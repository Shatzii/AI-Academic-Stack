/**
 * CMS API Routes
 * 
 * This file contains all the routes for the content management system API
 */

import { Router } from 'express';
import { z } from 'zod';
import { IStorage } from '../storage';
import { ICMSStorage } from '../storage/cms-interface';
import { 
  insertSchoolSchema,
  insertNeurodivergentSchoolSchema,
  insertLawSchoolSchema,
  insertLanguageSchoolSchema,
  insertPageSchema,
  insertAiTeacherSchema,
  insertResourceSchema
} from '../../shared/cms-schema';

/**
 * Create the CMS router with all routes for managing content
 */
export function createCmsRouter(storage: IStorage) {
  const router = Router();

  //================================================
  // Schools API
  //================================================
  
  // Get all schools
  router.get('/api/cms/schools', async (req, res) => {
    try {
      // Filter by type if provided in query
      const type = req.query.type as string | undefined;
      
      let schools;
      if (type) {
        // @ts-ignore - added by cms-storage
        schools = await storage.getSchoolsByType(type);
      } else {
        // @ts-ignore - added by cms-storage
        schools = await storage.getSchools();
      }
      
      res.json(schools);
    } catch (error) {
      console.error('Error fetching schools:', error);
      res.status(500).json({ error: 'Failed to fetch schools' });
    }
  });
  
  // Get school by ID
  router.get('/api/cms/schools/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid school ID' });
      }
      
      // @ts-ignore - added by cms-storage
      const school = await storage.getSchoolById(id);
      
      if (!school) {
        return res.status(404).json({ error: 'School not found' });
      }
      
      res.json(school);
    } catch (error) {
      console.error('Error fetching school:', error);
      res.status(500).json({ error: 'Failed to fetch school' });
    }
  });
  
  // Get school by slug
  router.get('/api/cms/schools/slug/:slug', async (req, res) => {
    try {
      const slug = req.params.slug;
      
      // @ts-ignore - added by cms-storage
      const school = await storage.getSchoolBySlug(slug);
      
      if (!school) {
        return res.status(404).json({ error: 'School not found' });
      }
      
      res.json(school);
    } catch (error) {
      console.error('Error fetching school by slug:', error);
      res.status(500).json({ error: 'Failed to fetch school' });
    }
  });
  
  // Create a new school
  router.post('/api/cms/schools', async (req, res) => {
    try {
      const schoolData = insertSchoolSchema.parse(req.body);
      
      // @ts-ignore - added by cms-storage
      const school = await storage.createSchool(schoolData);
      
      res.status(201).json(school);
    } catch (error) {
      console.error('Error creating school:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid school data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create school' });
    }
  });
  
  // Update a school
  router.patch('/api/cms/schools/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid school ID' });
      }
      
      const updateData = insertSchoolSchema.partial().parse(req.body);
      
      // @ts-ignore - added by cms-storage
      const school = await storage.updateSchool(id, updateData);
      
      if (!school) {
        return res.status(404).json({ error: 'School not found' });
      }
      
      res.json(school);
    } catch (error) {
      console.error('Error updating school:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid school data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update school' });
    }
  });
  
  // Delete a school
  router.delete('/api/cms/schools/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid school ID' });
      }
      
      // @ts-ignore - added by cms-storage
      const result = await storage.deleteSchool(id);
      
      if (!result) {
        return res.status(404).json({ error: 'School not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting school:', error);
      res.status(500).json({ error: 'Failed to delete school' });
    }
  });
  
  //================================================
  // Neurodivergent Schools API
  //================================================
  
  // Get all neurodivergent schools
  router.get('/api/cms/neurodivergent-schools', async (req, res) => {
    try {
      // @ts-ignore - added by cms-storage
      const schools = await storage.getNeurodivergentSchools();
      res.json(schools);
    } catch (error) {
      console.error('Error fetching neurodivergent schools:', error);
      res.status(500).json({ error: 'Failed to fetch neurodivergent schools' });
    }
  });
  
  // Get neurodivergent school by ID
  router.get('/api/cms/neurodivergent-schools/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid neurodivergent school ID' });
      }
      
      // @ts-ignore - added by cms-storage
      const school = await storage.getNeurodivergentSchoolById(id);
      
      if (!school) {
        return res.status(404).json({ error: 'Neurodivergent school not found' });
      }
      
      res.json(school);
    } catch (error) {
      console.error('Error fetching neurodivergent school:', error);
      res.status(500).json({ error: 'Failed to fetch neurodivergent school' });
    }
  });
  
  // Get neurodivergent school by school ID
  router.get('/api/cms/neurodivergent-schools/school/:schoolId', async (req, res) => {
    try {
      const schoolId = parseInt(req.params.schoolId);
      if (isNaN(schoolId)) {
        return res.status(400).json({ error: 'Invalid school ID' });
      }
      
      // @ts-ignore - added by cms-storage
      const school = await storage.getNeurodivergentSchoolBySchoolId(schoolId);
      
      if (!school) {
        return res.status(404).json({ error: 'Neurodivergent school not found' });
      }
      
      res.json(school);
    } catch (error) {
      console.error('Error fetching neurodivergent school by school ID:', error);
      res.status(500).json({ error: 'Failed to fetch neurodivergent school' });
    }
  });
  
  // Create a new neurodivergent school
  router.post('/api/cms/neurodivergent-schools', async (req, res) => {
    try {
      const schoolData = insertNeurodivergentSchoolSchema.parse(req.body);
      
      // @ts-ignore - added by cms-storage
      const school = await storage.createNeurodivergentSchool(schoolData);
      
      res.status(201).json(school);
    } catch (error) {
      console.error('Error creating neurodivergent school:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid neurodivergent school data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create neurodivergent school' });
    }
  });
  
  // Update a neurodivergent school
  router.patch('/api/cms/neurodivergent-schools/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid neurodivergent school ID' });
      }
      
      const updateData = insertNeurodivergentSchoolSchema.partial().parse(req.body);
      
      // @ts-ignore - added by cms-storage
      const school = await storage.updateNeurodivergentSchool(id, updateData);
      
      if (!school) {
        return res.status(404).json({ error: 'Neurodivergent school not found' });
      }
      
      res.json(school);
    } catch (error) {
      console.error('Error updating neurodivergent school:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid neurodivergent school data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update neurodivergent school' });
    }
  });
  
  //================================================
  // Law Schools API
  //================================================
  
  // Get all law schools
  router.get('/api/cms/law-schools', async (req, res) => {
    try {
      // @ts-ignore - added by cms-storage
      const schools = await storage.getLawSchools();
      res.json(schools);
    } catch (error) {
      console.error('Error fetching law schools:', error);
      res.status(500).json({ error: 'Failed to fetch law schools' });
    }
  });
  
  // Get law school by ID
  router.get('/api/cms/law-schools/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid law school ID' });
      }
      
      // @ts-ignore - added by cms-storage
      const school = await storage.getLawSchoolById(id);
      
      if (!school) {
        return res.status(404).json({ error: 'Law school not found' });
      }
      
      res.json(school);
    } catch (error) {
      console.error('Error fetching law school:', error);
      res.status(500).json({ error: 'Failed to fetch law school' });
    }
  });
  
  // Get law school by school ID
  router.get('/api/cms/law-schools/school/:schoolId', async (req, res) => {
    try {
      const schoolId = parseInt(req.params.schoolId);
      if (isNaN(schoolId)) {
        return res.status(400).json({ error: 'Invalid school ID' });
      }
      
      // @ts-ignore - added by cms-storage
      const school = await storage.getLawSchoolBySchoolId(schoolId);
      
      if (!school) {
        return res.status(404).json({ error: 'Law school not found' });
      }
      
      res.json(school);
    } catch (error) {
      console.error('Error fetching law school by school ID:', error);
      res.status(500).json({ error: 'Failed to fetch law school' });
    }
  });
  
  // Create a new law school
  router.post('/api/cms/law-schools', async (req, res) => {
    try {
      const schoolData = insertLawSchoolSchema.parse(req.body);
      
      // @ts-ignore - added by cms-storage
      const school = await storage.createLawSchool(schoolData);
      
      res.status(201).json(school);
    } catch (error) {
      console.error('Error creating law school:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid law school data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create law school' });
    }
  });
  
  // Update a law school
  router.patch('/api/cms/law-schools/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid law school ID' });
      }
      
      const updateData = insertLawSchoolSchema.partial().parse(req.body);
      
      // @ts-ignore - added by cms-storage
      const school = await storage.updateLawSchool(id, updateData);
      
      if (!school) {
        return res.status(404).json({ error: 'Law school not found' });
      }
      
      res.json(school);
    } catch (error) {
      console.error('Error updating law school:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid law school data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update law school' });
    }
  });
  
  //================================================
  // Language Schools API
  //================================================
  
  // Get all language schools
  router.get('/api/cms/language-schools', async (req, res) => {
    try {
      // @ts-ignore - added by cms-storage
      const schools = await storage.getLanguageSchools();
      res.json(schools);
    } catch (error) {
      console.error('Error fetching language schools:', error);
      res.status(500).json({ error: 'Failed to fetch language schools' });
    }
  });
  
  // Get language school by ID
  router.get('/api/cms/language-schools/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid language school ID' });
      }
      
      // @ts-ignore - added by cms-storage
      const school = await storage.getLanguageSchoolById(id);
      
      if (!school) {
        return res.status(404).json({ error: 'Language school not found' });
      }
      
      res.json(school);
    } catch (error) {
      console.error('Error fetching language school:', error);
      res.status(500).json({ error: 'Failed to fetch language school' });
    }
  });
  
  // Get language school by school ID
  router.get('/api/cms/language-schools/school/:schoolId', async (req, res) => {
    try {
      const schoolId = parseInt(req.params.schoolId);
      if (isNaN(schoolId)) {
        return res.status(400).json({ error: 'Invalid school ID' });
      }
      
      // @ts-ignore - added by cms-storage
      const school = await storage.getLanguageSchoolBySchoolId(schoolId);
      
      if (!school) {
        return res.status(404).json({ error: 'Language school not found' });
      }
      
      res.json(school);
    } catch (error) {
      console.error('Error fetching language school by school ID:', error);
      res.status(500).json({ error: 'Failed to fetch language school' });
    }
  });
  
  // Create a new language school
  router.post('/api/cms/language-schools', async (req, res) => {
    try {
      const schoolData = insertLanguageSchoolSchema.parse(req.body);
      
      // @ts-ignore - added by cms-storage
      const school = await storage.createLanguageSchool(schoolData);
      
      res.status(201).json(school);
    } catch (error) {
      console.error('Error creating language school:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid language school data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create language school' });
    }
  });
  
  // Update a language school
  router.patch('/api/cms/language-schools/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid language school ID' });
      }
      
      const updateData = insertLanguageSchoolSchema.partial().parse(req.body);
      
      // @ts-ignore - added by cms-storage
      const school = await storage.updateLanguageSchool(id, updateData);
      
      if (!school) {
        return res.status(404).json({ error: 'Language school not found' });
      }
      
      res.json(school);
    } catch (error) {
      console.error('Error updating language school:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid language school data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update language school' });
    }
  });
  
  //================================================
  // Pages API
  //================================================
  
  // Get all pages with optional filters
  router.get('/api/cms/pages', async (req, res) => {
    try {
      const schoolId = req.query.schoolId ? parseInt(req.query.schoolId as string) : undefined;
      const type = req.query.type as string | undefined;
      
      if (req.query.schoolId && isNaN(schoolId!)) {
        return res.status(400).json({ error: 'Invalid school ID' });
      }
      
      // @ts-ignore - added by cms-storage
      const pages = await storage.getPages({ schoolId, type });
      res.json(pages);
    } catch (error) {
      console.error('Error fetching pages:', error);
      res.status(500).json({ error: 'Failed to fetch pages' });
    }
  });
  
  // Get page by ID
  router.get('/api/cms/pages/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid page ID' });
      }
      
      // @ts-ignore - added by cms-storage
      const page = await storage.getPageById(id);
      
      if (!page) {
        return res.status(404).json({ error: 'Page not found' });
      }
      
      res.json(page);
    } catch (error) {
      console.error('Error fetching page:', error);
      res.status(500).json({ error: 'Failed to fetch page' });
    }
  });
  
  // Get page by slug
  router.get('/api/cms/pages/slug/:slug', async (req, res) => {
    try {
      const slug = req.params.slug;
      
      // @ts-ignore - added by cms-storage
      const page = await storage.getPageBySlug(slug);
      
      if (!page) {
        return res.status(404).json({ error: 'Page not found' });
      }
      
      res.json(page);
    } catch (error) {
      console.error('Error fetching page by slug:', error);
      res.status(500).json({ error: 'Failed to fetch page' });
    }
  });
  
  // Create a new page
  router.post('/api/cms/pages', async (req, res) => {
    try {
      const pageData = insertPageSchema.parse(req.body);
      
      // @ts-ignore - added by cms-storage
      const page = await storage.createPage(pageData);
      
      res.status(201).json(page);
    } catch (error) {
      console.error('Error creating page:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid page data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create page' });
    }
  });
  
  // Update a page
  router.patch('/api/cms/pages/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid page ID' });
      }
      
      const updateData = insertPageSchema.partial().parse(req.body);
      
      // @ts-ignore - added by cms-storage
      const page = await storage.updatePage(id, updateData);
      
      if (!page) {
        return res.status(404).json({ error: 'Page not found' });
      }
      
      res.json(page);
    } catch (error) {
      console.error('Error updating page:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid page data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update page' });
    }
  });
  
  // Delete a page
  router.delete('/api/cms/pages/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid page ID' });
      }
      
      // @ts-ignore - added by cms-storage
      const result = await storage.deletePage(id);
      
      if (!result) {
        return res.status(404).json({ error: 'Page not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting page:', error);
      res.status(500).json({ error: 'Failed to delete page' });
    }
  });
  
  //================================================
  // AI Teachers API
  //================================================
  
  // Get all AI teachers with optional school filter
  router.get('/api/cms/ai-teachers', async (req, res) => {
    try {
      const schoolId = req.query.schoolId ? parseInt(req.query.schoolId as string) : undefined;
      
      if (req.query.schoolId && isNaN(schoolId!)) {
        return res.status(400).json({ error: 'Invalid school ID' });
      }
      
      // @ts-ignore - added by cms-storage
      const teachers = await storage.getAiTeachers({ schoolId });
      res.json(teachers);
    } catch (error) {
      console.error('Error fetching AI teachers:', error);
      res.status(500).json({ error: 'Failed to fetch AI teachers' });
    }
  });
  
  // Get AI teacher by ID
  router.get('/api/cms/ai-teachers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid AI teacher ID' });
      }
      
      // @ts-ignore - added by cms-storage
      const teacher = await storage.getAiTeacherById(id);
      
      if (!teacher) {
        return res.status(404).json({ error: 'AI teacher not found' });
      }
      
      res.json(teacher);
    } catch (error) {
      console.error('Error fetching AI teacher:', error);
      res.status(500).json({ error: 'Failed to fetch AI teacher' });
    }
  });
  
  // Create a new AI teacher
  router.post('/api/cms/ai-teachers', async (req, res) => {
    try {
      const teacherData = insertAiTeacherSchema.parse(req.body);
      
      // @ts-ignore - added by cms-storage
      const teacher = await storage.createAiTeacher(teacherData);
      
      res.status(201).json(teacher);
    } catch (error) {
      console.error('Error creating AI teacher:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid AI teacher data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create AI teacher' });
    }
  });
  
  // Update an AI teacher
  router.patch('/api/cms/ai-teachers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid AI teacher ID' });
      }
      
      const updateData = insertAiTeacherSchema.partial().parse(req.body);
      
      // @ts-ignore - added by cms-storage
      const teacher = await storage.updateAiTeacher(id, updateData);
      
      if (!teacher) {
        return res.status(404).json({ error: 'AI teacher not found' });
      }
      
      res.json(teacher);
    } catch (error) {
      console.error('Error updating AI teacher:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid AI teacher data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update AI teacher' });
    }
  });
  
  // Delete an AI teacher
  router.delete('/api/cms/ai-teachers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid AI teacher ID' });
      }
      
      // @ts-ignore - added by cms-storage
      const result = await storage.deleteAiTeacher(id);
      
      if (!result) {
        return res.status(404).json({ error: 'AI teacher not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting AI teacher:', error);
      res.status(500).json({ error: 'Failed to delete AI teacher' });
    }
  });
  
  //================================================
  // Resources API
  //================================================
  
  // Get all resources with optional filters
  router.get('/api/cms/resources', async (req, res) => {
    try {
      const schoolId = req.query.schoolId ? parseInt(req.query.schoolId as string) : undefined;
      const type = req.query.type as string | undefined;
      const schoolType = req.query.schoolType as string | undefined;
      
      if (req.query.schoolId && isNaN(schoolId!)) {
        return res.status(400).json({ error: 'Invalid school ID' });
      }
      
      // @ts-ignore - added by cms-storage
      const resources = await storage.getResources({ schoolId, type, schoolType });
      res.json(resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      res.status(500).json({ error: 'Failed to fetch resources' });
    }
  });
  
  // Get resource by ID
  router.get('/api/cms/resources/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid resource ID' });
      }
      
      // @ts-ignore - added by cms-storage
      const resource = await storage.getResourceById(id);
      
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      
      res.json(resource);
    } catch (error) {
      console.error('Error fetching resource:', error);
      res.status(500).json({ error: 'Failed to fetch resource' });
    }
  });
  
  // Create a new resource
  router.post('/api/cms/resources', async (req, res) => {
    try {
      const resourceData = insertResourceSchema.parse(req.body);
      
      // @ts-ignore - added by cms-storage
      const resource = await storage.createResource(resourceData);
      
      res.status(201).json(resource);
    } catch (error) {
      console.error('Error creating resource:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid resource data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create resource' });
    }
  });
  
  // Update a resource
  router.patch('/api/cms/resources/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid resource ID' });
      }
      
      const updateData = insertResourceSchema.partial().parse(req.body);
      
      // @ts-ignore - added by cms-storage
      const resource = await storage.updateResource(id, updateData);
      
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      
      res.json(resource);
    } catch (error) {
      console.error('Error updating resource:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid resource data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update resource' });
    }
  });
  
  // Delete a resource
  router.delete('/api/cms/resources/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid resource ID' });
      }
      
      // @ts-ignore - added by cms-storage
      const result = await storage.deleteResource(id);
      
      if (!result) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting resource:', error);
      res.status(500).json({ error: 'Failed to delete resource' });
    }
  });

  return router;
}