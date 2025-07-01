/**
 * Learning Style Quiz and Persona Generation Routes
 * 
 * This module provides routes for handling learning style assessments
 * and generating personalized learning personas.
 */

import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { storage } from '../storage';
import { z } from 'zod';

// Initialize router
const router = express.Router();

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Schema for quiz submission
const quizSubmissionSchema = z.object({
  userId: z.number().optional(),
  answers: z.array(
    z.object({
      questionId: z.number(),
      answer: z.string(),
      weight: z.number().optional(),
    })
  ),
  additionalInfo: z.string().optional(),
  age: z.number().optional(),
  gradeLevel: z.string().optional(),
  neurotype: z.string().optional(),
});

// Schema for learning persona generation
const personaGenerationSchema = z.object({
  learningStyleResults: z.object({
    visual: z.number(),
    auditory: z.number(),
    kinesthetic: z.number(),
    reading: z.number(),
    verbal: z.number(),
    logical: z.number(),
    social: z.number(),
    solitary: z.number(),
  }),
  neurotype: z.string().optional(),
  strengths: z.array(z.string()).optional(),
  challenges: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  age: z.number().optional(),
  gradeLevel: z.string().optional(),
  additionalInfo: z.string().optional(),
});

// Define learning style quiz questions
const quizQuestions = [
  {
    id: 1,
    question: "When learning something new, I prefer to:",
    options: [
      { id: "a", text: "See diagrams, charts, or demonstrations", styles: ["visual"] },
      { id: "b", text: "Listen to explanations and talk it through", styles: ["auditory", "verbal"] },
      { id: "c", text: "Try it out hands-on and learn by doing", styles: ["kinesthetic"] },
      { id: "d", text: "Read about it first and take detailed notes", styles: ["reading"] }
    ]
  },
  {
    id: 2,
    question: "I remember information best when:",
    options: [
      { id: "a", text: "I write it down or draw it out", styles: ["visual", "reading"] },
      { id: "b", text: "I repeat it out loud or discuss it with others", styles: ["auditory", "social", "verbal"] },
      { id: "c", text: "I'm physically involved in an activity", styles: ["kinesthetic"] },
      { id: "d", text: "I think about it carefully on my own", styles: ["logical", "solitary"] }
    ]
  },
  {
    id: 3,
    question: "When solving problems, I tend to:",
    options: [
      { id: "a", text: "Make lists, diagrams, or organize information visually", styles: ["visual", "logical"] },
      { id: "b", text: "Talk through the steps with someone else", styles: ["verbal", "social"] },
      { id: "c", text: "Use trial and error and physical manipulation", styles: ["kinesthetic"] },
      { id: "d", text: "Analyze the problem thoroughly before taking action", styles: ["logical", "solitary", "reading"] }
    ]
  },
  {
    id: 4,
    question: "I find it easiest to understand:",
    options: [
      { id: "a", text: "Charts, graphs, and visual demonstrations", styles: ["visual"] },
      { id: "b", text: "Verbal instructions and explanations", styles: ["verbal", "auditory"] },
      { id: "c", text: "Practical examples I can try myself", styles: ["kinesthetic"] },
      { id: "d", text: "Written instructions and theoretical descriptions", styles: ["reading", "logical"] }
    ]
  },
  {
    id: 5,
    question: "When working on a group project, I typically:",
    options: [
      { id: "a", text: "Create visual aids and organize information", styles: ["visual"] },
      { id: "b", text: "Lead discussions and explain ideas verbally", styles: ["verbal", "social"] },
      { id: "c", text: "Build models or demonstrate concepts physically", styles: ["kinesthetic"] },
      { id: "d", text: "Research and write up the information", styles: ["reading", "solitary"] }
    ]
  },
  {
    id: 6,
    question: "When I'm trying to concentrate:",
    options: [
      { id: "a", text: "I prefer a visually clean, organized environment", styles: ["visual"] },
      { id: "b", text: "I'm easily distracted by sounds and noises", styles: ["auditory"] },
      { id: "c", text: "I get fidgety and need to move or take breaks", styles: ["kinesthetic"] },
      { id: "d", text: "I prefer a quiet space where I can think deeply", styles: ["solitary", "logical"] }
    ]
  },
  {
    id: 7,
    question: "When I'm explaining something to someone:",
    options: [
      { id: "a", text: "I often draw diagrams or use visual aids", styles: ["visual"] },
      { id: "b", text: "I use detailed verbal explanations", styles: ["verbal"] },
      { id: "c", text: "I demonstrate physically how to do it", styles: ["kinesthetic"] },
      { id: "d", text: "I provide written instructions or explanations", styles: ["reading"] }
    ]
  },
  {
    id: 8,
    question: "In my free time, I enjoy:",
    options: [
      { id: "a", text: "Visual activities like watching videos, art, or photography", styles: ["visual"] },
      { id: "b", text: "Listening to music, podcasts, or having conversations", styles: ["auditory", "social"] },
      { id: "c", text: "Physical activities, sports, or building things", styles: ["kinesthetic"] },
      { id: "d", text: "Reading, writing, or thinking about complex ideas", styles: ["reading", "logical", "solitary"] }
    ]
  },
  {
    id: 9,
    question: "When learning a new skill, I prefer:",
    options: [
      { id: "a", text: "To watch someone demonstrate it first", styles: ["visual"] },
      { id: "b", text: "To have someone explain it to me step by step", styles: ["verbal", "auditory"] },
      { id: "c", text: "To try it out and learn through practice", styles: ["kinesthetic"] },
      { id: "d", text: "To read instructions or theory before attempting it", styles: ["reading", "logical"] }
    ]
  },
  {
    id: 10,
    question: "When making decisions, I usually:",
    options: [
      { id: "a", text: "Visualize different outcomes and possibilities", styles: ["visual"] },
      { id: "b", text: "Discuss options with others to get their input", styles: ["verbal", "social"] },
      { id: "c", text: "Go with what feels right based on experience", styles: ["kinesthetic"] },
      { id: "d", text: "Logically analyze the pros and cons on my own", styles: ["logical", "solitary"] }
    ]
  },
  {
    id: 11,
    question: "Specifically related to neurodivergent traits, I find that:",
    options: [
      { id: "a", text: "I'm extremely sensitive to visual details others might miss", styles: ["visual"] },
      { id: "b", text: "I can be overwhelmed by certain sounds or conversations", styles: ["auditory"] },
      { id: "c", text: "I need to move or fidget to focus better", styles: ["kinesthetic"] },
      { id: "d", text: "I can focus intensely on topics that interest me for long periods", styles: ["solitary", "logical"] }
    ]
  },
  {
    id: 12,
    question: "When I'm trying to memorize information:",
    options: [
      { id: "a", text: "I create mental pictures or visual associations", styles: ["visual"] },
      { id: "b", text: "I repeat it out loud or create songs/rhymes", styles: ["auditory", "verbal"] },
      { id: "c", text: "I associate it with movements or physical sensations", styles: ["kinesthetic"] },
      { id: "d", text: "I organize it into logical systems or written notes", styles: ["logical", "reading"] }
    ]
  }
];

// GET quiz questions
router.get('/quiz-questions', (req, res) => {
  // Return questions without the learning style mappings
  const publicQuestions = quizQuestions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options.map(o => ({
      id: o.id,
      text: o.text,
    })),
  }));
  res.json({ questions: publicQuestions });
});

// Process quiz submission and calculate learning style
router.post('/submit-quiz', async (req, res) => {
  try {
    // Validate request body
    const validatedData = quizSubmissionSchema.parse(req.body);
    
    // Initialize learning style scores
    const learningStyleScores = {
      visual: 0,
      auditory: 0,
      kinesthetic: 0,
      reading: 0,
      verbal: 0,
      logical: 0,
      social: 0,
      solitary: 0,
    };
    
    // Calculate learning style scores based on answers
    validatedData.answers.forEach(answer => {
      const question = quizQuestions.find(q => q.id === answer.questionId);
      if (!question) return;
      
      const selectedOption = question.options.find(o => o.id === answer.answer);
      if (!selectedOption) return;
      
      // Add points to each learning style associated with the selected option
      selectedOption.styles.forEach(style => {
        if (style in learningStyleScores) {
          // Use weight if provided, otherwise default to 1
          const weight = answer.weight || 1;
          learningStyleScores[style] += weight;
        }
      });
    });
    
    // Normalize scores to percentages
    const totalPoints = Object.values(learningStyleScores).reduce((sum, score) => sum + score, 0);
    const normalizedScores = {};
    
    Object.entries(learningStyleScores).forEach(([style, score]) => {
      normalizedScores[style] = Math.round((score / totalPoints) * 100);
    });
    
    // Determine primary and secondary learning styles
    const sortedStyles = Object.entries(normalizedScores)
      .sort((a, b) => b[1] - a[1]);
    
    const primaryStyle = sortedStyles[0][0];
    const secondaryStyle = sortedStyles[1][0];
    
    // Store results in database if userId is provided
    let savedResult = null;
    if (validatedData.userId) {
      savedResult = await storage.createLearningStyleResult({
        userId: validatedData.userId,
        results: normalizedScores,
        primaryStyle,
        secondaryStyle,
        additionalInfo: validatedData.additionalInfo,
        createdAt: new Date(),
        neurotype: validatedData.neurotype,
        age: validatedData.age,
        gradeLevel: validatedData.gradeLevel,
      });
    }
    
    // Return results
    res.json({
      results: normalizedScores,
      primaryStyle,
      secondaryStyle,
      savedResultId: savedResult?.id,
    });
    
  } catch (error) {
    console.error('Error processing quiz submission:', error);
    res.status(400).json({ error: 'Invalid quiz submission' });
  }
});

// Generate learning persona based on quiz results
router.post('/generate-persona', async (req, res) => {
  try {
    // Validate request body
    const validatedData = personaGenerationSchema.parse(req.body);
    
    // Determine primary and secondary learning styles
    const sortedStyles = Object.entries(validatedData.learningStyleResults)
      .sort((a, b) => b[1] - a[1]);
    
    const primaryStyle = sortedStyles[0][0];
    const secondaryStyle = sortedStyles[1][0];
    
    // Construct prompt for Anthropic to generate a personalized learning persona
    const systemPrompt = `You are an expert educational psychologist specializing in neurodivergent learning styles. 
Your task is to create a personalized learning persona for a student based on their learning style assessment results.
The persona should be encouraging, supportive, and highlight the student's strengths while acknowledging areas for growth.

Please format your response in JSON with the following structure:
{
  "personaName": "A creative and fitting name for their learning persona",
  "personaDescription": "A 2-3 sentence description of their overall learning approach",
  "strengths": ["List 3-5 specific strengths based on their learning style"],
  "strategies": ["List 5-7 specific learning strategies that would work well for them"],
  "environments": ["List 3-4 ideal learning environments for this person"],
  "challenges": ["List 2-3 potential challenges they might face"],
  "superpower": "A single special strength or 'superpower' that leverages their unique learning style"
}

Make the response developmentally appropriate and encouraging. Focus on practical, actionable strategies.
`;

    // Build the user message based on assessment results
    let userMessage = `Please create a learning persona based on my assessment results:\n\n`;
    userMessage += `Primary learning style: ${primaryStyle} (${validatedData.learningStyleResults[primaryStyle]}%)\n`;
    userMessage += `Secondary learning style: ${secondaryStyle} (${validatedData.learningStyleResults[secondaryStyle]}%)\n\n`;
    userMessage += `All learning styles:\n`;
    
    sortedStyles.forEach(([style, score]) => {
      userMessage += `- ${style}: ${score}%\n`;
    });
    
    // Add additional information if available
    if (validatedData.neurotype) {
      userMessage += `\nNeurotype: ${validatedData.neurotype}\n`;
    }
    
    if (validatedData.age) {
      userMessage += `Age: ${validatedData.age}\n`;
    }
    
    if (validatedData.gradeLevel) {
      userMessage += `Grade level: ${validatedData.gradeLevel}\n`;
    }
    
    if (validatedData.strengths && validatedData.strengths.length > 0) {
      userMessage += `\nSelf-identified strengths: ${validatedData.strengths.join(', ')}\n`;
    }
    
    if (validatedData.challenges && validatedData.challenges.length > 0) {
      userMessage += `\nSelf-identified challenges: ${validatedData.challenges.join(', ')}\n`;
    }
    
    if (validatedData.interests && validatedData.interests.length > 0) {
      userMessage += `\nInterests: ${validatedData.interests.join(', ')}\n`;
    }
    
    if (validatedData.additionalInfo) {
      userMessage += `\nAdditional information: ${validatedData.additionalInfo}\n`;
    }
    
    // Generate persona using Anthropic API
    // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userMessage }
        ],
      });
      
      // Extract and parse the JSON response
      const content = response.content[0].text;
      
      // Find JSON in the response (in case the AI includes additional text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      let parsedPersona;
      
      if (jsonMatch) {
        try {
          parsedPersona = JSON.parse(jsonMatch[0]);
        } catch (e) {
          // If parsing fails, return the raw content
          parsedPersona = { rawContent: content };
        }
      } else {
        parsedPersona = { rawContent: content };
      }
      
      // Store the persona in the database if userId is provided
      let savedPersona = null;
      if (validatedData.userId) {
        savedPersona = await storage.createLearningPersona({
          userId: validatedData.userId,
          name: parsedPersona.personaName || 'Learning Persona',
          description: parsedPersona.personaDescription || '',
          strengths: Array.isArray(parsedPersona.strengths) ? parsedPersona.strengths : [],
          strategies: Array.isArray(parsedPersona.strategies) ? parsedPersona.strategies : [],
          environments: Array.isArray(parsedPersona.environments) ? parsedPersona.environments : [],
          challenges: Array.isArray(parsedPersona.challenges) ? parsedPersona.challenges : [],
          superpower: parsedPersona.superpower || '',
          primaryStyle,
          secondaryStyle,
          neurotype: validatedData.neurotype || null,
        });
      }

      // Return the generated persona
      res.json({
        learningStyleResults: validatedData.learningStyleResults,
        primaryStyle,
        secondaryStyle,
        persona: parsedPersona,
        savedPersonaId: savedPersona?.id
      });
      
    } catch (error) {
      console.error('Error generating persona with Anthropic:', error);
      res.status(500).json({ error: 'Failed to generate learning persona', details: error.message });
    }
    
  } catch (error) {
    console.error('Error in persona generation request:', error);
    res.status(400).json({ error: 'Invalid persona generation request' });
  }
});

// Get learning style results for a user
router.get('/results/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const results = await storage.getLearningStyleResults(userId);
    res.json({ results });
    
  } catch (error) {
    console.error('Error fetching learning style results:', error);
    res.status(500).json({ error: 'Failed to fetch learning style results' });
  }
});

// Get learning personas for a user
router.get('/personas/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const personas = await storage.getLearningPersonas(userId);
    res.json({ personas });
    
  } catch (error) {
    console.error('Error fetching learning personas:', error);
    res.status(500).json({ error: 'Failed to fetch learning personas' });
  }
});

// Get specific learning persona by ID
router.get('/persona/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid persona ID' });
    }
    
    const persona = await storage.getLearningPersona(id);
    if (!persona) {
      return res.status(404).json({ error: 'Learning persona not found' });
    }
    
    res.json({ persona });
    
  } catch (error) {
    console.error('Error fetching learning persona:', error);
    res.status(500).json({ error: 'Failed to fetch learning persona' });
  }
});

// Save learning persona to user profile
router.post('/save-persona', async (req, res) => {
  try {
    const { userId, learningStyle, learningPersona } = req.body;
    
    // Validate request body
    if (!learningPersona) {
      return res.status(400).json({ error: 'Learning persona is required' });
    }
    
    // If no userId is provided, we'll just return success without saving
    // This allows for guest/demo usage
    if (!userId) {
      return res.json({ 
        success: true, 
        message: 'Learning persona processed (demo mode - not saved to profile)' 
      });
    }
    
    // Update user profile with learning style info
    try {
      const user = await storage.getUser(userId);
      if (user) {
        await storage.updateUser(userId, {
          ...user,
          learningStyle: learningStyle,
          learningPersona: typeof learningPersona === 'string' 
            ? learningPersona 
            : JSON.stringify(learningPersona)
        });
      }
    } catch (userError) {
      console.warn('Could not update user profile, but continuing:', userError);
    }
    
    // Store the persona in the learning_personas table
    let savedPersona = null;
    try {
      savedPersona = await storage.createLearningPersona({
        userId: userId,
        name: learningPersona.personaName || 'Learning Persona',
        description: learningPersona.personaDescription || '',
        strengths: Array.isArray(learningPersona.strengths) ? learningPersona.strengths : [],
        strategies: Array.isArray(learningPersona.strategies) ? learningPersona.strategies : [],
        environments: Array.isArray(learningPersona.environments) ? learningPersona.environments : [],
        challenges: Array.isArray(learningPersona.challenges) ? learningPersona.challenges : [],
        superpower: learningPersona.superpower || '',
        primaryStyle: learningStyle,
        secondaryStyle: learningPersona.secondaryStyle || '',
        neurotype: req.body.neurotype || null,
      });
    } catch (personaError) {
      console.warn('Could not save learning persona to database, but continuing:', personaError);
    }
    
    res.json({
      success: true,
      message: 'Learning persona saved to profile',
      savedPersonaId: savedPersona?.id
    });
    
  } catch (error) {
    console.error('Error saving learning persona to profile:', error);
    res.status(500).json({ error: 'Error saving learning persona to profile' });
  }
});

export default router;