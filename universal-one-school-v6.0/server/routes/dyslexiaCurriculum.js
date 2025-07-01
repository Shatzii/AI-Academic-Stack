/**
 * Dyslexia Curriculum API Routes
 * 
 * These routes provide access to the Dyslexia Curriculum Service,
 * which generates dyslexia-friendly educational content across K-College
 * curriculum based on the SuperPAC Dyslexia Curriculum framework.
 */

import express from 'express';
import * as dyslexiaCurriculumService from '../../services/dyslexia-curriculum-service.js';

const router = express.Router();

// Utility function to handle API errors
const handleApiError = (res, error) => {
  console.error('Dyslexia Curriculum API Error:', error);
  if (error.message.includes('API_KEY is not set')) {
    return res.status(500).json({
      error: 'API configuration error',
      message: 'The required API key is not configured. Please contact the administrator.',
      code: 'API_KEY_MISSING'
    });
  }
  return res.status(500).json({
    error: 'Server error',
    message: error.message,
    code: 'INTERNAL_ERROR'
  });
};

/**
 * GET /api/dyslexia-curriculum/subjects
 * 
 * Returns a list of available subjects for curriculum generation
 */
router.get('/subjects', (req, res) => {
  try {
    const subjects = dyslexiaCurriculumService.getAvailableSubjects();
    res.json(subjects);
  } catch (error) {
    handleApiError(res, error);
  }
});

/**
 * GET /api/dyslexia-curriculum/grades
 * 
 * Returns a list of available grade levels for curriculum generation
 */
router.get('/grades', (req, res) => {
  try {
    const grades = dyslexiaCurriculumService.getAvailableGradeLevels();
    res.json(grades);
  } catch (error) {
    handleApiError(res, error);
  }
});

/**
 * GET /api/dyslexia-curriculum/formats
 * 
 * Returns a list of available formats for curriculum generation
 */
router.get('/formats', (req, res) => {
  try {
    const formats = dyslexiaCurriculumService.getAvailableFormats();
    res.json(formats);
  } catch (error) {
    handleApiError(res, error);
  }
});

/**
 * GET /api/dyslexia-curriculum/topics
 * 
 * Returns sample topics for a given subject and grade level
 * 
 * Query parameters:
 * - subject: The subject area
 * - grade: The grade level
 */
router.get('/topics', (req, res) => {
  try {
    const { subject, grade } = req.query;
    
    if (!subject || !grade) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'Both subject and grade parameters are required',
        code: 'MISSING_PARAMS'
      });
    }
    
    const topics = dyslexiaCurriculumService.getSampleTopics(subject, grade);
    res.json(topics);
  } catch (error) {
    handleApiError(res, error);
  }
});

/**
 * POST /api/dyslexia-curriculum/generate-lesson
 * 
 * Generates a curriculum lesson based on the provided parameters
 * 
 * Request body:
 * - subject: The subject area
 * - grade: The grade level
 * - state: The state standards to follow (optional, default: 'general')
 * - format: The learning format
 * - topic: The specific topic (optional)
 * - api: The API to use ('perplexity' or 'anthropic', default: 'anthropic')
 */
router.post('/generate-lesson', async (req, res) => {
  try {
    const { subject, grade, state = 'general', format, topic, api = 'anthropic' } = req.body;
    
    // Validate required parameters
    if (!subject || !grade || !format) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'subject, grade, and format parameters are required',
        code: 'MISSING_PARAMS'
      });
    }
    
    // Build parameters object for service
    const params = {
      subject,
      grade,
      state,
      format,
      topic: topic || `${subject} for ${grade}`
    };
    
    // Call the appropriate service method based on API selection
    let lesson;
    if (api === 'perplexity') {
      lesson = await dyslexiaCurriculumService.generateLessonWithPerplexity(params);
    } else {
      lesson = await dyslexiaCurriculumService.generateLessonWithAnthropic(params);
    }
    
    res.json(lesson);
  } catch (error) {
    handleApiError(res, error);
  }
});

/**
 * POST /api/dyslexia-curriculum/clear-cache
 * 
 * Clears the curriculum content cache
 */
router.post('/clear-cache', (req, res) => {
  try {
    dyslexiaCurriculumService.clearCache();
    res.json({ success: true, message: 'Curriculum cache cleared successfully' });
  } catch (error) {
    handleApiError(res, error);
  }
});

export default router;