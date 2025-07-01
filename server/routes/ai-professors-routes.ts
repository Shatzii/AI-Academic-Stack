/**
 * AI Professors API Routes
 * 
 * This module implements the API routes for interacting with AI professors
 * across different school types (Law School, Language School). It connects
 * with the CEO dashboard functionality for managing professors and AI interactions.
 */

import { Router } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { 
  AIProfessorFactory,
  ContentType,
  MessageRole
} from '../services/ai-professors/ai-professor-interface';
import { 
  createUAELawProfessor, 
  LawProfessor
} from '../services/ai-professors/law-professor';
import {
  createEnglishProfessor,
  createSpanishProfessor,
  createGermanProfessor,
  createChineseProfessor,
  TeachingLanguage
} from '../services/ai-professors/language-professor';
import { learningProfileService } from '../services/learning-profile-service';

// Create the router
const router = Router();

// Cache for professor instances
const professorCache = new Map();

/**
 * Validate if user can access school
 */
function canAccessSchool(user: any, schoolType: string): boolean {
  // In a real application, this would check user roles and permissions
  // For now, allow all authenticated users
  return !!user;
}

/**
 * Get the appropriate professor instance
 */
async function getProfessorInstance(domain: string, type: string) {
  const cacheKey = `${domain}:${type}`;
  
  // Check cache first
  if (professorCache.has(cacheKey)) {
    return professorCache.get(cacheKey);
  }
  
  // Create new professor instance
  let professor = null;
  
  if (domain === 'law') {
    professor = createUAELawProfessor();
  } else if (domain === 'language') {
    switch (type.toLowerCase()) {
      case 'english':
        professor = createEnglishProfessor();
        break;
      case 'spanish':
        professor = createSpanishProfessor();
        break;
      case 'german':
        professor = createGermanProfessor();
        break;
      case 'chinese':
        professor = createChineseProfessor();
        break;
    }
  }
  
  // Cache the instance
  if (professor) {
    professorCache.set(cacheKey, professor);
  }
  
  return professor;
}

/**
 * Get professor profile
 * GET /api/professors/:domain/:type/profile
 */
router.get('/:domain/:type/profile', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { domain, type } = req.params;
    
    // Check access permissions
    if (!canAccessSchool(req.user, domain)) {
      return res.status(403).json({ error: `You don't have access to ${domain} school` });
    }
    
    // Get professor instance
    const professor = await getProfessorInstance(domain, type);
    
    if (!professor) {
      return res.status(404).json({ error: `Professor not found for ${domain}/${type}` });
    }
    
    // Return professor profile
    const profile = professor.getProfile();
    res.json(profile);
  } catch (error) {
    console.error(`Error getting professor profile:`, error);
    res.status(500).json({ error: 'Failed to get professor profile' });
  }
});

/**
 * Generate content with professor
 * POST /api/professors/:domain/:type/content
 */
router.post('/:domain/:type/content', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { domain, type } = req.params;
    
    // Validate request body
    const schema = z.object({
      contentType: z.string(),
      topic: z.string(),
      difficultyLevel: z.string().optional(),
      length: z.string().optional(),
      format: z.string().optional(),
      additionalInstructions: z.string().optional(),
      applyLearningProfile: z.boolean().optional()
    });
    
    const validationResult = schema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validationResult.error });
    }
    
    const { contentType, topic, difficultyLevel, length, format, additionalInstructions, applyLearningProfile } = validationResult.data;
    
    // Check access permissions
    if (!canAccessSchool(req.user, domain)) {
      return res.status(403).json({ error: `You don't have access to ${domain} school` });
    }
    
    // Get professor instance
    const professor = await getProfessorInstance(domain, type);
    
    if (!professor) {
      return res.status(404).json({ error: `Professor not found for ${domain}/${type}` });
    }
    
    // Get learning profile if needed
    let learningProfile = undefined;
    
    if (applyLearningProfile) {
      learningProfile = await learningProfileService.getOrCreateProfile(req.user!.id);
    }
    
    // Generate content
    const contentResponse = await professor.generateContent({
      professorId: professor.getProfile().id!,
      userId: req.user!.id,
      contentType: contentType as ContentType,
      topic,
      difficultyLevel,
      length,
      format,
      additionalInstructions,
      learningProfile
    });
    
    // Return content
    res.json(contentResponse);
  } catch (error) {
    console.error(`Error generating content:`, error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

/**
 * Start conversation with professor
 * POST /api/professors/:domain/:type/conversations
 */
router.post('/:domain/:type/conversations', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { domain, type } = req.params;
    
    // Validate request body
    const schema = z.object({
      topic: z.string(),
      initialMessage: z.string().optional()
    });
    
    const validationResult = schema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validationResult.error });
    }
    
    const { topic, initialMessage } = validationResult.data;
    
    // Check access permissions
    if (!canAccessSchool(req.user, domain)) {
      return res.status(403).json({ error: `You don't have access to ${domain} school` });
    }
    
    // Get professor instance
    const professor = await getProfessorInstance(domain, type);
    
    if (!professor) {
      return res.status(404).json({ error: `Professor not found for ${domain}/${type}` });
    }
    
    // Start conversation
    const conversation = await professor.startConversation(
      req.user!.id,
      topic,
      initialMessage
    );
    
    // Return conversation
    res.status(201).json(conversation);
  } catch (error) {
    console.error(`Error starting conversation:`, error);
    res.status(500).json({ error: 'Failed to start conversation' });
  }
});

/**
 * Get conversation
 * GET /api/professors/:domain/:type/conversations/:conversationId
 */
router.get('/:domain/:type/conversations/:conversationId', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { domain, type, conversationId } = req.params;
    
    // Check access permissions
    if (!canAccessSchool(req.user, domain)) {
      return res.status(403).json({ error: `You don't have access to ${domain} school` });
    }
    
    // Get professor instance
    const professor = await getProfessorInstance(domain, type);
    
    if (!professor) {
      return res.status(404).json({ error: `Professor not found for ${domain}/${type}` });
    }
    
    // Get conversation
    const conversation = await professor.getConversation(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Check if conversation belongs to user
    if (conversation.userId !== req.user!.id && req.user!.role !== 'admin' && req.user!.role !== 'ceo') {
      return res.status(403).json({ error: 'You do not have permission to view this conversation' });
    }
    
    // Return conversation
    res.json(conversation);
  } catch (error) {
    console.error(`Error getting conversation:`, error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
});

/**
 * Send message in conversation
 * POST /api/professors/:domain/:type/conversations/:conversationId/messages
 */
router.post('/:domain/:type/conversations/:conversationId/messages', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { domain, type, conversationId } = req.params;
    
    // Validate request body
    const schema = z.object({
      content: z.string(),
      messageType: z.string().default('text')
    });
    
    const validationResult = schema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validationResult.error });
    }
    
    const { content, messageType } = validationResult.data;
    
    // Check access permissions
    if (!canAccessSchool(req.user, domain)) {
      return res.status(403).json({ error: `You don't have access to ${domain} school` });
    }
    
    // Get professor instance
    const professor = await getProfessorInstance(domain, type);
    
    if (!professor) {
      return res.status(404).json({ error: `Professor not found for ${domain}/${type}` });
    }
    
    // Get conversation
    const conversation = await professor.getConversation(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Check if conversation belongs to user
    if (conversation.userId !== req.user!.id && req.user!.role !== 'admin' && req.user!.role !== 'ceo') {
      return res.status(403).json({ error: 'You do not have permission to access this conversation' });
    }
    
    // Create message
    const message = {
      id: uuidv4(),
      role: MessageRole.STUDENT,
      content,
      type: messageType,
      timestamp: new Date()
    };
    
    // Handle interaction
    const response = await professor.handleInteraction(conversationId, message);
    
    // Return response
    res.json(response);
  } catch (error) {
    console.error(`Error sending message:`, error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

/**
 * End conversation
 * PUT /api/professors/:domain/:type/conversations/:conversationId/end
 */
router.put('/:domain/:type/conversations/:conversationId/end', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { domain, type, conversationId } = req.params;
    
    // Check access permissions
    if (!canAccessSchool(req.user, domain)) {
      return res.status(403).json({ error: `You don't have access to ${domain} school` });
    }
    
    // Get professor instance
    const professor = await getProfessorInstance(domain, type);
    
    if (!professor) {
      return res.status(404).json({ error: `Professor not found for ${domain}/${type}` });
    }
    
    // End conversation
    const success = await professor.endConversation(conversationId);
    
    if (!success) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Return success
    res.json({ success: true });
  } catch (error) {
    console.error(`Error ending conversation:`, error);
    res.status(500).json({ error: 'Failed to end conversation' });
  }
});

/**
 * Get assessment for student work
 * POST /api/professors/:domain/:type/assessments
 */
router.post('/:domain/:type/assessments', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { domain, type } = req.params;
    
    // Validate request body
    const schema = z.object({
      submission: z.string(),
      rubric: z.record(z.any()).optional()
    });
    
    const validationResult = schema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validationResult.error });
    }
    
    const { submission, rubric } = validationResult.data;
    
    // Check access permissions
    if (!canAccessSchool(req.user, domain)) {
      return res.status(403).json({ error: `You don't have access to ${domain} school` });
    }
    
    // Get professor instance
    const professor = await getProfessorInstance(domain, type);
    
    if (!professor) {
      return res.status(404).json({ error: `Professor not found for ${domain}/${type}` });
    }
    
    // Provide assessment
    const assessment = await professor.provideAssessment(
      req.user!.id,
      submission,
      rubric
    );
    
    // Return assessment
    res.json(assessment);
  } catch (error) {
    console.error(`Error getting assessment:`, error);
    res.status(500).json({ error: 'Failed to get assessment' });
  }
});

/**
 * Get adaptation recommendations based on learning profile
 * GET /api/professors/:domain/:type/adaptations
 */
router.get('/:domain/:type/adaptations', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { domain, type } = req.params;
    
    // Check access permissions
    if (!canAccessSchool(req.user, domain)) {
      return res.status(403).json({ error: `You don't have access to ${domain} school` });
    }
    
    // Get professor instance
    const professor = await getProfessorInstance(domain, type);
    
    if (!professor) {
      return res.status(404).json({ error: `Professor not found for ${domain}/${type}` });
    }
    
    // Get learning profile
    const learningProfile = await learningProfileService.getOrCreateProfile(req.user!.id);
    
    // Get adaptations
    const adaptations = await professor.adaptToLearningProfile(learningProfile);
    
    // Return adaptations
    res.json(adaptations);
  } catch (error) {
    console.error(`Error getting adaptations:`, error);
    res.status(500).json({ error: 'Failed to get adaptations' });
  }
});

/**
 * Admin routes for CEO dashboard
 */

/**
 * Get all available professors
 * GET /api/professors/available
 */
router.get('/available', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Check if user is admin or CEO
    if (req.user!.role !== 'admin' && req.user!.role !== 'ceo') {
      return res.status(403).json({ error: 'You do not have permission to access this resource' });
    }
    
    // Create available professors list
    const availableProfessors = [
      {
        domain: 'law',
        type: 'uae',
        name: 'Dr. Ahmed Al Mansouri',
        title: 'Professor of UAE Law',
        specialization: 'UAE Commercial and Corporate Law',
        avatarUrl: '/images/professors/ahmed-al-mansouri.png'
      },
      {
        domain: 'language',
        type: 'english',
        name: 'Dr. Emily Johnson',
        title: 'Professor of English Language',
        specialization: 'English Language Education',
        avatarUrl: '/images/professors/english-professor.png'
      },
      {
        domain: 'language',
        type: 'spanish',
        name: 'Profesora Isabella Martínez',
        title: 'Professor of Spanish Language',
        specialization: 'Spanish Language Education',
        avatarUrl: '/images/professors/spanish-professor.png'
      },
      {
        domain: 'language',
        type: 'german',
        name: 'Professor Lukas Weber',
        title: 'Professor of German Language',
        specialization: 'German Language Education',
        avatarUrl: '/images/professors/german-professor.png'
      },
      {
        domain: 'language',
        type: 'chinese',
        name: 'Professor Li Wei',
        title: 'Professor of Chinese Language',
        specialization: 'Chinese Language Education',
        avatarUrl: '/images/professors/chinese-professor.png'
      }
    ];
    
    // Return professors
    res.json(availableProfessors);
  } catch (error) {
    console.error(`Error getting available professors:`, error);
    res.status(500).json({ error: 'Failed to get available professors' });
  }
});

/**
 * Get all conversations across professors (admin only)
 * GET /api/professors/conversations
 */
router.get('/conversations', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Check if user is admin or CEO
    if (req.user!.role !== 'admin' && req.user!.role !== 'ceo') {
      return res.status(403).json({ error: 'You do not have permission to access this resource' });
    }
    
    // This would normally query a database
    // For now, return a placeholder empty array
    res.json([]);
  } catch (error) {
    console.error(`Error getting conversations:`, error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

/**
 * Get usage statistics for professors (admin only)
 * GET /api/professors/stats
 */
router.get('/stats', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Check if user is admin or CEO
    if (req.user!.role !== 'admin' && req.user!.role !== 'ceo') {
      return res.status(403).json({ error: 'You do not have permission to access this resource' });
    }
    
    // This would normally query a database for actual usage statistics
    // For now, return placeholder data
    const stats = {
      totalInteractions: 0,
      activeConversations: 0,
      uniqueUsers: 0,
      contentGenerated: 0,
      byProfessor: [
        {
          domain: 'law',
          type: 'uae',
          name: 'Dr. Ahmed Al Mansouri',
          interactions: 0,
          averageRating: 0
        },
        {
          domain: 'language',
          type: 'english',
          name: 'Dr. Emily Johnson',
          interactions: 0,
          averageRating: 0
        },
        {
          domain: 'language',
          type: 'spanish',
          name: 'Profesora Isabella Martínez',
          interactions: 0,
          averageRating: 0
        },
        {
          domain: 'language',
          type: 'german',
          name: 'Professor Lukas Weber',
          interactions: 0,
          averageRating: 0
        },
        {
          domain: 'language',
          type: 'chinese',
          name: 'Professor Li Wei',
          interactions: 0,
          averageRating: 0
        }
      ]
    };
    
    // Return stats
    res.json(stats);
  } catch (error) {
    console.error(`Error getting professor stats:`, error);
    res.status(500).json({ error: 'Failed to get professor stats' });
  }
});

export default router;