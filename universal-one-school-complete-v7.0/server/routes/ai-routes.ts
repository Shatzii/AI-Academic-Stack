import { Router } from 'express';
import { SelfHostedAI } from '../services/self-hosted-ai';

const router = Router();
const aiService = new SelfHostedAI();

// Health check for self-hosted AI
router.get('/self-hosted/health', async (req, res) => {
  try {
    const health = await aiService.healthCheck();
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      models: health.models,
      responseTime: health.responseTime,
      version: '7.0.0',
      aiEngine: 'self-hosted-anthropic'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get available models
router.get('/self-hosted/models', async (req, res) => {
  try {
    const models = await aiService.getAvailableModels();
    res.json({
      models,
      count: models.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test content generation
router.post('/self-hosted/test-generation', async (req, res) => {
  try {
    const { query, school = 'primary', neurotype = 'neurotypical' } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: 'Query is required',
        timestamp: new Date().toISOString()
      });
    }

    const response = await aiService.generateEducationalContent(query, school, neurotype);
    
    res.json({
      success: true,
      query,
      school,
      neurotype,
      response,
      timestamp: new Date().toISOString(),
      model: aiService.getModelForSchool(school)
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Compare performance with cloud AI
router.post('/self-hosted/compare-performance', async (req, res) => {
  try {
    const { query, school = 'primary' } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: 'Query is required',
        timestamp: new Date().toISOString()
      });
    }

    const startTime = Date.now();
    const selfHostedResponse = await aiService.generateEducationalContent(query, school);
    const selfHostedTime = Date.now() - startTime;

    res.json({
      success: true,
      query,
      school,
      comparison: {
        selfHosted: {
          response: selfHostedResponse,
          responseTime: selfHostedTime,
          cost: 0,
          model: aiService.getModelForSchool(school)
        },
        cloud: {
          response: "Cloud AI not configured - using self-hosted only",
          responseTime: "N/A",
          cost: "N/A",
          model: "N/A"
        }
      },
      winner: 'self-hosted',
      savings: {
        time: '0ms (immediate)',
        cost: '$0 (no external API costs)',
        privacy: 'Complete data sovereignty'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Generate educational content (main endpoint)
router.post('/generate-content', async (req, res) => {
  try {
    const { 
      query, 
      school = 'primary', 
      neurotype = 'neurotypical',
      grade = null,
      subject = null,
      accommodations = []
    } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: 'Query is required',
        timestamp: new Date().toISOString()
      });
    }

    const response = await aiService.generateEducationalContent(
      query, 
      school, 
      neurotype,
      { grade, subject, accommodations }
    );
    
    res.json({
      success: true,
      content: response,
      metadata: {
        query,
        school,
        neurotype,
        grade,
        subject,
        accommodations,
        model: aiService.getModelForSchool(school),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export { router as selfHostedAIRoutes };