/**
 * Curriculum Transformer API Routes
 * 
 * This module provides the Express routes for the curriculum transformer API.
 */

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const transformer = require('./transformer');

// Create router
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Create upload directory if it doesn't exist
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Generate unique filename
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function(req, file, cb) {
    // Check if file type is supported
    const ext = path.extname(file.originalname).toLowerCase();
    const supportedExtensions = [
      '.pdf', '.docx', '.pptx', '.html', '.txt', '.md'
    ];
    
    if (supportedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  }
});

/**
 * GET /api/transformer/status/:jobId
 * Get transformation job status
 */
router.get('/status/:jobId', (req, res) => {
  try {
    const { jobId } = req.params;
    const status = transformer.getTransformationStatus(jobId);
    res.json(status);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * GET /api/transformer/result/:jobId
 * Get transformation job result
 */
router.get('/result/:jobId', (req, res) => {
  try {
    const { jobId } = req.params;
    const result = transformer.getTransformationResult(jobId);
    
    // Set appropriate content type based on result format
    if (result.format === 'html' || result.format === 'interactive') {
      res.set('Content-Type', 'text/html');
    } else if (result.format === 'pdf') {
      res.set('Content-Type', 'application/pdf');
    }
    
    // Send result content
    res.send(result.content);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * POST /api/transformer/transform
 * Transform content using uploaded file
 */
router.post('/transform', upload.single('file'), (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Get file path and format
    const filePath = req.file.path;
    const inputFormat = path.extname(req.file.originalname).slice(1).toLowerCase();
    
    // Parse transformation options
    const outputFormat = req.body.outputFormat || 'html';
    const transformationTypes = Array.isArray(req.body.transformationTypes)
      ? req.body.transformationTypes
      : req.body.transformationTypes ? [req.body.transformationTypes] : ['visual'];
    const neurodivergentProfile = req.body.neurodivergentProfile || 'general';
    
    // Parse custom options
    let customOptions = {};
    try {
      if (req.body.customOptions) {
        customOptions = JSON.parse(req.body.customOptions);
      }
    } catch (error) {
      console.warn('Error parsing custom options:', error);
    }
    
    // Read file content
    const content = fs.readFileSync(filePath);
    
    // Start transformation
    const jobId = transformer.startTransformation({
      content,
      inputFormat,
      outputFormat,
      transformationTypes,
      neurodivergentProfile,
      customOptions
    });
    
    // Return job ID
    res.json({
      jobId,
      status: 'pending',
      message: 'Transformation started'
    });
    
    // Clean up file after processing
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Transformation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/transformer/transform-text
 * Transform content from text input
 */
router.post('/transform-text', (req, res) => {
  try {
    // Check if content was provided
    if (!req.body.content) {
      return res.status(400).json({ error: 'No content provided' });
    }
    
    // Parse transformation options
    const content = req.body.content;
    const inputFormat = req.body.inputFormat || 'txt';
    const outputFormat = req.body.outputFormat || 'html';
    const transformationTypes = Array.isArray(req.body.transformationTypes)
      ? req.body.transformationTypes
      : req.body.transformationTypes ? [req.body.transformationTypes] : ['visual'];
    const neurodivergentProfile = req.body.neurodivergentProfile || 'general';
    
    // Parse custom options
    let customOptions = {};
    try {
      if (req.body.customOptions) {
        customOptions = typeof req.body.customOptions === 'string'
          ? JSON.parse(req.body.customOptions)
          : req.body.customOptions;
      }
    } catch (error) {
      console.warn('Error parsing custom options:', error);
    }
    
    // Check if content is small enough for synchronous transformation
    if (Buffer.byteLength(content, 'utf8') <= 1024 * 50) {
      // Transform content synchronously
      try {
        const result = transformer.transformSync({
          content,
          inputFormat,
          outputFormat,
          transformationTypes,
          neurodivergentProfile,
          customOptions
        });
        
        // Set appropriate content type based on result format
        if (result.format === 'html' || result.format === 'interactive') {
          res.set('Content-Type', 'text/html');
        } else if (result.format === 'pdf') {
          res.set('Content-Type', 'application/pdf');
        }
        
        // Send result content
        res.send(result.content);
      } catch (error) {
        console.error('Synchronous transformation error:', error);
        res.status(500).json({ error: error.message });
      }
    } else {
      // Start asynchronous transformation for larger content
      const jobId = transformer.startTransformation({
        content,
        inputFormat,
        outputFormat,
        transformationTypes,
        neurodivergentProfile,
        customOptions
      });
      
      // Return job ID
      res.json({
        jobId,
        status: 'pending',
        message: 'Transformation started'
      });
    }
  } catch (error) {
    console.error('Transformation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/transformer/cancel/:jobId
 * Cancel a running transformation job
 */
router.post('/cancel/:jobId', (req, res) => {
  try {
    const { jobId } = req.params;
    const canceled = transformer.cancelTransformation(jobId);
    
    if (canceled) {
      res.json({ message: 'Transformation canceled' });
    } else {
      res.json({ message: 'Transformation already completed or failed' });
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Export router
module.exports = router;