/**
 * Enhanced CMS Router
 * 
 * This file exports the combined CMS routers for the ShatziiOS platform.
 * Includes comprehensive APIs for managing all three school types:
 * - Neurodivergent Schools
 * - Law Schools
 * - Language Schools
 */

import { Router } from 'express';
import { storage } from '../storage';
import { createCmsRouter } from './cms-routes';

// Create a combined CMS router using our enhanced CMS router function
const router = Router();

// Create the CMS router with all custom routes
const cmsRouter = createCmsRouter(storage);

// Routes for accessing the three main schools (simplify paths by removing '/api/cms' prefix)
// Schools API
router.get('/schools', (req, res) => {
  try {
    // Filter by type if provided in query
    const type = req.query.type as string | undefined;
    
    // @ts-ignore - added by cms-storage
    storage.getSchools()
      .then(schools => {
        if (type) {
          schools = schools.filter(school => school.type === type);
        }
        res.json(schools);
      })
      .catch(err => {
        console.error('Error fetching schools:', err);
        res.status(500).json({ error: 'Failed to fetch schools' });
      });
  } catch (error) {
    console.error('Error in schools route:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get school by ID
router.get('/schools/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid school ID' });
    }
    
    // @ts-ignore - added by cms-storage
    storage.getSchoolById(id)
      .then(school => {
        if (!school) {
          return res.status(404).json({ error: 'School not found' });
        }
        res.json(school);
      })
      .catch(err => {
        console.error('Error fetching school:', err);
        res.status(500).json({ error: 'Failed to fetch school' });
      });
  } catch (error) {
    console.error('Error in school by ID route:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CMS API is running' });
});

export default router;