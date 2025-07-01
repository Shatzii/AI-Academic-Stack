/**
 * Bar Exam API Routes
 * 
 * API endpoints for the bar exam preparation features,
 * including AI-generated practice questions, essay evaluation,
 * and personalized study plans.
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
// Import the service using dynamic import for CJS compatibility
import barExamServicePath from '../../services/bar-exam-ai-service.cjs';
// Import the storage directly with the correct path
import { storage } from '../storage.js';

const router = express.Router();

// Get the service using dynamic import pattern
const barExamService = barExamServicePath.default || barExamServicePath;

// Rate limiting to prevent API abuse
const barExamLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiter to all bar exam routes
router.use(barExamLimiter);

/**
 * Generate bar exam practice questions
 * 
 * POST /api/bar-exam/practice-questions
 * 
 * Body: {
 *   legalTopic: string,
 *   difficultyLevel: string,
 *   count: number
 * }
 */
router.post('/practice-questions', async (req, res) => {
  try {
    const { legalTopic, difficultyLevel, count } = req.body;
    
    // Input validation
    if (!legalTopic || !difficultyLevel || !count) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Generate questions using the service
    const questions = await barExamService.generateBarExamQuestions(
      legalTopic,
      difficultyLevel,
      count
    );
    
    res.json(questions);
  } catch (error) {
    console.error('Error generating practice questions:', error);
    res.status(500).json({ error: 'Failed to generate practice questions' });
  }
});

/**
 * Evaluate bar exam essay
 * 
 * POST /api/bar-exam/evaluate-essay
 * 
 * Body: {
 *   prompt: string,
 *   essay: string
 * }
 */
router.post('/evaluate-essay', async (req, res) => {
  try {
    const { prompt, essay } = req.body;
    
    // Input validation
    if (!prompt || !essay) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Evaluate the essay using the service
    const evaluation = await barExamService.evaluateBarExamEssay(prompt, essay);
    
    res.json(evaluation);
  } catch (error) {
    console.error('Error evaluating essay:', error);
    res.status(500).json({ error: 'Failed to evaluate essay' });
  }
});

/**
 * Generate personalized study plan
 * 
 * POST /api/bar-exam/study-plan
 * 
 * Body: {
 *   userId: number,
 *   timeFrameDays: number,
 *   weakAreas: array,
 *   studyPreferences: object
 * }
 */
router.post('/study-plan', async (req, res) => {
  try {
    const { userId, timeFrameDays, weakAreas, studyPreferences } = req.body;
    
    // Input validation
    if (!userId || !timeFrameDays || !weakAreas || !Array.isArray(weakAreas)) {
      return res.status(400).json({ error: 'Missing or invalid required parameters' });
    }
    
    // Generate study plan using the service
    const studyPlan = await barExamService.generateBarExamStudyPlan(
      userId,
      timeFrameDays,
      weakAreas,
      studyPreferences || {}
    );
    
    res.json(studyPlan);
  } catch (error) {
    console.error('Error generating study plan:', error);
    res.status(500).json({ error: 'Failed to generate study plan' });
  }
});

/**
 * Analyze bar exam performance
 * 
 * POST /api/bar-exam/analyze-performance
 * 
 * Body: {
 *   testResults: array
 * }
 */
router.post('/analyze-performance', async (req, res) => {
  try {
    const { testResults } = req.body;
    
    // Input validation
    if (!testResults || !Array.isArray(testResults) || testResults.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid test results' });
    }
    
    // Analyze the test results using the service
    const analysis = await barExamService.analyzeBarExamPerformance(testResults);
    
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing performance:', error);
    res.status(500).json({ error: 'Failed to analyze performance' });
  }
});

/**
 * Get all memory aids
 * 
 * GET /api/bar-exam/memory-aids
 */
router.get('/memory-aids', async (req, res) => {
  try {
    // Use the directly imported storage
    const memoryAids = await storage.getBarExamMemoryAids();
    
    res.json(memoryAids);
  } catch (error) {
    console.error('Error fetching memory aids:', error);
    res.status(500).json({ error: 'Failed to fetch memory aids' });
  }
});

/**
 * Get memory aid by ID
 * 
 * GET /api/bar-exam/memory-aids/:id
 */
router.get('/memory-aids/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Use the storage to get memory aid by ID

    const memoryAid = await storage.getBarExamMemoryAid(Number(id));
    
    if (!memoryAid) {
      return res.status(404).json({ error: 'Memory aid not found' });
    }
    
    // Update access count and last accessed time
    if (memoryAid) {
      memoryAid.accessCount = (memoryAid.accessCount || 0) + 1;
      memoryAid.lastAccessed = new Date();
    }
    
    res.json(memoryAid);
  } catch (error) {
    console.error('Error fetching memory aid:', error);
    res.status(500).json({ error: 'Failed to fetch memory aid' });
  }
});

/**
 * Create a new memory aid
 * 
 * POST /api/bar-exam/memory-aids
 * 
 * Body: {
 *   title: string,
 *   content: string,
 *   neurotypeTailoring: string,
 *   legalTopic: string,
 *   aidType: string,
 *   explanation: string
 * }
 */
router.post('/memory-aids', async (req, res) => {
  try {
    const { title, content, neurotypeTailoring, legalTopic, aidType, explanation } = req.body;
    
    // Input validation
    if (!title || !content || !neurotypeTailoring || !legalTopic || !aidType || !explanation) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Use the storage to create a new memory aid

    const newMemoryAid = await storage.createBarExamMemoryAid({
      title,
      content,
      neurotypeTailoring,
      legalTopic,
      aidType,
      explanation
    });
    
    res.status(201).json(newMemoryAid);
  } catch (error) {
    console.error('Error creating memory aid:', error);
    res.status(500).json({ error: 'Failed to create memory aid' });
  }
});

/**
 * Get memory aids by legal topic
 * 
 * GET /api/bar-exam/memory-aids/topic/:legalTopic
 */
router.get('/memory-aids/topic/:legalTopic', async (req, res) => {
  try {
    const { legalTopic } = req.params;
    
    // Use the storage to get memory aids by legal topic

    const memoryAids = await storage.getBarExamMemoryAidsByLegalTopic(legalTopic);
    
    res.json(memoryAids);
  } catch (error) {
    console.error('Error fetching memory aids by legal topic:', error);
    res.status(500).json({ error: 'Failed to fetch memory aids by legal topic' });
  }
});

/**
 * Get memory aids by neurotype
 * 
 * GET /api/bar-exam/memory-aids/neurotype/:neurotype
 */
router.get('/memory-aids/neurotype/:neurotype', async (req, res) => {
  try {
    const { neurotype } = req.params;
    
    // Use the storage to get memory aids by neurotype

    const memoryAids = await storage.getBarExamMemoryAidsByNeurotype(neurotype);
    
    res.json(memoryAids);
  } catch (error) {
    console.error('Error fetching memory aids by neurotype:', error);
    res.status(500).json({ error: 'Failed to fetch memory aids by neurotype' });
  }
});

/**
 * Get memory aids by aid type
 * 
 * GET /api/bar-exam/memory-aids/type/:aidType
 */
router.get('/memory-aids/type/:aidType', async (req, res) => {
  try {
    const { aidType } = req.params;
    
    // Use the storage to get memory aids by aid type

    const memoryAids = await storage.getBarExamMemoryAidsByType(aidType);
    
    res.json(memoryAids);
  } catch (error) {
    console.error('Error fetching memory aids by aid type:', error);
    res.status(500).json({ error: 'Failed to fetch memory aids by aid type' });
  }
});

/**
 * Get AI Tutor Sessions for user
 * 
 * GET /api/bar-exam/tutor-sessions/:userId
 */
router.get('/tutor-sessions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Use the storage to get tutor sessions for user

    const tutorSessions = await storage.getBarExamAiTutorSessions(Number(userId));
    
    res.json(tutorSessions);
  } catch (error) {
    console.error('Error fetching tutor sessions:', error);
    res.status(500).json({ error: 'Failed to fetch tutor sessions' });
  }
});

/**
 * Get AI Tutor Session by ID
 * 
 * GET /api/bar-exam/tutor-sessions/session/:id
 */
router.get('/tutor-sessions/session/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Use the storage to get tutor session by ID

    const tutorSession = await storage.getBarExamAiTutorSession(Number(id));
    
    if (!tutorSession) {
      return res.status(404).json({ error: 'Tutor session not found' });
    }
    
    res.json(tutorSession);
  } catch (error) {
    console.error('Error fetching tutor session:', error);
    res.status(500).json({ error: 'Failed to fetch tutor session' });
  }
});

/**
 * Create a new AI Tutor Session
 * 
 * POST /api/bar-exam/tutor-sessions
 * 
 * Body: {
 *   userId: number,
 *   legalTopic: string,
 *   questions: array,
 *   answers: array,
 *   neurotypeTailoring: string
 * }
 */
router.post('/tutor-sessions', async (req, res) => {
  try {
    const { userId, legalTopic, questions, answers, neurotypeTailoring } = req.body;
    
    // Input validation
    if (!userId || !legalTopic || !questions || !answers) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Use the storage to create a new tutor session

    const newTutorSession = await storage.createBarExamAiTutorSession({
      userId,
      legalTopic,
      questions,
      answers,
      neurotypeTailoring: neurotypeTailoring || 'general',
      rating: null,
      feedback: null,
      aiAnalysisNotes: null
    });
    
    res.status(201).json(newTutorSession);
  } catch (error) {
    console.error('Error creating tutor session:', error);
    res.status(500).json({ error: 'Failed to create tutor session' });
  }
});

/**
 * Rate an AI Tutor Session
 * 
 * POST /api/bar-exam/tutor-sessions/:id/rate
 * 
 * Body: {
 *   rating: number,
 *   feedback: string
 * }
 */
router.post('/tutor-sessions/:id/rate', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;
    
    // Input validation
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
    }
    
    // Use the storage to rate a tutor session

    const updatedSession = await storage.rateBarExamAiTutorSession(
      Number(id),
      rating,
      feedback || null
    );
    
    if (!updatedSession) {
      return res.status(404).json({ error: 'Tutor session not found' });
    }
    
    res.json(updatedSession);
  } catch (error) {
    console.error('Error rating tutor session:', error);
    res.status(500).json({ error: 'Failed to rate tutor session' });
  }
});

export { router };
export default router;