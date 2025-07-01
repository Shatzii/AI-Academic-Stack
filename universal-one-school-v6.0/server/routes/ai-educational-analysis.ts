/**
 * AI Educational Analysis API
 * 
 * This module provides endpoints for AI-powered educational analysis
 * using the Anthropic Claude API.
 */

import { Router, Request, Response } from 'express';
import { AnthropicService } from '../anthropic-service';

const router = Router();

/**
 * Analyze educational content with AI
 * POST /api/ai/educational-analysis
 */
router.post('/educational-analysis', async (req: Request, res: Response) => {
  try {
    const { text, gradeLevel, subject, learningStyle, neurodivergentType } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }
    
    // Create a system prompt that instructs Claude to analyze educational content
    const systemPrompt = `
You are an expert educational analyst specializing in neurodivergent learning styles. 
Analyze the provided educational content with the following considerations:
- Grade Level: ${gradeLevel || 'Not specified'}
- Subject: ${subject || 'Not specified'}
- Learning Style Preference: ${learningStyle || 'Not specified'}
- Neurodivergent Type: ${neurodivergentType || 'Not specified'}

Provide a thorough analysis that includes:
1. Cognitive accessibility (1-5 rating)
2. Age-appropriateness (1-5 rating)
3. Key concepts identified
4. Potential comprehension challenges
5. Specific accommodation suggestions
6. Alternative teaching strategies
7. Visual/auditory/kinesthetic elements
8. Structure recommendations

Format your analysis as JSON with clear sections and ratings.
`;

    const response = await AnthropicService.generateText(text, {
      systemPrompt,
      maxTokens: 1500,
      temperature: 0.2
    });
    
    res.json({ analysis: response });
  } catch (error) {
    console.error('Error in educational analysis:', error);
    res.status(500).json({ error: 'Failed to analyze educational content' });
  }
});

/**
 * Generate personalized educational content
 * POST /api/ai/content-generation
 */
router.post('/content-generation', async (req: Request, res: Response) => {
  try {
    const { 
      topic, 
      gradeLevel, 
      subject, 
      learningStyle, 
      neurodivergentType,
      outputFormat,
      contentLength
    } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const systemPrompt = `
You are a specialized educational content creator for neurodivergent learners.
Create personalized content with these specifications:
- Topic: ${topic}
- Grade Level: ${gradeLevel || 'Middle School'}
- Subject: ${subject || 'General'}
- Learning Style: ${learningStyle || 'Visual'}
- Neurodivergent Type: ${neurodivergentType || 'ADHD'}
- Format: ${outputFormat || 'Text lesson'}
- Content Length: ${contentLength || 'Medium (500-800 words)'}

Your content should:
1. Use clear, concise language appropriate for the specified neurodivergent type
2. Include engaging examples and metaphors
3. Break information into digestible chunks
4. Provide visual cues through text formatting (if text-based)
5. Incorporate repetition of key concepts
6. Use a warm, encouraging tone
7. Include comprehension check points
8. Suggest multi-sensory engagement opportunities
`;

    const response = await AnthropicService.generateText(
      `Please create educational content about "${topic}" tailored for ${neurodivergentType || 'neurodivergent'} learners.`, 
      {
        systemPrompt,
        maxTokens: 2000,
        temperature: 0.7
      }
    );
    
    res.json({ content: response });
  } catch (error) {
    console.error('Error in content generation:', error);
    res.status(500).json({ error: 'Failed to generate educational content' });
  }
});

/**
 * Analyze educational diagram or image
 * POST /api/ai/image-analysis
 */
router.post('/image-analysis', async (req: Request, res: Response) => {
  try {
    // Check for file upload
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    
    const imageFile = req.files.image as any;
    const base64Image = imageFile.data.toString('base64');
    const imageType = imageFile.mimetype as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    
    // Additional parameters
    const { gradeLevel, subject } = req.body;
    
    const systemPrompt = `
You are an educational diagram and image analyzer specialized in creating accessible explanations for neurodivergent students.
When analyzing this educational image/diagram:
1. Describe the key visual elements 
2. Explain the main concepts presented
3. Clarify any complex relationships or processes shown
4. Suggest how this visual information could be made more accessible
5. Rate the visual clarity from 1-5
6. Identify any potential confusion points for neurodivergent learners

Consider these specifics:
- Grade Level: ${gradeLevel || 'Not specified'}
- Subject: ${subject || 'Not specified'}
`;

    // Create a prompt for analysis
    const promptText = "Please analyze this educational diagram or image for educational content and accessibility.";
    
    // Create options with the image data
    const multimodalOptions = {
      imageBase64: base64Image,
      imageType: imageType,
      systemPrompt,
      maxTokens: 1500,
    };
    
    const response = await AnthropicService.analyzeMultimodal(promptText, multimodalOptions);
    
    res.json({ analysis: response });
  } catch (error) {
    console.error('Error in image analysis:', error);
    res.status(500).json({ error: 'Failed to analyze educational image' });
  }
});

export default router;