/**
 * Personalization Routes
 * 
 * This module contains the API routes that implement the assessment to
 * curriculum personalization pipeline, connecting the learning profile,
 * content rules, and AI content generation services.
 */

import express, { Request, Response } from 'express';
import { storage } from '../storage';
import { 
  generateLearningProfile, 
  getLearningProfile,
  getContentAdaptationRecommendations,
  processLearningInteractions,
  LearningStyle,
  Neurotype,
  AdaptationLevel
} from '../services/learning-profile-service';
import {
  generateContentRules,
  getContentRules,
  ContentFormat,
  ContentComplexity,
  ContentPace,
  PresentationStyle
} from '../services/content-rules-service';
import {
  generateContent,
  hasReachedContentGenerationLimit,
  TIER_LIMITS
} from '../services/ai-content-service';

const router = express.Router();

/**
 * Generate or retrieve a user's learning profile
 * GET /api/personalization/profile/:userId
 */
router.get('/profile/:userId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Check if user exists
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get the user's learning profile
    let profile = await getLearningProfile(userId);
    
    // If no profile exists, check if assessments exist to create one
    if (!profile) {
      // Check if assessments exist
      const hasAssessments = await storage.hasCompletedAssessments(userId);
      
      if (hasAssessments) {
        // Generate a new profile based on assessments
        profile = await generateLearningProfile(userId);
        
        if (!profile) {
          return res.status(500).json({ error: 'Failed to generate learning profile' });
        }
      } else {
        return res.status(404).json({ 
          error: 'No learning profile found',
          message: 'Complete the learning style and neurotype assessments to generate a profile'
        });
      }
    }
    
    res.json({ profile });
  } catch (error) {
    console.error('Error in /profile/:userId:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Submit learning style assessment
 * POST /api/personalization/assessment/learning-style
 */
router.post('/assessment/learning-style', async (req: Request, res: Response) => {
  try {
    const { userId, assessmentData } = req.body;
    
    if (!userId || !assessmentData) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Validate assessment data
    if (!assessmentData.visualScore || !assessmentData.auditoryScore || 
        !assessmentData.kinestheticScore || !assessmentData.readingWritingScore) {
      return res.status(400).json({ error: 'Invalid assessment data' });
    }
    
    // Save the learning style assessment
    const success = await storage.saveLearningStyleAssessment(userId, {
      ...assessmentData,
      assessmentDate: new Date()
    });
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to save assessment' });
    }
    
    // Check if both assessments are complete and generate profile if needed
    const hasNeurotypeAssessment = await storage.hasNeurotypeAssessment(userId);
    
    if (hasNeurotypeAssessment) {
      // Generate learning profile
      const profile = await generateLearningProfile(userId);
      
      if (profile) {
        res.json({ 
          success: true, 
          message: 'Assessment saved and learning profile generated',
          profile 
        });
      } else {
        res.json({ 
          success: true, 
          message: 'Assessment saved but profile generation failed'
        });
      }
    } else {
      res.json({ 
        success: true, 
        message: 'Learning style assessment saved. Complete neurotype assessment to generate profile.'
      });
    }
  } catch (error) {
    console.error('Error in /assessment/learning-style:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Submit neurotype assessment
 * POST /api/personalization/assessment/neurotype
 */
router.post('/assessment/neurotype', async (req: Request, res: Response) => {
  try {
    const { userId, assessmentData } = req.body;
    
    if (!userId || !assessmentData) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Validate assessment data
    if (!assessmentData.dyslexiaIndicators || !assessmentData.adhdIndicators || 
        !assessmentData.autismSpectrumIndicators) {
      return res.status(400).json({ error: 'Invalid assessment data' });
    }
    
    // Save the neurotype assessment
    const success = await storage.saveNeurotypeAssessment(userId, {
      ...assessmentData,
      assessmentDate: new Date()
    });
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to save assessment' });
    }
    
    // Check if both assessments are complete and generate profile if needed
    const hasLearningStyleAssessment = await storage.hasLearningStyleAssessment(userId);
    
    if (hasLearningStyleAssessment) {
      // Generate learning profile
      const profile = await generateLearningProfile(userId);
      
      if (profile) {
        res.json({ 
          success: true, 
          message: 'Assessment saved and learning profile generated',
          profile 
        });
      } else {
        res.json({ 
          success: true, 
          message: 'Assessment saved but profile generation failed'
        });
      }
    } else {
      res.json({ 
        success: true, 
        message: 'Neurotype assessment saved. Complete learning style assessment to generate profile.'
      });
    }
  } catch (error) {
    console.error('Error in /assessment/neurotype:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Get content adaptation recommendations
 * GET /api/personalization/adaptations/:userId
 */
router.get('/adaptations/:userId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const { contentType, subject } = req.query;
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    if (!contentType || !subject) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }
    
    // Get adaptation recommendations
    const adaptations = await getContentAdaptationRecommendations(
      userId,
      contentType as string,
      subject as string
    );
    
    if (!adaptations) {
      return res.status(404).json({ error: 'No adaptation recommendations found' });
    }
    
    res.json({ adaptations });
  } catch (error) {
    console.error('Error in /adaptations/:userId:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Submit learning interactions for profile refinement
 * POST /api/personalization/interactions/:userId
 */
router.post('/interactions/:userId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const { interactions } = req.body;
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    if (!interactions || !Array.isArray(interactions)) {
      return res.status(400).json({ error: 'Invalid interactions data' });
    }
    
    // Process the learning interactions
    const success = await processLearningInteractions(userId, interactions);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to process interactions' });
    }
    
    res.json({ 
      success: true, 
      message: 'Learning interactions processed successfully'
    });
  } catch (error) {
    console.error('Error in /interactions/:userId:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Generate content rules
 * POST /api/personalization/content-rules
 */
router.post('/content-rules', async (req: Request, res: Response) => {
  try {
    const { 
      userId, 
      contentType, 
      subject, 
      gradeLevel,
      tier = 'basic'
    } = req.body;
    
    if (!userId || !contentType || !subject || !gradeLevel) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Get the user's learning profile
    const profile = await getLearningProfile(userId);
    
    if (!profile) {
      return res.status(404).json({ 
        error: 'No learning profile found',
        message: 'Complete the learning style and neurotype assessments to generate a profile'
      });
    }
    
    // Generate content rules
    const contentRules = await generateContentRules(
      userId,
      profile,
      contentType,
      subject,
      gradeLevel,
      tier
    );
    
    if (!contentRules) {
      return res.status(500).json({ error: 'Failed to generate content rules' });
    }
    
    // Save the content rules for future use
    await storage.saveContentRules(userId, contentRules);
    
    res.json({ contentRules });
  } catch (error) {
    console.error('Error in /content-rules:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Generate personalized curriculum content
 * POST /api/personalization/generate-content
 */
router.post('/generate-content', async (req: Request, res: Response) => {
  try {
    const { 
      userId, 
      subject, 
      gradeLevel, 
      contentType, 
      topic,
      learningObjectives = [],
      tier = 'basic'
    } = req.body;
    
    if (!userId || !subject || !gradeLevel || !contentType || !topic) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Check if user has reached their content generation limit
    const limitReached = await hasReachedContentGenerationLimit(userId, tier);
    
    if (limitReached) {
      return res.status(403).json({ 
        error: 'Content generation limit reached',
        message: `You have reached your content generation limit for the ${tier} tier.`
      });
    }
    
    // Get the user's learning profile
    const profile = await getLearningProfile(userId);
    
    if (!profile) {
      return res.status(404).json({ 
        error: 'No learning profile found',
        message: 'Complete the learning style and neurotype assessments to generate a profile'
      });
    }
    
    // Get or generate content rules
    let contentRules = await getContentRules(userId, contentType, subject, gradeLevel, tier);
    
    if (!contentRules) {
      contentRules = await generateContentRules(
        userId,
        profile,
        contentType,
        subject,
        gradeLevel,
        tier
      );
      
      if (!contentRules) {
        return res.status(500).json({ error: 'Failed to generate content rules' });
      }
      
      // Save the content rules for future use
      await storage.saveContentRules(userId, contentRules);
    }
    
    // Generate the content
    const generatedContent = await generateContent(
      userId,
      profile,
      contentRules,
      {
        subject,
        gradeLevel,
        contentType,
        topic,
        learningObjectives,
        tier
      }
    );
    
    if (!generatedContent) {
      return res.status(500).json({ error: 'Failed to generate content' });
    }
    
    // Save the generated content
    await storage.saveGeneratedContent(userId, generatedContent);
    
    // Record content generation for usage tracking
    await storage.recordContentGeneration(userId, tier);
    
    res.json({ 
      content: generatedContent,
      message: 'Content generated successfully'
    });
  } catch (error) {
    console.error('Error in /generate-content:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Get all generated content for a user
 * GET /api/personalization/content/:userId
 */
router.get('/content/:userId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Get the user's generated content
    const content = await storage.getGeneratedContent(userId);
    
    res.json({ content });
  } catch (error) {
    console.error('Error in /content/:userId:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Get specific generated content by ID
 * GET /api/personalization/content/:userId/:contentId
 */
router.get('/content/:userId/:contentId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const contentId = req.params.contentId;
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Get the specific content
    const content = await storage.getGeneratedContentById(userId, contentId);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    res.json({ content });
  } catch (error) {
    console.error('Error in /content/:userId/:contentId:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Get tier information and limits
 * GET /api/personalization/tier-info
 */
router.get('/tier-info', (req: Request, res: Response) => {
  try {
    res.json({ 
      tiers: {
        basic: {
          name: 'Basic',
          price: 49,
          description: 'Essential neurodivergent learning tools',
          limits: TIER_LIMITS.basic
        },
        standard: {
          name: 'Standard',
          price: 129,
          description: 'Comprehensive personalized learning',
          limits: TIER_LIMITS.standard
        },
        premium: {
          name: 'Premium',
          price: 199,
          description: 'Advanced AI-enhanced education',
          limits: TIER_LIMITS.premium
        }
      }
    });
  } catch (error) {
    console.error('Error in /tier-info:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Helper middleware to provide storage methods required by these routes
 */
export const personalizationStorageMethods = {
  hasCompletedAssessments: async (userId: number): Promise<boolean> => {
    const hasLearningStyle = await storage.hasLearningStyleAssessment(userId);
    const hasNeurotype = await storage.hasNeurotypeAssessment(userId);
    return hasLearningStyle && hasNeurotype;
  },
  
  hasLearningStyleAssessment: async (userId: number): Promise<boolean> => {
    // Implementation would check if user has completed the learning style assessment
    return false;
  },
  
  hasNeurotypeAssessment: async (userId: number): Promise<boolean> => {
    // Implementation would check if user has completed the neurotype assessment
    return false;
  },
  
  saveLearningStyleAssessment: async (userId: number, assessmentData: any): Promise<boolean> => {
    // Implementation would save the learning style assessment
    return true;
  },
  
  saveNeurotypeAssessment: async (userId: number, assessmentData: any): Promise<boolean> => {
    // Implementation would save the neurotype assessment
    return true;
  },
  
  saveContentRules: async (userId: number, contentRules: any): Promise<boolean> => {
    // Implementation would save the content rules
    return true;
  },
  
  saveGeneratedContent: async (userId: number, content: any): Promise<boolean> => {
    // Implementation would save the generated content
    return true;
  },
  
  getGeneratedContent: async (userId: number): Promise<any[]> => {
    // Implementation would get all generated content for a user
    return [];
  },
  
  getGeneratedContentById: async (userId: number, contentId: string): Promise<any> => {
    // Implementation would get specific generated content by ID
    return null;
  },
  
  recordContentGeneration: async (userId: number, tier: string): Promise<boolean> => {
    // Implementation would record content generation for usage tracking
    return true;
  }
};

export default router;