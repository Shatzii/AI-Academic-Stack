import { Router } from 'express';
import { storage } from '../storage';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createPathSchema = z.object({
  userId: z.string().uuid(),
  schoolId: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  subject: z.string(),
  grade: z.string(),
});

const updateProgressSchema = z.object({
  currentNode: z.string(),
  completedNodes: z.array(z.string()),
  timeSpent: z.number(),
  accuracy: z.number(),
  adaptationsUsed: z.array(z.string()),
});

// Get learning paths for a user
router.get('/user/:userId/school/:schoolId', async (req, res) => {
  try {
    const { userId, schoolId } = req.params;
    const paths = await storage.getLearningPathsForUser(userId, schoolId);
    res.json(paths);
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    res.status(500).json({ error: 'Failed to fetch learning paths' });
  }
});

// Get specific learning path
router.get('/:pathId', async (req, res) => {
  try {
    const { pathId } = req.params;
    const path = await storage.getLearningPath(pathId);
    
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    res.json(path);
  } catch (error) {
    console.error('Error fetching learning path:', error);
    res.status(500).json({ error: 'Failed to fetch learning path' });
  }
});

// Create a new learning path
router.post('/create', async (req, res) => {
  try {
    const validatedData = createPathSchema.parse(req.body);
    const path = await storage.createLearningPath(validatedData);
    res.status(201).json(path);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data', details: error.errors });
    }
    console.error('Error creating learning path:', error);
    res.status(500).json({ error: 'Failed to create learning path' });
  }
});

// Generate adaptive learning path
router.post('/generate-adaptive', async (req, res) => {
  try {
    const { userId, schoolId, subject, grade } = req.body;
    
    if (!userId || !schoolId || !subject || !grade) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const adaptivePath = await storage.generateAdaptivePath(userId, schoolId, subject, grade);
    res.json(adaptivePath);
  } catch (error) {
    console.error('Error generating adaptive path:', error);
    res.status(500).json({ error: 'Failed to generate adaptive learning path' });
  }
});

// Update learning path progress
router.put('/:pathId/progress', async (req, res) => {
  try {
    const { pathId } = req.params;
    const validatedData = updateProgressSchema.parse(req.body);
    
    const updatedPath = await storage.updateLearningPathProgress(pathId, validatedData);
    res.json(updatedPath);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid progress data', details: error.errors });
    }
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update learning path progress' });
  }
});

// Get path templates for a school and neurotype
router.get('/templates/:schoolId/:neurotype', async (req, res) => {
  try {
    const { schoolId, neurotype } = req.params;
    const templates = await storage.getPathTemplates(schoolId, neurotype);
    res.json(templates);
  } catch (error) {
    console.error('Error fetching path templates:', error);
    res.status(500).json({ error: 'Failed to fetch path templates' });
  }
});

// Record learning analytics
router.post('/analytics', async (req, res) => {
  try {
    const analyticsData = req.body;
    const result = await storage.recordLearningAnalytics(analyticsData);
    res.json(result);
  } catch (error) {
    console.error('Error recording analytics:', error);
    res.status(500).json({ error: 'Failed to record learning analytics' });
  }
});

export default router;