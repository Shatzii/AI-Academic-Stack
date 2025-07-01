/**
 * Enhanced AI Features API Routes
 * 
 * This module provides routes for the enhanced AI features
 * available across all schools in the ShotziOS platform.
 */

const express = require('express');
const router = express.Router();
const anthropicService = require('../services/anthropic-service');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../../uploads');
    
    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

/**
 * Helper to read file as base64
 */
const fileToBase64 = async (filePath) => {
  try {
    const data = await fs.promises.readFile(filePath);
    return data.toString('base64');
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
};

/**
 * @route GET /api/ai/health
 * @desc Health check for AI services
 */
router.get('/health', async (req, res) => {
  try {
    // Simple prompt to test connection to Anthropic
    const response = await anthropicService.generateText('Hello, are you working properly?');
    res.json({
      status: 'ok',
      message: 'AI services are operational',
      anthropicResponse: response.substring(0, 100) + '...' // Truncate for readability
    });
  } catch (error) {
    console.error('AI health check failed:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'AI services are not functioning properly',
      error: error.message
    });
  }
});

/**
 * @route POST /api/ai/adapted-content
 * @desc Generate content adapted for specific neurotype
 */
router.post('/adapted-content', async (req, res) => {
  try {
    const { subject, topic, neurotype, level } = req.body;
    
    // Validate required fields
    if (!subject || !topic || !neurotype || !level) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Missing required fields: subject, topic, neurotype, and level are required'
      });
    }
    
    const adaptedContent = await anthropicService.generateAdaptedContent(subject, topic, neurotype, level);
    
    res.json({
      status: 'success',
      adaptedContent
    });
  } catch (error) {
    console.error('Error generating adapted content:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to generate adapted content',
      error: error.message
    });
  }
});

/**
 * @route POST /api/ai/vocabulary
 * @desc Generate vocabulary list for language learning
 */
router.post('/vocabulary', async (req, res) => {
  try {
    const { language, topic, level } = req.body;
    
    // Validate required fields
    if (!language || !topic || !level) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Missing required fields: language, topic, and level are required'
      });
    }
    
    const vocabulary = await anthropicService.generateVocabularyList(language, topic, level);
    
    res.json({
      status: 'success',
      vocabulary
    });
  } catch (error) {
    console.error('Error generating vocabulary:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to generate vocabulary list',
      error: error.message
    });
  }
});

/**
 * @route POST /api/ai/dialogue
 * @desc Generate language practice dialogue
 */
router.post('/dialogue', async (req, res) => {
  try {
    const { language, situation, level } = req.body;
    
    // Validate required fields
    if (!language || !situation || !level) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Missing required fields: language, situation, and level are required'
      });
    }
    
    const dialogue = await anthropicService.generateDialogue(language, situation, level);
    
    res.json({
      status: 'success',
      dialogue
    });
  } catch (error) {
    console.error('Error generating dialogue:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to generate dialogue',
      error: error.message
    });
  }
});

/**
 * @route POST /api/ai/legal-analysis
 * @desc Generate legal case analysis
 */
router.post('/legal-analysis', async (req, res) => {
  try {
    const { caseDescription, jurisdiction, legalArea } = req.body;
    
    // Validate required fields
    if (!caseDescription || !jurisdiction || !legalArea) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Missing required fields: caseDescription, jurisdiction, and legalArea are required'
      });
    }
    
    const analysis = await anthropicService.generateLegalAnalysis(caseDescription, jurisdiction, legalArea);
    
    res.json({
      status: 'success',
      analysis
    });
  } catch (error) {
    console.error('Error generating legal analysis:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to generate legal analysis',
      error: error.message
    });
  }
});

/**
 * @route POST /api/ai/analyze-image
 * @desc Analyze educational image (multimodal)
 */
router.post('/analyze-image', upload.single('image'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        status: 'error',
        message: 'No image file provided'
      });
    }
    
    const { instructions } = req.body;
    
    if (!instructions) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Missing required field: instructions'
      });
    }
    
    // Convert image to base64
    const base64Image = await fileToBase64(req.file.path);
    
    // Analyze the image
    const analysis = await anthropicService.analyzeEducationalImage(base64Image, instructions);
    
    // Clean up the uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temporary file:', err);
    });
    
    res.json({
      status: 'success',
      analysis
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Clean up the uploaded file if it exists
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
      });
    }
    
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to analyze image',
      error: error.message
    });
  }
});

/**
 * @route POST /api/ai/learning-recommendations
 * @desc Generate personalized learning recommendations
 */
router.post('/learning-recommendations', async (req, res) => {
  try {
    const { studentProfile } = req.body;
    
    if (!studentProfile) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Missing required field: studentProfile'
      });
    }
    
    const recommendations = await anthropicService.generateLearningRecommendations(studentProfile);
    
    res.json({
      status: 'success',
      recommendations
    });
  } catch (error) {
    console.error('Error generating learning recommendations:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to generate learning recommendations',
      error: error.message
    });
  }
});

/**
 * @route POST /api/ai/assessment-questions
 * @desc Generate assessment questions
 */
router.post('/assessment-questions', async (req, res) => {
  try {
    const { subject, topic, difficulty, questionType, count } = req.body;
    
    // Validate required fields
    if (!subject || !topic || !difficulty || !questionType || !count) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Missing required fields: subject, topic, difficulty, questionType, and count are required'
      });
    }
    
    const questions = await anthropicService.generateAssessmentQuestions(
      subject, topic, difficulty, questionType, count
    );
    
    res.json({
      status: 'success',
      questions
    });
  } catch (error) {
    console.error('Error generating assessment questions:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to generate assessment questions',
      error: error.message
    });
  }
});

/**
 * @route POST /api/ai/student-feedback
 * @desc Generate feedback on student work
 */
router.post('/student-feedback', async (req, res) => {
  try {
    const { studentWork, assignmentContext, learningObjectives, neurotype } = req.body;
    
    // Validate required fields
    if (!studentWork || !assignmentContext || !learningObjectives) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Missing required fields: studentWork, assignmentContext, and learningObjectives are required'
      });
    }
    
    const feedback = await anthropicService.generateStudentFeedback(
      studentWork, assignmentContext, learningObjectives, neurotype
    );
    
    res.json({
      status: 'success',
      feedback
    });
  } catch (error) {
    console.error('Error generating student feedback:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to generate student feedback',
      error: error.message
    });
  }
});

module.exports = router;