/**
 * Language Learning School API Routes
 * 
 * This module provides API endpoints for language learning functionality,
 * including vocabulary generation, conversation practice, and cultural lessons.
 */

import express from 'express';
import { Anthropic } from '@anthropic-ai/sdk';

const router = express.Router();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Get supported languages
router.get('/languages', (req, res) => {
  res.json({
    success: true,
    languages: [
      {
        code: 'es',
        name: 'Spanish',
        levels: ['beginner', 'intermediate', 'advanced'],
        available: true
      },
      {
        code: 'de',
        name: 'German',
        levels: ['beginner', 'intermediate', 'advanced'],
        available: true
      },
      {
        code: 'fr',
        name: 'French',
        levels: ['beginner', 'intermediate', 'advanced'],
        available: true
      },
      {
        code: 'it',
        name: 'Italian',
        levels: ['beginner', 'intermediate', 'advanced'],
        available: true
      },
      {
        code: 'ja',
        name: 'Japanese',
        levels: ['beginner', 'intermediate'],
        available: true
      },
      {
        code: 'zh',
        name: 'Chinese',
        levels: ['beginner', 'intermediate'],
        available: true
      },
      {
        code: 'ru',
        name: 'Russian',
        levels: ['beginner'],
        available: true
      }
    ]
  });
});

// Generate vocabulary list
router.post('/generate/vocabulary', async (req, res) => {
  try {
    const { language, topic, level } = req.body;
    
    if (!language || !topic || !level) {
      return res.status(400).json({ 
        success: false, 
        error: 'Language, topic, and level are required' 
      });
    }
    
    const prompt = `Generate a vocabulary list for ${language} language learners at ${level} level about the topic "${topic}".
Format as a JSON array with objects containing these fields:
- word: the vocabulary word in ${language}
- translation: the English translation
- pronunciation: pronunciation guide in simplified phonetics
- example: a short example sentence using the word
- notes: brief usage notes or cultural context

Keep the list to 10 words maximum and ensure the vocabulary is appropriate for ${level} level learners.`;
    
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219', // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      max_tokens: 1000,
      messages: [
        { role: 'user', content: prompt }
      ],
    });
    
    // Try to extract JSON from the response
    try {
      const content = response.content[0].text;
      // Find JSON in the content (it might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) || 
                        [null, content];
      
      const jsonContent = jsonMatch[1];
      const vocabularyList = JSON.parse(jsonContent);
      
      res.json({ 
        success: true, 
        vocabulary: vocabularyList
      });
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to parse AI response as JSON',
        rawResponse: response.content[0].text
      });
    }
  } catch (error) {
    console.error('Vocabulary generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
});

// Generate dialogue
router.post('/generate/dialogue', async (req, res) => {
  try {
    const { language, scenario, level } = req.body;
    
    if (!language || !scenario || !level) {
      return res.status(400).json({
        success: false,
        error: 'Language, scenario, and level are required'
      });
    }
    
    const prompt = `Create a realistic dialogue in ${language} for ${level} level learners in the scenario: "${scenario}".
The dialogue should include at least 2 speakers and be 10-15 exchanges long.
Format the response as a JSON object with these fields:
- title: A title for the dialogue
- scenario: A brief description of the scenario
- speakers: Array of speaker names
- exchanges: Array of objects, each with "speaker" and "text" fields
- vocabulary: Array of 5-8 key vocabulary words with translations
- grammar: Array of 1-3 grammar points demonstrated in the dialogue
- comprehensionQuestions: Array of 3 questions about the dialogue with answers

Include translations for each exchange. For beginner level, keep sentences simple. 
For intermediate and advanced levels, introduce more complex grammar and vocabulary.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219', // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      max_tokens: 1500,
      messages: [
        { role: 'user', content: prompt }
      ],
    });
    
    // Extract JSON from the response
    try {
      const content = response.content[0].text;
      // Find JSON in the content
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) || 
                        [null, content];
      
      const jsonContent = jsonMatch[1];
      const dialogue = JSON.parse(jsonContent);
      
      res.json({
        success: true,
        dialogue
      });
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      res.status(500).json({
        success: false,
        error: 'Failed to parse AI response as JSON',
        rawResponse: response.content[0].text
      });
    }
  } catch (error) {
    console.error('Dialogue generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate cultural lesson
router.post('/generate/cultural-lesson', async (req, res) => {
  try {
    const { language, topic, level } = req.body;
    
    if (!language || !topic || !level) {
      return res.status(400).json({
        success: false,
        error: 'Language, topic, and level are required'
      });
    }
    
    const prompt = `Create a cultural lesson about ${topic} for ${language} language learners at ${level} level.
Format the response as a JSON object with these fields:
- title: A title for the cultural lesson
- introduction: Brief introduction to the topic
- keyPoints: Array of main cultural points
- vocabulary: Array of 5-8 culturally relevant vocabulary words with translations
- culturalNotes: Array of interesting cultural notes or comparisons
- activities: Array of 2-3 suggested learning activities
- resources: Array of 2-3 suggested additional resources (books, websites, videos)

The content should be appropriate for ${level} level language learners, with complexity adjusted accordingly.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219', // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      max_tokens: 1500,
      messages: [
        { role: 'user', content: prompt }
      ],
    });
    
    // Extract JSON from the response
    try {
      const content = response.content[0].text;
      // Find JSON in the content
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) || 
                        [null, content];
      
      const jsonContent = jsonMatch[1];
      const culturalLesson = JSON.parse(jsonContent);
      
      res.json({
        success: true,
        culturalLesson
      });
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      res.status(500).json({
        success: false,
        error: 'Failed to parse AI response as JSON',
        rawResponse: response.content[0].text
      });
    }
  } catch (error) {
    console.error('Cultural lesson generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;