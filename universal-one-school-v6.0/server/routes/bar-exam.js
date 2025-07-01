/**
 * Bar Exam API Routes
 * 
 * API endpoints for the bar exam preparation features,
 * including AI-generated practice questions, essay evaluation,
 * and personalized study plans.
 */

const express = require('express');
const router = express.Router();
const barExamService = require('../../services/bar-exam-ai-service.cjs');

// Rate limiting to prevent API abuse
const rateLimit = require('express-rate-limit');
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
 *   difficulty: "easy" | "medium" | "hard" | "bar-level",
 *   numberOfQuestions: number,
 *   questionType: "multiple-choice" | "essay" | "short-answer",
 *   studentWeaknesses: string[] (optional)
 * }
 */
router.post('/practice-questions', async (req, res) => {
  try {
    const { 
      legalTopic, 
      difficulty, 
      numberOfQuestions, 
      questionType, 
      studentWeaknesses 
    } = req.body;
    
    // Input validation
    if (!legalTopic || !difficulty || !numberOfQuestions || !questionType) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    if (numberOfQuestions < 1 || numberOfQuestions > 10) {
      return res.status(400).json({ error: 'Number of questions must be between 1 and 10' });
    }
    
    const validQuestionTypes = ['multiple-choice', 'essay', 'short-answer'];
    if (!validQuestionTypes.includes(questionType)) {
      return res.status(400).json({ error: 'Invalid question type' });
    }
    
    const validDifficulties = ['easy', 'medium', 'hard', 'bar-level'];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty level' });
    }
    
    // Generate questions using the service
    const questions = await barExamService.generateBarExamQuestions(
      legalTopic,
      difficulty,
      numberOfQuestions,
      questionType,
      studentWeaknesses || []
    );
    
    res.json(questions);
  } catch (error) {
    console.error('Error generating practice questions:', error);
    res.status(500).json({ error: 'Failed to generate practice questions' });
  }
});

/**
 * Evaluate a student's essay answer
 * 
 * POST /api/bar-exam/evaluate-essay
 * 
 * Body: {
 *   questionText: string,
 *   studentAnswer: string,
 *   legalTopic: string
 * }
 */
router.post('/evaluate-essay', async (req, res) => {
  try {
    const { questionText, studentAnswer, legalTopic } = req.body;
    
    // Input validation
    if (!questionText || !studentAnswer || !legalTopic) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    if (studentAnswer.length < 100) {
      return res.status(400).json({ error: 'Essay answer is too short for evaluation' });
    }
    
    // Evaluate the essay using the service
    const evaluation = await barExamService.evaluateBarExamEssay(
      questionText,
      studentAnswer,
      legalTopic
    );
    
    res.json(evaluation);
  } catch (error) {
    console.error('Error evaluating essay:', error);
    res.status(500).json({ error: 'Failed to evaluate essay' });
  }
});

/**
 * Generate a personalized study plan
 * 
 * POST /api/bar-exam/study-plan
 * 
 * Body: {
 *   studentData: object,
 *   examDate: string
 * }
 */
router.post('/study-plan', async (req, res) => {
  try {
    const { studentData, examDate } = req.body;
    
    // Input validation
    if (!studentData || !examDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Validate exam date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(examDate)) {
      return res.status(400).json({ error: 'Exam date must be in YYYY-MM-DD format' });
    }
    
    // Required student data fields
    const requiredFields = ['strengths', 'weaknesses', 'availableStudyHours', 'neurotype'];
    for (const field of requiredFields) {
      if (!studentData[field]) {
        return res.status(400).json({ error: `Missing required field in studentData: ${field}` });
      }
    }
    
    // Generate the study plan using the service
    const studyPlan = await barExamService.generatePersonalizedStudyPlan(
      studentData,
      examDate
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
 * Generate memory aids for legal concepts
 * 
 * POST /api/bar-exam/memory-aids
 * 
 * Body: {
 *   legalTopic: string,
 *   neurotype: string
 * }
 */
router.post('/memory-aids', async (req, res) => {
  try {
    const { legalTopic, neurotype } = req.body;
    
    // Input validation
    if (!legalTopic) {
      return res.status(400).json({ error: 'Missing required parameter: legalTopic' });
    }
    
    // Generate memory aids using the service
    const memoryAids = await barExamService.generateLegalMemoryAids(
      legalTopic,
      neurotype || 'general'
    );
    
    res.json(memoryAids);
  } catch (error) {
    console.error('Error generating memory aids:', error);
    res.status(500).json({ error: 'Failed to generate memory aids' });
  }
});

/**
 * Get AI tutor response for a legal question
 * 
 * POST /api/bar-exam/tutor-response
 * 
 * Body: {
 *   studentQuestion: string,
 *   legalTopic: string,
 *   neurotype: string
 * }
 */
router.post('/tutor-response', async (req, res) => {
  try {
    const { studentQuestion, legalTopic, neurotype } = req.body;
    
    // Input validation
    if (!studentQuestion || !legalTopic) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Get tutor response using the service
    const tutorResponse = await barExamService.barExamTutorResponse(
      studentQuestion,
      legalTopic,
      neurotype || 'general'
    );
    
    res.json(tutorResponse);
  } catch (error) {
    console.error('Error getting tutor response:', error);
    res.status(500).json({ error: 'Failed to get tutor response' });
  }
});

/**
 * Get bar exam progress and statistics
 * 
 * GET /api/bar-exam/progress/:userId
 */
router.get('/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // For MVP, returning mock data
    // In production, this would fetch from the database
    const progress = {
      overallProgress: 72,
      subjectProgress: [
        { subject: 'UAE Constitutional Law', progress: 92, status: 'completed' },
        { subject: 'UAE Civil Law', progress: 88, status: 'completed' },
        { subject: 'UAE Criminal Law', progress: 76, status: 'in-progress' },
        { subject: 'UAE Commercial Law', progress: 65, status: 'in-progress' },
        { subject: 'UAE Civil Procedure', progress: 58, status: 'in-progress' },
        { subject: 'Islamic Jurisprudence', progress: 0, status: 'not-started' }
      ],
      testsTaken: 24,
      averageScore: 82,
      studyHours: 140,
      subjectsMastered: '8/10',
      examDate: '2025-06-15',
      daysRemaining: 65
    };
    
    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

/**
 * Get all memory aids
 * 
 * GET /api/bar-exam/memory-aids
 */
router.get('/memory-aids', async (req, res) => {
  try {
    // Use the storage to get all memory aids
    const storage = req.app.locals.storage;
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
    const storage = req.app.locals.storage;
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
 * Get memory aids by legal topic
 * 
 * GET /api/bar-exam/memory-aids/topic/:legalTopic
 */
router.get('/memory-aids/topic/:legalTopic', async (req, res) => {
  try {
    const { legalTopic } = req.params;
    
    // Use the storage to get memory aids by legal topic
    const storage = req.app.locals.storage;
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
    const storage = req.app.locals.storage;
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
    const storage = req.app.locals.storage;
    const memoryAids = await storage.getBarExamMemoryAidsByType(aidType);
    
    res.json(memoryAids);
  } catch (error) {
    console.error('Error fetching memory aids by aid type:', error);
    res.status(500).json({ error: 'Failed to fetch memory aids by aid type' });
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
    const storage = req.app.locals.storage;
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
 * Get all AI tutor sessions for a user
 * 
 * GET /api/bar-exam/tutor-sessions/:userId
 */
router.get('/tutor-sessions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Input validation
    if (!userId) {
      return res.status(400).json({ error: 'Missing required parameter: userId' });
    }
    
    // Use the storage to get tutor sessions for a user
    const storage = req.app.locals.storage;
    const sessions = await storage.getBarExamAiTutorSessions(Number(userId));
    
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching tutor sessions:', error);
    res.status(500).json({ error: 'Failed to fetch tutor sessions' });
  }
});

/**
 * Get a specific AI tutor session by ID
 * 
 * GET /api/bar-exam/tutor-sessions/session/:id
 */
router.get('/tutor-sessions/session/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Input validation
    if (!id) {
      return res.status(400).json({ error: 'Missing required parameter: id' });
    }
    
    // Use the storage to get tutor session by ID
    const storage = req.app.locals.storage;
    const session = await storage.getBarExamAiTutorSession(Number(id));
    
    if (!session) {
      return res.status(404).json({ error: 'Tutor session not found' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Error fetching tutor session:', error);
    res.status(500).json({ error: 'Failed to fetch tutor session' });
  }
});

/**
 * Create a new AI tutor session
 * 
 * POST /api/bar-exam/tutor-sessions
 * 
 * Body: {
 *   userId: number,
 *   subject: string,
 *   question: string,
 *   neurotypeTailoring: string
 * }
 */
router.post('/tutor-sessions', async (req, res) => {
  try {
    const { userId, subject, question, neurotypeTailoring } = req.body;
    
    // Input validation
    if (!userId || !subject || !question) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Get the response from the AI service
    const response = await barExamService.barExamTutorResponse(
      question,
      subject,
      neurotypeTailoring || 'general'
    );
    
    // Create a new tutor session with the AI response
    const storage = req.app.locals.storage;
    const newSession = await storage.createBarExamAiTutorSession({
      userId: Number(userId),
      subject,
      question,
      answer: response.answer,
      neurotypeTailoring: neurotypeTailoring || 'general',
      followUpQuestions: response.followUpQuestions || []
    });
    
    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error creating tutor session:', error);
    res.status(500).json({ error: 'Failed to create tutor session' });
  }
});

/**
 * Rate an AI tutor session
 * 
 * PATCH /api/bar-exam/tutor-sessions/:id/rate
 * 
 * Body: {
 *   rating: number,
 *   feedback: string
 * }
 */
router.patch('/tutor-sessions/:id/rate', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;
    
    // Input validation
    if (!id) {
      return res.status(400).json({ error: 'Missing required parameter: id' });
    }
    
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
    }
    
    // Use the storage to rate a tutor session
    const storage = req.app.locals.storage;
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

module.exports = router;