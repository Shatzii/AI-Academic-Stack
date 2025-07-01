/**
 * Curriculum Transformer API Routes
 * 
 * This module provides API endpoints for the curriculum transformer service
 * which adapts traditional educational content for neurodivergent learners.
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
  transformFromUrl, 
  transformFromFile, 
  transformFromText,
  generateHtmlOutput,
  LEARNING_DIFFERENCES
} = require('../services/curriculum-transformer');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/curriculum');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// File filter to only allow supported document types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/html',
    'image/jpeg',
    'image/png'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { 
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

/**
 * Helper to validate the learning difference parameter
 */
function validateLearningDifference(req, res, next) {
  const { learningDifference } = req.body;
  
  if (!learningDifference) {
    return res.status(400).json({ 
      error: 'Missing required parameter: learningDifference' 
    });
  }
  
  if (!Object.keys(LEARNING_DIFFERENCES).includes(learningDifference)) {
    return res.status(400).json({ 
      error: 'Invalid learning difference. Supported values: dyslexia, adhd, autism' 
    });
  }
  
  next();
}

/**
 * GET /api/curriculum-transformer/info
 * Get information about the curriculum transformer service
 */
router.get('/info', (req, res) => {
  res.json({
    service: 'Curriculum Transformer',
    version: '1.0.0',
    supportedLearningDifferences: Object.keys(LEARNING_DIFFERENCES),
    supportedFileTypes: [
      'PDF (.pdf)',
      'Word (.docx)',
      'Text (.txt)',
      'HTML (.html)',
      'Images (.jpg, .png)'
    ],
    maxFileSize: '50MB'
  });
});

/**
 * POST /api/curriculum-transformer/transform-url
 * Transform content from a URL
 */
router.post('/transform-url', validateLearningDifference, async (req, res) => {
  const { url, learningDifference, format = 'json' } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'Missing required parameter: url' });
  }
  
  try {
    const startTime = Date.now();
    const result = await transformFromUrl(url, learningDifference);
    const duration = Date.now() - startTime;
    
    if (format === 'html') {
      const html = generateHtmlOutput(result);
      res.header('Content-Type', 'text/html');
      return res.send(html);
    }
    
    res.json({
      ...result,
      duration,
      status: 'success'
    });
  } catch (error) {
    console.error('Error transforming URL content:', error);
    res.status(500).json({ 
      error: 'Failed to transform content from URL', 
      details: error.message 
    });
  }
});

/**
 * POST /api/curriculum-transformer/transform-text
 * Transform raw text content
 */
router.post('/transform-text', validateLearningDifference, async (req, res) => {
  const { text, learningDifference, format = 'json' } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Missing required parameter: text' });
  }
  
  try {
    const startTime = Date.now();
    const result = await transformFromText(text, learningDifference);
    const duration = Date.now() - startTime;
    
    if (format === 'html') {
      const html = generateHtmlOutput(result);
      res.header('Content-Type', 'text/html');
      return res.send(html);
    }
    
    res.json({
      ...result,
      duration,
      status: 'success'
    });
  } catch (error) {
    console.error('Error transforming text content:', error);
    res.status(500).json({ 
      error: 'Failed to transform text content', 
      details: error.message 
    });
  }
});

/**
 * POST /api/curriculum-transformer/transform-file
 * Transform content from an uploaded file
 */
router.post('/transform-file', upload.single('file'), validateLearningDifference, async (req, res) => {
  const { learningDifference, format = 'json' } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  try {
    const startTime = Date.now();
    const result = await transformFromFile(req.file.path, learningDifference);
    const duration = Date.now() - startTime;
    
    // Clean up the uploaded file after processing
    fs.unlinkSync(req.file.path);
    
    if (format === 'html') {
      const html = generateHtmlOutput(result);
      res.header('Content-Type', 'text/html');
      return res.send(html);
    }
    
    res.json({
      ...result,
      originalFilename: req.file.originalname,
      fileSize: req.file.size,
      duration,
      status: 'success'
    });
  } catch (error) {
    console.error('Error transforming file content:', error);
    
    // Clean up the uploaded file in case of error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Failed to transform file content', 
      details: error.message 
    });
  }
});

module.exports = router;