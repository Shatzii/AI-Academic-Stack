import { Router } from 'express';
import { storage } from '../storage';
import anthropicService from '../services/anthropic';
import { 
  insertAiCompanionSchema, 
  insertAiCompanionChatSchema, 
  insertAiCompanionMessageSchema, 
  insertAiCompanionLearningProgressSchema 
} from '@shared/schema';
import { z } from 'zod';

export const router = Router();

// Get all user's AI companions
router.get('/users/:userId/companions', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const companions = await storage.getAiCompanions(userId);
    res.json(companions);
  } catch (error) {
    console.error('Error fetching AI companions:', error);
    res.status(500).json({ message: 'Failed to fetch AI companions' });
  }
});

// Get specific AI companion
router.get('/companions/:id', async (req, res) => {
  try {
    const companionId = parseInt(req.params.id);
    const companion = await storage.getAiCompanion(companionId);
    
    if (!companion) {
      return res.status(404).json({ message: 'AI companion not found' });
    }
    
    res.json(companion);
  } catch (error) {
    console.error('Error fetching AI companion:', error);
    res.status(500).json({ message: 'Failed to fetch AI companion' });
  }
});

// Create AI companion
router.post('/companions', async (req, res) => {
  try {
    const validatedData = insertAiCompanionSchema.parse(req.body);
    const companion = await storage.createAiCompanion(validatedData);
    res.status(201).json(companion);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    console.error('Error creating AI companion:', error);
    res.status(500).json({ message: 'Failed to create AI companion' });
  }
});

// Update AI companion
router.put('/companions/:id', async (req, res) => {
  try {
    const companionId = parseInt(req.params.id);
    const updatedCompanion = await storage.updateAiCompanion(companionId, req.body);
    
    if (!updatedCompanion) {
      return res.status(404).json({ message: 'AI companion not found' });
    }
    
    res.json(updatedCompanion);
  } catch (error) {
    console.error('Error updating AI companion:', error);
    res.status(500).json({ message: 'Failed to update AI companion' });
  }
});

// Delete AI companion (deactivate)
router.delete('/companions/:id', async (req, res) => {
  try {
    const companionId = parseInt(req.params.id);
    const success = await storage.deleteAiCompanion(companionId);
    
    if (!success) {
      return res.status(404).json({ message: 'AI companion not found' });
    }
    
    res.json({ message: 'AI companion deactivated successfully' });
  } catch (error) {
    console.error('Error deleting AI companion:', error);
    res.status(500).json({ message: 'Failed to delete AI companion' });
  }
});

// Get AI companion chat history
router.get('/companions/:companionId/chats', async (req, res) => {
  try {
    const companionId = parseInt(req.params.companionId);
    const chats = await storage.getAiCompanionChats(companionId);
    res.json(chats);
  } catch (error) {
    console.error('Error fetching companion chats:', error);
    res.status(500).json({ message: 'Failed to fetch companion chats' });
  }
});

// Create new chat session
router.post('/chats', async (req, res) => {
  try {
    const validatedData = insertAiCompanionChatSchema.parse(req.body);
    const chat = await storage.createAiCompanionChat(validatedData);
    res.status(201).json(chat);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    console.error('Error creating chat session:', error);
    res.status(500).json({ message: 'Failed to create chat session' });
  }
});

// Get chat messages
router.get('/chats/:chatId/messages', async (req, res) => {
  try {
    const chatId = parseInt(req.params.chatId);
    const messages = await storage.getAiCompanionMessages(chatId);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ message: 'Failed to fetch chat messages' });
  }
});

// Add new message and get AI response
router.post('/chats/:chatId/messages', async (req, res) => {
  try {
    const chatId = parseInt(req.params.chatId);
    const { content, type = 'text' } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    // Create user message
    const userMessage = await storage.createAiCompanionMessage({
      chatId,
      role: 'user',
      content,
      type
    });
    
    // Get chat and companion info for context
    const chat = await storage.getAiCompanionChat(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat session not found' });
    }
    
    const companion = await storage.getAiCompanion(chat.companionId);
    if (!companion) {
      return res.status(404).json({ message: 'AI companion not found' });
    }
    
    // Get previous messages for context
    const messages = await storage.getAiCompanionMessages(chatId);
    const chatHistory = messages
      .filter(msg => msg.id !== userMessage.id) // Exclude current message
      .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
      .map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));
    
    // Generate AI response
    const systemPrompt = `
      You are an educational AI assistant with the following characteristics:
      - Personality: ${companion.personality}
      - Expertise: ${companion.expertise}
      - Tone: ${companion.tone}
      ${companion.neurotypeSensitivity ? `- Neurodiversity specialization: ${companion.neurotypeSensitivity}` : ''}
      ${companion.customPrompt ? `\n${companion.customPrompt}` : ''}
      
      Adapt your responses to be helpful, educational, and supportive for the student.
    `;
    
    const aiResponseText = await anthropicService.generateChatResponse(
      [...chatHistory, { role: 'user', content }],
      systemPrompt
    );
    
    // Save AI response to database
    const aiMessage = await storage.createAiCompanionMessage({
      chatId,
      role: 'assistant',
      content: aiResponseText,
      type: 'text'
    });
    
    // Return both messages
    res.status(201).json({
      userMessage,
      aiMessage
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ message: 'Failed to process message' });
  }
});

// Analyze student learning progress
router.post('/companions/:companionId/analyze', async (req, res) => {
  try {
    const companionId = parseInt(req.params.companionId);
    const { userId, subject, learningContent } = req.body;
    
    if (!userId || !subject || !learningContent) {
      return res.status(400).json({ message: 'userId, subject, and learningContent are required' });
    }
    
    // Analyze learning progress using Anthropic
    const analysis = await anthropicService.analyzeLearningProgress(
      learningContent,
      subject,
      "appropriate grade level", // This could be improved by getting actual grade level
      "General understanding of the subject"
    );
    
    // Save or update learning progress
    const existingProgress = await storage.getAiCompanionLearningProgressBySubject(parseInt(userId), companionId, subject);
    
    if (existingProgress) {
      // Update existing record
      const updatedProgress = await storage.updateAiCompanionLearningProgress(existingProgress.id, {
        proficiencyLevel: analysis.proficiencyLevel,
        strengthAreas: analysis.strengthAreas,
        improvementAreas: analysis.improvementAreas,
        lastAssessment: new Date()
      });
      
      return res.json({
        analysis,
        progressRecord: updatedProgress
      });
    } else {
      // Create new record
      const newProgress = await storage.createAiCompanionLearningProgress({
        companionId,
        userId: parseInt(userId),
        subject,
        topic: subject, // Generalized topic (same as subject for now)
        proficiencyLevel: analysis.proficiencyLevel,
        strengthAreas: analysis.strengthAreas,
        improvementAreas: analysis.improvementAreas,
        lastAssessment: new Date()
      });
      
      return res.json({
        analysis,
        progressRecord: newProgress
      });
    }
  } catch (error) {
    console.error('Error analyzing learning:', error);
    res.status(500).json({ message: 'Failed to analyze learning progress' });
  }
});

// Generate quiz questions
router.post('/companions/:companionId/quiz', async (req, res) => {
  try {
    const { subject, topic, difficulty = 3, numberOfQuestions = 5 } = req.body;
    
    if (!subject || !topic) {
      return res.status(400).json({ message: 'subject and topic are required' });
    }
    
    const combinedTopic = `${subject}: ${topic}`;
    const quizData = await anthropicService.generateQuiz(
      combinedTopic, 
      difficulty, 
      numberOfQuestions
    );
    
    res.json(quizData);
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ message: 'Failed to generate quiz questions' });
  }
});

// Generate learning path
router.post('/companions/:companionId/learning-path', async (req, res) => {
  try {
    const { userId, subject, currentLevel, learningGoals, timeframe, neurotype } = req.body;
    
    if (!userId || !subject || !currentLevel || !learningGoals || !timeframe) {
      return res.status(400).json({ 
        message: 'userId, subject, currentLevel, learningGoals, and timeframe are required' 
      });
    }
    
    const studentProfile = {
      gradeLevel: currentLevel,
      subject: subject,
      interests: [learningGoals] // This could be expanded in the future
    };

    const learningPath = await anthropicService.generateLearningPlan(
      studentProfile,
      "visual", // Default learning style, could be customized
      neurotype || "neurotypical", 
      currentLevel,
      learningGoals 
    );
    
    res.json(learningPath);
  } catch (error) {
    console.error('Error generating learning path:', error);
    res.status(500).json({ message: 'Failed to generate learning path' });
  }
});

export default router;