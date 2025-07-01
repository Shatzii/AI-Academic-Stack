/**
 * Learning Profile Routes
 * 
 * This file contains all routes related to the Learning Profile Management System
 * for ShatziiOS neurodivergent education platform.
 */

import { Router } from 'express';
import learningProfileApiRoutes from '../api/learning-profile-routes';

export const router = Router();

// Import and use the API routes for learning profiles
router.use('/profiles', learningProfileApiRoutes);

// Legacy routes for backward compatibility
router.get('/legacy/user-profiles', async (req, res) => {
  // Redirect to the new API
  return res.redirect(307, '/api/learning/profiles');
});

export default router;