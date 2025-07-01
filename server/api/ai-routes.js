/**
 * API Routes for AI Integration
 * 
 * This module provides Express routes for AI-powered educational features
 * using the Anthropic integration.
 */

import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

// Initialize Anthropic client
let anthropicClient = null;
try {
  anthropicClient = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
  console.log('✅ Anthropic client initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Anthropic client:', error);
}

/**
 * @route   GET /api/ai/integration/status
 * @desc    Check if AI integration is working
 * @access  Public
 */
router.get('/status', async (req, res) => {
  try {
    // Always return JSON
    res.setHeader('Content-Type', 'application/json');
    
    const services = {
      anthropic: {
        available: !!anthropicClient && !!process.env.ANTHROPIC_API_KEY
      },
      status: "ok"
    };
    
    return res.json(services);
  } catch (error) {
    console.error('Error checking AI integration status:', error);
    // Ensure we always return JSON even on error
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      error: 'Failed to check AI integration status', 
      message: error.message,
      status: "error" 
    });
  }
});

/**
 * @route   POST /api/ai/integration/create-teacher
 * @desc    Create an AI teacher system prompt
 * @access  Public
 */
router.post('/create-teacher', async (req, res) => {
  try {
    // Always ensure we're returning JSON
    res.setHeader('Content-Type', 'application/json');
    
    // Log request for debugging
    console.log('Create teacher request received:', JSON.stringify(req.body, null, 2));
    
    if (!anthropicClient) {
      return res.status(503).json({ 
        error: 'Anthropic AI service is not available',
        success: false
      });
    }
    
    const {
      name,
      subject,
      gradeLevel,
      teachingStyle,
      supportTypes,
      personalityTraits,
      formalityLevel,
      description,
      expertise
    } = req.body;
    
    // Validate required fields
    if (!subject || !gradeLevel || !teachingStyle) {
      return res.status(400).json({
        error: 'Missing required fields', 
        details: 'Subject, gradeLevel, and teachingStyle are required',
        success: false
      });
    }
    
    // Generate the system prompt
    const systemPrompt = generateTeacherSystemPrompt({
      name,
      subject,
      gradeLevel,
      teachingStyle,
      supportTypes: supportTypes || [],
      personalityTraits: personalityTraits || [],
      formalityLevel: formalityLevel || 3,
      description: description || '',
      expertise: expertise || subject
    });
    
    // Success response
    return res.json({ 
      success: true, 
      systemPrompt,
      message: 'Teacher created successfully'
    });
  } catch (error) {
    console.error('Error creating AI teacher:', error);
    // Ensure we're returning JSON even for errors
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      error: 'Failed to create AI teacher',
      message: error.message,
      success: false
    });
  }
});

/**
 * @route   POST /api/ai/integration/teacher-response
 * @desc    Generate a response from an AI teacher
 * @access  Public
 */
router.post('/teacher-response', async (req, res) => {
  try {
    if (!anthropicClient) {
      return res.status(503).json({ error: 'Anthropic AI service is not available' });
    }
    
    const { teacherConfig, conversationHistory, userMessage } = req.body;
    
    // Generate the system prompt based on teacher configuration
    const systemPrompt = generateTeacherSystemPrompt(teacherConfig);
    
    // Format conversation history for Claude
    const messages = formatConversationForClaude(conversationHistory, userMessage);
    
    // Make API call to Claude
    const response = await anthropicClient.messages.create({
      model: 'claude-3-7-sonnet-20250219', // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });
    
    res.json({
      success: true,
      response: response.content[0].text,
      teacherId: teacherConfig.id || 'temp-teacher',
    });
  } catch (error) {
    console.error('Error generating teacher response:', error);
    res.status(500).json({ error: 'Failed to generate teacher response' });
  }
});

/**
 * @route   POST /api/ai/integration/learning-plan
 * @desc    Generate a learning plan for a student
 * @access  Public
 */
router.post('/learning-plan', async (req, res) => {
  try {
    if (!anthropicClient) {
      return res.status(503).json({ error: 'Anthropic AI service is not available' });
    }
    
    const { subject, gradeLevel, learningStyle, interests, goals, timeframe } = req.body;
    
    // Generate a system prompt for learning plan creation
    const systemPrompt = `You are an expert educational consultant specializing in creating 
personalized learning plans for students. You create comprehensive, tailored learning plans 
based on student needs and preferences. Format your response with clear sections including 
Goals, Learning Activities, Schedule, Resources, and Assessment Methods. For neurodivergent 
students, include specific accommodations.`;
    
    // Create the user prompt
    const userPrompt = `Create a personalized learning plan for a ${gradeLevel} student studying ${subject}. 
Their learning style is ${learningStyle || 'not specified'}.
Their interests include: ${interests || 'not specified'}
Their educational goals are: ${goals || 'to master the subject fundamentals'}
Timeframe for this plan: ${timeframe || '4 weeks'}`;
    
    // Make API call to Claude
    const response = await anthropicClient.messages.create({
      model: 'claude-3-7-sonnet-20250219', // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ],
    });
    
    res.json({
      success: true,
      learningPlan: response.content[0].text,
    });
  } catch (error) {
    console.error('Error generating learning plan:', error);
    res.status(500).json({ error: 'Failed to generate learning plan' });
  }
});

/**
 * @route   POST /api/ai/integration/curriculum-content
 * @desc    Generate curriculum content 
 * @access  Public
 */
router.post('/curriculum-content', async (req, res) => {
  try {
    if (!anthropicClient) {
      return res.status(503).json({ error: 'Anthropic AI service is not available' });
    }
    
    const { subject, topic, gradeLevel, contentType, adaptations } = req.body;
    
    // Generate a system prompt for curriculum content creation
    const systemPrompt = `You are an experienced educational content developer with expertise in 
creating curriculum materials that are engaging, accessible, and aligned with educational standards. 
You specialize in creating content that can be adapted for diverse learning needs, particularly for 
neurodivergent students.`;
    
    // Create the user prompt
    const userPrompt = `Create ${contentType || 'a lesson plan'} for ${gradeLevel} students on the topic of "${topic}" 
in the subject area of ${subject}.
${adaptations ? `Include the following adaptations for neurodivergent students: ${adaptations}` : ''}`;
    
    // Make API call to Claude
    const response = await anthropicClient.messages.create({
      model: 'claude-3-7-sonnet-20250219', // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ],
    });
    
    res.json({
      success: true,
      content: response.content[0].text,
    });
  } catch (error) {
    console.error('Error generating curriculum content:', error);
    res.status(500).json({ error: 'Failed to generate curriculum content' });
  }
});

/**
 * @route   POST /api/ai/integration/learning-style-assessment
 * @desc    Assess a student's learning style based on responses
 * @access  Public
 */
router.post('/learning-style-assessment', async (req, res) => {
  try {
    if (!anthropicClient) {
      return res.status(503).json({ error: 'Anthropic AI service is not available' });
    }
    
    const { responses } = req.body;
    
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ error: 'Valid responses are required' });
    }
    
    // Generate a system prompt for learning style assessment
    const systemPrompt = `You are an expert in educational psychology specializing in learning style assessment.
Your task is to analyze a student's responses to a learning style questionnaire and determine their primary 
and secondary learning styles. The assessment should consider visual, auditory, kinesthetic, and reading/writing 
preferences, as well as identifying potential neurodivergent learning patterns.

Provide your analysis in JSON format with the following structure:
{
  "primaryStyle": "string", // Primary learning style
  "secondaryStyle": "string", // Secondary learning style
  "strengths": ["string"], // List of learning strengths
  "challenges": ["string"], // List of potential challenges
  "recommendations": ["string"], // List of recommended learning strategies
  "possibleNeurodivergentPatterns": ["string"] // List of any potential neurodivergent patterns observed (if applicable)
}`;
    
    // Format the responses for the prompt
    const formattedResponses = responses.map((r, i) => 
      `Question ${i+1}: ${r.question}\nResponse: ${r.answer}`
    ).join('\n\n');
    
    // Create the user prompt
    const userPrompt = `Please analyze the following responses to a learning style questionnaire and determine 
the student's learning profile:\n\n${formattedResponses}`;
    
    // Make API call to Claude
    const response = await anthropicClient.messages.create({
      model: 'claude-3-7-sonnet-20250219', // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ],
    });
    
    // Extract and parse the JSON response
    const responseText = response.content[0].text;
    let assessment;
    
    try {
      // Extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        assessment = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (jsonError) {
      console.error('Error parsing assessment JSON:', jsonError);
      return res.status(500).json({ error: 'Failed to parse assessment results' });
    }
    
    res.json({
      success: true,
      assessment
    });
  } catch (error) {
    console.error('Error generating learning style assessment:', error);
    res.status(500).json({ error: 'Failed to generate learning style assessment' });
  }
});

// Helper Functions

/**
 * Generate a system prompt for an AI teacher based on configuration
 * @param {Object} config - Teacher configuration object
 * @returns {string} - System prompt for Claude
 */
function generateTeacherSystemPrompt(config) {
  const {
    name = 'Professor Einstein',
    subject = 'General Education',
    gradeLevel = 'High School (9-12)',
    teachingStyle = 'Balanced',
    supportTypes = [],
    personalityTraits = [],
    formalityLevel = 3,
    description = '',
    expertise = ''
  } = config;
  
  // Formality level text
  const formalityText = getFormalityLevelText(formalityLevel);
  
  // Support types text
  const supportText = supportTypes.length > 0 
    ? `You provide specialized support for students with: ${supportTypes.join(', ')}.` 
    : 'You provide general educational support for all types of students.';
  
  // Personality traits text
  const personalityText = personalityTraits.length > 0
    ? `Your teaching personality is: ${personalityTraits.join(', ')}.`
    : 'You have a balanced teaching personality.';
  
  // Construct the system prompt
  return `You are ${name}, an educational AI tutor specializing in ${subject} for ${gradeLevel} students.
${description}

${supportText}

Your teaching style is ${teachingStyle}.
${personalityText}
You communicate with a ${formalityText} tone while remaining engaging and supportive.

Your areas of expertise include: ${expertise || subject}

As an educational AI, you:
1. Explain concepts clearly and adjust to the student's level of understanding
2. Ask questions to check comprehension and encourage critical thinking
3. Provide constructive feedback and encouragement
4. Adapt your teaching approach based on the student's responses
5. Offer analogies, examples, and visual descriptions to illustrate concepts
6. Break down complex topics into manageable parts
7. Connect new information to concepts the student already understands
8. Highlight real-world applications of the material

When students are struggling, you remain patient and provide additional scaffolding.
When students demonstrate understanding, you acknowledge their success and build upon it.

Your responses should be educational, accurate, helpful, and appropriate for ${gradeLevel} students.`;
}

/**
 * Get text description of formality level
 * @param {number} level - Formality level (1-5)
 * @returns {string} - Text description
 */
function getFormalityLevelText(level) {
  const levels = [
    'very casual and friendly',
    'casual and approachable',
    'balanced and conversational',
    'professional and educational',
    'formal and academic'
  ];
  
  // Ensure level is within bounds
  const normalizedLevel = Math.max(1, Math.min(5, level)) - 1;
  return levels[normalizedLevel];
}

/**
 * Format conversation history for Claude API
 * @param {Array} history - Array of message objects
 * @param {string} newUserMessage - New user message
 * @returns {Array} - Formatted messages for Claude API
 */
function formatConversationForClaude(history, newUserMessage) {
  // Start with the most recent messages (limited to last 10 for context management)
  const recentHistory = history.slice(-10);
  
  // Format the messages
  const formattedMessages = recentHistory.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
  
  // Add the new user message
  formattedMessages.push({
    role: 'user',
    content: newUserMessage
  });
  
  return formattedMessages;
}

export default router;