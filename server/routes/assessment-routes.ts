/**
 * Assessment System API Routes
 * 
 * These routes handle the assessment system functionality including:
 * - Retrieving and creating assessment results
 * - Managing learning profiles
 * - Generating learning recommendations
 * - Integrating with the personalization pipeline
 */

import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { db } from '../db';
import { 
  assessmentFramework, 
  AssessmentType, 
  AssessmentResult
} from '../services/assessment-framework';
import { processDyslexiaAssessmentResults, generateDyslexiaAdaptations } from '../services/assessment-modules/dyslexia-assessment';
import { processADHDAssessmentResults, generateADHDAdaptations } from '../services/assessment-modules/adhd-assessment';
import { processAutismSpectrumAssessmentResults, generateAutismSpectrumAdaptations } from '../services/assessment-modules/autism-spectrum-assessment';
import { 
  AdaptationCategory, 
  AdaptationLevel,
  LearningStyle, 
  Neurotype,
  LearningProfile
} from '../services/learning-profile-service';

const router = Router();

/**
 * Get available assessments
 * GET /api/assessment/available
 */
router.get('/available', async (req, res) => {
  try {
    // Return list of available assessments with metadata
    const availableAssessments = [
      {
        id: 'learning-style',
        type: AssessmentType.LEARNING_STYLE,
        name: 'Learning Style Assessment',
        description: 'Discover your preferred learning style to optimize your educational experience.',
        estimatedTimeMinutes: 10,
        questionCount: 20
      },
      {
        id: 'reading-skills',
        type: AssessmentType.READING_SKILLS,
        name: 'Reading Skills Assessment',
        description: 'Identify specific reading strengths and challenges to personalize your learning experience.',
        estimatedTimeMinutes: 15,
        questionCount: 10,
        recommendedForNeurotype: 'dyslexia'
      },
      {
        id: 'attention-assessment',
        type: AssessmentType.ATTENTION_ASSESSMENT,
        name: 'Attention & Focus Assessment',
        description: 'Understand your attention patterns and executive function skills.',
        estimatedTimeMinutes: 12,
        questionCount: 12,
        recommendedForNeurotype: 'adhd'
      },
      {
        id: 'social-communication',
        type: AssessmentType.SOCIAL_COMMUNICATION,
        name: 'Learning Environment Preferences',
        description: 'Identify your optimal learning environment and sensory preferences.',
        estimatedTimeMinutes: 12,
        questionCount: 12,
        recommendedForNeurotype: 'autism_spectrum'
      }
    ];
    
    res.status(200).json(availableAssessments);
  } catch (error) {
    console.error('Error retrieving available assessments:', error);
    res.status(500).json({ error: 'Failed to retrieve available assessments' });
  }
});

/**
 * Get assessment questions
 * GET /api/assessment/questions/:assessmentId
 */
router.get('/questions/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    
    // Depending on the assessment ID, return the appropriate questions
    let assessmentData;
    
    switch (assessmentId) {
      case 'learning-style':
        // Learning style assessment questions
        assessmentData = {
          metadata: {
            id: 'learning-style',
            type: AssessmentType.LEARNING_STYLE,
            name: 'Learning Style Assessment',
            description: 'Discover your preferred learning style to optimize your educational experience.',
            estimatedTimeMinutes: 10,
            questionCount: 20
          },
          questions: getLearningStyleQuestions()
        };
        break;
        
      case 'reading-skills':
        // Reading skills assessment questions for dyslexia
        assessmentData = {
          metadata: {
            id: 'reading-skills',
            type: AssessmentType.READING_SKILLS,
            name: 'Reading Skills Assessment',
            description: 'Identify specific reading challenges to personalize your learning experience.',
            estimatedTimeMinutes: 15,
            questionCount: 10,
            recommendedForNeurotype: 'dyslexia'
          },
          questions: getDyslexiaAssessmentQuestions()
        };
        break;
        
      case 'attention-assessment':
        // Attention assessment questions for ADHD
        assessmentData = {
          metadata: {
            id: 'attention-assessment',
            type: AssessmentType.ATTENTION_ASSESSMENT,
            name: 'Attention & Focus Assessment',
            description: 'Understand your attention patterns and executive function skills.',
            estimatedTimeMinutes: 12,
            questionCount: 12,
            recommendedForNeurotype: 'adhd'
          },
          questions: getADHDAssessmentQuestions()
        };
        break;
        
      case 'social-communication':
        // Social communication assessment questions for autism spectrum
        assessmentData = {
          metadata: {
            id: 'social-communication',
            type: AssessmentType.SOCIAL_COMMUNICATION,
            name: 'Learning Environment Preferences',
            description: 'Identify your optimal learning environment and sensory preferences.',
            estimatedTimeMinutes: 12,
            questionCount: 12,
            recommendedForNeurotype: 'autism_spectrum'
          },
          questions: getAutismSpectrumAssessmentQuestions()
        };
        break;
        
      default:
        return res.status(404).json({ error: 'Assessment not found' });
    }
    
    res.status(200).json(assessmentData);
  } catch (error) {
    console.error('Error retrieving assessment questions:', error);
    res.status(500).json({ error: 'Failed to retrieve assessment questions' });
  }
});

/**
 * Submit assessment answers
 * POST /api/assessment/submit
 */
router.post('/submit', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'You must be logged in to submit an assessment' });
    }
    
    // Validate input
    const schema = z.object({
      assessmentId: z.string(),
      answers: z.record(z.string(), z.string())
    });
    
    const validationResult = schema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: 'Invalid assessment data' });
    }
    
    const { assessmentId, answers } = validationResult.data;
    
    // Process the assessment based on its type
    let assessmentResult: AssessmentResult;
    let assessmentType: AssessmentType;
    let results: Record<string, any> = {};
    let recommendations: Record<string, any> = {};
    
    switch (assessmentId) {
      case 'learning-style':
        assessmentType = AssessmentType.LEARNING_STYLE;
        results = processLearningStyleAnswers(answers);
        recommendations = generateLearningStyleRecommendations(results);
        break;
        
      case 'reading-skills':
        assessmentType = AssessmentType.READING_SKILLS;
        // Convert answers from string keys to number keys
        const dyslexiaAnswers: Record<number, string> = {};
        Object.entries(answers).forEach(([key, value]) => {
          dyslexiaAnswers[parseInt(key)] = value;
        });
        
        results = processDyslexiaAssessmentResults(dyslexiaAnswers);
        recommendations = {
          neurotype: Neurotype.DYSLEXIA,
          adaptationLevel: determineAdaptationLevel(results),
          adaptations: generateDyslexiaAdaptations(
            results,
            determineAdaptationLevel(results)
          )
        };
        break;
        
      case 'attention-assessment':
        assessmentType = AssessmentType.ATTENTION_ASSESSMENT;
        // Convert answers from string keys to number keys
        const adhdAnswers: Record<number, string> = {};
        Object.entries(answers).forEach(([key, value]) => {
          adhdAnswers[parseInt(key)] = value;
        });
        
        results = processADHDAssessmentResults(adhdAnswers);
        recommendations = {
          neurotype: Neurotype.ADHD,
          adaptationLevel: determineAdaptationLevel(results),
          adaptations: generateADHDAdaptations(
            results,
            determineAdaptationLevel(results)
          )
        };
        break;
        
      case 'social-communication':
        assessmentType = AssessmentType.SOCIAL_COMMUNICATION;
        // Convert answers from string keys to number keys
        const autismAnswers: Record<number, string> = {};
        Object.entries(answers).forEach(([key, value]) => {
          autismAnswers[parseInt(key)] = value;
        });
        
        results = processAutismSpectrumAssessmentResults(autismAnswers);
        recommendations = {
          neurotype: Neurotype.AUTISM_SPECTRUM,
          adaptationLevel: determineAdaptationLevel(results),
          adaptations: generateAutismSpectrumAdaptations(
            results,
            determineAdaptationLevel(results)
          )
        };
        break;
        
      default:
        return res.status(400).json({ error: 'Unknown assessment type' });
    }
    
    // Create the assessment result
    assessmentResult = {
      id: undefined, // Will be assigned by database
      userId: req.user!.id,
      assessmentType,
      completedDate: new Date(),
      results,
      recommendedAdaptations: [],
      version: '1.0'
    };
    
    // Save assessment result to database
    const savedResult = await storage.saveAssessmentResult(assessmentResult);
    
    // If this is a learning style assessment or the first assessment of any type for this user,
    // generate or update the learning profile
    const profile = await storage.getLearningProfile(req.user!.id);
    
    if (!profile || assessmentType === AssessmentType.LEARNING_STYLE) {
      await assessmentFramework.generateLearningProfile(req.user!.id);
    }
    
    // Return success response with assessment results and recommendations
    res.status(200).json({
      success: true,
      assessmentId,
      type: assessmentType,
      results,
      recommendations
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({ error: 'Failed to submit assessment' });
  }
});

/**
 * Get user's completed assessments
 * GET /api/assessment/completed/:userId
 */
router.get('/completed/:userId', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'You must be logged in to view assessment results' });
    }
    
    const userId = parseInt(req.params.userId);
    
    // Verify that the user is requesting their own results or has admin access
    if (req.user!.id !== userId && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'You do not have permission to view these assessment results' });
    }
    
    // Get all assessment results for the user
    const assessmentResults = await storage.getAssessmentResultsByUser(userId);
    
    if (!assessmentResults || assessmentResults.length === 0) {
      return res.status(200).json([]);
    }
    
    // Format results for client
    const formattedResults = assessmentResults.map(result => ({
      userId: result.userId,
      assessmentType: result.assessmentType,
      completedDate: result.completedDate,
      results: result.results,
      recommendations: {
        primaryStyle: result.assessmentType === AssessmentType.LEARNING_STYLE ? 
          determineLearningSTypePrimary(result.results) : undefined,
        secondaryStyle: result.assessmentType === AssessmentType.LEARNING_STYLE ? 
          determineLearningSTypeSecondary(result.results) : undefined,
        neurotype: result.assessmentType !== AssessmentType.LEARNING_STYLE ? 
          determineNeurotype(result.assessmentType) : undefined,
        adaptationLevel: result.assessmentType !== AssessmentType.LEARNING_STYLE ? 
          determineAdaptationLevel(result.results) : undefined,
        adaptations: {}
      }
    }));
    
    res.status(200).json(formattedResults);
  } catch (error) {
    console.error('Error retrieving completed assessments:', error);
    res.status(500).json({ error: 'Failed to retrieve completed assessments' });
  }
});

/**
 * Get user's learning profile
 * GET /api/assessment/profile/:userId
 */
router.get('/profile/:userId', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'You must be logged in to view learning profiles' });
    }
    
    const userId = parseInt(req.params.userId);
    
    // Verify that the user is requesting their own profile or has admin access
    if (req.user!.id !== userId && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'You do not have permission to view this learning profile' });
    }
    
    // Get the learning profile for the user
    const profile = await storage.getLearningProfile(userId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Learning profile not found' });
    }
    
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error retrieving learning profile:', error);
    res.status(500).json({ error: 'Failed to retrieve learning profile' });
  }
});

/**
 * Get learning profile summary for a user
 * GET /api/assessment/profile-summary/:userId
 */
router.get('/profile-summary/:userId', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'You must be logged in to view profile summaries' });
    }
    
    const userId = parseInt(req.params.userId);
    
    // Get the learning profile for the user
    const profile = await storage.getLearningProfile(userId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Learning profile not found' });
    }
    
    // Create a simplified summary for the client
    const summary = {
      userId: profile.userId,
      primaryStyle: profile.primaryStyle,
      secondaryStyle: profile.secondaryStyle,
      neurotype: profile.neurotype,
      adaptationLevel: profile.adaptationLevel,
      contentPreferences: {
        visual: profile.contentPreferences.visualElements,
        audio: profile.contentPreferences.audioElements,
        text: profile.contentPreferences.textElements,
        interactive: profile.contentPreferences.interactiveElements
      },
      keyAdaptations: Object.entries(profile.adaptations)
        .filter(([_, adaptation]) => adaptation.required)
        .reduce((acc, [category, adaptation]) => {
          acc[category] = adaptation.specifics.slice(0, 3);
          return acc;
        }, {} as Record<string, string[]>)
    };
    
    res.status(200).json(summary);
  } catch (error) {
    console.error('Error retrieving profile summary:', error);
    res.status(500).json({ error: 'Failed to retrieve profile summary' });
  }
});

/**
 * Process learning style assessment answers
 */
function processLearningStyleAnswers(answers: Record<string, string>): Record<string, number> {
  const scores = {
    visual: 0,
    auditory: 0,
    kinesthetic: 0,
    readingWriting: 0
  };
  
  // Count of questions answered for each style
  const counts = {
    visual: 0,
    auditory: 0,
    kinesthetic: 0,
    readingWriting: 0
  };
  
  // Process each answer
  Object.values(answers).forEach(answer => {
    // Extract the learning style and value from the answer
    // Format example: "v_8" for visual with value 8
    const [style, valueStr] = answer.split('_');
    const value = parseInt(valueStr);
    
    if (isNaN(value)) return;
    
    // Add to appropriate score
    switch (style) {
      case 'v':
        scores.visual += value;
        counts.visual++;
        break;
      case 'a':
        scores.auditory += value;
        counts.auditory++;
        break;
      case 'k':
        scores.kinesthetic += value;
        counts.kinesthetic++;
        break;
      case 'r':
        scores.readingWriting += value;
        counts.readingWriting++;
        break;
    }
  });
  
  // Calculate averages
  const results = {
    visual: counts.visual > 0 ? Math.round(scores.visual / counts.visual) : 0,
    auditory: counts.auditory > 0 ? Math.round(scores.auditory / counts.auditory) : 0,
    kinesthetic: counts.kinesthetic > 0 ? Math.round(scores.kinesthetic / counts.kinesthetic) : 0,
    readingWriting: counts.readingWriting > 0 ? Math.round(scores.readingWriting / counts.readingWriting) : 0
  };
  
  return results;
}

/**
 * Generate learning style recommendations
 */
function generateLearningStyleRecommendations(results: Record<string, number>): Record<string, any> {
  // Find primary and secondary learning styles
  const styles = [
    { style: 'visual', score: results.visual },
    { style: 'auditory', score: results.auditory },
    { style: 'kinesthetic', score: results.kinesthetic },
    { style: 'reading_writing', score: results.readingWriting }
  ];
  
  // Sort by score (highest first)
  styles.sort((a, b) => b.score - a.score);
  
  const primaryStyle = styles[0].style;
  
  // Set secondary style if there's a close second
  let secondaryStyle = null;
  if (styles[1].score > 0.7 * styles[0].score) {
    secondaryStyle = styles[1].style;
  }
  
  // Generate content recommendations based on learning style
  const contentRecommendations: Record<string, string[]> = {};
  
  switch (primaryStyle) {
    case 'visual':
      contentRecommendations.presentation = [
        'Use diagrams, charts, and visual maps',
        'Incorporate color-coding for different concepts',
        'Include infographics to explain complex ideas'
      ];
      break;
    case 'auditory':
      contentRecommendations.presentation = [
        'Provide audio recordings of content',
        'Use verbal explanations and discussions',
        'Incorporate musical mnemonics and sound cues'
      ];
      break;
    case 'kinesthetic':
      contentRecommendations.presentation = [
        'Include hands-on, interactive activities',
        'Incorporate physical movement into learning',
        'Use simulations and role-playing exercises'
      ];
      break;
    case 'reading_writing':
      contentRecommendations.presentation = [
        'Provide written explanations and summaries',
        'Include reading materials and reference documents',
        'Encourage note-taking and journaling'
      ];
      break;
  }
  
  return {
    primaryStyle,
    secondaryStyle,
    contentRecommendations
  };
}

/**
 * Get learning style assessment questions
 */
function getLearningStyleQuestions() {
  // Return VARK-style assessment questions
  return [
    {
      id: 1,
      text: 'How do you prefer to learn a new skill?',
      options: [
        { id: 'v_8', text: 'Watching a demonstration or video' },
        { id: 'a_8', text: 'Listening to someone explain it' },
        { id: 'k_8', text: 'Trying it yourself through practice' },
        { id: 'r_8', text: 'Reading instructions or a manual' }
      ]
    },
    {
      id: 2,
      text: 'When you need to remember directions to a place, you usually:',
      options: [
        { id: 'v_8', text: 'Visualize a map or landmarks' },
        { id: 'a_8', text: 'Repeat the directions out loud or remember verbal instructions' },
        { id: 'k_8', text: 'Remember the physical movements and turns you need to make' },
        { id: 'r_8', text: 'Write down the directions or rely on written notes' }
      ]
    },
    {
      id: 3,
      text: 'When learning something new in class, you prefer when the teacher:',
      options: [
        { id: 'v_8', text: 'Uses diagrams, charts, or demonstrations' },
        { id: 'a_8', text: 'Explains concepts verbally and holds discussions' },
        { id: 'k_8', text: 'Provides hands-on activities or experiments' },
        { id: 'r_8', text: 'Provides written materials or texts to read' }
      ]
    },
    {
      id: 4,
      text: 'When you\'re trying to understand a difficult concept, you often:',
      options: [
        { id: 'v_8', text: 'Draw a diagram or mind map to visualize it' },
        { id: 'a_8', text: 'Discuss it with someone to talk through your understanding' },
        { id: 'k_8', text: 'Create a model or act it out physically' },
        { id: 'r_8', text: 'Write notes or read explanations until it makes sense' }
      ]
    },
    {
      id: 5,
      text: 'Which type of study material do you find most helpful?',
      options: [
        { id: 'v_8', text: 'Charts, diagrams, and illustrations' },
        { id: 'a_8', text: 'Recorded lectures or study groups for discussion' },
        { id: 'k_8', text: 'Interactive simulations or physical models' },
        { id: 'r_8', text: 'Textbooks and written study guides' }
      ]
    }
  ];
}

/**
 * Get dyslexia assessment questions
 */
function getDyslexiaAssessmentQuestions() {
  // This function would return questions from the dyslexia assessment
  // For now, returning a placeholder subset of questions
  
  // In a real implementation, this would import questions from
  // the dyslexia assessment module
  return [
    {
      id: 1,
      text: 'How often do you have difficulty recognizing or producing rhyming words?',
      options: [
        { id: 'p1_1', text: 'Never or rarely' },
        { id: 'p1_2', text: 'Occasionally' },
        { id: 'p1_3', text: 'Often' },
        { id: 'p1_4', text: 'Always or almost always' }
      ],
      adaptations: {
        visualSupport: '/images/assessments/dyslexia/rhyming-words.svg'
      }
    },
    {
      id: 3,
      text: 'When reading aloud, how often do you read slowly or with great effort?',
      options: [
        { id: 'f1_1', text: 'Never or rarely' },
        { id: 'f1_2', text: 'Occasionally' },
        { id: 'f1_3', text: 'Often' },
        { id: 'f1_4', text: 'Always or almost always' }
      ]
    },
    {
      id: 5,
      text: 'How often do you have trouble recognizing common words by sight?',
      options: [
        { id: 'w1_1', text: 'Never or rarely' },
        { id: 'w1_2', text: 'Occasionally' },
        { id: 'w1_3', text: 'Often' },
        { id: 'w1_4', text: 'Always or almost always' }
      ],
      adaptations: {
        visualSupport: '/images/assessments/dyslexia/sight-words.svg'
      }
    }
  ];
}

/**
 * Get ADHD assessment questions
 */
function getADHDAssessmentQuestions() {
  // This function would return questions from the ADHD assessment
  // For now, returning a placeholder subset of questions
  
  // In a real implementation, this would import questions from
  // the ADHD assessment module
  return [
    {
      id: 1,
      text: 'How often do you have trouble staying focused on tasks that require sustained mental effort?',
      options: [
        { id: 'sa1_1', text: 'Never or rarely' },
        { id: 'sa1_2', text: 'Occasionally' },
        { id: 'sa1_3', text: 'Often' },
        { id: 'sa1_4', text: 'Always or almost always' }
      ],
      adaptations: {
        visualSupport: '/images/assessments/adhd/sustained-attention.svg'
      }
    },
    {
      id: 5,
      text: 'How often do you feel the need to move or fidget when you\'re expected to stay still?',
      options: [
        { id: 'h1_1', text: 'Never or rarely' },
        { id: 'h1_2', text: 'Occasionally' },
        { id: 'h1_3', text: 'Often' },
        { id: 'h1_4', text: 'Always or almost always' }
      ],
      adaptations: {
        visualSupport: '/images/assessments/adhd/hyperactivity.svg'
      }
    },
    {
      id: 9,
      text: 'How often do you have trouble organizing tasks and activities?',
      options: [
        { id: 'os1_1', text: 'Never or rarely' },
        { id: 'os1_2', text: 'Occasionally' },
        { id: 'os1_3', text: 'Often' },
        { id: 'os1_4', text: 'Always or almost always' }
      ],
      adaptations: {
        visualSupport: '/images/assessments/adhd/organization.svg'
      }
    }
  ];
}

/**
 * Get autism spectrum assessment questions
 */
function getAutismSpectrumAssessmentQuestions() {
  // This function would return questions from the autism spectrum assessment
  // For now, returning a placeholder subset of questions
  
  // In a real implementation, this would import questions from
  // the autism spectrum assessment module
  return [
    {
      id: 1,
      text: 'How difficult is it for you to understand the unwritten rules of social interactions?',
      options: [
        { id: 'sc1_1', text: 'Not difficult at all' },
        { id: 'sc1_2', text: 'Slightly difficult' },
        { id: 'sc1_3', text: 'Moderately difficult' },
        { id: 'sc1_4', text: 'Very difficult' }
      ],
      adaptations: {
        visualSupport: '/images/assessments/autism/social-rules.svg'
      }
    },
    {
      id: 5,
      text: 'How often are you bothered by certain sounds, lights, textures, or other sensory experiences?',
      options: [
        { id: 'ss1_1', text: 'Never or rarely' },
        { id: 'ss1_2', text: 'Occasionally' },
        { id: 'ss1_3', text: 'Often' },
        { id: 'ss1_4', text: 'Always or almost always' }
      ],
      adaptations: {
        visualSupport: '/images/assessments/autism/sensory-sensitivity.svg'
      }
    },
    {
      id: 9,
      text: 'How intensely do you focus on topics or activities that interest you?',
      options: [
        { id: 'si1_1', text: 'No more than average' },
        { id: 'si1_2', text: 'Somewhat more than average' },
        { id: 'si1_3', text: 'Much more than average' },
        { id: 'si1_4', text: 'Extremely more than average' }
      ]
    }
  ];
}

/**
 * Determine the primary learning style from assessment results
 */
function determineLearningSTypePrimary(results: Record<string, number>): string {
  // Find the learning style with the highest score
  const styles = [
    { style: LearningStyle.VISUAL, score: results.visual },
    { style: LearningStyle.AUDITORY, score: results.auditory },
    { style: LearningStyle.KINESTHETIC, score: results.kinesthetic },
    { style: LearningStyle.READING_WRITING, score: results.readingWriting }
  ];
  
  // Sort by score (highest first)
  styles.sort((a, b) => b.score - a.score);
  
  return styles[0].style;
}

/**
 * Determine the secondary learning style from assessment results
 */
function determineLearningSTypeSecondary(results: Record<string, number>): string | null {
  // Find the learning style with the highest score
  const styles = [
    { style: LearningStyle.VISUAL, score: results.visual },
    { style: LearningStyle.AUDITORY, score: results.auditory },
    { style: LearningStyle.KINESTHETIC, score: results.kinesthetic },
    { style: LearningStyle.READING_WRITING, score: results.readingWriting }
  ];
  
  // Sort by score (highest first)
  styles.sort((a, b) => b.score - a.score);
  
  // Set secondary style if there's a close second
  if (styles[1].score > 0.7 * styles[0].score) {
    return styles[1].style;
  }
  
  return null;
}

/**
 * Determine the neurotype from assessment type
 */
function determineNeurotype(assessmentType: string): Neurotype {
  switch (assessmentType) {
    case AssessmentType.READING_SKILLS:
      return Neurotype.DYSLEXIA;
    case AssessmentType.ATTENTION_ASSESSMENT:
      return Neurotype.ADHD;
    case AssessmentType.SOCIAL_COMMUNICATION:
      return Neurotype.AUTISM_SPECTRUM;
    default:
      return Neurotype.NEUROTYPICAL;
  }
}

/**
 * Determine the adaptation level based on indicator scores
 */
function determineAdaptationLevel(results: Record<string, number>): AdaptationLevel {
  // Calculate the average score across all indicators
  const scores = Object.values(results);
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  // Determine adaptation level based on average score
  if (averageScore > 7) {
    return AdaptationLevel.SIGNIFICANT;
  } else if (averageScore > 4) {
    return AdaptationLevel.MODERATE;
  } else {
    return AdaptationLevel.MINIMAL;
  }
}

export default router;

// Storage extension methods for assessment-related operations
export const assessmentStorageMethods = {
  /**
   * Save an assessment result
   */
  saveAssessmentResult: async (result: AssessmentResult): Promise<AssessmentResult> => {
    try {
      // Implementation would save to database
      // This is a placeholder
      return result;
    } catch (error) {
      console.error(`Error saving assessment result:`, error);
      throw error;
    }
  },
  
  /**
   * Get assessment results for a user
   */
  getAssessmentResultsByUser: async (userId: number): Promise<AssessmentResult[]> => {
    try {
      // Implementation would retrieve from database
      // This is a placeholder
      return [];
    } catch (error) {
      console.error(`Error getting assessment results for user ${userId}:`, error);
      return [];
    }
  },
  
  /**
   * Get a specific assessment result
   */
  getAssessmentResult: async (id: number): Promise<AssessmentResult | null> => {
    try {
      // Implementation would retrieve from database
      // This is a placeholder
      return null;
    } catch (error) {
      console.error(`Error getting assessment result ${id}:`, error);
      return null;
    }
  },
  
  /**
   * Get a learning profile for a user
   */
  getLearningProfile: async (userId: number): Promise<LearningProfile | null> => {
    try {
      // Implementation would retrieve from database
      // This is a placeholder
      return null;
    } catch (error) {
      console.error(`Error getting learning profile for user ${userId}:`, error);
      return null;
    }
  },
  
  /**
   * Save a learning profile
   */
  saveLearningProfile: async (profile: LearningProfile): Promise<LearningProfile> => {
    try {
      // Implementation would save to database
      // This is a placeholder
      return profile;
    } catch (error) {
      console.error(`Error saving learning profile:`, error);
      throw error;
    }
  }
};