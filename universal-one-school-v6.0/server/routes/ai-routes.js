/**
 * AI Routes for ShatziiOS
 * 
 * This module provides AI-related functionality for the ShatziiOS platform,
 * handling requests for AI teacher creation, tutoring sessions, and other
 * AI-powered educational features.
 */

import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

// Create router
const router = express.Router();

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Log all AI API requests
router.use((req, res, next) => {
  console.log(`[AI API] ${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Status endpoint to check if the AI API is running
router.get('/status', async (req, res) => {
  try {
    // Check if we have the necessary API keys
    const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
    
    // Optional: Perform a basic test of Anthropic API if the key is available
    let anthropicStatus = { available: false, message: 'API key not provided' };
    
    if (hasAnthropicKey) {
      try {
        // Small test message to verify API functionality
        const message = await anthropic.messages.create({
          max_tokens: 1024,
          messages: [{ role: 'user', content: 'Hello from ShatziiOS! (respond in one short sentence)' }],
          model: 'claude-3-7-sonnet-20250219',
        });
        
        anthropicStatus = { 
          available: true, 
          message: 'API functioning correctly',
          sample_response: message.content[0].text.substring(0, 100) // Truncate for brevity
        };
      } catch (error) {
        anthropicStatus = { 
          available: false, 
          message: 'API key present but error connecting to Anthropic API',
          error: error.message
        };
      }
    }
    
    res.json({
      status: 'ok',
      message: 'ShatziiOS AI API is running',
      timestamp: new Date().toISOString(),
      apis: {
        anthropic: anthropicStatus
      }
    });
  } catch (error) {
    console.error('Error in status endpoint:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error checking API status',
      error: error.message
    });
  }
});

// Create AI Teacher endpoint
router.post('/create-teacher', async (req, res) => {
  try {
    const { subject, gradeLevel, teachingStyle, neurotype } = req.body;
    
    if (!subject || !gradeLevel || !teachingStyle) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameters: subject, gradeLevel, and teachingStyle are required'
      });
    }
    
    console.log('Creating AI teacher with config:', req.body);
    
    // Create the AI teacher using Anthropic Claude
    const prompt = `
      I need you to create an AI teacher profile with the following characteristics:
      - Subject: ${subject}
      - Grade Level: ${gradeLevel}
      - Teaching Style: ${teachingStyle}
      ${neurotype ? `- Specialized for students with: ${neurotype}` : ''}
      
      Please generate a complete teacher profile including:
      1. A suitable name
      2. A brief introduction/bio
      3. Teaching philosophy
      4. Key strategies for helping students succeed
      5. Specialization areas within the subject
      
      Format the response as JSON with the fields: name, bio, philosophy, strategies, specializations
    `;
    
    // Call Anthropic API
    const message = await anthropic.messages.create({
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-3-7-sonnet-20250219',
    });
    
    // Parse the JSON response
    // First, find any JSON object in the response
    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const teacherProfile = JSON.parse(jsonMatch[0]);
        
        // Add the original configuration
        teacherProfile.config = {
          subject,
          gradeLevel,
          teachingStyle,
          neurotype: neurotype || null
        };
        
        res.json({
          status: 'success',
          message: 'AI teacher created successfully',
          teacher: teacherProfile
        });
      } catch (parseError) {
        console.error('Error parsing JSON from Anthropic response:', parseError);
        res.status(500).json({
          status: 'error',
          message: 'Error parsing AI response',
          rawResponse: responseText
        });
      }
    } else {
      console.error('No JSON found in Anthropic response');
      res.status(500).json({
        status: 'error',
        message: 'AI did not return a proper JSON response',
        rawResponse: responseText
      });
    }
  } catch (error) {
    console.error('Error creating AI teacher:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating AI teacher',
      error: error.message
    });
  }
});

// AI Teacher Response endpoint
router.post('/teacher-response', async (req, res) => {
  try {
    const { teacherConfig, conversationHistory, userMessage } = req.body;
    
    if (!teacherConfig || !userMessage) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameters: teacherConfig and userMessage are required'
      });
    }
    
    console.log('Getting AI teacher response for:', {
      teacherConfig,
      messageLength: userMessage.length
    });
    
    // Convert conversation history to Anthropic format
    const messages = [];
    
    // Add system message with teacher persona
    const systemMessage = `
      You are ${teacherConfig.name}, an AI teacher with the following characteristics:
      - Subject: ${teacherConfig.config.subject}
      - Grade Level: ${teacherConfig.config.gradeLevel}
      - Teaching Style: ${teacherConfig.config.teachingStyle}
      ${teacherConfig.config.neurotype ? `- Specialized for students with: ${teacherConfig.config.neurotype}` : ''}
      
      Your teaching philosophy: ${teacherConfig.philosophy}
      
      Your specializations include: ${teacherConfig.specializations.join(', ')}
      
      When responding to students, use these strategies: ${teacherConfig.strategies.join(', ')}
      
      Respond to the student's question or comment in a helpful, educational manner
      consistent with your teaching style and philosophy. Be encouraging and supportive.
      Focus on explaining concepts clearly and providing examples when appropriate.
    `;
    
    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role, // 'user' or 'assistant'
          content: msg.content
        });
      });
    }
    
    // Add the current user message
    messages.push({
      role: 'user',
      content: userMessage
    });
    
    // Call Anthropic API
    const response = await anthropic.messages.create({
      max_tokens: 1024,
      system: systemMessage,
      messages: messages,
      model: 'claude-3-7-sonnet-20250219',
    });
    
    res.json({
      status: 'success',
      message: 'AI teacher response generated successfully',
      response: {
        role: 'assistant',
        content: response.content[0].text,
        teacher: teacherConfig.name
      }
    });
  } catch (error) {
    console.error('Error generating AI teacher response:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating AI teacher response',
      error: error.message
    });
  }
});

// Learning Plan Generation endpoint
router.post('/learning-plan', async (req, res) => {
  try {
    const { subject, gradeLevel, learningStyle, interests, goals, neurotype } = req.body;
    
    if (!subject || !gradeLevel) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameters: subject and gradeLevel are required'
      });
    }
    
    console.log('Generating learning plan with parameters:', req.body);
    
    // Generate the learning plan using Anthropic Claude
    const prompt = `
      Generate a personalized learning plan with the following parameters:
      - Subject: ${subject}
      - Grade Level: ${gradeLevel}
      - Learning Style: ${learningStyle || 'Not specified'}
      - Student Interests: ${interests || 'Not specified'}
      - Learning Goals: ${goals || 'Not specified'}
      ${neurotype ? `- Adaptations for: ${neurotype}` : ''}
      
      Please create a comprehensive learning plan including:
      1. Learning objectives
      2. Key topics and concepts
      3. Suggested learning activities
      4. Resources and materials
      5. Assessment methods
      6. Timeline with milestones
      
      Format the response as JSON with the fields: objectives, topics, activities, resources, assessment, timeline
    `;
    
    // Call Anthropic API
    const message = await anthropic.messages.create({
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-3-7-sonnet-20250219',
    });
    
    // Parse the JSON response
    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const learningPlan = JSON.parse(jsonMatch[0]);
        
        // Add the original configuration
        learningPlan.config = {
          subject,
          gradeLevel,
          learningStyle: learningStyle || null,
          interests: interests || null,
          goals: goals || null,
          neurotype: neurotype || null
        };
        
        res.json({
          status: 'success',
          message: 'Learning plan generated successfully',
          plan: learningPlan
        });
      } catch (parseError) {
        console.error('Error parsing JSON from Anthropic response:', parseError);
        res.status(500).json({
          status: 'error',
          message: 'Error parsing AI response',
          rawResponse: responseText
        });
      }
    } else {
      console.error('No JSON found in Anthropic response');
      res.status(500).json({
        status: 'error',
        message: 'AI did not return a proper JSON response',
        rawResponse: responseText
      });
    }
  } catch (error) {
    console.error('Error generating learning plan:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating learning plan',
      error: error.message
    });
  }
});

export default router;