import { Request, Response, Application } from 'express';
import { storage } from '../storage';
import { z } from 'zod';

// Schema for validating learning progress update requests
const updateProgressSchema = z.object({
  userId: z.number(),
  nodeId: z.string(),
  progress: z.number().min(0).max(100),
  isCompleted: z.boolean().optional(),
  isStarted: z.boolean().optional()
});

export function registerLearningProgressRoutes(app: Application) {
  // Get all learning progress for a user
  app.get('/api/learning-progress/:userId', async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const progressData = await storage.getUserLearningProgress(userId);
      return res.json(progressData);
    } catch (error) {
      console.error('Error fetching learning progress:', error);
      return res.status(500).json({ error: 'Failed to fetch learning progress' });
    }
  });

  // Get learning progress for a specific node
  app.get('/api/learning-progress/:userId/:nodeId', async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      const nodeId = req.params.nodeId;
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const progressData = await storage.getNodeLearningProgress(userId, nodeId);
      
      if (!progressData) {
        return res.status(404).json({ error: 'Progress not found' });
      }
      
      return res.json(progressData);
    } catch (error) {
      console.error('Error fetching node progress:', error);
      return res.status(500).json({ error: 'Failed to fetch node progress' });
    }
  });

  // Update progress for a learning node
  app.post('/api/learning-progress', async (req: Request, res: Response) => {
    try {
      const validationResult = updateProgressSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Invalid request data', 
          details: validationResult.error.format() 
        });
      }
      
      const { userId, nodeId, progress, isCompleted, isStarted } = validationResult.data;
      
      const updatedProgress = await storage.updateLearningProgress({
        userId,
        nodeId,
        progress,
        isCompleted,
        isStarted
      });
      
      return res.json(updatedProgress);
    } catch (error) {
      console.error('Error updating learning progress:', error);
      return res.status(500).json({ error: 'Failed to update learning progress' });
    }
  });

  // Mark a learning node as completed
  app.post('/api/learning-progress/complete', async (req: Request, res: Response) => {
    try {
      const { userId, nodeId } = req.body;
      
      if (!userId || !nodeId) {
        return res.status(400).json({ error: 'Missing required fields: userId and nodeId' });
      }
      
      const completedProgress = await storage.completeLearningNode(userId, nodeId);
      
      return res.json(completedProgress);
    } catch (error) {
      console.error('Error completing learning node:', error);
      return res.status(500).json({ error: 'Failed to complete learning node' });
    }
  });

  // Get learning path for a specific school type
  app.get('/api/learning-path/:schoolType', async (req: Request, res: Response) => {
    try {
      const { schoolType } = req.params;
      
      if (!['law', 'superhero', 'language'].includes(schoolType)) {
        return res.status(400).json({ error: 'Invalid school type' });
      }
      
      const pathData = await storage.getLearningPathBySchool(schoolType);
      
      return res.json(pathData);
    } catch (error) {
      console.error(`Error fetching ${req.params.schoolType} learning path:`, error);
      return res.status(500).json({ error: 'Failed to fetch learning path' });
    }
  });

  // Get personalized learning path for a user within a school
  app.get('/api/learning-path/:schoolType/:userId', async (req: Request, res: Response) => {
    try {
      const schoolType = req.params.schoolType;
      const userId = Number(req.params.userId);
      
      if (!['law', 'superhero', 'language'].includes(schoolType)) {
        return res.status(400).json({ error: 'Invalid school type' });
      }
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      // Get the learning path for this school
      const pathNodes = await storage.getLearningPathBySchool(schoolType);
      
      // Get the user's progress for all nodes
      const userProgress = await storage.getUserLearningProgress(userId);
      
      // Combine the data to create a personalized path
      const personalizedPath = pathNodes.map(node => {
        const progress = userProgress.find(p => p.nodeId === node.id);
        return {
          ...node,
          progress: progress?.progress || 0,
          completed: progress?.isCompleted || false,
          started: progress?.isStarted || false,
          completedAt: progress?.completedAt,
          isNew: !progress
        };
      });
      
      return res.json(personalizedPath);
    } catch (error) {
      console.error(`Error fetching personalized ${req.params.schoolType} learning path:`, error);
      return res.status(500).json({ error: 'Failed to fetch personalized learning path' });
    }
  });
}