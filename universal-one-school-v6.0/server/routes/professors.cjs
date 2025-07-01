/**
 * AI Professor API Routes (CommonJS version)
 * 
 * This file contains the API routes for managing and interacting
 * with AI professors in the ShotziOS platform.
 */

const express = require('express');
const router = express.Router();
const professorService = require('../../services/ai-professor-service');

// Create a new AI professor
router.post('/', async (req, res) => {
  try {
    const professorParameters = req.body;
    const professor = await professorService.createAIProfessor(professorParameters);
    res.status(201).json(professor);
  } catch (error) {
    console.error('Error creating AI professor:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get all professors
router.get('/', (req, res) => {
  try {
    const professors = professorService.listAIProfessors();
    res.json(professors);
  } catch (error) {
    console.error('Error listing AI professors:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get a specific professor
router.get('/:id', (req, res) => {
  try {
    const professor = professorService.getAIProfessor(req.params.id);
    res.json(professor);
  } catch (error) {
    console.error('Error getting AI professor:', error.message);
    res.status(404).json({ error: error.message });
  }
});

// Update a professor
router.patch('/:id', (req, res) => {
  try {
    const updatedProfessor = professorService.updateAIProfessor(req.params.id, req.body);
    res.json(updatedProfessor);
  } catch (error) {
    console.error('Error updating AI professor:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Ask a question to a professor
router.post('/:id/ask', async (req, res) => {
  try {
    const { studentId, question, context } = req.body;
    
    if (!studentId || !question) {
      return res.status(400).json({ error: 'studentId and question are required' });
    }
    
    const answer = await professorService.askProfessor(
      req.params.id,
      studentId,
      question,
      context
    );
    
    res.json({ answer });
  } catch (error) {
    console.error('Error asking AI professor:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get professor-student conversation history
router.get('/:id/history/:studentId', (req, res) => {
  try {
    const history = professorService.getProfessorStudentHistory(
      req.params.id,
      req.params.studentId
    );
    
    res.json(history);
  } catch (error) {
    console.error('Error getting conversation history:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Generate a lesson plan
router.post('/:id/lesson-plan', async (req, res) => {
  try {
    const { topic, duration } = req.body;
    
    if (!topic || !duration) {
      return res.status(400).json({ error: 'topic and duration are required' });
    }
    
    const lessonPlan = await professorService.generateLessonPlan(
      req.params.id,
      topic,
      duration
    );
    
    res.json(lessonPlan);
  } catch (error) {
    console.error('Error generating lesson plan:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Create a quiz
router.post('/:id/quiz', async (req, res) => {
  try {
    const { topic, questionCount, difficulty } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'topic is required' });
    }
    
    const quiz = await professorService.createQuiz(
      req.params.id,
      topic,
      questionCount || 5,
      difficulty || 'medium'
    );
    
    res.json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Generate a study guide
router.post('/:id/study-guide', async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'topic is required' });
    }
    
    const studyGuide = await professorService.generateStudyGuide(
      req.params.id,
      topic
    );
    
    res.json(studyGuide);
  } catch (error) {
    console.error('Error generating study guide:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Provide feedback on student work
router.post('/:id/feedback', async (req, res) => {
  try {
    const { studentWork, criteria } = req.body;
    
    if (!studentWork) {
      return res.status(400).json({ error: 'studentWork is required' });
    }
    
    const feedback = await professorService.provideStudentFeedback(
      req.params.id,
      studentWork,
      criteria
    );
    
    res.json(feedback);
  } catch (error) {
    console.error('Error providing student feedback:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;