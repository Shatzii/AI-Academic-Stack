/**
 * Law School Routes
 * 
 * This file defines Express routes for the UAE Law School functionality,
 * including bar exam prep, case studies, and legal educational content.
 */

import { Router } from 'express';
import { z } from 'zod';
import { UAELawProfessor } from '../services/ai-professors/law-professor';
import { AIModel } from '../services/ai-service';

const router = Router();
const lawProfessor = new UAELawProfessor();

// Schema for legal question
const legalQuestionSchema = z.object({
  id: z.string().optional(), // Optional ID field
  question: z.string().min(10, "Question must be at least 10 characters"),
  topic: z.string().min(3, "Topic must be specified"),
  subtopic: z.string().optional(),
  difficulty: z.enum(['basic', 'intermediate', 'advanced', 'bar-exam']),
  context: z.string().optional(),
});

// Schema for case study analysis
const caseStudySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  facts: z.string().min(50, "Facts must be at least 50 characters"),
  legalIssues: z.array(z.string()).min(1, "At least one legal issue must be provided"),
  relevantLaws: z.array(z.string()).min(1, "At least one relevant law must be provided"),
});

// Schema for legal resource generation
const resourceRequestSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  subtopic: z.string().optional(),
  resourceType: z.enum(['summary', 'outline', 'practice-questions', 'flashcards']),
  difficultyLevel: z.enum(['basic', 'intermediate', 'advanced', 'bar-exam']),
});

// Schema for bar exam questions generation
const barExamQuestionsSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  count: z.number().min(1).max(10).default(5),
});

// Route to answer legal questions
router.post('/answer-question', async (req, res) => {
  try {
    const data = legalQuestionSchema.parse(req.body);
    
    // Check if ID is provided, otherwise generate a random one
    const id = req.body.id || Math.random().toString(36).substring(2, 15);
    
    const response = await lawProfessor.answerLegalQuestion({
      id: id,
      question: data.question,
      topic: data.topic,
      subtopic: data.subtopic,
      difficulty: data.difficulty,
      context: data.context,
    });
    
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error answering legal question:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Failed to answer legal question'
    });
  }
});

// Route to analyze case studies
router.post('/analyze-case', async (req, res) => {
  try {
    const data = caseStudySchema.parse(req.body);
    
    const response = await lawProfessor.analyzeCaseStudy({
      id: Math.random().toString(36).substring(2, 15), // Generate a random ID
      title: data.title,
      facts: data.facts,
      legalIssues: data.legalIssues,
      relevantLaws: data.relevantLaws,
    });
    
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error analyzing case study:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Failed to analyze case study'
    });
  }
});

// Route to generate legal educational resources
router.post('/generate-resource', async (req, res) => {
  try {
    const data = resourceRequestSchema.parse(req.body);
    
    const resource = await lawProfessor.generateLegalResource({
      topic: data.topic,
      subtopic: data.subtopic,
      resourceType: data.resourceType,
      difficultyLevel: data.difficultyLevel,
    });
    
    res.json({
      success: true,
      data: {
        topic: data.topic,
        subtopic: data.subtopic,
        resourceType: data.resourceType,
        difficultyLevel: data.difficultyLevel,
        resource: resource
      }
    });
  } catch (error) {
    console.error('Error generating legal resource:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate legal resource'
    });
  }
});

// Route to generate bar exam practice questions
router.post('/bar-exam-questions', async (req, res) => {
  try {
    const data = barExamQuestionsSchema.parse(req.body);
    
    const questions = await lawProfessor.generateBarExamQuestions(data.topic, data.count);
    
    res.json({
      success: true,
      data: {
        topic: data.topic,
        count: questions.length,
        questions: questions
      }
    });
  } catch (error) {
    console.error('Error generating bar exam questions:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate bar exam questions'
    });
  }
});

// Route to get feedback on a student's answer to a legal question
router.post('/answer-feedback', async (req, res) => {
  try {
    const { question, studentAnswer, topic, difficulty } = req.body;
    
    if (!question || !studentAnswer || !topic || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: question, studentAnswer, topic, and difficulty are required'
      });
    }
    
    const feedback = await lawProfessor.getAnswerFeedback(
      question,
      studentAnswer,
      topic,
      difficulty
    );
    
    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error getting answer feedback:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get feedback on answer'
    });
  }
});

export default router;