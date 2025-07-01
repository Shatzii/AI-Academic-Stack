/**
 * Curriculum API Routes
 * 
 * This module provides API routes for curriculum management:
 * - Curriculum Modules
 * - Learning Missions
 */

import express from 'express';
import { z } from 'zod';
import { IStorage } from '../storage';

export function setupCurriculumRoutes(router: express.Router, storage: IStorage) {
  // Schema definitions
  const curriculumModuleSchema = z.object({
    title: z.string(),
    description: z.string(),
    schoolId: z.number(),
    schoolType: z.string(),
    gradeLevel: z.string(),
    subject: z.string(),
    learningObjectives: z.array(z.string()),
    content: z.string(),
    activities: z.array(z.any()).optional().default([]),
    assessments: z.array(z.any()).optional().default([]),
    resources: z.array(z.any()).optional().default([]),
    active: z.boolean().optional().default(true),
    order: z.number().optional().default(0),
    metadata: z.record(z.unknown()).optional()
  });

  const learningMissionSchema = z.object({
    title: z.string(),
    description: z.string(),
    moduleId: z.number(),
    schoolType: z.string(),
    difficulty: z.string(),
    rewardPoints: z.number(),
    timeLimit: z.number(),
    instructions: z.string(),
    objectives: z.array(z.string()),
    steps: z.array(z.any()).optional().default([]),
    active: z.boolean().optional().default(true),
    metadata: z.record(z.unknown()).optional()
  });

  // Curriculum Modules
  router.get('/curriculum-modules', async (req, res) => {
    try {
      const { schoolId, schoolType, gradeLevel } = req.query;
      let modules = await storage.getCurriculumModules();

      if (schoolId) {
        const id = parseInt(schoolId as string);
        modules = modules.filter(module => module.schoolId === id);
      }
      
      if (schoolType) {
        modules = modules.filter(module => module.schoolType === schoolType);
      }
      
      if (gradeLevel) {
        modules = modules.filter(module => module.gradeLevel === gradeLevel);
      }
      
      res.json(modules);
    } catch (error) {
      console.error('Error fetching curriculum modules:', error);
      res.status(500).json({ error: 'Failed to fetch curriculum modules' });
    }
  });

  router.get('/curriculum-modules/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const module = await storage.getCurriculumModuleById(id);
      
      if (!module) {
        return res.status(404).json({ error: 'Curriculum module not found' });
      }
      
      res.json(module);
    } catch (error) {
      console.error('Error fetching curriculum module:', error);
      res.status(500).json({ error: 'Failed to fetch curriculum module' });
    }
  });

  router.post('/curriculum-modules', async (req, res) => {
    try {
      const data = curriculumModuleSchema.parse(req.body);
      const module = await storage.createCurriculumModule(data);
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating curriculum module:', error);
      res.status(500).json({ error: 'Failed to create curriculum module' });
    }
  });

  router.put('/curriculum-modules/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const module = await storage.getCurriculumModuleById(id);
      
      if (!module) {
        return res.status(404).json({ error: 'Curriculum module not found' });
      }
      
      const data = curriculumModuleSchema.partial().parse(req.body);
      const updatedModule = await storage.updateCurriculumModule(id, data);
      res.json(updatedModule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error updating curriculum module:', error);
      res.status(500).json({ error: 'Failed to update curriculum module' });
    }
  });

  router.delete('/curriculum-modules/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const module = await storage.getCurriculumModuleById(id);
      
      if (!module) {
        return res.status(404).json({ error: 'Curriculum module not found' });
      }
      
      await storage.deleteCurriculumModule(id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting curriculum module:', error);
      res.status(500).json({ error: 'Failed to delete curriculum module' });
    }
  });

  // Learning Missions
  router.get('/learning-missions', async (req, res) => {
    try {
      const { moduleId, schoolType } = req.query;
      let missions = await storage.getLearningMissions();

      if (moduleId) {
        const id = parseInt(moduleId as string);
        missions = missions.filter(mission => mission.moduleId === id);
      }
      
      if (schoolType) {
        missions = missions.filter(mission => mission.schoolType === schoolType);
      }
      
      res.json(missions);
    } catch (error) {
      console.error('Error fetching learning missions:', error);
      res.status(500).json({ error: 'Failed to fetch learning missions' });
    }
  });

  router.get('/learning-missions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const mission = await storage.getLearningMissionById(id);
      
      if (!mission) {
        return res.status(404).json({ error: 'Learning mission not found' });
      }
      
      res.json(mission);
    } catch (error) {
      console.error('Error fetching learning mission:', error);
      res.status(500).json({ error: 'Failed to fetch learning mission' });
    }
  });

  router.post('/learning-missions', async (req, res) => {
    try {
      const data = learningMissionSchema.parse(req.body);
      const mission = await storage.createLearningMission(data);
      res.status(201).json(mission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating learning mission:', error);
      res.status(500).json({ error: 'Failed to create learning mission' });
    }
  });

  router.put('/learning-missions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const mission = await storage.getLearningMissionById(id);
      
      if (!mission) {
        return res.status(404).json({ error: 'Learning mission not found' });
      }
      
      const data = learningMissionSchema.partial().parse(req.body);
      const updatedMission = await storage.updateLearningMission(id, data);
      res.json(updatedMission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error updating learning mission:', error);
      res.status(500).json({ error: 'Failed to update learning mission' });
    }
  });

  router.delete('/learning-missions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const mission = await storage.getLearningMissionById(id);
      
      if (!mission) {
        return res.status(404).json({ error: 'Learning mission not found' });
      }
      
      await storage.deleteLearningMission(id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting learning mission:', error);
      res.status(500).json({ error: 'Failed to delete learning mission' });
    }
  });

  return router;
}