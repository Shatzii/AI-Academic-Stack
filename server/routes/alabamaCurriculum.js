/**
 * Alabama Curriculum API Routes
 * 
 * These routes provide access to the Alabama Curriculum Service,
 * which generates comprehensive K-12 curriculum content following 
 * Alabama education standards, with adaptations for neurodivergent learners.
 */

import express from 'express';
import * as alabamaCurriculumService from '../../services/alabama-curriculum-service.js';

const router = express.Router();

// Utility function to handle API errors
function handleApiError(res, error) {
  console.error('API Error:', error);
  
  if (error.message.includes('API_KEY is not set')) {
    return res.status(500).json({
      success: false,
      error: 'API key not configured. Please contact the administrator.',
      details: error.message
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Error processing your request',
    details: error.message
  });
}

/**
 * Get available options for curriculum generation
 * GET /api/alabama-curriculum/options
 */
router.get('/options', (req, res) => {
  try {
    res.json({
      success: true,
      options: {
        grades: alabamaCurriculumService.GRADE_LEVELS,
        subjects: alabamaCurriculumService.SUBJECTS,
        neurotypes: alabamaCurriculumService.NEUROTYPES
      }
    });
  } catch (error) {
    handleApiError(res, error);
  }
});

/**
 * Generate a comprehensive curriculum based on Alabama standards
 * POST /api/alabama-curriculum/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { subject, grade, neurotype, api } = req.body;
    
    // Validate required parameters
    if (!subject || !grade) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        details: 'Subject and grade are required'
      });
    }
    
    // Default to anthropic if API not specified
    const apiToUse = api || 'anthropic';
    
    // Generate curriculum
    const curriculum = await alabamaCurriculumService.generateAlabamaCurriculum({
      subject,
      grade,
      neurotype: neurotype || 'general',
      api: apiToUse
    });
    
    res.json({
      success: true,
      data: curriculum
    });
  } catch (error) {
    handleApiError(res, error);
  }
});

/**
 * Generate a specific unit plan based on Alabama standards
 * POST /api/alabama-curriculum/generate-unit
 */
router.post('/generate-unit', async (req, res) => {
  try {
    const { subject, grade, unit, neurotype, api } = req.body;
    
    // Validate required parameters
    if (!subject || !grade || !unit) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        details: 'Subject, grade, and unit are required'
      });
    }
    
    // Default to anthropic if API not specified
    const apiToUse = api || 'anthropic';
    
    // Generate unit plan
    const unitPlan = await alabamaCurriculumService.generateAlabamaCurriculumUnit({
      subject,
      grade,
      unit,
      neurotype: neurotype || 'general',
      api: apiToUse
    });
    
    res.json({
      success: true,
      data: unitPlan
    });
  } catch (error) {
    handleApiError(res, error);
  }
});

/**
 * Clear the curriculum cache
 * POST /api/alabama-curriculum/clear-cache
 */
router.post('/clear-cache', (req, res) => {
  try {
    alabamaCurriculumService.clearCache();
    res.json({
      success: true,
      message: 'Curriculum cache cleared successfully'
    });
  } catch (error) {
    handleApiError(res, error);
  }
});

export default router;