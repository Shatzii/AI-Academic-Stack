/**
 * Specialized Schools API Routes
 * 
 * This module provides API routes for specialized school types:
 * - Neurodivergent Schools
 * - Law Schools
 * - Language Schools
 */

import express from 'express';
import { z } from 'zod';
import { IStorage } from '../storage';

export function setupSpecializedSchoolsRoutes(router: express.Router, storage: IStorage) {
  // Schema definitions
  const neurodivergentSchoolSchema = z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    type: z.literal('neurodivergent'),
    gradeRange: z.string(),
    themeColor: z.string().optional(),
    logoUrl: z.string().optional(),
    active: z.boolean().optional().default(true),
    metadata: z.record(z.unknown()).optional(),
    specializations: z.array(z.string()),
    supportServices: z.array(z.string()),
    accommodations: z.array(z.string()),
    neurotypes: z.array(z.string()),
    learningStyles: z.array(z.string()),
    mascot: z.string().optional(),
    superheroTheme: z.object({
      primaryColor: z.string(),
      secondaryColor: z.string(),
      mascotName: z.string(),
      powers: z.array(z.string())
    }).optional()
  });

  const lawSchoolSchema = z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    type: z.literal('law'),
    gradeRange: z.string(),
    themeColor: z.string().optional(),
    logoUrl: z.string().optional(),
    active: z.boolean().optional().default(true),
    metadata: z.record(z.unknown()).optional(),
    barExamFocus: z.boolean(),
    specializations: z.array(z.string()),
    jurisdictions: z.array(z.string()),
    courses: z.array(z.string()),
    accreditation: z.string().optional()
  });

  const languageSchoolSchema = z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    type: z.literal('language'),
    gradeRange: z.string(),
    themeColor: z.string().optional(),
    logoUrl: z.string().optional(),
    active: z.boolean().optional().default(true),
    metadata: z.record(z.unknown()).optional(),
    languages: z.array(z.string()),
    methodologies: z.array(z.string()),
    proficiencyLevels: z.array(z.string()),
    culturalImmersion: z.boolean()
  });

  // Neurodivergent schools
  router.get('/schools/type/neurodivergent', async (req, res) => {
    try {
      // Assuming the Schools table has a type field to filter by
      const schools = await storage.getSchools();
      const neurodivergentSchools = schools.filter(school => school.type === 'neurodivergent');
      res.json(neurodivergentSchools);
    } catch (error) {
      console.error('Error fetching neurodivergent schools:', error);
      res.status(500).json({ error: 'Failed to fetch neurodivergent schools' });
    }
  });

  router.get('/neurodivergent-schools/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const school = await storage.getSchoolById(id);
      
      if (!school || school.type !== 'neurodivergent') {
        return res.status(404).json({ error: 'Neurodivergent school not found' });
      }
      
      res.json(school);
    } catch (error) {
      console.error('Error fetching neurodivergent school:', error);
      res.status(500).json({ error: 'Failed to fetch neurodivergent school' });
    }
  });

  router.post('/neurodivergent-schools', async (req, res) => {
    try {
      const data = neurodivergentSchoolSchema.parse(req.body);
      const school = await storage.createSchool(data);
      res.status(201).json(school);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating neurodivergent school:', error);
      res.status(500).json({ error: 'Failed to create neurodivergent school' });
    }
  });

  router.put('/neurodivergent-schools/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const school = await storage.getSchoolById(id);
      
      if (!school || school.type !== 'neurodivergent') {
        return res.status(404).json({ error: 'Neurodivergent school not found' });
      }
      
      const data = neurodivergentSchoolSchema.partial().parse(req.body);
      const updatedSchool = await storage.updateSchool(id, data);
      res.json(updatedSchool);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error updating neurodivergent school:', error);
      res.status(500).json({ error: 'Failed to update neurodivergent school' });
    }
  });

  // Law schools
  router.get('/schools/type/law', async (req, res) => {
    try {
      const schools = await storage.getSchools();
      const lawSchools = schools.filter(school => school.type === 'law');
      res.json(lawSchools);
    } catch (error) {
      console.error('Error fetching law schools:', error);
      res.status(500).json({ error: 'Failed to fetch law schools' });
    }
  });

  router.get('/law-schools/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const school = await storage.getSchoolById(id);
      
      if (!school || school.type !== 'law') {
        return res.status(404).json({ error: 'Law school not found' });
      }
      
      res.json(school);
    } catch (error) {
      console.error('Error fetching law school:', error);
      res.status(500).json({ error: 'Failed to fetch law school' });
    }
  });

  router.post('/law-schools', async (req, res) => {
    try {
      const data = lawSchoolSchema.parse(req.body);
      const school = await storage.createSchool(data);
      res.status(201).json(school);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating law school:', error);
      res.status(500).json({ error: 'Failed to create law school' });
    }
  });

  router.put('/law-schools/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const school = await storage.getSchoolById(id);
      
      if (!school || school.type !== 'law') {
        return res.status(404).json({ error: 'Law school not found' });
      }
      
      const data = lawSchoolSchema.partial().parse(req.body);
      const updatedSchool = await storage.updateSchool(id, data);
      res.json(updatedSchool);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error updating law school:', error);
      res.status(500).json({ error: 'Failed to update law school' });
    }
  });

  // Language schools
  router.get('/schools/type/language', async (req, res) => {
    try {
      const schools = await storage.getSchools();
      const languageSchools = schools.filter(school => school.type === 'language');
      res.json(languageSchools);
    } catch (error) {
      console.error('Error fetching language schools:', error);
      res.status(500).json({ error: 'Failed to fetch language schools' });
    }
  });

  router.get('/language-schools/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const school = await storage.getSchoolById(id);
      
      if (!school || school.type !== 'language') {
        return res.status(404).json({ error: 'Language school not found' });
      }
      
      res.json(school);
    } catch (error) {
      console.error('Error fetching language school:', error);
      res.status(500).json({ error: 'Failed to fetch language school' });
    }
  });

  router.post('/language-schools', async (req, res) => {
    try {
      const data = languageSchoolSchema.parse(req.body);
      const school = await storage.createSchool(data);
      res.status(201).json(school);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating language school:', error);
      res.status(500).json({ error: 'Failed to create language school' });
    }
  });

  router.put('/language-schools/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const school = await storage.getSchoolById(id);
      
      if (!school || school.type !== 'language') {
        return res.status(404).json({ error: 'Language school not found' });
      }
      
      const data = languageSchoolSchema.partial().parse(req.body);
      const updatedSchool = await storage.updateSchool(id, data);
      res.json(updatedSchool);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error updating language school:', error);
      res.status(500).json({ error: 'Failed to update language school' });
    }
  });

  // Vocabulary Lists (for Language School)
  const vocabularyListSchema = z.object({
    title: z.string(),
    description: z.string(),
    difficulty: z.string(),
    category: z.string(),
    moduleId: z.number().nullable().optional(),
    active: z.boolean().optional().default(true),
  });

  const vocabularyItemSchema = z.object({
    term: z.string(),
    definition: z.string(),
    exampleSentence: z.string(),
    listId: z.number(),
    pronunciation: z.string().nullable().optional(),
    partOfSpeech: z.string().nullable().optional(),
    audioUrl: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
    active: z.boolean().optional().default(true)
  });

  router.get('/vocabulary-lists', async (req, res) => {
    try {
      const { category, difficulty } = req.query;
      let lists = await storage.getVocabularyLists();
      
      if (category) {
        lists = lists.filter(list => list.category === category);
      }
      
      if (difficulty) {
        lists = lists.filter(list => list.difficulty === difficulty);
      }
      
      res.json(lists);
    } catch (error) {
      console.error('Error fetching vocabulary lists:', error);
      res.status(500).json({ error: 'Failed to fetch vocabulary lists' });
    }
  });

  router.get('/vocabulary-lists/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const list = await storage.getVocabularyList(id);
      
      if (!list) {
        return res.status(404).json({ error: 'Vocabulary list not found' });
      }
      
      // Also get the vocabulary items for this list
      const items = await storage.getVocabularyItems(id);
      
      // Return both the list and its items
      res.json({
        ...list,
        items
      });
    } catch (error) {
      console.error('Error fetching vocabulary list:', error);
      res.status(500).json({ error: 'Failed to fetch vocabulary list' });
    }
  });

  // Specialized endpoint to get vocabulary items by list ID
  router.get('/vocabulary-items/list/:listId', async (req, res) => {
    try {
      const listId = parseInt(req.params.listId);
      const items = await storage.getVocabularyItems(listId);
      
      res.json(items);
    } catch (error) {
      console.error('Error fetching vocabulary items:', error);
      res.status(500).json({ error: 'Failed to fetch vocabulary items' });
    }
  });

  // Get specific vocabulary item by ID
  router.get('/vocabulary-items/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getVocabularyItem(id);
      
      if (!item) {
        return res.status(404).json({ error: 'Vocabulary item not found' });
      }
      
      res.json(item);
    } catch (error) {
      console.error('Error fetching vocabulary item:', error);
      res.status(500).json({ error: 'Failed to fetch vocabulary item' });
    }
  });

  // Create a new vocabulary item
  router.post('/vocabulary-items', async (req, res) => {
    try {
      const data = vocabularyItemSchema.parse(req.body);
      const item = await storage.createVocabularyItem(data);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating vocabulary item:', error);
      res.status(500).json({ error: 'Failed to create vocabulary item' });
    }
  });

  router.post('/vocabulary-lists', async (req, res) => {
    try {
      const data = vocabularyListSchema.parse(req.body);
      const list = await storage.createVocabularyList(data);
      res.status(201).json(list);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating vocabulary list:', error);
      res.status(500).json({ error: 'Failed to create vocabulary list' });
    }
  });

  router.put('/vocabulary-lists/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const list = await storage.getVocabularyListById(id);
      
      if (!list) {
        return res.status(404).json({ error: 'Vocabulary list not found' });
      }
      
      const data = vocabularyListSchema.partial().parse(req.body);
      const updatedList = await storage.updateVocabularyList(id, data);
      res.json(updatedList);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error updating vocabulary list:', error);
      res.status(500).json({ error: 'Failed to update vocabulary list' });
    }
  });

  router.delete('/vocabulary-lists/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const list = await storage.getVocabularyListById(id);
      
      if (!list) {
        return res.status(404).json({ error: 'Vocabulary list not found' });
      }
      
      await storage.deleteVocabularyList(id);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting vocabulary list:', error);
      res.status(500).json({ error: 'Failed to delete vocabulary list' });
    }
  });

  return router;
}