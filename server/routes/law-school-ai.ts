import { Router, Request, Response } from 'express';
import {
  analyzeLegalCase,
  generateBarExamQuestions
} from '../services/anthropic-school-integrations';

export const router = Router();

/**
 * @route POST /api/law-school/ai/analyze-case
 * @desc Analyze a legal case and provide structured insights
 * @access Private
 */
router.post('/analyze-case', async (req: Request, res: Response) => {
  try {
    const { caseText, legalArea, prompt } = req.body;
    
    if (!caseText || !legalArea) {
      return res.status(400).json({ 
        success: false, 
        message: 'Case text and legal area are required' 
      });
    }

    const analysis = await analyzeLegalCase(caseText, legalArea, prompt || '');
    
    res.json({
      success: true,
      analysis
    });
  } catch (error: any) {
    console.error('Error analyzing legal case:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze legal case',
      error: error.message
    });
  }
});

/**
 * @route POST /api/law-school/ai/generate-bar-questions
 * @desc Generate practice UAE bar exam questions
 * @access Private
 */
router.post('/generate-bar-questions', async (req: Request, res: Response) => {
  try {
    const { legalTopic, questionCount = 3, format = 'multiple-choice' } = req.body;
    
    if (!legalTopic) {
      return res.status(400).json({ 
        success: false, 
        message: 'Legal topic is required' 
      });
    }

    const barQuestions = await generateBarExamQuestions(
      legalTopic,
      questionCount,
      format
    );
    
    res.json({
      success: true,
      questions: barQuestions
    });
  } catch (error: any) {
    console.error('Error generating bar exam questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate bar exam questions',
      error: error.message
    });
  }
});