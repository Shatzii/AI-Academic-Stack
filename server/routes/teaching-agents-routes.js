/**
 * Teaching Agents API Routes
 * 
 * These routes expose the Teaching Agents functionality to the frontend,
 * allowing access to state-compliant educational AI agents across all subjects.
 */

import express from 'express';
import { getTeachingAgent, loadStateStandards } from '../../services/ai-teaching-agents.js';
const router = express.Router();

// Rate limiting for protection against abuse
import rateLimit from 'express-rate-limit';
const teachingAgentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: "Too many requests to teaching agent API, please try again later"
});

// Apply rate limiting to all teaching agent routes
router.use(teachingAgentLimiter);

/**
 * Get a list of available subject areas
 */
router.get('/api/teaching-agents/subjects', async (req, res) => {
  try {
    const subjects = [
      { id: 'math', name: 'Mathematics', 
        gradeLevels: ['k-2', '3-5', '6-8', '9-12'] },
      { id: 'science', name: 'Science',
        gradeLevels: ['k-2', '3-5', '6-8', '9-12'] },
      { id: 'english', name: 'English Language Arts',
        gradeLevels: ['k-2', '3-5', '6-8', '9-12'] },
      { id: 'social-studies', name: 'Social Studies',
        gradeLevels: ['k-2', '3-5', '6-8', '9-12'] },
      { id: 'art', name: 'Art',
        gradeLevels: ['k-5', '6-12'] },
      { id: 'music', name: 'Music',
        gradeLevels: ['k-5', '6-12'] },
      { id: 'physical-education', name: 'Physical Education',
        gradeLevels: ['k-5', '6-12'] },
      { id: 'computer-science', name: 'Computer Science',
        gradeLevels: ['k-5', '6-12'] },
      { id: 'world-languages', name: 'World Languages',
        gradeLevels: ['k-5', '6-12'] }
    ];
    
    res.json({ subjects });
  } catch (error) {
    console.error('Error fetching teaching agent subjects:', error);
    res.status(500).json({ error: 'Failed to retrieve teaching agent subjects' });
  }
});

/**
 * Get available neurotype accommodations
 */
router.get('/api/teaching-agents/neurotypes', async (req, res) => {
  try {
    const neurotypes = [
      { id: 'adhd', name: 'ADHD',
        description: 'Attention Deficit Hyperactivity Disorder' },
      { id: 'autism', name: 'Autism Spectrum',
        description: 'Autism Spectrum Disorder accommodations' },
      { id: 'dyslexia', name: 'Dyslexia',
        description: 'Dyslexia and reading difficulty accommodations' },
      { id: 'dyscalculia', name: 'Dyscalculia',
        description: 'Math learning disability accommodations' },
      { id: 'dysgraphia', name: 'Dysgraphia',
        description: 'Writing disability accommodations' },
      { id: 'executive-function', name: 'Executive Function',
        description: 'Executive functioning challenge accommodations' },
      { id: 'sensory', name: 'Sensory Processing',
        description: 'Sensory processing sensitivity accommodations' },
      { id: 'anxiety', name: 'Anxiety',
        description: 'Anxiety and emotional regulation accommodations' }
    ];
    
    res.json({ neurotypes });
  } catch (error) {
    console.error('Error fetching neurotype accommodations:', error);
    res.status(500).json({ error: 'Failed to retrieve neurotype accommodations' });
  }
});

/**
 * Get state standards for a specific state
 */
router.get('/api/teaching-agents/standards/:stateCode', async (req, res) => {
  try {
    const { stateCode } = req.params;
    
    if (!stateCode || stateCode.length !== 2) {
      return res.status(400).json({ 
        error: 'Invalid state code, must be a 2-letter code (e.g., CA, TX)' 
      });
    }
    
    const standards = await loadStateStandards(stateCode.toUpperCase());
    res.json({ standards });
  } catch (error) {
    console.error(`Error fetching standards for state ${req.params.stateCode}:`, error);
    res.status(500).json({ error: 'Failed to retrieve state educational standards' });
  }
});

/**
 * Generate a lesson plan from a teaching agent
 */
router.post('/api/teaching-agents/lesson-plan', async (req, res) => {
  try {
    const { subject, gradeLevel, stateCode, neurotype, topic, options } = req.body;
    
    if (!subject || !gradeLevel || !stateCode || !topic) {
      return res.status(400).json({ 
        error: 'Missing required fields: subject, gradeLevel, stateCode, and topic are required' 
      });
    }
    
    const agent = await getTeachingAgent({ subject, gradeLevel, stateCode, neurotype });
    const lessonPlan = await agent.generateLessonPlan(topic, options || {});
    
    res.json({ lessonPlan });
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    res.status(500).json({ error: 'Failed to generate lesson plan' });
  }
});

/**
 * Generate assessment questions from a teaching agent
 */
router.post('/api/teaching-agents/assessment', async (req, res) => {
  try {
    const { 
      subject, gradeLevel, stateCode, neurotype, 
      topic, count, difficulty 
    } = req.body;
    
    if (!subject || !gradeLevel || !stateCode || !topic) {
      return res.status(400).json({ 
        error: 'Missing required fields: subject, gradeLevel, stateCode, and topic are required' 
      });
    }
    
    const agent = await getTeachingAgent({ subject, gradeLevel, stateCode, neurotype });
    const assessment = await agent.generateAssessment(
      topic, 
      count || 5, 
      difficulty || 'medium'
    );
    
    res.json({ assessment });
  } catch (error) {
    console.error('Error generating assessment:', error);
    res.status(500).json({ error: 'Failed to generate assessment questions' });
  }
});

/**
 * Get feedback on student work
 */
router.post('/api/teaching-agents/feedback', async (req, res) => {
  try {
    const { 
      subject, gradeLevel, stateCode, neurotype,
      studentWork, assignmentContext 
    } = req.body;
    
    if (!subject || !gradeLevel || !stateCode || !studentWork || !assignmentContext) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }
    
    const agent = await getTeachingAgent({ subject, gradeLevel, stateCode, neurotype });
    const feedback = await agent.provideFeedback(studentWork, assignmentContext);
    
    res.json({ feedback });
  } catch (error) {
    console.error('Error providing feedback:', error);
    res.status(500).json({ error: 'Failed to generate feedback on student work' });
  }
});

/**
 * Generate a personalized learning path
 */
router.post('/api/teaching-agents/learning-path', async (req, res) => {
  try {
    const { 
      subject, gradeLevel, stateCode, neurotype,
      studentData 
    } = req.body;
    
    if (!subject || !gradeLevel || !stateCode || !studentData) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }
    
    const agent = await getTeachingAgent({ subject, gradeLevel, stateCode, neurotype });
    const learningPath = await agent.generateLearningPath(studentData);
    
    res.json({ learningPath });
  } catch (error) {
    console.error('Error generating learning path:', error);
    res.status(500).json({ error: 'Failed to generate personalized learning path' });
  }
});

export default router;