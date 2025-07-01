/**
 * Language Learning API Routes
 * 
 * This file defines all API endpoints for AI-powered language learning features
 * in the ShotziOS platform using Anthropic Claude integration.
 */

import { Router, Request, Response } from 'express';
import languageLearningService from '../services/language-learning-ai';

const router = Router();

/**
 * @route POST /api/language-learning/vocabulary
 * @desc Generate vocabulary list for language learning
 * @access Private
 */
router.post('/vocabulary', async (req: Request, res: Response) => {
  try {
    const { 
      language, 
      topic, 
      level, 
      count = 15, 
      includeContext = true 
    } = req.body;
    
    if (!language || !topic || !level) {
      return res.status(400).json({ 
        success: false, 
        message: 'Language, topic, and level are required' 
      });
    }

    const vocabularyList = await languageLearningService.generateVocabularyList(
      language,
      topic,
      level,
      count,
      includeContext
    );
    
    res.json({
      success: true,
      data: vocabularyList
    });
  } catch (error: any) {
    console.error('Error generating vocabulary list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate vocabulary list',
      error: error.message
    });
  }
});

/**
 * @route POST /api/language-learning/dialogue
 * @desc Generate dialogue for language practice
 * @access Private
 */
router.post('/dialogue', async (req: Request, res: Response) => {
  try {
    const { 
      language, 
      topic, 
      level, 
      context, 
      characterCount = 2 
    } = req.body;
    
    if (!language || !topic || !level || !context) {
      return res.status(400).json({ 
        success: false, 
        message: 'Language, topic, level, and context are required' 
      });
    }

    const dialogue = await languageLearningService.generateLanguageDialogue(
      language,
      topic,
      level,
      context,
      characterCount
    );
    
    res.json({
      success: true,
      data: dialogue
    });
  } catch (error: any) {
    console.error('Error generating dialogue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate dialogue',
      error: error.message
    });
  }
});

/**
 * @route POST /api/language-learning/grammar
 * @desc Generate grammar exercises
 * @access Private
 */
router.post('/grammar', async (req: Request, res: Response) => {
  try {
    const { 
      language, 
      grammarConcept, 
      level, 
      exerciseCount = 10 
    } = req.body;
    
    if (!language || !grammarConcept || !level) {
      return res.status(400).json({ 
        success: false, 
        message: 'Language, grammar concept, and level are required' 
      });
    }

    const grammarExercises = await languageLearningService.generateGrammarExercises(
      language,
      grammarConcept,
      level,
      exerciseCount
    );
    
    res.json({
      success: true,
      data: grammarExercises
    });
  } catch (error: any) {
    console.error('Error generating grammar exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate grammar exercises',
      error: error.message
    });
  }
});

/**
 * @route POST /api/language-learning/cultural-lesson
 * @desc Generate cultural lesson
 * @access Private
 */
router.post('/cultural-lesson', async (req: Request, res: Response) => {
  try {
    const { 
      language, 
      culturalTopic, 
      level 
    } = req.body;
    
    if (!language || !culturalTopic || !level) {
      return res.status(400).json({ 
        success: false, 
        message: 'Language, cultural topic, and level are required' 
      });
    }

    const culturalLesson = await languageLearningService.generateCulturalLesson(
      language,
      culturalTopic,
      level
    );
    
    res.json({
      success: true,
      data: culturalLesson
    });
  } catch (error: any) {
    console.error('Error generating cultural lesson:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate cultural lesson',
      error: error.message
    });
  }
});

/**
 * @route POST /api/language-learning/pronunciation
 * @desc Analyze pronunciation from audio
 * @access Private
 */
router.post('/pronunciation', async (req: Request, res: Response) => {
  try {
    const { 
      base64Audio, 
      language, 
      targetPhrase, 
      level 
    } = req.body;
    
    if (!language || !targetPhrase || !level) {
      return res.status(400).json({ 
        success: false, 
        message: 'Language, target phrase, and level are required' 
      });
    }

    // For now, we'll use a placeholder empty string for base64Audio
    // since this is a simulated capability until Claude supports audio
    const pronunciationFeedback = await languageLearningService.analyzePronunciation(
      base64Audio || '',
      language,
      targetPhrase,
      level
    );
    
    res.json({
      success: true,
      data: pronunciationFeedback
    });
  } catch (error: any) {
    console.error('Error analyzing pronunciation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze pronunciation',
      error: error.message
    });
  }
});

/**
 * @route POST /api/language-learning/assessment
 * @desc Create language assessment
 * @access Private
 */
router.post('/assessment', async (req: Request, res: Response) => {
  try {
    const { 
      language, 
      level, 
      skills, 
      questionCount = 20 
    } = req.body;
    
    if (!language || !level || !skills || !Array.isArray(skills)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Language, level, and skills array are required' 
      });
    }

    const assessment = await languageLearningService.createLanguageAssessment(
      language,
      level,
      skills,
      questionCount
    );
    
    res.json({
      success: true,
      data: assessment
    });
  } catch (error: any) {
    console.error('Error creating language assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create language assessment',
      error: error.message
    });
  }
});

/**
 * @route POST /api/language-learning/curriculum
 * @desc Generate language curriculum
 * @access Private
 */
router.post('/curriculum', async (req: Request, res: Response) => {
  try {
    const { 
      language, 
      level, 
      goals, 
      duration = 8, 
      learningStyle 
    } = req.body;
    
    if (!language || !level || !goals || !Array.isArray(goals) || !learningStyle) {
      return res.status(400).json({ 
        success: false, 
        message: 'Language, level, goals array, and learning style are required' 
      });
    }

    const curriculum = await languageLearningService.generateLanguageCurriculum(
      language,
      level,
      goals,
      duration,
      learningStyle
    );
    
    res.json({
      success: true,
      data: curriculum
    });
  } catch (error: any) {
    console.error('Error generating language curriculum:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate language curriculum',
      error: error.message
    });
  }
});

// Export the router
export default router;