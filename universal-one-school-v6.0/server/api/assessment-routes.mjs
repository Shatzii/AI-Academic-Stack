/**
 * Learning Assessment API Routes
 * 
 * This module provides API endpoints for the personalized learning assessment system
 * that helps identify learning styles, preferences, and challenges for neurodivergent
 * learners across all educational programs.
 */

import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { storage } from '../storage.js';

const router = express.Router();

// Initialize Anthropic client (if API key is available)
let anthropic = null;
try {
  if (process.env.ANTHROPIC_API_KEY) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    console.log('✅ Anthropic client initialized for assessment system');
  } else {
    console.log('⚠️ ANTHROPIC_API_KEY not available, AI assessment features will be limited');
  }
} catch (error) {
  console.error('❌ Error initializing Anthropic client:', error);
}

// Constants
const CLAUDE_MODEL = 'claude-3-7-sonnet-20250219'; // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025

/**
 * @route   GET /api/assessment/styles
 * @desc    Get all supported learning styles
 * @access  Public
 */
router.get('/styles', (req, res) => {
  try {
    const styles = {
      visual: {
        id: 'visual',
        name: 'Visual Learner',
        description: 'You learn best through visual aids like pictures, diagrams, and spatial organization. You benefit from seeing information presented visually and may think in pictures.',
        icon: '👁️',
        color: '#4287f5',
        strategies: [
          'Use color coding for notes and information',
          'Create mind maps and visual diagrams',
          'Watch educational videos',
          'Use flashcards with images',
          'Visualize concepts in your mind'
        ]
      },
      auditory: {
        id: 'auditory',
        name: 'Auditory Learner',
        description: 'You learn best by hearing and listening. You benefit from discussions, verbal instructions, and talking things through. You may repeat things out loud to understand them better.',
        icon: '👂',
        color: '#f54842',
        strategies: [
          'Record and listen to lectures',
          'Discuss concepts with others',
          'Read material aloud',
          'Use verbal mnemonics and rhymes',
          'Listen to educational podcasts'
        ]
      },
      kinesthetic: {
        id: 'kinesthetic',
        name: 'Kinesthetic Learner',
        description: 'You learn best through physical experiences and hands-on activities. You benefit from movement, touch, and practical applications. You prefer to learn by doing rather than watching or listening.',
        icon: '✋',
        color: '#42f56f',
        strategies: [
          'Use hands-on experiments and activities',
          'Take frequent movement breaks',
          'Use physical objects when learning',
          'Act out concepts when possible',
          'Create models or dioramas'
        ]
      },
      reading: {
        id: 'reading',
        name: 'Reading/Writing Learner',
        description: 'You learn best through reading and writing. You benefit from taking detailed notes and prefer text-based information. You process information well when it is presented in written form.',
        icon: '📚',
        color: '#f5a742',
        strategies: [
          'Take detailed written notes',
          'Rewrite information in your own words',
          'Create lists and outlines',
          'Use written summaries and descriptions',
          'Read textbooks and reference materials'
        ]
      },
      multimodal: {
        id: 'multimodal',
        name: 'Multimodal Learner',
        description: 'You have a flexible learning style, using multiple modes of learning depending on the situation. You can adapt to different teaching styles and benefit from varied presentation of information.',
        icon: '🔄',
        color: '#a142f5',
        strategies: [
          'Vary your study methods',
          'Combine visual, auditory, and kinesthetic techniques',
          'Adapt your approach based on the subject',
          'Create multi-sensory study materials',
          'Use technology that offers multiple formats'
        ]
      }
    };

    res.json({ status: 'success', styles });
  } catch (error) {
    console.error('Error getting learning styles:', error);
    res.status(500).json({ status: 'error', message: 'Server error retrieving learning styles' });
  }
});

/**
 * @route   GET /api/assessment/neurotypes
 * @desc    Get all supported neurotypes
 * @access  Public
 */
router.get('/neurotypes', (req, res) => {
  try {
    const neurotypes = {
      adhd: {
        id: 'adhd',
        name: 'ADHD',
        fullName: 'Attention-Deficit/Hyperactivity Disorder',
        description: 'Affects attention, activity levels, and impulse control.',
        strengths: [
          'Creativity and innovative thinking',
          'Hyperfocus on interests',
          'High energy and enthusiasm',
          'Adaptability and flexibility',
          'Quick information processing'
        ],
        challenges: [
          'Sustaining attention on non-preferred tasks',
          'Time management and organization',
          'Working memory challenges',
          'Impulsivity and emotional regulation',
          'Managing distractions and stimuli'
        ],
        icon: '⚡',
        color: '#ff9500'
      },
      dyslexia: {
        id: 'dyslexia',
        name: 'Dyslexia',
        fullName: 'Developmental Reading Disorder',
        description: 'Affects reading, spelling, and sometimes writing.',
        strengths: [
          'Creative problem-solving',
          'Visual-spatial reasoning',
          'Big-picture thinking',
          'Pattern recognition',
          'Verbal communication skills'
        ],
        challenges: [
          'Decoding written words',
          'Reading fluency and comprehension',
          'Spelling consistency',
          'Phonological processing',
          'Sequential memory tasks'
        ],
        icon: '📖',
        color: '#4287f5'
      },
      autism: {
        id: 'autism',
        name: 'Autism Spectrum',
        fullName: 'Autism Spectrum Disorder',
        description: 'Affects social communication and includes restricted interests or repetitive behaviors.',
        strengths: [
          'Attention to detail',
          'Pattern recognition and systematic thinking',
          'Deep knowledge in areas of interest',
          'Logical reasoning abilities',
          'Unique perspectives and creative insights'
        ],
        challenges: [
          'Social communication interpretation',
          'Sensory sensitivities',
          'Transitions and unexpected changes',
          'Executive functioning tasks',
          'Understanding unwritten social rules'
        ],
        icon: '🧩',
        color: '#42b0f5'
      },
      multiple: {
        id: 'multiple',
        name: 'Multiple Neurodivergences',
        fullName: 'Co-occurring Neurodevelopmental Differences',
        description: 'A combination of two or more neurodevelopmental differences, creating a unique profile.',
        strengths: [
          'Unique cognitive flexibility',
          'Creative compensation strategies',
          'Diverse thinking and problem-solving approaches',
          'Adaptability from navigating different challenges',
          'Heightened self-awareness'
        ],
        challenges: [
          'Complex support needs across domains',
          'Overlapping challenges can amplify difficulties',
          'Finding strategies that work for multiple needs',
          'Explaining needs to others',
          'Accessing appropriate accommodations'
        ],
        icon: '🔄',
        color: '#a142f5'
      }
    };

    res.json({ status: 'success', neurotypes });
  } catch (error) {
    console.error('Error getting neurotypes:', error);
    res.status(500).json({ status: 'error', message: 'Server error retrieving neurotypes' });
  }
});

/**
 * @route   POST /api/assessment/learning-style-quiz/submit
 * @desc    Submit learning style quiz answers
 * @access  Private
 */
router.post('/learning-style-quiz/submit', async (req, res) => {
  try {
    const { userId, responses, age, gradeLevel, neurotype } = req.body;
    
    if (!userId || !responses || !responses.length) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required data: userId and quiz responses are required' 
      });
    }

    // Calculate simple score based on responses
    const scores = {
      visual: 0,
      auditory: 0,
      kinesthetic: 0,
      reading: 0,
      multimodal: 0
    };

    // Process responses
    responses.forEach(response => {
      if (response.selectedStyle) {
        scores[response.selectedStyle]++;
      }
    });

    // Find primary and secondary styles
    let primaryStyle = 'visual'; // Default
    let secondaryStyle = 'visual'; // Default
    let maxScore = 0;
    let secondMaxScore = 0;

    for (const [style, score] of Object.entries(scores)) {
      if (score > maxScore) {
        secondaryStyle = primaryStyle;
        secondMaxScore = maxScore;
        primaryStyle = style;
        maxScore = score;
      } else if (score > secondMaxScore && style !== primaryStyle) {
        secondaryStyle = style;
        secondMaxScore = score;
      }
    }

    // If max score is relatively low, mark as multimodal
    if (maxScore <= responses.length / 4) {
      primaryStyle = 'multimodal';
    }

    // Create result object
    const resultData = {
      userId,
      results: scores,
      primaryStyle,
      secondaryStyle,
      additionalInfo: '',
      age: age || null,
      gradeLevel: gradeLevel || null,
      neurotype: neurotype || null,
      personaGenerated: false
    };

    // Save to database
    const savedResult = await storage.createLearningStyleResult(resultData);

    // Generate AI assessment if available
    if (anthropic) {
      try {
        const aiAssessmentResult = await generateAIAssessment(responses, savedResult);
        
        // Update the saved result with AI analysis
        const updatedResult = await storage.updateLearningStyleResult(savedResult.id, {
          additionalInfo: JSON.stringify(aiAssessmentResult),
          personaGenerated: true,
          persona: aiAssessmentResult.persona || null
        });
        
        return res.json({ 
          status: 'success', 
          result: updatedResult,
          aiAnalysis: aiAssessmentResult
        });
      } catch (aiError) {
        console.error('Error generating AI assessment:', aiError);
        // Continue with basic result even if AI analysis fails
        return res.json({ 
          status: 'success', 
          result: savedResult,
          aiAnalysis: null,
          aiError: 'AI assessment generation failed'
        });
      }
    } else {
      // No AI available, return basic result
      return res.json({ 
        status: 'success', 
        result: savedResult
      });
    }
  } catch (error) {
    console.error('Error processing learning style quiz:', error);
    res.status(500).json({ status: 'error', message: 'Server error processing learning style quiz' });
  }
});

/**
 * @route   GET /api/assessment/learning-style-quiz
 * @desc    Get learning style quiz questions
 * @access  Public
 */
router.get('/learning-style-quiz', (req, res) => {
  try {
    // Get age level for age-appropriate questions
    const ageLevel = req.query.ageLevel || 'middle'; // elementary, middle, high, adult
    
    // Standard questions for all age groups
    const standardQuestions = [
      {
        id: 'learning_new_info',
        text: 'When learning new information, I prefer:',
        options: [
          { id: 'visual', text: 'Seeing diagrams, charts, or pictures' },
          { id: 'auditory', text: 'Listening to someone explain it' },
          { id: 'kinesthetic', text: 'Trying it out or practicing it' },
          { id: 'reading', text: 'Reading about it in detail' }
        ]
      },
      {
        id: 'remember_best',
        text: 'I remember things best when:',
        options: [
          { id: 'visual', text: 'I can picture them in my mind' },
          { id: 'auditory', text: 'I hear them or say them aloud' },
          { id: 'kinesthetic', text: 'I have done them or practiced them' },
          { id: 'reading', text: 'I have written them down' }
        ]
      },
      {
        id: 'free_time',
        text: 'In my free time, I enjoy:',
        options: [
          { id: 'visual', text: 'Watching videos or looking at pictures' },
          { id: 'auditory', text: 'Listening to music or podcasts' },
          { id: 'kinesthetic', text: 'Playing sports or making things' },
          { id: 'reading', text: 'Reading books or writing' }
        ]
      },
      {
        id: 'giving_directions',
        text: 'When giving someone directions, I would:',
        options: [
          { id: 'visual', text: 'Draw a map or show them a picture' },
          { id: 'auditory', text: 'Explain the directions verbally' },
          { id: 'kinesthetic', text: 'Walk or drive them through the route' },
          { id: 'reading', text: 'Write out detailed step-by-step instructions' }
        ]
      },
      {
        id: 'concentration_difficulty',
        text: 'I find it hardest to concentrate when:',
        options: [
          { id: 'visual', text: 'The space is visually cluttered or distracting' },
          { id: 'auditory', text: 'There are noises or people talking' },
          { id: 'kinesthetic', text: 'I have to sit still for a long time' },
          { id: 'reading', text: 'I have to remember things without writing them down' }
        ]
      }
    ];
    
    // Age-specific questions
    const ageSpecificQuestions = {
      elementary: [
        {
          id: 'elementary_class_activity',
          text: 'The class activity I like best is:',
          options: [
            { id: 'visual', text: 'Drawing or looking at pictures' },
            { id: 'auditory', text: 'Listening to stories or singing' },
            { id: 'kinesthetic', text: 'Playing games or doing crafts' },
            { id: 'reading', text: 'Reading books or writing stories' }
          ]
        },
        {
          id: 'elementary_superpower',
          text: 'If I had a learning superpower, it would be:',
          options: [
            { id: 'visual', text: 'Super vision to see all the details' },
            { id: 'auditory', text: 'Super hearing to remember everything I hear' },
            { id: 'kinesthetic', text: 'Super hands to build and create anything' },
            { id: 'reading', text: 'Super reading and writing powers' }
          ]
        }
      ],
      
      middle: [
        {
          id: 'middle_study_method',
          text: 'When studying for a test, I usually:',
          options: [
            { id: 'visual', text: 'Use highlighters and make colorful notes' },
            { id: 'auditory', text: 'Say important facts out loud or discuss with others' },
            { id: 'kinesthetic', text: 'Move around while reviewing or use physical flashcards' },
            { id: 'reading', text: 'Rewrite my notes or make summaries' }
          ]
        },
        {
          id: 'middle_project',
          text: 'For a school project, I prefer to:',
          options: [
            { id: 'visual', text: 'Create a poster or slideshow' },
            { id: 'auditory', text: 'Give a presentation or record a podcast' },
            { id: 'kinesthetic', text: 'Build a model or perform a demonstration' },
            { id: 'reading', text: 'Write a detailed report' }
          ]
        }
      ],
      
      high: [
        {
          id: 'high_difficult_concept',
          text: 'When learning a difficult concept, I:',
          options: [
            { id: 'visual', text: 'Search for diagrams, videos, or visual explanations' },
            { id: 'auditory', text: 'Discuss it with others or explain it out loud' },
            { id: 'kinesthetic', text: 'Try to find a practical application or hands-on example' },
            { id: 'reading', text: 'Research more information and take detailed notes' }
          ]
        },
        {
          id: 'high_tech_use',
          text: 'I use technology for learning by:',
          options: [
            { id: 'visual', text: 'Watching videos or using visual apps' },
            { id: 'auditory', text: 'Listening to audiobooks or recorded lectures' },
            { id: 'kinesthetic', text: 'Using interactive simulations or games' },
            { id: 'reading', text: 'Reading digital materials or taking notes online' }
          ]
        }
      ],
      
      adult: [
        {
          id: 'adult_work_preference',
          text: 'In a work or educational setting, I prefer:',
          options: [
            { id: 'visual', text: 'Visual presentations with graphics and charts' },
            { id: 'auditory', text: 'Group discussions and verbal instructions' },
            { id: 'kinesthetic', text: 'Interactive workshops and hands-on activities' },
            { id: 'reading', text: 'Detailed written materials and documentation' }
          ]
        },
        {
          id: 'adult_training',
          text: 'When learning a new skill or for professional development, I:',
          options: [
            { id: 'visual', text: 'Look for video tutorials or illustrated guides' },
            { id: 'auditory', text: 'Prefer live instruction where I can ask questions' },
            { id: 'kinesthetic', text: 'Want to practice the skill in real scenarios' },
            { id: 'reading', text: 'Read manuals or guides thoroughly' }
          ]
        }
      ]
    };
    
    // Combine standard questions with age-appropriate questions
    let questions = [...standardQuestions];
    
    if (ageSpecificQuestions[ageLevel]) {
      questions = [...questions, ...ageSpecificQuestions[ageLevel]];
    }
    
    // Add some neurodivergent-specific questions
    const neurodivergentQuestions = [
      {
        id: 'focus_environment',
        text: 'I can focus best in an environment that:',
        options: [
          { id: 'visual', text: 'Is visually organized and has clear visual boundaries' },
          { id: 'auditory', text: 'Is quiet or has consistent background sounds' },
          { id: 'kinesthetic', text: 'Allows me to fidget or change positions' },
          { id: 'reading', text: 'Has minimal distractions and clear written instructions' }
        ]
      },
      {
        id: 'information_processing',
        text: 'When processing new information, I:',
        options: [
          { id: 'visual', text: 'Need to see it organized visually to understand relationships' },
          { id: 'auditory', text: 'Process it better when I hear it explained multiple ways' },
          { id: 'kinesthetic', text: 'Need to interact with the information physically' },
          { id: 'reading', text: 'Need to read and write about it to fully process it' }
        ]
      }
    ];
    
    questions = [...questions, ...neurodivergentQuestions];
    
    // Randomize question order (except first question)
    const firstQuestion = questions.shift();
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    questions.unshift(firstQuestion);
    
    res.json({ 
      status: 'success', 
      quiz: {
        id: 'learning_style_assessment',
        title: 'Learning Style Assessment',
        description: 'This quiz will help identify your preferred learning style.',
        questions: questions
      }
    });
  } catch (error) {
    console.error('Error getting learning style quiz:', error);
    res.status(500).json({ status: 'error', message: 'Server error retrieving learning style quiz' });
  }
});

/**
 * @route   GET /api/assessment/results/:userId
 * @desc    Get learning assessment results for a user
 * @access  Private
 */
router.get('/results/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (!userId) {
      return res.status(400).json({ status: 'error', message: 'Invalid user ID' });
    }
    
    const results = await storage.getLearningStyleResults(userId);
    
    if (!results || results.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No assessment results found for this user' });
    }
    
    // Sort by most recent first
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ status: 'success', results });
  } catch (error) {
    console.error('Error getting assessment results:', error);
    res.status(500).json({ status: 'error', message: 'Server error retrieving assessment results' });
  }
});

/**
 * @route   GET /api/assessment/personas/:userId
 * @desc    Get learning personas for a user
 * @access  Private
 */
router.get('/personas/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (!userId) {
      return res.status(400).json({ status: 'error', message: 'Invalid user ID' });
    }
    
    const personas = await storage.getLearningPersonas(userId);
    
    if (!personas || personas.length === 0) {
      return res.json({ 
        status: 'success', 
        personas: [],
        message: 'No learning personas found for this user' 
      });
    }
    
    res.json({ status: 'success', personas });
  } catch (error) {
    console.error('Error getting learning personas:', error);
    res.status(500).json({ status: 'error', message: 'Server error retrieving learning personas' });
  }
});

/**
 * @route   POST /api/assessment/persona/generate
 * @desc    Generate a learning persona for a user based on assessment results
 * @access  Private
 */
router.post('/persona/generate', async (req, res) => {
  try {
    const { userId, assessmentId, customData } = req.body;
    
    if (!userId) {
      return res.status(400).json({ status: 'error', message: 'User ID is required' });
    }
    
    // Get the assessment result
    const assessment = assessmentId 
      ? await storage.getLearningStyleResult(parseInt(assessmentId))
      : (await storage.getLearningStyleResults(userId))[0]; // Get most recent if specific ID not provided
    
    if (!assessment) {
      return res.status(404).json({ status: 'error', message: 'No assessment result found' });
    }
    
    // Generate persona
    let persona;
    
    if (anthropic) {
      try {
        // Generate persona using AI
        persona = await generateAIPersona(assessment, customData);
      } catch (aiError) {
        console.error('Error generating AI persona:', aiError);
        // Fall back to template-based persona
        persona = generateTemplatePersona(assessment, customData);
      }
    } else {
      // Use template-based generation if AI not available
      persona = generateTemplatePersona(assessment, customData);
    }
    
    // Save persona to database
    const savedPersona = await storage.createLearningPersona({
      userId: userId,
      resultId: assessment.id,
      name: persona.name,
      description: persona.description,
      strengths: persona.strengths,
      strategies: persona.strategies,
      environments: persona.environments,
      challenges: persona.challenges || [],
      superpower: persona.superpower || ''
    });
    
    // Update the assessment result to mark as having a persona
    await storage.updateLearningStyleResult(assessment.id, {
      personaGenerated: true
    });
    
    res.json({ status: 'success', persona: savedPersona });
  } catch (error) {
    console.error('Error generating learning persona:', error);
    res.status(500).json({ status: 'error', message: 'Server error generating learning persona' });
  }
});

/**
 * Generate an AI assessment based on quiz responses
 * @param {Array} responses - User's quiz responses
 * @param {Object} result - Basic assessment result
 * @returns {Object} AI assessment result
 */
async function generateAIAssessment(responses, result) {
  if (!anthropic) {
    throw new Error('Anthropic client not initialized');
  }
  
  try {
    // Format the responses for the AI
    const formattedResponses = responses.map(r => {
      return `Question: ${r.text}\nAnswer: ${r.selectedText || r.selectedStyle}`;
    }).join('\n\n');
    
    const prompt = `You are an expert educational psychologist specializing in neurodivergent learning styles. Analyze the following responses to a learning style assessment:

${formattedResponses}

Additional information:
- Primary learning style identified: ${result.primaryStyle}
- Secondary learning style identified: ${result.secondaryStyle}
- Age: ${result.age || 'Not specified'}
- Grade level: ${result.gradeLevel || 'Not specified'}
- Neurotype: ${result.neurotype || 'Not specified'}

Based on these responses, provide a detailed analysis in JSON format with the following structure:
{
  "analysis": {
    "primaryStyle": "The confirmed primary learning style",
    "secondaryStyle": "The confirmed secondary learning style",
    "strengthDetails": ["List of 3-5 specific strengths based on these learning styles"],
    "challengeDetails": ["List of 3-5 potential challenges based on these learning styles"],
    "adaptationNeeds": ["List of 3-5 specific adaptations that would benefit this learner"]
  },
  "recommendedStrategies": ["List of 5-7 specific learning strategies tailored to this profile"],
  "recommendedEnvironments": ["List of 3-5 ideal learning environments for this profile"],
  "recommendedTools": ["List of 5-7 specific tools or resources that would benefit this learner"],
  "persona": {
    "name": "A creative, empowering name for their learning persona (e.g., 'Visual Explorer' or 'Kinesthetic Innovator')",
    "description": "A 2-3 sentence empowering description of this learning profile",
    "strengths": ["5 key strengths as JSON array"],
    "strategies": ["5 key strategies as JSON array"],
    "environments": ["3 ideal environments as JSON array"],
    "superpower": "A single sentence describing their unique 'learning superpower'"
  }
}
`;

    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.3, // More precise for assessment analysis
    });
    
    // Parse and return the JSON response
    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                      responseText.match(/{[\s\S]*}/);
                      
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } else {
      throw new Error("Failed to parse AI assessment response");
    }
  } catch (error) {
    console.error("Error generating AI assessment:", error);
    throw error;
  }
}

/**
 * Generate an AI persona based on assessment results
 * @param {Object} assessment - Assessment result
 * @param {Object} customData - Additional custom data
 * @returns {Object} AI-generated persona
 */
async function generateAIPersona(assessment, customData) {
  if (!anthropic) {
    throw new Error('Anthropic client not initialized');
  }
  
  try {
    const prompt = `You are an expert educational psychologist specializing in neurodivergent learning. Create a personalized learning persona based on this assessment:

Assessment Results:
- Primary Learning Style: ${assessment.primaryStyle}
- Secondary Learning Style: ${assessment.secondaryStyle}
- Neurotype: ${assessment.neurotype || 'Not specified'}
- Age: ${assessment.age || 'Not specified'}
- Grade Level: ${assessment.gradeLevel || 'Not specified'}

${customData ? `Additional Information: ${JSON.stringify(customData)}` : ''}

Create a detailed, empowering learning persona in JSON format with this structure:
{
  "name": "A creative, empowering name for their learning persona (e.g., 'Visual Explorer' or 'Kinesthetic Innovator')",
  "description": "A 2-3 sentence empowering description of this learning profile that emphasizes strengths",
  "strengths": ["5 specific strengths as JSON array"],
  "strategies": ["5 specific learning strategies tailored to this profile"],
  "environments": ["3 ideal learning environments for this profile"],
  "challenges": ["3 potential challenges they might face"],
  "superpower": "A single sentence describing their unique 'learning superpower'"
}

Make the persona inspiring, strength-based, and specifically tailored to both their learning style AND neurotype. The persona should focus on their unique abilities rather than deficits.
`;

    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1000,
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7, // More creative for persona generation
    });
    
    // Parse and return the JSON response
    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                      responseText.match(/{[\s\S]*}/);
                      
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } else {
      throw new Error("Failed to parse AI persona response");
    }
  } catch (error) {
    console.error("Error generating AI persona:", error);
    throw error;
  }
}

/**
 * Generate a template-based persona as fallback when AI is not available
 * @param {Object} assessment - Assessment result
 * @param {Object} customData - Additional custom data
 * @returns {Object} Template-based persona
 */
function generateTemplatePersona(assessment, customData) {
  const style = assessment.primaryStyle;
  const neurotype = assessment.neurotype || 'general';
  
  // Style-based template personas
  const stylePersonas = {
    visual: {
      name: "Visual Voyager",
      description: "A visually-oriented learner who excels at understanding and creating through images, diagrams, and spatial relationships. You have the ability to see connections and patterns that others might miss.",
      strengths: [
        "Processing visual information quickly",
        "Understanding complex ideas through visual aids",
        "Strong spatial awareness and organization",
        "Remembering what you've seen",
        "Creating visual representations of ideas"
      ],
      strategies: [
        "Use color-coding in notes and materials",
        "Create mind maps for complex topics",
        "Convert written information into diagrams",
        "Watch educational videos when available",
        "Take pictures of important information"
      ],
      environments: [
        "Visually organized spaces with minimal clutter",
        "Areas with good lighting and clear sight lines",
        "Spaces with visual tools like whiteboards"
      ],
      superpower: "Visualizing the invisible - bringing abstract ideas into view"
    },
    
    auditory: {
      name: "Sound Sage",
      description: "An auditory-focused learner who excels at processing and remembering what you hear. You have a natural ability to follow verbal instructions and recall conversations with impressive detail.",
      strengths: [
        "Processing verbal information effectively",
        "Remembering what you've heard",
        "Following verbal instructions well",
        "Learning through discussions",
        "Explaining ideas verbally"
      ],
      strategies: [
        "Record lectures for later review",
        "Read material aloud when studying",
        "Participate in study groups and discussions",
        "Use verbal mnemonics and rhymes",
        "Listen to educational podcasts"
      ],
      environments: [
        "Spaces with good acoustics and minimal echo",
        "Areas with controlled background noise",
        "Environments that allow for verbal processing"
      ],
      superpower: "Hearing the harmony in words and sounds that others miss"
    },
    
    kinesthetic: {
      name: "Motion Master",
      description: "A kinesthetic learner who thrives through physical interaction with the world. You have an exceptional ability to learn by doing and remember information that's connected to movement or touch.",
      strengths: [
        "Learning through hands-on experiences",
        "Physical coordination and dexterity",
        "Memory for actions and movements",
        "Spatial awareness and navigation",
        "Building and manipulating objects"
      ],
      strategies: [
        "Use physical manipulatives when learning",
        "Take regular movement breaks",
        "Act out concepts when possible",
        "Take notes by hand rather than typing",
        "Use fidget tools to maintain focus"
      ],
      environments: [
        "Spaces that allow movement and physical activity",
        "Areas with standing or alternative seating options",
        "Environments with hands-on materials and tools"
      ],
      superpower: "Transforming movement into knowledge and bringing ideas to life through action"
    },
    
    reading: {
      name: "Text Tactician",
      description: "A reading/writing learner who excels at processing written information. You have a natural ability to understand and express complex ideas through text, making you a powerful communicator.",
      strengths: [
        "Understanding written instructions",
        "Organizing thoughts through writing",
        "Processing text-based information",
        "Expressing ideas clearly in writing",
        "Creating detailed written records"
      ],
      strategies: [
        "Take detailed notes in your own words",
        "Create written summaries of key concepts",
        "Use lists and outlines to organize information",
        "Read material multiple times for deeper understanding",
        "Keep a learning journal or vocabulary list"
      ],
      environments: [
        "Quiet spaces with minimal distractions",
        "Areas with good lighting for reading",
        "Environments with writing surfaces and materials"
      ],
      superpower: "Weaving words into wisdom and capturing complex ideas with precision"
    },
    
    multimodal: {
      name: "Adaptive Achiever",
      description: "A versatile multimodal learner who can adapt to different learning situations. You have the unique ability to switch between learning styles based on the task at hand, making you exceptionally adaptable.",
      strengths: [
        "Adapting to different teaching methods",
        "Connecting information across modalities",
        "Learning complex topics through multiple approaches",
        "Transferring knowledge between contexts",
        "Understanding diverse perspectives"
      ],
      strategies: [
        "Vary study methods based on the material",
        "Create multi-sensory study materials",
        "Switch learning modes when feeling stuck",
        "Use technology that offers multiple formats",
        "Take breaks to reset between different approaches"
      ],
      environments: [
        "Flexible spaces that support different activities",
        "Areas with varied resources and tools",
        "Environments that can be adjusted for different needs"
      ],
      superpower: "Shapeshifting your learning approach to master any challenge"
    }
  };
  
  // Neurotype-specific adjustments
  const neurotypeChallenges = {
    adhd: [
      "Sustaining attention on non-preferred tasks",
      "Managing time and deadlines effectively",
      "Organizing materials and information",
      "Filtering distractions in busy environments"
    ],
    
    dyslexia: [
      "Processing text-heavy materials quickly",
      "Spelling and writing without support",
      "Taking notes while listening simultaneously",
      "Working with unfamiliar terminology"
    ],
    
    autism: [
      "Managing sensory overload in busy environments",
      "Adapting to unexpected changes in routines",
      "Understanding implicit social expectations",
      "Processing multiple verbal instructions simultaneously"
    ],
    
    general: [
      "Maintaining focus during longer learning sessions",
      "Adapting to new learning environments",
      "Balancing multiple subjects or projects",
      "Self-advocating for needed accommodations"
    ]
  };
  
  // Get the base persona for the learning style
  const persona = { ...stylePersonas[style] };
  
  // Add neurotype-specific challenges
  persona.challenges = neurotypeChallenges[neurotype] || neurotypeChallenges.general;
  
  // Customize with any additional data
  if (customData && customData.interests) {
    persona.description += ` Your interests in ${customData.interests.join(', ')} provide natural opportunities to apply your learning strengths.`;
  }
  
  return persona;
}

export default router;