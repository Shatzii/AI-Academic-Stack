/**
 * Soundtrack Generator Routes
 * 
 * API endpoints for generating personalized learning soundtracks based on
 * student profiles and learning activities.
 */

import { Router } from 'express';
import generateSoundtrack from '../services/soundtrack-service.js';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generate a personalized soundtrack based on learning activity
 * POST /api/soundtracks/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { studentProfile, learningActivity, duration } = req.body;
    
    if (!learningActivity) {
      return res.status(400).json({ 
        error: 'Missing required field: learningActivity' 
      });
    }
    
    // Generate soundtrack using our service
    const soundtrack = await generateSoundtrack(
      studentProfile,
      learningActivity,
      duration || 25,
      anthropic
    );
    
    return res.json({ 
      success: true, 
      data: soundtrack 
    });
  } catch (error) {
    console.error('Error generating soundtrack:', error);
    return res.status(500).json({ 
      error: 'Failed to generate soundtrack',
      details: error.message
    });
  }
});

/**
 * Generate a mood-based soundtrack
 * POST /api/soundtracks/mood
 */
router.post('/mood', async (req, res) => {
  try {
    const { studentProfile, mood, learningGoal } = req.body;
    
    if (!mood || !learningGoal) {
      return res.status(400).json({ 
        error: 'Missing required fields: mood and learningGoal' 
      });
    }
    
    // Generate soundtrack based on mood
    const soundtrack = await generateSoundtrack(
      studentProfile,
      `${learningGoal} while feeling ${mood}`,
      30, // Default duration for mood-based soundtracks
      anthropic,
      { 
        isMoodBased: true,
        mood: mood 
      }
    );
    
    return res.json({ 
      success: true, 
      data: soundtrack 
    });
  } catch (error) {
    console.error('Error generating mood-based soundtrack:', error);
    return res.status(500).json({ 
      error: 'Failed to generate mood-based soundtrack',
      details: error.message
    });
  }
});

/**
 * Generate a study session soundtrack
 * POST /api/soundtracks/session
 */
router.post('/session', async (req, res) => {
  try {
    const { studentProfile, sessionLength, activities } = req.body;
    
    if (!activities || !activities.length) {
      return res.status(400).json({ 
        error: 'Missing required field: activities' 
      });
    }
    
    // Combine activities into a single session description
    const sessionDescription = `Study session with activities: ${activities.join(', ')}`;
    
    // Generate soundtrack for the study session
    const soundtrack = await generateSoundtrack(
      studentProfile,
      sessionDescription,
      sessionLength || 60,
      anthropic,
      { 
        isStudySession: true,
        activities: activities 
      }
    );
    
    return res.json({ 
      success: true, 
      data: soundtrack 
    });
  } catch (error) {
    console.error('Error generating study session soundtrack:', error);
    return res.status(500).json({ 
      error: 'Failed to generate study session soundtrack',
      details: error.message
    });
  }
});

/**
 * Get all saved soundtracks for a student
 * GET /api/soundtracks
 */
router.get('/', async (req, res) => {
  try {
    // In a real implementation, we would fetch soundtracks from the database
    // For now, we'll return a sample soundtrack for testing
    return res.json({
      success: true,
      data: [{
        id: 'sample-soundtrack-1',
        name: 'Focus for Math Study',
        type: 'focus',
        activity: 'solving algebra problems',
        neurotype: 'adhd',
        duration: 25,
        segments: [
          {
            type: 'focus',
            elements: ['white noise', 'low frequency beats', 'gentle pulses'],
            duration: 15,
            description: 'Steady focus sounds to enhance concentration during problem-solving'
          },
          {
            type: 'break',
            elements: ['nature sounds', 'birds', 'light wind'],
            duration: 5,
            description: 'Brief relaxation interlude to prevent mental fatigue'
          },
          {
            type: 'energize',
            elements: ['upbeat rhythms', 'motivational pace'],
            duration: 5,
            description: 'Energizing sounds to maintain momentum in final stretch'
          }
        ],
        description: 'Optimized for ADHD focus needs during mathematical problem-solving',
        createdAt: new Date().toISOString(),
        specialConsiderations: 'Includes rhythmic patterns to aid working memory and reduce distraction sensitivity'
      }]
    });
  } catch (error) {
    console.error('Error fetching soundtracks:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch soundtracks',
      details: error.message
    });
  }
});

export default router;