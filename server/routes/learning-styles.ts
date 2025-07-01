import express, { Router, Request, Response } from 'express';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import { SessionData } from 'express-session';

import { handleApiError, createError } from '../utils/error-handler';
import { successResponse, createdResponse, notFoundResponse } from '../utils/response';
import { 
  QuizResponse, 
  LearningStyleType, 
  learningStyleDescriptions, 
  quizQuestions, 
  sampleLearningPersonas,
  LearningPersona,
  UserData
} from '../../shared/learning-styles-quiz';

// Create Anthropic client for AI-powered persona generation
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const router: Router = express.Router();

// Zod schema for quiz responses
const quizResponsesSchema = z.object({
  responses: z.array(
    z.object({
      questionId: z.number(),
      answerId: z.string()
    })
  )
});

// Zod schema for persona generation request
const personaGenerationSchema = z.object({
  learningStyle: z.string(),
  userData: z.object({
    name: z.string().optional(),
    avatarType: z.string().optional(),
    interests: z.array(z.string()).optional(),
    schoolTier: z.enum(['elementary', 'middle', 'high']).optional()
  }).optional()
});

// Zod schema for saving persona
const savePersonaSchema = z.object({
  persona: z.object({
    name: z.string(),
    avatarType: z.string(),
    learningStyle: z.string(),
    title: z.string(),
    description: z.string(),
    personalizedApproach: z.string(),
    studyStrategies: z.array(z.string()),
    classroomBehavior: z.string(),
    communicationStyle: z.string(),
    challenges: z.string(),
    strengths: z.string(),
    interestSpecificStrategies: z.array(z.string()).optional()
  })
});

/**
 * Save quiz results and determine learning style
 * POST /api/learning-styles/save-quiz-results
 */
router.post('/save-quiz-results', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { responses } = quizResponsesSchema.parse(req.body);
    
    // Calculate learning style based on responses
    const learningStyle = calculateLearningStyle(responses);
    
    // Create a session user ID if not already present
    const userId = req.session.userId || Math.floor(Math.random() * 10000);
    req.session.userId = userId;
    
    // Save learning style to database/session
    try {
      await req.db.upsertLearningStyle({
        userId,
        learningStyle,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving learning style:', error);
      // Continue even if saving fails - we can use the session data
    }
    
    // Save the style to session as well for redundancy
    req.session.learningStyle = learningStyle;
    
    return successResponse(res, 'Learning style saved successfully', {
      learningStyle,
      description: learningStyleDescriptions[learningStyle as LearningStyleType] || 
                   'Your learning style helps you understand how you learn best.'
    });
  } catch (error) {
    return handleApiError(res, error);
  }
});

/**
 * Generate a personalized learning persona based on style
 * POST /api/learning-styles/generate-persona
 */
router.post('/generate-persona', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { learningStyle, userData } = personaGenerationSchema.parse(req.body);
    
    // Create a session user ID if not already present
    const userId = req.session.userId || Math.floor(Math.random() * 10000);
    req.session.userId = userId;
    
    // Generate personalized learning persona using AI
    let persona: LearningPersona;
    
    try {
      persona = await generateLearningPersonaWithAI(learningStyle as LearningStyleType, userData);
    } catch (error) {
      console.error('Error generating AI persona:', error);
      // Fallback to sample persona if AI generation fails
      persona = sampleLearningPersonas[learningStyle as LearningStyleType] || 
                sampleLearningPersonas.visual; // Default to visual if style not found
      
      // Add personalized interest strategies if userData has interests
      if (userData?.interests && userData.interests.length > 0) {
        persona.interestSpecificStrategies = userData.interests.map(interest => 
          `Apply ${learningStyle} techniques when learning about ${interest}`
        );
      }
    }
    
    // Save the learning style to session for redundancy
    req.session.learningStyle = learningStyle;
    
    // Save learning persona to db if user is authenticated
    try {
      if (userId) {
        await req.db.upsertLearningPersona({
          userId,
          persona: JSON.stringify(persona)
        });
      }
    } catch (error) {
      console.error('Error saving learning persona:', error);
      // Continue even if db save fails - session has the data
    }
    
    // Store persona in session
    req.session.learningPersona = persona;
    
    return successResponse(res, 'Learning persona generated successfully', persona);
  } catch (error) {
    return handleApiError(res, error);
  }
});

/**
 * Save a learning persona to the user's profile
 * POST /api/learning-styles/save-persona
 */
router.post('/save-persona', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { persona } = savePersonaSchema.parse(req.body);
    
    // Get user ID from session
    const userId = req.session.userId;
    if (!userId) {
      return notFoundResponse(res, 'User session not found. Please complete the quiz first.');
    }
    
    // Save the persona to the database
    try {
      await req.db.upsertLearningPersona({
        userId,
        persona: JSON.stringify(persona)
      });
    } catch (error) {
      console.error('Error saving learning persona:', error);
      throw createError('Failed to save learning persona to database', 500);
    }
    
    // Save to session for redundancy
    req.session.learningPersona = persona;
    req.session.learningStyle = persona.learningStyle;
    
    return createdResponse(res, 'Learning persona saved successfully', persona);
  } catch (error) {
    return handleApiError(res, error);
  }
});

/**
 * Get the current user's learning style and persona
 * GET /api/learning-styles/my-profile
 */
router.get('/my-profile', async (req: Request, res: Response) => {
  try {
    // Get user ID from session
    const userId = req.session.userId;
    if (!userId) {
      return notFoundResponse(res, 'User session not found. Please complete the quiz first.');
    }
    
    // Get learner profile from database
    let learningStyle = req.session.learningStyle;
    let learningPersona = req.session.learningPersona;
    
    try {
      // Get data from database if available
      const dbLearningStyle = await req.db.getLearningStyle(userId);
      const dbLearningPersona = await req.db.getLearningPersona(userId);
      
      if (dbLearningStyle) {
        learningStyle = dbLearningStyle.learningStyle;
      }
      
      if (dbLearningPersona) {
        try {
          learningPersona = JSON.parse(dbLearningPersona.persona);
        } catch (e) {
          console.error('Error parsing persona JSON:', e);
        }
      }
    } catch (error) {
      console.error('Error fetching learning profile from db:', error);
      // Continue using session data if db fetch fails
    }
    
    // Check if profile exists
    if (!learningStyle && !learningPersona) {
      return notFoundResponse(res, 'Learning profile not found. Please complete the quiz first.');
    }
    
    return successResponse(res, 'Learning profile retrieved successfully', {
      learningStyle,
      learningPersona,
      description: learningStyle ? 
        learningStyleDescriptions[learningStyle as LearningStyleType] : 
        'Your learning style helps you understand how you learn best.'
    });
  } catch (error) {
    return handleApiError(res, error);
  }
});

/**
 * Calculate learning style based on quiz responses
 */
function calculateLearningStyle(responses: QuizResponse[]): string {
  // Count the frequency of each learning style in the responses
  const styleCounts: Record<string, number> = {
    visual: 0,
    auditory: 0,
    kinesthetic: 0,
    reading: 0
  };
  
  // Process each response
  responses.forEach(response => {
    // Find the question and selected answer
    const question = quizQuestions.find(q => q.id === response.questionId);
    
    if (question) {
      const answer = question.answers.find(a => a.id === response.answerId);
      
      if (answer) {
        // Increment the count for this learning style
        styleCounts[answer.learningStyle] = (styleCounts[answer.learningStyle] || 0) + 1;
      }
    }
  });
  
  // Find the dominant learning style(s)
  const maxCount = Math.max(...Object.values(styleCounts));
  const dominantStyles = Object.keys(styleCounts).filter(style => styleCounts[style] === maxCount);
  
  // If there are multiple dominant styles, classify as multimodal
  if (dominantStyles.length > 1) {
    return 'multimodal';
  }
  
  // Return the single dominant learning style
  return dominantStyles[0] || 'visual'; // Default to visual if something went wrong
}

/**
 * Generate a personalized learning persona using AI
 */
async function generateLearningPersonaWithAI(
  learningStyle: LearningStyleType, 
  userData?: UserData
): Promise<LearningPersona> {
  // If no API key or userData is provided, return the sample persona
  if (!process.env.ANTHROPIC_API_KEY || !userData) {
    return sampleLearningPersonas[learningStyle];
  }
  
  try {
    // Prepare the prompt for persona generation
    let userInterestsText = '';
    if (userData.interests && userData.interests.length > 0) {
      userInterestsText = `The user has expressed interest in: ${userData.interests.join(', ')}.`;
    }
    
    let userNameText = '';
    if (userData.name) {
      userNameText = `The user's name is ${userData.name}.`;
    }
    
    let schoolTierText = '';
    if (userData.schoolTier) {
      schoolTierText = `The user is in ${userData.schoolTier} school.`;
    }
    
    // Create detailed prompt for Claude
    const prompt = `
    I need to create a personalized learning persona for a student with a ${learningStyle} learning style.
    ${userNameText} ${schoolTierText} ${userInterestsText}
    
    Create a detailed, personalized learning profile that is informative, motivational, and actionable.
    
    Here's what I know about this learning style:
    ${learningStyleDescriptions[learningStyle]}
    
    Return the response as a JSON object with these fields:
    {
      "name": "A catchy name for this learning persona",
      "avatarType": "superhero",
      "learningStyle": "${learningStyle}",
      "title": "A title that reflects this learning style (e.g., 'The Visual Navigator')",
      "description": "A concise description of how this person learns best",
      "personalizedApproach": "A personalized paragraph about their learning journey using this style",
      "studyStrategies": ["An array of 5-7 specific and actionable study strategies for this style"],
      "classroomBehavior": "How they typically behave in classroom settings",
      "communicationStyle": "How they tend to communicate with others",
      "challenges": "Potential challenges or difficulties for this learning style",
      "strengths": "Key strengths of this learning style"
    }
    
    ${userInterestsText ? `Also include an additional field "interestSpecificStrategies" with an array of 3-5 personalized learning strategies related specifically to the user's interests.` : ''}
    
    Make it feel personal, engaging, and specifically tailored to the user.
    `;
    
    // Call Anthropic Claude API
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219", // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      max_tokens: 1000,
      messages: [
        { role: "user", content: prompt }
      ],
    });
    
    // Extract and parse the JSON response
    try {
      const content = response.content[0].text;
      const jsonString = content.replace(/```json|```/g, '').trim();
      const persona = JSON.parse(jsonString) as LearningPersona;
      
      // Ensure all required fields are present
      const requiredFields = [
        'name', 'avatarType', 'learningStyle', 'title', 'description',
        'personalizedApproach', 'studyStrategies', 'classroomBehavior',
        'communicationStyle', 'challenges', 'strengths'
      ];
      
      const missingFields = requiredFields.filter(field => !persona[field as keyof LearningPersona]);
      
      if (missingFields.length > 0) {
        console.warn(`AI-generated persona missing fields: ${missingFields.join(', ')}`);
        throw new Error('Incomplete persona generated');
      }
      
      return persona;
    } catch (error) {
      console.error('Error parsing AI-generated persona:', error);
      throw new Error('Failed to parse AI-generated persona');
    }
  } catch (error) {
    console.error('Error generating persona with AI:', error);
    throw error;
  }
}

export default router;