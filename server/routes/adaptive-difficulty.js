/**
 * Adaptive Difficulty API Routes
 * 
 * These routes provide the API interface for the adaptive difficulty system,
 * allowing users to adjust content difficulty and manage difficulty profiles.
 */

const express = require('express');
const router = express.Router();
const adaptiveDifficultyService = require('../../services/adaptive-difficulty-service');

// Get difficulty levels (constants)
router.get('/levels', (req, res) => {
  res.json(adaptiveDifficultyService.DIFFICULTY_LEVELS);
});

// Get default parameters (constants)
router.get('/parameters', (req, res) => {
  res.json(adaptiveDifficultyService.DEFAULT_PARAMETERS);
});

// Create a new difficulty profile
router.post('/profiles', async (req, res) => {
  try {
    const { userId, initialSettings } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const profile = adaptiveDifficultyService.createDifficultyProfile(userId, initialSettings || {});
    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating difficulty profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a user's difficulty profile
router.get('/profiles/:userId', (req, res) => {
  try {
    const profile = adaptiveDifficultyService.getDifficultyProfile(req.params.userId);
    res.json(profile);
  } catch (error) {
    console.error('Error getting difficulty profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a user's difficulty profile
router.patch('/profiles/:userId', (req, res) => {
  try {
    const updatedProfile = adaptiveDifficultyService.updateDifficultyProfile(
      req.params.userId,
      req.body
    );
    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating difficulty profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get effective difficulty for a subject
router.get('/profiles/:userId/subjects/:subject', (req, res) => {
  try {
    const difficulty = adaptiveDifficultyService.getEffectiveDifficulty(
      req.params.userId,
      req.params.subject
    );
    res.json({ difficulty });
  } catch (error) {
    console.error('Error getting effective difficulty:', error);
    res.status(500).json({ error: error.message });
  }
});

// Set difficulty for a specific subject
router.put('/profiles/:userId/subjects/:subject', (req, res) => {
  try {
    const { difficultyLevel } = req.body;
    
    if (difficultyLevel === undefined) {
      return res.status(400).json({ error: 'difficultyLevel is required' });
    }
    
    // Get current difficulty for recording the change
    const oldDifficulty = adaptiveDifficultyService.getEffectiveDifficulty(
      req.params.userId,
      req.params.subject
    );
    
    // Update subject difficulty
    const updatedProfile = adaptiveDifficultyService.setSubjectDifficulty(
      req.params.userId,
      req.params.subject,
      difficultyLevel
    );
    
    // Record the change
    if (oldDifficulty !== difficultyLevel) {
      adaptiveDifficultyService.recordDifficultyChange(
        req.params.userId,
        req.params.subject,
        oldDifficulty,
        difficultyLevel,
        req.body.reason || 'manual'
      );
    }
    
    res.json(updatedProfile);
  } catch (error) {
    console.error('Error setting subject difficulty:', error);
    res.status(500).json({ error: error.message });
  }
});

// Adapt content to a specific difficulty level
router.post('/adapt', async (req, res) => {
  try {
    const { content, targetDifficulty, parameters } = req.body;
    
    if (!content || targetDifficulty === undefined) {
      return res.status(400).json({ error: 'content and targetDifficulty are required' });
    }
    
    const adaptedContent = await adaptiveDifficultyService.adaptContent(
      content,
      targetDifficulty,
      parameters
    );
    
    res.json({ original: content, adapted: adaptedContent });
  } catch (error) {
    console.error('Error adapting content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate practice questions
router.post('/questions', async (req, res) => {
  try {
    const { topic, difficultyLevel, count } = req.body;
    
    if (!topic || difficultyLevel === undefined) {
      return res.status(400).json({ error: 'topic and difficultyLevel are required' });
    }
    
    const questions = await adaptiveDifficultyService.generatePracticeQuestions(
      topic,
      difficultyLevel,
      count || 5
    );
    
    res.json({ questions });
  } catch (error) {
    console.error('Error generating practice questions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get difficulty recommendation based on performance
router.post('/recommend', (req, res) => {
  try {
    const { performanceData } = req.body;
    
    if (!performanceData) {
      return res.status(400).json({ error: 'performanceData is required' });
    }
    
    const recommendedLevel = adaptiveDifficultyService.recommendDifficultyLevel(performanceData);
    
    res.json({ recommendedLevel });
  } catch (error) {
    console.error('Error recommending difficulty level:', error);
    res.status(500).json({ error: error.message });
  }
});

// Auto-adjust difficulty based on performance
router.post('/auto-adjust', (req, res) => {
  try {
    const { userId, subject, performanceData } = req.body;
    
    if (!userId || !subject || !performanceData) {
      return res.status(400).json({ 
        error: 'userId, subject, and performanceData are required'
      });
    }
    
    // Get current difficulty for recording the change
    const oldDifficulty = adaptiveDifficultyService.getEffectiveDifficulty(userId, subject);
    
    // Auto-adjust difficulty
    const updatedProfile = adaptiveDifficultyService.autoAdjustDifficulty(
      userId,
      subject,
      performanceData
    );
    
    // Get new difficulty
    const newDifficulty = adaptiveDifficultyService.getEffectiveDifficulty(userId, subject);
    
    // Record the change if difficulty was updated
    if (oldDifficulty !== newDifficulty) {
      adaptiveDifficultyService.recordDifficultyChange(
        userId,
        subject,
        oldDifficulty,
        newDifficulty,
        'auto'
      );
    }
    
    res.json({
      profile: updatedProfile,
      oldDifficulty,
      newDifficulty,
      changed: oldDifficulty !== newDifficulty
    });
  } catch (error) {
    console.error('Error auto-adjusting difficulty:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get difficulty history for a user
router.get('/history/:userId', (req, res) => {
  try {
    const { subject } = req.query;
    
    const history = adaptiveDifficultyService.getDifficultyHistory(
      req.params.userId,
      subject || null
    );
    
    res.json({ history });
  } catch (error) {
    console.error('Error getting difficulty history:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;