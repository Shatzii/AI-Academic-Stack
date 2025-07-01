/**
 * Comprehensive Curriculum API Routes
 * 
 * These routes handle curriculum generation for all types of curricula:
 * - Neurodivergent Education (Alabama standards-aligned)
 * - Law Education (UAE Bar Exam preparation)
 * - Language Education (multilingual proficiency)
 */

import express from 'express';
import { 
  generateComprehensiveCurriculum, 
  getOptions,
  clearCache,
  SUBJECTS,
  GRADE_LEVELS,
  STANDARDS,
  CURRICULUM_COMPONENTS,
  NEURODIVERGENT_ADAPTATIONS
} from '../../services/comprehensive-curriculum-service.js';

const router = express.Router();

/**
 * GET /api/curriculum/options
 * Get available options for curriculum generation
 */
router.get('/options', (req, res) => {
  try {
    const options = getOptions();
    res.json({ success: true, options });
  } catch (error) {
    console.error('Error fetching curriculum options:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch curriculum options', 
      details: error.message 
    });
  }
});

/**
 * POST /api/curriculum/generate
 * Generate a comprehensive curriculum
 */
router.post('/generate', async (req, res) => {
  try {
    const params = req.body;
    
    // Validate required parameters
    if (!params.domain) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameter: domain'
      });
    }
    
    if (!params.subject) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameter: subject'
      });
    }
    
    if (!params.level) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameter: level'
      });
    }
    
    // Set API to use (default to anthropic if not specified)
    params.api = params.api || 'anthropic';
    
    // Ensure API keys are available
    if (params.api === 'anthropic' && !process.env.ANTHROPIC_API_KEY) {
      return res.status(400).json({ 
        success: false, 
        error: 'Anthropic API key not configured'
      });
    }
    
    if (params.api === 'perplexity' && !process.env.PERPLEXITY_API_KEY) {
      return res.status(400).json({ 
        success: false, 
        error: 'Perplexity API key not configured'
      });
    }
    
    // Generate the curriculum
    const result = await generateComprehensiveCurriculum(params);
    
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error generating curriculum:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate curriculum', 
      details: error.message 
    });
  }
});

/**
 * POST /api/curriculum/clear-cache
 * Clear the curriculum cache
 */
router.post('/clear-cache', (req, res) => {
  try {
    clearCache();
    res.json({ success: true, message: 'Curriculum cache cleared successfully' });
  } catch (error) {
    console.error('Error clearing curriculum cache:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to clear curriculum cache', 
      details: error.message 
    });
  }
});

/**
 * POST /api/curriculum/validate
 * Validate curriculum parameters before generation
 */
router.post('/validate', (req, res) => {
  try {
    const params = req.body;
    const errors = [];
    
    // Validate domain
    if (!params.domain) {
      errors.push('Missing required parameter: domain');
    } else if (!['neurodivergent', 'law', 'language'].includes(params.domain)) {
      errors.push(`Invalid domain: ${params.domain}`);
    }
    
    // Validate subject based on domain
    if (!params.subject) {
      errors.push('Missing required parameter: subject');
    } else if (params.domain && SUBJECTS[params.domain]) {
      const validSubjects = Object.keys(SUBJECTS[params.domain]);
      if (!validSubjects.includes(params.subject)) {
        errors.push(`Invalid subject for domain ${params.domain}: ${params.subject}`);
      }
    }
    
    // Validate level
    if (!params.level) {
      errors.push('Missing required parameter: level');
    }
    
    // Validate standards
    if (params.standards && params.domain) {
      const validStandards = Object.keys(STANDARDS[params.domain] || {});
      if (validStandards.length > 0 && !validStandards.includes(params.standards)) {
        errors.push(`Invalid standards for domain ${params.domain}: ${params.standards}`);
      }
    }
    
    // Validate adaptation for neurodivergent domain
    if (params.domain === 'neurodivergent' && params.adaptation) {
      const validAdaptations = Object.keys(NEURODIVERGENT_ADAPTATIONS);
      if (!validAdaptations.includes(params.adaptation)) {
        errors.push(`Invalid adaptation: ${params.adaptation}`);
      }
    }
    
    // Validate components
    if (params.components && Array.isArray(params.components)) {
      const validComponents = Object.keys(CURRICULUM_COMPONENTS);
      params.components.forEach(component => {
        if (!validComponents.includes(component)) {
          errors.push(`Invalid component: ${component}`);
        }
      });
    }
    
    // Validate years
    if (params.years) {
      const years = parseInt(params.years);
      if (isNaN(years) || years < 1 || years > 4) {
        errors.push('Years must be a number between 1 and 4');
      }
    }
    
    // Return validation result
    if (errors.length > 0) {
      res.json({ 
        success: false, 
        valid: false, 
        errors 
      });
    } else {
      res.json({ 
        success: true, 
        valid: true 
      });
    }
  } catch (error) {
    console.error('Error validating curriculum parameters:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to validate curriculum parameters', 
      details: error.message 
    });
  }
});

export default router;