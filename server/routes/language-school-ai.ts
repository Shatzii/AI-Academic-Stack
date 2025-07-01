import { Router, Request, Response } from 'express';
import {
  generateVocabularyList,
  createLanguageDialogue,
  generateGrammarExercises,
  generateCulturalLesson
} from '../services/anthropic-school-integrations';

export const router = Router();

/**
 * @route POST /api/language-school/ai/generate-vocabulary
 * @desc Generate vocabulary lists for language learning
 * @access Private
 */
router.post('/generate-vocabulary', async (req: Request, res: Response) => {
  try {
    const { language, proficiencyLevel, topic } = req.body;
    
    if (!language || !proficiencyLevel || !topic) {
      return res.status(400).json({ 
        success: false, 
        message: 'Language, proficiency level, and topic are required' 
      });
    }

    const vocabularyList = await generateVocabularyList(
      language,
      proficiencyLevel,
      topic
    );
    
    res.json({
      success: true,
      vocabularyList
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
 * @route POST /api/language-school/ai/create-dialogue
 * @desc Create a language practice dialogue
 * @access Private
 */
router.post('/create-dialogue', async (req: Request, res: Response) => {
  try {
    const { language, proficiencyLevel, situation } = req.body;
    
    if (!language || !proficiencyLevel || !situation) {
      return res.status(400).json({ 
        success: false, 
        message: 'Language, proficiency level, and situation are required' 
      });
    }

    const dialogue = await createLanguageDialogue(
      language,
      proficiencyLevel,
      situation
    );
    
    res.json({
      success: true,
      dialogue
    });
  } catch (error: any) {
    console.error('Error creating language dialogue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create language dialogue',
      error: error.message
    });
  }
});

/**
 * @route POST /api/language-school/ai/generate-grammar
 * @desc Generate grammar exercises for language learning
 * @access Private
 */
router.post('/generate-grammar', async (req: Request, res: Response) => {
  try {
    const { language, proficiencyLevel, grammarTopic } = req.body;
    
    if (!language || !proficiencyLevel || !grammarTopic) {
      return res.status(400).json({ 
        success: false, 
        message: 'Language, proficiency level, and grammar topic are required' 
      });
    }

    const grammarExercises = await generateGrammarExercises(
      language,
      proficiencyLevel,
      grammarTopic
    );
    
    res.json({
      success: true,
      grammarExercises
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
 * @route POST /api/language-school/ai/generate-cultural-lesson
 * @desc Generate cultural lessons for language learning
 * @access Private
 */
router.post('/generate-cultural-lesson', async (req: Request, res: Response) => {
  try {
    const { language, proficiencyLevel, culturalTopic } = req.body;
    
    if (!language || !proficiencyLevel || !culturalTopic) {
      return res.status(400).json({ 
        success: false, 
        message: 'Language, proficiency level, and cultural topic are required' 
      });
    }

    const culturalLesson = await generateCulturalLesson(
      language,
      proficiencyLevel,
      culturalTopic
    );
    
    res.json({
      success: true,
      culturalLesson
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