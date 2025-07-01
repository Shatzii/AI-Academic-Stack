/**
 * Neurodivergent Curriculum API Routes
 * 
 * These routes provide access to the Neurodivergent Curriculum Service,
 * which generates educational content tailored to different neurodivergent types, including:
 * - ADHD
 * - Autism Spectrum
 * - Dyslexia
 * - Dyscalculia
 * - Dyspraxia
 * - Sensory Processing
 * - Tourette Syndrome
 * - Executive Function Support
 */

import express from 'express';
import * as neurodivergentCurriculumService from '../../services/neurodivergent-curriculum-service.js';

const router = express.Router();

// Utility function to handle API errors
const handleApiError = (res, error) => {
  console.error('Neurodivergent Curriculum API Error:', error);
  if (error.message.includes('API_KEY is not set')) {
    return res.status(500).json({
      error: 'API configuration error',
      message: 'The required API key is not configured. Please contact the administrator.',
      code: 'API_KEY_MISSING'
    });
  }
  if (error.message.includes('Unsupported neurotype')) {
    return res.status(400).json({
      error: 'Invalid neurotype',
      message: error.message,
      code: 'INVALID_NEUROTYPE'
    });
  }
  return res.status(500).json({
    error: 'Server error',
    message: error.message,
    code: 'INTERNAL_ERROR'
  });
};

/**
 * GET /api/neurodivergent-curriculum/neurotypes
 * 
 * Returns a list of available neurodivergent types supported by the service
 */
router.get('/neurotypes', (req, res) => {
  try {
    const neurodivergentTypes = neurodivergentCurriculumService.getAvailableNeurodivergentTypes();
    res.json(neurodivergentTypes);
  } catch (error) {
    handleApiError(res, error);
  }
});

/**
 * GET /api/neurodivergent-curriculum/subjects
 * 
 * Returns a list of available subjects for curriculum generation
 */
router.get('/subjects', (req, res) => {
  try {
    const subjects = neurodivergentCurriculumService.getAvailableSubjects();
    res.json(subjects);
  } catch (error) {
    handleApiError(res, error);
  }
});

/**
 * GET /api/neurodivergent-curriculum/grades
 * 
 * Returns a list of available grade levels for curriculum generation
 */
router.get('/grades', (req, res) => {
  try {
    const grades = neurodivergentCurriculumService.getAvailableGradeLevels();
    res.json(grades);
  } catch (error) {
    handleApiError(res, error);
  }
});

/**
 * GET /api/neurodivergent-curriculum/formats
 * 
 * Returns a list of available formats for curriculum generation
 */
router.get('/formats', (req, res) => {
  try {
    const formats = neurodivergentCurriculumService.getAvailableFormats();
    res.json(formats);
  } catch (error) {
    handleApiError(res, error);
  }
});

/**
 * POST /api/neurodivergent-curriculum/generate-lesson
 * 
 * Generates a curriculum lesson based on the provided parameters
 * 
 * Request body:
 * - subject: The subject area
 * - grade: The grade level
 * - state: The state standards to follow (optional, default: 'general')
 * - format: The learning format
 * - topic: The specific topic (optional)
 * - neurotype: The neurodivergent type to tailor content for
 */
router.post('/generate-lesson', async (req, res) => {
  try {
    const { subject, grade, state = 'general', format, topic, neurotype } = req.body;
    
    // Validate required parameters
    if (!subject || !grade || !format || !neurotype) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'subject, grade, format, and neurotype parameters are required',
        code: 'MISSING_PARAMS'
      });
    }
    
    // Build parameters object for service
    const params = {
      subject,
      grade,
      state,
      format,
      topic: topic || `${subject} for ${grade}`,
      neurotype
    };
    
    // Call the service to generate the lesson
    const lesson = await neurodivergentCurriculumService.generateNeurodivergentLesson(params);
    
    res.json(lesson);
  } catch (error) {
    handleApiError(res, error);
  }
});

export default router;