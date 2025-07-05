import { Router, Request, Response } from 'express';
import { SelfHostedAI } from '../services/self-hosted-ai';

const router = Router();
const aiService = new SelfHostedAI();

// Helper function to handle errors
const handleError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error occurred';
};

// Health check for self-hosted AI
router.get('/self-hosted/health', async (req: Request, res: Response) => {
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
      error: handleError(error),
      timestamp: new Date().toISOString()
    });
  }
});

// Get available models
router.get('/self-hosted/models', async (req: Request, res: Response) => {
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
      error: handleError(error),
      timestamp: new Date().toISOString()
    });
  }
});

// Test content generation
router.post('/self-hosted/test-generation', async (req: Request, res: Response) => {
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
      error: handleError(error),
      timestamp: new Date().toISOString()
    });
  }
});

// Generate educational content (main endpoint)
router.post('/generate-content', async (req: Request, res: Response) => {
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
      error: handleError(error),
      timestamp: new Date().toISOString()
    });
  }
});

export { router as selfHostedAIRoutes };