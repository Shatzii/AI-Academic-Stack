/**
 * AI Service Routes
 * 
 * This file defines Express routes for interacting with AI services
 * including content generation, legal content, and language learning features.
 */

import { Router } from 'express';
import aiService from '../services/ai-service';
import { z } from 'zod';

const router = Router();

// Schemas for request validation
const GeneralAIRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string(),
    })
  ),
  maxTokens: z.number().optional(),
  model: z.object({
    provider: z.enum(['anthropic', 'openai']),
    model: z.string(),
  }).optional(),
});

const EducationalContentRequestSchema = z.object({
  topic: z.string(),
  grade: z.string(),
  learningStyle: z.string(),
  contentType: z.enum(['lesson', 'quiz', 'activity', 'summary']),
  maxTokens: z.number().optional(),
});

const LegalContentRequestSchema = z.object({
  topic: z.string(),
  contentType: z.enum(['explanation', 'case-study', 'practice-question', 'summary']),
  difficulty: z.enum(['basic', 'intermediate', 'advanced', 'bar-exam']),
  maxTokens: z.number().optional(),
});

const LanguageContentRequestSchema = z.object({
  language: z.string(),
  topic: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  contentType: z.enum(['vocabulary', 'dialogue', 'grammar', 'exercise']),
  maxTokens: z.number().optional(),
});

// Direct AI message route
router.post('/message', async (req, res) => {
  try {
    // Validate request
    const validatedData = GeneralAIRequestSchema.parse(req.body);
    
    // Process the request
    const result = await aiService.getAIResponse(
      validatedData.messages,
      {
        model: validatedData.model,
        maxTokens: validatedData.maxTokens
      }
    );
    
    // Return the response
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in AI message route:', error);
    
    // Send appropriate error response
    if (error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: error.errors
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.message || 'Error processing AI request'
      });
    }
  }
});

// Educational content generation route
router.post('/education', async (req, res) => {
  try {
    // Validate request
    const validatedData = EducationalContentRequestSchema.parse(req.body);
    
    // Process the request
    const result = await aiService.generateEducationalContent(
      validatedData.topic,
      validatedData.grade,
      validatedData.learningStyle,
      validatedData.contentType,
      {
        maxTokens: validatedData.maxTokens
      }
    );
    
    // Return the response
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in educational content route:', error);
    
    // Send appropriate error response
    if (error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: error.errors
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.message || 'Error generating educational content'
      });
    }
  }
});

// Legal content generation route
router.post('/legal', async (req, res) => {
  try {
    // Validate request
    const validatedData = LegalContentRequestSchema.parse(req.body);
    
    // Process the request
    const result = await aiService.generateLegalContent(
      validatedData.topic,
      validatedData.contentType,
      validatedData.difficulty,
      {
        maxTokens: validatedData.maxTokens
      }
    );
    
    // Return the response
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in legal content route:', error);
    
    // Send appropriate error response
    if (error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: error.errors
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.message || 'Error generating legal content'
      });
    }
  }
});

// Language content generation route
router.post('/language', async (req, res) => {
  try {
    // Validate request
    const validatedData = LanguageContentRequestSchema.parse(req.body);
    
    // Process the request
    const result = await aiService.generateLanguageContent(
      validatedData.language,
      validatedData.topic,
      validatedData.level,
      validatedData.contentType,
      {
        maxTokens: validatedData.maxTokens
      }
    );
    
    // Return the response
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in language content route:', error);
    
    // Send appropriate error response
    if (error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: error.errors
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.message || 'Error generating language content'
      });
    }
  }
});

// AI status check route
router.get('/status', async (req, res) => {
  try {
    const status = await aiService.checkAIConnections();
    
    res.json({
      success: true,
      data: {
        anthropic: status.anthropic,
        openai: status.openai,
        message: status.message
      }
    });
  } catch (error) {
    console.error('Error checking AI connections:', error);
    
    res.status(500).json({
      success: false,
      message: error.message || 'Error checking AI connections'
    });
  }
});

export default router;