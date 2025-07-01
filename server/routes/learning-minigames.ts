/**
 * Learning Mini-Games API Routes
 * 
 * Handles all endpoints related to interactive learning progress mini-games,
 * including game management, content management, and user progress tracking.
 */

import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { 
  insertLearningMiniGameSchema, 
  insertMiniGameContentSchema,
  insertUserMiniGameProgressSchema,
  insertUserMiniGameActivitySchema,
  miniGameTypes
} from '../../shared/learning-minigame-types';
import { z } from 'zod';

const router = Router();

/**
 * Get all mini-games
 * GET /api/learning-minigames
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const games = await (storage as any).getMiniGames();
    return res.json({ success: true, data: games });
  } catch (error) {
    console.error('Error fetching mini-games:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch mini-games' });
  }
});

/**
 * Get mini-game by ID
 * GET /api/learning-minigames/:id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    
    const game = await (storage as any).getMiniGame(id);
    if (!game) {
      return res.status(404).json({ success: false, error: 'Mini-game not found' });
    }
    
    return res.json({ success: true, data: game });
  } catch (error) {
    console.error('Error fetching mini-game:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch mini-game' });
  }
});

/**
 * Get mini-games by type
 * GET /api/learning-minigames/type/:type
 */
router.get('/type/:type', async (req: Request, res: Response) => {
  try {
    const gameType = req.params.type;
    const games = await (storage as any).getMiniGamesByType(gameType);
    return res.json({ success: true, data: games });
  } catch (error) {
    console.error('Error fetching mini-games by type:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch mini-games by type' });
  }
});

/**
 * Get mini-games by subject
 * GET /api/learning-minigames/subject/:subject
 */
router.get('/subject/:subject', async (req: Request, res: Response) => {
  try {
    const subject = req.params.subject;
    const games = await (storage as any).getMiniGamesBySubject(subject);
    return res.json({ success: true, data: games });
  } catch (error) {
    console.error('Error fetching mini-games by subject:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch mini-games by subject' });
  }
});

/**
 * Get mini-games by grade level
 * GET /api/learning-minigames/grade/:gradeLevel
 */
router.get('/grade/:gradeLevel', async (req: Request, res: Response) => {
  try {
    const gradeLevel = req.params.gradeLevel;
    const games = await (storage as any).getMiniGamesByGradeLevel(gradeLevel);
    return res.json({ success: true, data: games });
  } catch (error) {
    console.error('Error fetching mini-games by grade level:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch mini-games by grade level' });
  }
});

/**
 * Get mini-games by difficulty
 * GET /api/learning-minigames/difficulty/:difficulty
 */
router.get('/difficulty/:difficulty', async (req: Request, res: Response) => {
  try {
    const difficulty = parseInt(req.params.difficulty);
    if (isNaN(difficulty)) {
      return res.status(400).json({ success: false, error: 'Invalid difficulty format' });
    }
    
    const games = await (storage as any).getMiniGamesByDifficulty(difficulty);
    return res.json({ success: true, data: games });
  } catch (error) {
    console.error('Error fetching mini-games by difficulty:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch mini-games by difficulty' });
  }
});

/**
 * Create a new mini-game
 * POST /api/learning-minigames
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = insertLearningMiniGameSchema.parse(req.body);
    const newGame = await (storage as any).createMiniGame(validatedData);
    return res.status(201).json({ success: true, data: newGame });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Error creating mini-game:', error);
    return res.status(500).json({ success: false, error: 'Failed to create mini-game' });
  }
});

/**
 * Update a mini-game
 * PATCH /api/learning-minigames/:id
 */
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    
    // Partial validation of the request body
    const validatedData = insertLearningMiniGameSchema.partial().parse(req.body);
    
    const updatedGame = await (storage as any).updateMiniGame(id, validatedData);
    if (!updatedGame) {
      return res.status(404).json({ success: false, error: 'Mini-game not found' });
    }
    
    return res.json({ success: true, data: updatedGame });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Error updating mini-game:', error);
    return res.status(500).json({ success: false, error: 'Failed to update mini-game' });
  }
});

/**
 * Delete a mini-game
 * DELETE /api/learning-minigames/:id
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    
    const success = await (storage as any).deleteMiniGame(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Mini-game not found' });
    }
    
    return res.json({ success: true, message: 'Mini-game deleted successfully' });
  } catch (error) {
    console.error('Error deleting mini-game:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete mini-game' });
  }
});

// Game Content Routes

/**
 * Get all content for a mini-game
 * GET /api/learning-minigames/:gameId/contents
 */
router.get('/:gameId/contents', async (req: Request, res: Response) => {
  try {
    const gameId = parseInt(req.params.gameId);
    if (isNaN(gameId)) {
      return res.status(400).json({ success: false, error: 'Invalid game ID format' });
    }
    
    // Verify the game exists
    const game = await (storage as any).getMiniGame(gameId);
    if (!game) {
      return res.status(404).json({ success: false, error: 'Mini-game not found' });
    }
    
    const contents = await (storage as any).getMiniGameContents(gameId);
    return res.json({ success: true, data: contents });
  } catch (error) {
    console.error('Error fetching mini-game contents:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch mini-game contents' });
  }
});

/**
 * Get specific content for a mini-game
 * GET /api/learning-minigames/content/:id
 */
router.get('/content/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    
    const content = await (storage as any).getMiniGameContent(id);
    if (!content) {
      return res.status(404).json({ success: false, error: 'Mini-game content not found' });
    }
    
    return res.json({ success: true, data: content });
  } catch (error) {
    console.error('Error fetching mini-game content:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch mini-game content' });
  }
});

/**
 * Create new content for a mini-game
 * POST /api/learning-minigames/:gameId/contents
 */
router.post('/:gameId/contents', async (req: Request, res: Response) => {
  try {
    const gameId = parseInt(req.params.gameId);
    if (isNaN(gameId)) {
      return res.status(400).json({ success: false, error: 'Invalid game ID format' });
    }
    
    // Verify the game exists
    const game = await (storage as any).getMiniGame(gameId);
    if (!game) {
      return res.status(404).json({ success: false, error: 'Mini-game not found' });
    }
    
    const validatedData = insertMiniGameContentSchema.parse({
      ...req.body,
      gameId
    });
    
    const newContent = await (storage as any).createMiniGameContent(validatedData);
    return res.status(201).json({ success: true, data: newContent });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Error creating mini-game content:', error);
    return res.status(500).json({ success: false, error: 'Failed to create mini-game content' });
  }
});

/**
 * Update mini-game content
 * PATCH /api/learning-minigames/content/:id
 */
router.patch('/content/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    
    // Partial validation of the request body
    const validatedData = insertMiniGameContentSchema.partial().parse(req.body);
    
    const updatedContent = await (storage as any).updateMiniGameContent(id, validatedData);
    if (!updatedContent) {
      return res.status(404).json({ success: false, error: 'Mini-game content not found' });
    }
    
    return res.json({ success: true, data: updatedContent });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Error updating mini-game content:', error);
    return res.status(500).json({ success: false, error: 'Failed to update mini-game content' });
  }
});

/**
 * Delete mini-game content
 * DELETE /api/learning-minigames/content/:id
 */
router.delete('/content/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    
    const success = await (storage as any).deleteMiniGameContent(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Mini-game content not found' });
    }
    
    return res.json({ success: true, message: 'Mini-game content deleted successfully' });
  } catch (error) {
    console.error('Error deleting mini-game content:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete mini-game content' });
  }
});

// User Progress Routes

/**
 * Get user's progress for all mini-games
 * GET /api/learning-minigames/user/:userId/progress
 */
router.get('/user/:userId/progress', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID format' });
    }
    
    const progress = await (storage as any).getUserMiniGameProgress(userId);
    return res.json({ success: true, data: progress });
  } catch (error) {
    console.error('Error fetching user mini-game progress:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch user mini-game progress' });
  }
});

/**
 * Get user's progress for a specific mini-game
 * GET /api/learning-minigames/user/:userId/progress/:gameId
 */
router.get('/user/:userId/progress/:gameId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const gameId = parseInt(req.params.gameId);
    
    if (isNaN(userId) || isNaN(gameId)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    
    const progress = await (storage as any).getUserMiniGameProgressByGame(userId, gameId);
    if (!progress) {
      return res.status(404).json({ success: false, error: 'Progress not found' });
    }
    
    return res.json({ success: true, data: progress });
  } catch (error) {
    console.error('Error fetching user mini-game progress:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch user mini-game progress' });
  }
});

/**
 * Create or update user's progress for a mini-game
 * POST /api/learning-minigames/user/:userId/progress/:gameId
 */
router.post('/user/:userId/progress/:gameId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const gameId = parseInt(req.params.gameId);
    
    if (isNaN(userId) || isNaN(gameId)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    
    // Verify the game exists
    const game = await (storage as any).getMiniGame(gameId);
    if (!game) {
      return res.status(404).json({ success: false, error: 'Mini-game not found' });
    }
    
    // Check if we're completing the game
    if (req.body.completed === true) {
      const { score, timeSpent } = req.body;
      
      // Validate required fields for game completion
      if (typeof score !== 'number') {
        return res.status(400).json({ 
          success: false, 
          error: 'Score is required and must be a number when completing a game' 
        });
      }
      
      if (typeof timeSpent !== 'number') {
        return res.status(400).json({ 
          success: false, 
          error: 'Time spent is required and must be a number (in seconds) when completing a game' 
        });
      }
      
      const updatedProgress = await (storage as any).completeMiniGame(userId, gameId, score, timeSpent);
      
      // Award XP to the user based on the game's reward XP
      if (game.rewardXp) {
        try {
          await (storage as any).updateUserXp(userId, game.rewardXp);
        } catch (error) {
          console.error('Error updating user XP:', error);
          // Continue anyway - this is not a critical failure
        }
      }
      
      return res.json({ success: true, data: updatedProgress });
    } else {
      // For non-completion updates, use regular progress update
      const existingProgress = await (storage as any).getUserMiniGameProgressByGame(userId, gameId);
      
      if (existingProgress) {
        // Partial validation of the request body
        const validatedData = insertUserMiniGameProgressSchema.partial().parse({
          ...req.body,
          userId,
          gameId
        });
        
        const updatedProgress = await (storage as any).updateUserMiniGameProgress(existingProgress.id, validatedData);
        return res.json({ success: true, data: updatedProgress });
      } else {
        // Create new progress
        const validatedData = insertUserMiniGameProgressSchema.parse({
          ...req.body,
          userId,
          gameId,
          completed: false, // Force to false for new entries that aren't using completeMiniGame
          attempts: 1
        });
        
        const newProgress = await (storage as any).createUserMiniGameProgress(validatedData);
        return res.status(201).json({ success: true, data: newProgress });
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Error updating user mini-game progress:', error);
    return res.status(500).json({ success: false, error: 'Failed to update user mini-game progress' });
  }
});

/**
 * Record user activity for a mini-game
 * POST /api/learning-minigames/user/:userId/activity/:gameId
 */
router.post('/user/:userId/activity/:gameId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const gameId = parseInt(req.params.gameId);
    
    if (isNaN(userId) || isNaN(gameId)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    
    // Verify the game exists
    const game = await (storage as any).getMiniGame(gameId);
    if (!game) {
      return res.status(404).json({ success: false, error: 'Mini-game not found' });
    }
    
    const validatedData = insertUserMiniGameActivitySchema.parse({
      ...req.body,
      userId,
      gameId
    });
    
    const activity = await (storage as any).recordUserMiniGameActivity(validatedData);
    return res.status(201).json({ success: true, data: activity });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Error recording user mini-game activity:', error);
    return res.status(500).json({ success: false, error: 'Failed to record user mini-game activity' });
  }
});

/**
 * Get user activities for a mini-game
 * GET /api/learning-minigames/user/:userId/activity/:gameId
 */
router.get('/user/:userId/activity/:gameId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const gameId = parseInt(req.params.gameId);
    
    if (isNaN(userId) || isNaN(gameId)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    
    const activities = await (storage as any).getUserMiniGameActivities(userId, gameId);
    return res.json({ success: true, data: activities });
  } catch (error) {
    console.error('Error fetching user mini-game activities:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch user mini-game activities' });
  }
});

// Analytics and Stats Routes

/**
 * Get mini-game statistics for a user
 * GET /api/learning-minigames/user/:userId/stats
 */
router.get('/user/:userId/stats', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID format' });
    }
    
    const stats = await (storage as any).getMiniGameStats(userId);
    return res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching mini-game stats:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch mini-game stats' });
  }
});

/**
 * Get recommended mini-games for a user
 * GET /api/learning-minigames/user/:userId/recommendations
 */
router.get('/user/:userId/recommendations', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID format' });
    }
    
    const recommendations = await (storage as any).getMiniGameRecommendations(userId);
    return res.json({ success: true, data: recommendations });
  } catch (error) {
    console.error('Error fetching mini-game recommendations:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch mini-game recommendations' });
  }
});

/**
 * Get top performing mini-games
 * GET /api/learning-minigames/top-performing
 */
router.get('/top-performing', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    
    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({ success: false, error: 'Invalid limit parameter' });
    }
    
    const topGames = await (storage as any).getTopPerformingMiniGames(limit);
    return res.json({ success: true, data: topGames });
  } catch (error) {
    console.error('Error fetching top performing mini-games:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch top performing mini-games' });
  }
});

/**
 * Get all available mini-game types
 * GET /api/learning-minigames/types
 */
router.get('/types', async (_req: Request, res: Response) => {
  try {
    return res.json({ success: true, data: miniGameTypes });
  } catch (error) {
    console.error('Error fetching mini-game types:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch mini-game types' });
  }
});

export default router;