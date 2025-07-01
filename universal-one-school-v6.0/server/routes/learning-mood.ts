/**
 * Learning Mood Tracker API Routes
 * 
 * Handles all endpoints related to the emoji-based mood tracking system
 * for monitoring student emotional states during learning.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  insertLearningMoodSchema,
  moodCategories
} from '../../shared/learning-mood-types';
import { storage } from '../storage';

const router = Router();

// Get all available mood categories with their emojis
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    res.json(moodCategories);
  } catch (error) {
    console.error('Error fetching mood categories:', error);
    res.status(500).json({ message: 'Failed to fetch mood categories' });
  }
});

// Get all learning moods (optionally filtered by student ID)
router.get('/', async (req: Request, res: Response) => {
  try {
    const studentId = req.query.studentId ? Number(req.query.studentId) : undefined;
    const moods = await (storage as any).getLearningMoods(studentId);
    res.json(moods);
  } catch (error) {
    console.error('Error fetching learning moods:', error);
    res.status(500).json({ message: 'Failed to fetch learning moods' });
  }
});

// Get moods by category
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const moods = await (storage as any).getLearningMoodsByCategory(category);
    res.json(moods);
  } catch (error) {
    console.error('Error fetching learning moods by category:', error);
    res.status(500).json({ message: 'Failed to fetch learning moods by category' });
  }
});

// Get moods by session ID
router.get('/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const sessionId = Number(req.params.sessionId);
    const moods = await (storage as any).getLearningMoodsBySession(sessionId);
    res.json(moods);
  } catch (error) {
    console.error('Error fetching learning moods by session:', error);
    res.status(500).json({ message: 'Failed to fetch learning moods by session' });
  }
});

// Get a specific mood by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const mood = await (storage as any).getLearningMood(id);
    
    if (!mood) {
      return res.status(404).json({ message: 'Learning mood not found' });
    }
    
    res.json(mood);
  } catch (error) {
    console.error('Error fetching learning mood:', error);
    res.status(500).json({ message: 'Failed to fetch learning mood' });
  }
});

// Create a new mood entry
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = insertLearningMoodSchema.parse(req.body);
    const mood = await (storage as any).createLearningMood(validatedData);
    res.status(201).json(mood);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid mood data', errors: error.errors });
    }
    console.error('Error creating learning mood:', error);
    res.status(500).json({ message: 'Failed to create learning mood' });
  }
});

// Delete a mood entry
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const success = await (storage as any).deleteLearningMood(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Learning mood not found' });
    }
    
    res.json({ message: 'Learning mood deleted successfully' });
  } catch (error) {
    console.error('Error deleting learning mood:', error);
    res.status(500).json({ message: 'Failed to delete learning mood' });
  }
});

// Get mood statistics for a student
router.get('/stats/:studentId', async (req: Request, res: Response) => {
  try {
    const studentId = Number(req.params.studentId);
    const stats = await (storage as any).getStudentMoodStats(studentId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching student mood stats:', error);
    res.status(500).json({ message: 'Failed to fetch student mood statistics' });
  }
});

// Get mood trends over time for a student
router.get('/trends/:studentId', async (req: Request, res: Response) => {
  try {
    const studentId = Number(req.params.studentId);
    const days = req.query.days ? Number(req.query.days) : 30; // Default to 30 days
    const trends = await (storage as any).getMoodTrendsOverTime(studentId, days);
    res.json(trends);
  } catch (error) {
    console.error('Error fetching mood trends:', error);
    res.status(500).json({ message: 'Failed to fetch mood trends' });
  }
});

// Get feedback and suggestions based on mood
router.get('/feedback/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const feedback = await (storage as any).generateMoodFeedback(category);
    res.json(feedback);
  } catch (error) {
    console.error('Error generating mood feedback:', error);
    res.status(500).json({ message: 'Failed to generate mood feedback' });
  }
});

// Get overall mood counts (for analytics)
router.get('/counts', async (_req: Request, res: Response) => {
  try {
    const counts = await (storage as any).getMoodCounts();
    res.json(counts);
  } catch (error) {
    console.error('Error fetching mood counts:', error);
    res.status(500).json({ message: 'Failed to fetch mood counts' });
  }
});

export default router;