/**
 * Neurodivergent Superhero School API Routes
 * 
 * This module provides API endpoints for the Neurodivergent Superhero School,
 * featuring specialized learning approaches and adaptive content for different
 * neurotypes.
 */

import express from 'express';
import { Anthropic } from '@anthropic-ai/sdk';

const router = express.Router();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Get available learning paths
router.get('/learning-paths', (req, res) => {
  res.json({
    success: true,
    learningPaths: [
      {
        id: 'visual-spatial',
        name: 'Visual-Spatial Explorer',
        description: 'Learning path optimized for visual-spatial strengths',
        suitableFor: ['ADHD', 'Autism', 'Visual learners'],
        subjects: ['Mathematics', 'Science', 'Art', 'Engineering']
      },
      {
        id: 'pattern-seeker',
        name: 'Pattern Seeker',
        description: 'Learning path focused on pattern recognition and logical reasoning',
        suitableFor: ['Autism', 'Dyslexia', 'Logical-mathematical learners'],
        subjects: ['Mathematics', 'Coding', 'Music', 'Chess']
      },
      {
        id: 'creative-connector',
        name: 'Creative Connector',
        description: 'Learning path that emphasizes creative connections and associations',
        suitableFor: ['ADHD', 'Dyslexia', 'Creative thinkers'],
        subjects: ['Literature', 'History', 'Art', 'Social Studies']
      },
      {
        id: 'hands-on-explorer',
        name: 'Hands-On Explorer',
        description: 'Learning path focused on kinesthetic learning and physical interaction',
        suitableFor: ['ADHD', 'Sensory processing differences', 'Kinesthetic learners'],
        subjects: ['Science', 'Physical Education', 'Engineering', 'Life Skills']
      }
    ]
  });
});

// Get available neurotype accommodation profiles
router.get('/neurotype-profiles', (req, res) => {
  res.json({
    success: true,
    neurotypes: [
      {
        id: 'adhd',
        name: 'ADHD',
        accommodations: [
          'Shorter learning segments',
          'Movement breaks',
          'Visual timers',
          'Interactive content',
          'Choice-based activities'
        ],
        strengths: [
          'Creativity',
          'Hyperfocus on interests',
          'Thinking outside the box',
          'High energy',
          'Adaptability'
        ]
      },
      {
        id: 'autism',
        name: 'Autism',
        accommodations: [
          'Predictable routines',
          'Visual schedules',
          'Sensory considerations',
          'Clear, direct instructions',
          'Special interest integration'
        ],
        strengths: [
          'Pattern recognition',
          'Detail orientation',
          'Deep focus',
          'Visual memory',
          'Logical thinking'
        ]
      },
      {
        id: 'dyslexia',
        name: 'Dyslexia',
        accommodations: [
          'Audio content options',
          'Dyslexia-friendly fonts',
          'Color overlays',
          'Speech-to-text tools',
          'Multisensory learning'
        ],
        strengths: [
          'Big-picture thinking',
          'Creativity',
          'Spatial reasoning',
          'Problem-solving',
          'Verbal communication'
        ]
      },
      {
        id: 'anxiety',
        name: 'Anxiety',
        accommodations: [
          'Preview of upcoming content',
          'Calm-down space',
          'Multiple attempts allowed',
          'Alternative assessment options',
          'Stress-reduction techniques'
        ],
        strengths: [
          'Attention to detail',
          'Preparation',
          'Empathy',
          'Conscientiousness',
          'Anticipating challenges'
        ]
      }
    ]
  });
});

// Generate adapted educational content
router.post('/generate/adapted-content', async (req, res) => {
  try {
    const { subject, topic, neurotype, level } = req.body;
    
    if (!subject || !topic || !neurotype || !level) {
      return res.status(400).json({
        success: false,
        error: 'Subject, topic, neurotype, and level are required'
      });
    }
    
    const prompt = `Create an educational lesson about "${topic}" in the subject "${subject}" for ${level} level students with ${neurotype} learning style.

Format the response as a JSON object with these fields:
- title: A clear, engaging title for the lesson
- introduction: A brief, accessible introduction to hook the student's interest
- keyPoints: Array of 3-5 main concepts to learn
- adaptations: Specific adaptations made for ${neurotype} learning style
- activities: Array of 2-3 engaging activities that leverage ${neurotype} strengths
- visuals: Descriptions of 2-3 helpful visual aids or diagrams
- assessment: A creative assessment method suitable for ${neurotype} learners
- extensions: Ideas for extending learning based on student interest

Ensure the content addresses common challenges for ${neurotype} learners while leveraging their typical strengths. Use clear language, chunked information, and multisensory approaches.`;

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
      const adaptedContent = JSON.parse(jsonContent);
      
      res.json({
        success: true,
        adaptedContent
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
    console.error('Adapted content generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate sensory break activities
router.post('/generate/sensory-breaks', async (req, res) => {
  try {
    const { sensorySensitivity, environment, duration } = req.body;
    
    if (!environment || !duration) {
      return res.status(400).json({
        success: false,
        error: 'Environment and duration are required'
      });
    }
    
    const sensoryProfile = sensorySensitivity || 'mixed';
    
    const prompt = `Generate a list of sensory break activities suitable for a neurodivergent student with ${sensoryProfile} sensory sensitivity, in a ${environment} environment, lasting approximately ${duration} minutes.

Format the response as a JSON object with these fields:
- title: A title for this sensory break collection
- activities: Array of activity objects, each with:
  - name: Brief name of the activity
  - description: How to perform the activity
  - sensorySystems: Array of sensory systems involved (vestibular, proprioceptive, tactile, visual, auditory)
  - materials: Array of needed materials, if any
  - duration: Approximate time in minutes
  - adaptations: Possible adaptations for different needs
- tips: Array of general tips for implementing sensory breaks`;

    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219', // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      max_tokens: 1000,
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
      const sensoryBreaks = JSON.parse(jsonContent);
      
      res.json({
        success: true,
        sensoryBreaks
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
    console.error('Sensory break generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate special interest exploration
router.post('/generate/interest-exploration', async (req, res) => {
  try {
    const { interest, academicSubjects, level } = req.body;
    
    if (!interest || !academicSubjects || !level) {
      return res.status(400).json({
        success: false,
        error: 'Interest, academic subjects, and level are required'
      });
    }
    
    // Ensure academicSubjects is an array
    const subjects = Array.isArray(academicSubjects) ? academicSubjects : [academicSubjects];
    
    const prompt = `Create an educational exploration plan connecting a student's special interest in "${interest}" to the academic subjects: ${subjects.join(', ')} at ${level} level.

Format the response as a JSON object with these fields:
- title: An engaging title for this exploration plan
- overview: Brief explanation of how ${interest} connects to the academic subjects
- connections: Array of objects, each with:
  - subject: One of the academic subjects
  - connections: Array of specific connections between the interest and subject
  - activities: Array of learning activities leveraging this connection
- project: A culminating project idea that synthesizes the subjects through the lens of the interest
- resources: Array of resources (books, websites, videos) related to the interest
- extensions: Ideas for further exploration`;

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
      const interestExploration = JSON.parse(jsonContent);
      
      res.json({
        success: true,
        interestExploration
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
    console.error('Interest exploration generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;