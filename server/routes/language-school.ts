/**
 * Language School API Routes
 * 
 * This module contains the API routes for the Language School functionality.
 */

import { Router, Request, Response } from 'express';
import { storage } from '../storage';

export const router = Router();

/**
 * @route GET /api/language-school/courses
 * @desc Get all language courses
 * @access Public
 */
router.get('/courses', async (_req: Request, res: Response) => {
  try {
    const courses = await storage.getLanguageCourses();
    
    // Add module count to each course
    const coursesWithModuleCount = await Promise.all(
      courses.map(async (course) => {
        const modules = await storage.getLanguageModules(course.id);
        return {
          ...course,
          moduleCount: modules.length
        };
      })
    );
    
    res.json({
      success: true,
      courses: coursesWithModuleCount
    });
  } catch (error) {
    console.error('Error fetching language courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch language courses'
    });
  }
});

/**
 * @route GET /api/language-school/courses/:courseId
 * @desc Get a specific language course by ID
 * @access Public
 */
router.get('/courses/:courseId', async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;
    const course = await storage.getLanguageCourseById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Language course not found'
      });
    }
    
    const modules = await storage.getLanguageModules(courseId);
    
    res.json({
      success: true,
      course: {
        ...course,
        moduleCount: modules.length
      }
    });
  } catch (error) {
    console.error('Error fetching language course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch language course'
    });
  }
});

/**
 * @route GET /api/language-school/courses/:courseId/modules
 * @desc Get all modules for a language course
 * @access Public
 */
router.get('/courses/:courseId/modules', async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;
    const modules = await storage.getLanguageModules(courseId);
    
    // Add mission count to each module
    const modulesWithMissionCount = await Promise.all(
      modules.map(async (module) => {
        const missions = await storage.getLanguageMissions(module.id);
        return {
          ...module,
          missionCount: missions.length
        };
      })
    );
    
    // Sort modules by orderIndex
    const sortedModules = modulesWithMissionCount.sort((a, b) => a.orderIndex - b.orderIndex);
    
    res.json({
      success: true,
      modules: sortedModules
    });
  } catch (error) {
    console.error('Error fetching language modules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch language modules'
    });
  }
});

/**
 * @route GET /api/language-school/modules/:moduleId
 * @desc Get a specific language module by ID
 * @access Public
 */
router.get('/modules/:moduleId', async (req: Request, res: Response) => {
  try {
    const moduleId = req.params.moduleId;
    const module = await storage.getLanguageModuleById(moduleId);
    
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Language module not found'
      });
    }
    
    const missions = await storage.getLanguageMissions(moduleId);
    
    res.json({
      success: true,
      module: {
        ...module,
        missionCount: missions.length
      }
    });
  } catch (error) {
    console.error('Error fetching language module:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch language module'
    });
  }
});

/**
 * @route GET /api/language-school/modules/:moduleId/missions
 * @desc Get all missions for a language module
 * @access Public
 */
router.get('/modules/:moduleId/missions', async (req: Request, res: Response) => {
  try {
    const moduleId = req.params.moduleId;
    const missions = await storage.getLanguageMissions(moduleId);
    
    // Sort missions by orderIndex
    const sortedMissions = missions.sort((a, b) => a.orderIndex - b.orderIndex);
    
    res.json({
      success: true,
      missions: sortedMissions
    });
  } catch (error) {
    console.error('Error fetching language missions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch language missions'
    });
  }
});

/**
 * @route GET /api/language-school/missions/:missionId
 * @desc Get a specific language mission by ID
 * @access Public
 */
router.get('/missions/:missionId', async (req: Request, res: Response) => {
  try {
    const missionId = req.params.missionId;
    const mission = await storage.getLanguageMissionById(missionId);
    
    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Language mission not found'
      });
    }
    
    res.json({
      success: true,
      mission
    });
  } catch (error) {
    console.error('Error fetching language mission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch language mission'
    });
  }
});

/**
 * @route GET /api/language-school/vocabulary-lists
 * @desc Get all vocabulary lists
 * @access Public
 */
router.get('/vocabulary-lists', async (req: Request, res: Response) => {
  try {
    const lists = await storage.getVocabularyLists();
    
    // Add word count to each list
    const listsWithWordCount = await Promise.all(
      lists.map(async (list) => {
        const words = await storage.getVocabularyWords(list.id);
        return {
          ...list,
          wordCount: words.length
        };
      })
    );
    
    res.json({
      success: true,
      vocabularyLists: listsWithWordCount
    });
  } catch (error) {
    console.error('Error fetching vocabulary lists:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vocabulary lists'
    });
  }
});

/**
 * @route GET /api/language-school/vocabulary-lists/:listId
 * @desc Get a specific vocabulary list by ID
 * @access Public
 */
router.get('/vocabulary-lists/:listId', async (req: Request, res: Response) => {
  try {
    const listId = req.params.listId;
    const list = await storage.getVocabularyListById(listId);
    
    if (!list) {
      return res.status(404).json({
        success: false,
        message: 'Vocabulary list not found'
      });
    }
    
    const words = await storage.getVocabularyWords(listId);
    
    res.json({
      success: true,
      vocabularyList: {
        ...list,
        wordCount: words.length
      }
    });
  } catch (error) {
    console.error('Error fetching vocabulary list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vocabulary list'
    });
  }
});

/**
 * @route GET /api/language-school/vocabulary-lists/:listId/words
 * @desc Get all words for a vocabulary list
 * @access Public
 */
router.get('/vocabulary-lists/:listId/words', async (req: Request, res: Response) => {
  try {
    const listId = req.params.listId;
    const words = await storage.getVocabularyWords(listId);
    
    res.json({
      success: true,
      words
    });
  } catch (error) {
    console.error('Error fetching vocabulary words:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vocabulary words'
    });
  }
});

/**
 * @route GET /api/language-school/user/:userId/progress
 * @desc Get language learning progress for a user
 * @access Private
 */
router.get('/user/:userId/progress', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const progress = await storage.getUserLanguageProgress(userId);
    
    res.json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('Error fetching user language progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user language progress'
    });
  }
});

/**
 * @route GET /api/language-school/user/:userId/vocabulary-progress
 * @desc Get vocabulary learning progress for a user
 * @access Private
 */
router.get('/user/:userId/vocabulary-progress', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const progress = await storage.getUserVocabularyProgress(userId);
    
    res.json({
      success: true,
      vocabularyProgress: progress
    });
  } catch (error) {
    console.error('Error fetching user vocabulary progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user vocabulary progress'
    });
  }
});