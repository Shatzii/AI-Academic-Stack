/**
 * Starworld 3D Curriculum API Routes
 * 
 * Routes for managing avatars, 3D worlds, motion coaching sessions, 
 * parental controls, and metrics for the neurodivergent superhero school.
 */

import express from 'express';
export const router = express.Router();

/**
 * Get all avatars for a user
 * 
 * GET /api/starworld/avatars/:userId
 */
router.get('/avatars/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Input validation
    if (!userId) {
      return res.status(400).json({ error: 'Missing required parameter: userId' });
    }
    
    // Get avatars from storage
    const storage = req.app.locals.storage;
    const avatars = await storage.getStarworldAvatars(Number(userId));
    
    res.json(avatars);
  } catch (error) {
    console.error('Error fetching avatars:', error);
    res.status(500).json({ error: 'Failed to fetch avatars' });
  }
});

/**
 * Get a specific avatar by ID
 * 
 * GET /api/starworld/avatars/avatar/:id
 */
router.get('/avatars/avatar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Input validation
    if (!id) {
      return res.status(400).json({ error: 'Missing required parameter: id' });
    }
    
    // Get avatar from storage
    const storage = req.app.locals.storage;
    const avatar = await storage.getStarworldAvatar(Number(id));
    
    if (!avatar) {
      return res.status(404).json({ error: 'Avatar not found' });
    }
    
    res.json(avatar);
  } catch (error) {
    console.error('Error fetching avatar:', error);
    res.status(500).json({ error: 'Failed to fetch avatar' });
  }
});

/**
 * Create a new avatar
 * 
 * POST /api/starworld/avatars
 * 
 * Body: {
 *   userId: number,
 *   name: string,
 *   skinTone: string,
 *   hairColor: string,
 *   eyeColor: string,
 *   superpower?: string,
 *   accessories?: any[],
 *   costume?: any,
 *   neurotypeStrengths?: string[],
 *   sharedPublic?: boolean
 * }
 */
router.post('/avatars', async (req, res) => {
  try {
    const { 
      userId, name, skinTone, hairColor, eyeColor, 
      superpower, accessories, costume, neurotypeStrengths, sharedPublic 
    } = req.body;
    
    // Input validation
    if (!userId || !name) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Create avatar in storage
    const storage = req.app.locals.storage;
    const newAvatar = await storage.createStarworldAvatar({
      userId: Number(userId),
      name,
      skinTone: skinTone || '#fcd5b5',
      hairColor: hairColor || '#000000',
      eyeColor: eyeColor || '#0000FF',
      superpower,
      accessories: accessories || [],
      costume: costume || {},
      neurotypeStrengths: neurotypeStrengths || [],
      sharedPublic: sharedPublic || false
    });
    
    res.status(201).json(newAvatar);
  } catch (error) {
    console.error('Error creating avatar:', error);
    res.status(500).json({ error: 'Failed to create avatar' });
  }
});

/**
 * Update an existing avatar
 * 
 * PATCH /api/starworld/avatars/:id
 */
router.patch('/avatars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Input validation
    if (!id) {
      return res.status(400).json({ error: 'Missing required parameter: id' });
    }
    
    // Update avatar in storage
    const storage = req.app.locals.storage;
    const updatedAvatar = await storage.updateStarworldAvatar(Number(id), updateData);
    
    if (!updatedAvatar) {
      return res.status(404).json({ error: 'Avatar not found' });
    }
    
    res.json(updatedAvatar);
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({ error: 'Failed to update avatar' });
  }
});

/**
 * Delete an avatar
 * 
 * DELETE /api/starworld/avatars/:id
 */
router.delete('/avatars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Input validation
    if (!id) {
      return res.status(400).json({ error: 'Missing required parameter: id' });
    }
    
    // Delete avatar from storage
    const storage = req.app.locals.storage;
    const success = await storage.deleteStarworldAvatar(Number(id));
    
    if (!success) {
      return res.status(404).json({ error: 'Avatar not found' });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting avatar:', error);
    res.status(500).json({ error: 'Failed to delete avatar' });
  }
});

/**
 * Get all 3D worlds for a user
 * 
 * GET /api/starworld/worlds/:userId
 */
router.get('/worlds/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Input validation
    if (!userId) {
      return res.status(400).json({ error: 'Missing required parameter: userId' });
    }
    
    // Get worlds from storage
    const storage = req.app.locals.storage;
    const worlds = await storage.getStarworldWorlds(Number(userId));
    
    res.json(worlds);
  } catch (error) {
    console.error('Error fetching worlds:', error);
    res.status(500).json({ error: 'Failed to fetch worlds' });
  }
});

/**
 * Get a specific 3D world by ID
 * 
 * GET /api/starworld/worlds/world/:id
 */
router.get('/worlds/world/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Input validation
    if (!id) {
      return res.status(400).json({ error: 'Missing required parameter: id' });
    }
    
    // Get world from storage
    const storage = req.app.locals.storage;
    const world = await storage.getStarworldWorld(Number(id));
    
    if (!world) {
      return res.status(404).json({ error: 'World not found' });
    }
    
    res.json(world);
  } catch (error) {
    console.error('Error fetching world:', error);
    res.status(500).json({ error: 'Failed to fetch world' });
  }
});

/**
 * Create a new 3D world
 * 
 * POST /api/starworld/worlds
 */
router.post('/worlds', async (req, res) => {
  try {
    const { 
      userId, name, description, environment, objects, terrain,
      lighting, weather, interactiveElements, educationalContent,
      parentalRating, contentRestrictions, sharedPublic
    } = req.body;
    
    // Input validation
    if (!userId || !name) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Create world in storage
    const storage = req.app.locals.storage;
    const newWorld = await storage.createStarworldWorld({
      userId: Number(userId),
      name,
      description,
      environment: environment || 'classroom',
      objects: objects || [],
      terrain: terrain || {},
      lighting: lighting || {},
      weather: weather || 'sunny',
      interactiveElements: interactiveElements || [],
      educationalContent: educationalContent || [],
      parentalRating: parentalRating || 'everyone',
      contentRestrictions: contentRestrictions || [],
      sharedPublic: sharedPublic || false
    });
    
    res.status(201).json(newWorld);
  } catch (error) {
    console.error('Error creating world:', error);
    res.status(500).json({ error: 'Failed to create world' });
  }
});

/**
 * Update an existing 3D world
 * 
 * PATCH /api/starworld/worlds/:id
 */
router.patch('/worlds/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Input validation
    if (!id) {
      return res.status(400).json({ error: 'Missing required parameter: id' });
    }
    
    // Update world in storage
    const storage = req.app.locals.storage;
    const updatedWorld = await storage.updateStarworldWorld(Number(id), updateData);
    
    if (!updatedWorld) {
      return res.status(404).json({ error: 'World not found' });
    }
    
    res.json(updatedWorld);
  } catch (error) {
    console.error('Error updating world:', error);
    res.status(500).json({ error: 'Failed to update world' });
  }
});

/**
 * Record a motion tracking session
 * 
 * POST /api/starworld/motion-sessions
 */
router.post('/motion-sessions', async (req, res) => {
  try {
    const { 
      userId, qualityLevel, activityType, duration,
      performanceData, keypoints, avatarId, worldId
    } = req.body;
    
    // Input validation
    if (!userId) {
      return res.status(400).json({ error: 'Missing required parameter: userId' });
    }
    
    // Create session in storage
    const storage = req.app.locals.storage;
    const newSession = await storage.createStarworldMotionSession({
      userId: Number(userId),
      qualityLevel: qualityLevel || 'medium',
      activityType: activityType || 'general',
      duration: duration || 0,
      performanceData: performanceData || {},
      keypoints: keypoints || [],
      avatarId: avatarId ? Number(avatarId) : undefined,
      worldId: worldId ? Number(worldId) : undefined
    });
    
    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error recording motion session:', error);
    res.status(500).json({ error: 'Failed to record motion session' });
  }
});

/**
 * Get motion sessions for a user
 * 
 * GET /api/starworld/motion-sessions/:userId
 */
router.get('/motion-sessions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Input validation
    if (!userId) {
      return res.status(400).json({ error: 'Missing required parameter: userId' });
    }
    
    // Get sessions from storage
    const storage = req.app.locals.storage;
    const sessions = await storage.getStarworldMotionSessions(Number(userId));
    
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching motion sessions:', error);
    res.status(500).json({ error: 'Failed to fetch motion sessions' });
  }
});

/**
 * Get parental controls for a child
 * 
 * GET /api/starworld/parental-controls/:parentId/:childId
 */
router.get('/parental-controls/:parentId/:childId', async (req, res) => {
  try {
    const { parentId, childId } = req.params;
    
    // Input validation
    if (!parentId || !childId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Get controls from storage
    const storage = req.app.locals.storage;
    const controls = await storage.getStarworldParentalControls(
      Number(parentId),
      Number(childId)
    );
    
    res.json(controls);
  } catch (error) {
    console.error('Error fetching parental controls:', error);
    res.status(500).json({ error: 'Failed to fetch parental controls' });
  }
});

/**
 * Save parental controls
 * 
 * POST /api/starworld/parental-controls
 */
router.post('/parental-controls', async (req, res) => {
  try {
    const { 
      parentId, childId, contentRating, timeLimit, restrictedFeatures,
      restrictedTimes, requireApproval, approvalCategories,
      notifyOnLogin, notifyOnCreation
    } = req.body;
    
    // Input validation
    if (!parentId || !childId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Create controls in storage
    const storage = req.app.locals.storage;
    const newControls = await storage.createStarworldParentalControls({
      parentId: Number(parentId),
      childId: Number(childId),
      contentRating: contentRating || 'everyone',
      timeLimit,
      restrictedFeatures: restrictedFeatures || [],
      restrictedTimes: restrictedTimes || [],
      requireApproval: requireApproval || false,
      approvalCategories: approvalCategories || [],
      notifyOnLogin: notifyOnLogin || false,
      notifyOnCreation: notifyOnCreation || false
    });
    
    res.status(201).json(newControls);
  } catch (error) {
    console.error('Error saving parental controls:', error);
    res.status(500).json({ error: 'Failed to save parental controls' });
  }
});

/**
 * Update parental controls
 * 
 * PATCH /api/starworld/parental-controls/:id
 */
router.patch('/parental-controls/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Input validation
    if (!id) {
      return res.status(400).json({ error: 'Missing required parameter: id' });
    }
    
    // Update controls in storage
    const storage = req.app.locals.storage;
    const updatedControls = await storage.updateStarworldParentalControls(
      Number(id),
      updateData
    );
    
    if (!updatedControls) {
      return res.status(404).json({ error: 'Parental controls not found' });
    }
    
    res.json(updatedControls);
  } catch (error) {
    console.error('Error updating parental controls:', error);
    res.status(500).json({ error: 'Failed to update parental controls' });
  }
});

/**
 * Record usage metrics
 * 
 * POST /api/starworld/metrics
 */
router.post('/metrics', async (req, res) => {
  try {
    const { 
      userId, sessionId, metricType, metricData,
      avatarId, worldId, duration, interactionCount
    } = req.body;
    
    // Input validation
    if (!userId || !sessionId || !metricType || !metricData) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Record metrics in storage
    const storage = req.app.locals.storage;
    const metrics = await storage.createStarworldMetrics({
      userId: Number(userId),
      sessionId,
      metricType,
      metricData,
      avatarId: avatarId ? Number(avatarId) : undefined,
      worldId: worldId ? Number(worldId) : undefined,
      duration,
      interactionCount
    });
    
    res.status(201).json(metrics);
  } catch (error) {
    console.error('Error recording metrics:', error);
    res.status(500).json({ error: 'Failed to record metrics' });
  }
});

/**
 * Get metrics for a user
 * 
 * GET /api/starworld/metrics/:userId
 */
router.get('/metrics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Input validation
    if (!userId) {
      return res.status(400).json({ error: 'Missing required parameter: userId' });
    }
    
    // Get metrics from storage
    const storage = req.app.locals.storage;
    const metrics = await storage.getStarworldMetrics(Number(userId));
    
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

