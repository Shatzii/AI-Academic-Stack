/**
 * Test AI API Routes
 * 
 * This is a simplified version of the AI routes for testing
 */

import express from 'express';

const router = express.Router();

// Simple test route
router.get('/test', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'AI Integration Test API is working!',
    timestamp: new Date().toISOString()
  });
});

// Status check route
router.get('/status', (req, res) => {
  res.json({
    anthropic: {
      available: true,
      model: 'claude-3-7-sonnet-20250219'
    },
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

export default router;