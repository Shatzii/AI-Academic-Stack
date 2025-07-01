/**
 * Autism Spectrum Assessment Module
 * 
 * A specialized assessment module for identifying autism spectrum-specific learning needs
 * and generating appropriate adaptations for personalized learning.
 */

import { 
  AssessmentType, 
  AssessmentModule, 
  AssessmentQuestion, 
  AssessmentOption, 
  ResultScale,
  AutismSpectrumIndicators
} from '../assessment-framework';
import { AdaptationCategory, AdaptationLevel } from '../learning-profile-service';

/**
 * Autism Spectrum Assessment Areas
 */
export enum AutismSpectrumAssessmentArea {
  SOCIAL_COMMUNICATION = 'social_communication',
  FLEXIBILITY = 'flexibility_preferences',
  SENSORY = 'sensory_sensitivity',
  PATTERN_RECOGNITION = 'pattern_recognition',
  SPECIAL_INTERESTS = 'special_interest_focus',
  EXECUTIVE_FUNCTION = 'executive_function'
}

/**
 * Autism Spectrum-Specific Adaptations
 */
export const autismSpectrumAdaptations = {
  [AdaptationCategory.SENSORY_CONSIDERATIONS]: [
    {
      name: 'Reduced visual complexity',
      description: 'Simple, clean interface with minimal decoration and distractions',
      level: AdaptationLevel.MINIMAL
    },
    {
      name: 'Adjustable visual contrast',
      description: 'Ability to customize color contrast and brightness settings',
      level: AdaptationLevel.MINIMAL
    },
    {
      name: 'Audio control options',
      description: 'Volume controls, audio previews, and mute options for all sounds',
      level: AdaptationLevel.MODERATE
    },
    {
      name: 'Sensory break indicators',
      description: 'Notifications suggesting sensory breaks during learning sessions',
      level: AdaptationLevel.MODERATE
    },
    {
      name: 'Fully customizable sensory experience',
      description: 'Comprehensive controls for all visual and auditory elements',
      level: AdaptationLevel.SIGNIFICANT
    }
  ],
  [AdaptationCategory.CONTENT_ORGANIZATION]: [
    {
      name: 'Consistent layout and navigation',
      description: 'Predictable structure and navigation patterns across all content',
      level: AdaptationLevel.MINIMAL
    },
    {
      name: 'Visual schedules',
      description: 'Clear visual representation of learning sequence and activities',
      level: AdaptationLevel.MINIMAL
    },
    {
      name: 'Explicit transitions',
      description: 'Clear indicators when moving between different activities or topics',
      level: AdaptationLevel.MODERATE
    },
    {
      name: 'Detailed advance organizers',
      description: 'Comprehensive previews of content structure and expectations',
      level: AdaptationLevel.MODERATE
    },
    {
      name: 'Special interest integration',
      description: 'Content connections to identified areas of special interest',
      level: AdaptationLevel.SIGNIFICANT
    }
  ],
  [AdaptationCategory.INTERACTIVE_ELEMENTS]: [
    {
      name: 'Clear, literal instructions',
      description: 'Instructions that avoid idioms, metaphors, or ambiguous language',
      level: AdaptationLevel.MINIMAL
    },
    {
      name: 'Predictable interaction patterns',
      description: 'Consistent interaction models across all activities',
      level: AdaptationLevel.MINIMAL
    },
    {
      name: 'Visual support for social content',
      description: 'Visual cues and explicit explanations for social concepts',
      level: AdaptationLevel.MODERATE
    },
    {
      name: 'Pattern-based learning activities',
      description: 'Learning activities that leverage pattern recognition strengths',
      level: AdaptationLevel.MODERATE
    },
    {
      name: 'Social script supports',
      description: 'Explicit social scripts for collaborative learning activities',
      level: AdaptationLevel.SIGNIFICANT
    }
  ]
};

/**
 * Create the autism spectrum assessment module
 */
export const createAutismSpectrumAssessmentModule = (): AssessmentModule => {
  return {
    type: AssessmentType.SOCIAL_COMMUNICATION,
    name: 'Social Communication and Sensory Processing Assessment',
    description: 'A comprehensive assessment designed to identify autism spectrum-specific learning needs and preferences.',
    targetAgeRange: [6, 18], // Ages 6-18
    estimatedTimeMinutes: 15,
    requiresSpecialist: false,
    questions: generateAutismSpectrumQuestions(),
    resultSchema: {
      socialCommunication: ResultScale.NUMERIC_SCALE,
      flexibilityPreferences: ResultScale.NUMERIC_SCALE,
      sensorySensitivity: ResultScale.NUMERIC_SCALE,
      patternRecognition: ResultScale.NUMERIC_SCALE,
      specialInterestFocus: ResultScale.NUMERIC_SCALE,
      executiveFunction: ResultScale.NUMERIC_SCALE
    }
  };
};

/**
 * Generate the assessment questions for autism spectrum assessment
 */
function generateAutismSpectrumQuestions(): AssessmentQuestion[] {
  return [
    // Social Communication
    {
      id: 1,
      assessmentType: AssessmentType.SOCIAL_COMMUNICATION,
      text: 'How difficult is it for you to understand the unwritten rules of social interactions?',
      options: [
        {
          id: 'sc1_1',
          text: 'Not difficult at all',
          value: 1,
          indicators: { socialCommunication: 1 }
        },
        {
          id: 'sc1_2',
          text: 'Slightly difficult',
          value: 3,
          indicators: { socialCommunication: 3 }
        },
        {
          id: 'sc1_3',
          text: 'Moderately difficult',
          value: 7,
          indicators: { socialCommunication: 7 }
        },
        {
          id: 'sc1_4',
          text: 'Very difficult',
          value: 10,
          indicators: { socialCommunication: 10 }
        }
      ],
      adaptations: {
        visualSupport: '/images/assessments/autism/social-rules.svg'
      }
    },
    {
      id: 2,
      assessmentType: AssessmentType.SOCIAL_COMMUNICATION,
      text: 'How often do you find it challenging to understand figurative language, jokes, or sarcasm?',
      options: [
        {
          id: 'sc2_1',
          text: 'Never or rarely',
          value: 1,
          indicators: { socialCommunication: 1 }
        },
        {
          id: 'sc2_2',
          text: 'Occasionally',
          value: 3,
          indicators: { socialCommunication: 3 }
        },
        {
          id: 'sc2_3',
          text: 'Often',
          value: 7,
          indicators: { socialCommunication: 7 }
        },
        {
          id: 'sc2_4',
          text: 'Always or almost always',
          value: 10,
          indicators: { socialCommunication: 10 }
        }
      ]
    },
    
    // Flexibility Preferences
    {
      id: 3,
      assessmentType: AssessmentType.SOCIAL_COMMUNICATION,
      text: 'How important is it to you to maintain specific routines or ways of doing things?',
      options: [
        {
          id: 'fp1_1',
          text: 'Not important at all',
          value: 1,
          indicators: { flexibilityPreferences: 1 }
        },
        {
          id: 'fp1_2',
          text: 'Somewhat important',
          value: 3,
          indicators: { flexibilityPreferences: 3 }
        },
        {
          id: 'fp1_3',
          text: 'Very important',
          value: 7,
          indicators: { flexibilityPreferences: 7 }
        },
        {
          id: 'fp1_4',
          text: 'Extremely important',
          value: 10,
          indicators: { flexibilityPreferences: 10 }
        }
      ],
      adaptations: {
        visualSupport: '/images/assessments/autism/routines.svg'
      }
    },
    {
      id: 4,
      assessmentType: AssessmentType.SOCIAL_COMMUNICATION,
      text: 'How difficult is it for you to adapt when plans change unexpectedly?',
      options: [
        {
          id: 'fp2_1',
          text: 'Not difficult at all',
          value: 1,
          indicators: { flexibilityPreferences: 1 }
        },
        {
          id: 'fp2_2',
          text: 'Slightly difficult',
          value: 3,
          indicators: { flexibilityPreferences: 3 }
        },
        {
          id: 'fp2_3',
          text: 'Moderately difficult',
          value: 7,
          indicators: { flexibilityPreferences: 7 }
        },
        {
          id: 'fp2_4',
          text: 'Very difficult',
          value: 10,
          indicators: { flexibilityPreferences: 10 }
        }
      ]
    },
    
    // Sensory Sensitivity
    {
      id: 5,
      assessmentType: AssessmentType.SOCIAL_COMMUNICATION,
      text: 'How often are you bothered by certain sounds, lights, textures, or other sensory experiences?',
      options: [
        {
          id: 'ss1_1',
          text: 'Never or rarely',
          value: 1,
          indicators: { sensorySensitivity: 1 }
        },
        {
          id: 'ss1_2',
          text: 'Occasionally',
          value: 3,
          indicators: { sensorySensitivity: 3 }
        },
        {
          id: 'ss1_3',
          text: 'Often',
          value: 7,
          indicators: { sensorySensitivity: 7 }
        },
        {
          id: 'ss1_4',
          text: 'Always or almost always',
          value: 10,
          indicators: { sensorySensitivity: 10 }
        }
      ],
      adaptations: {
        visualSupport: '/images/assessments/autism/sensory-sensitivity.svg'
      }
    },
    {
      id: 6,
      assessmentType: AssessmentType.SOCIAL_COMMUNICATION,
      text: 'How difficult is it for you to focus in environments with multiple sensory inputs (sounds, movements, visual stimuli)?',
      options: [
        {
          id: 'ss2_1',
          text: 'Not difficult at all',
          value: 1,
          indicators: { sensorySensitivity: 1 }
        },
        {
          id: 'ss2_2',
          text: 'Slightly difficult',
          value: 3,
          indicators: { sensorySensitivity: 3 }
        },
        {
          id: 'ss2_3',
          text: 'Moderately difficult',
          value: 7,
          indicators: { sensorySensitivity: 7 }
        },
        {
          id: 'ss2_4',
          text: 'Very difficult',
          value: 10,
          indicators: { sensorySensitivity: 10 }
        }
      ]
    },
    
    // Pattern Recognition
    {
      id: 7,
      assessmentType: AssessmentType.SOCIAL_COMMUNICATION,
      text: 'How good are you at recognizing patterns, sequences, or details that others might miss?',
      options: [
        {
          id: 'pr1_1',
          text: 'Not very good',
          value: 1,
          indicators: { patternRecognition: 1 }
        },
        {
          id: 'pr1_2',
          text: 'Somewhat good',
          value: 3,
          indicators: { patternRecognition: 3 }
        },
        {
          id: 'pr1_3',
          text: 'Very good',
          value: 7,
          indicators: { patternRecognition: 7 }
        },
        {
          id: 'pr1_4',
          text: 'Exceptionally good',
          value: 10,
          indicators: { patternRecognition: 10 }
        }
      ]
    },
    {
      id: 8,
      assessmentType: AssessmentType.SOCIAL_COMMUNICATION,
      text: 'How often do you notice inconsistencies or errors in information that others might overlook?',
      options: [
        {
          id: 'pr2_1',
          text: 'Never or rarely',
          value: 1,
          indicators: { patternRecognition: 1 }
        },
        {
          id: 'pr2_2',
          text: 'Occasionally',
          value: 3,
          indicators: { patternRecognition: 3 }
        },
        {
          id: 'pr2_3',
          text: 'Often',
          value: 7,
          indicators: { patternRecognition: 7 }
        },
        {
          id: 'pr2_4',
          text: 'Always or almost always',
          value: 10,
          indicators: { patternRecognition: 10 }
        }
      ],
      adaptations: {
        visualSupport: '/images/assessments/autism/pattern-recognition.svg'
      }
    },
    
    // Special Interest Focus
    {
      id: 9,
      assessmentType: AssessmentType.SOCIAL_COMMUNICATION,
      text: 'How intensely do you focus on topics or activities that interest you?',
      options: [
        {
          id: 'si1_1',
          text: 'No more than average',
          value: 1,
          indicators: { specialInterestFocus: 1 }
        },
        {
          id: 'si1_2',
          text: 'Somewhat more than average',
          value: 3,
          indicators: { specialInterestFocus: 3 }
        },
        {
          id: 'si1_3',
          text: 'Much more than average',
          value: 7,
          indicators: { specialInterestFocus: 7 }
        },
        {
          id: 'si1_4',
          text: 'Extremely more than average',
          value: 10,
          indicators: { specialInterestFocus: 10 }
        }
      ]
    },
    {
      id: 10,
      assessmentType: AssessmentType.SOCIAL_COMMUNICATION,
      text: 'How important is it for you to learn deeply about specific topics that interest you?',
      options: [
        {
          id: 'si2_1',
          text: 'Not important',
          value: 1,
          indicators: { specialInterestFocus: 1 }
        },
        {
          id: 'si2_2',
          text: 'Somewhat important',
          value: 3,
          indicators: { specialInterestFocus: 3 }
        },
        {
          id: 'si2_3',
          text: 'Very important',
          value: 7,
          indicators: { specialInterestFocus: 7 }
        },
        {
          id: 'si2_4',
          text: 'Extremely important',
          value: 10,
          indicators: { specialInterestFocus: 10 }
        }
      ],
      adaptations: {
        visualSupport: '/images/assessments/autism/special-interests.svg'
      }
    },
    
    // Executive Function
    {
      id: 11,
      assessmentType: AssessmentType.SOCIAL_COMMUNICATION,
      text: 'How difficult is it for you to switch your attention between different tasks or activities?',
      options: [
        {
          id: 'ef1_1',
          text: 'Not difficult at all',
          value: 1,
          indicators: { executiveFunction: 1 }
        },
        {
          id: 'ef1_2',
          text: 'Slightly difficult',
          value: 3,
          indicators: { executiveFunction: 3 }
        },
        {
          id: 'ef1_3',
          text: 'Moderately difficult',
          value: 7,
          indicators: { executiveFunction: 7 }
        },
        {
          id: 'ef1_4',
          text: 'Very difficult',
          value: 10,
          indicators: { executiveFunction: 10 }
        }
      ]
    },
    {
      id: 12,
      assessmentType: AssessmentType.SOCIAL_COMMUNICATION,
      text: 'How often do you need support with planning and organizing multi-step tasks?',
      options: [
        {
          id: 'ef2_1',
          text: 'Never or rarely',
          value: 1,
          indicators: { executiveFunction: 1 }
        },
        {
          id: 'ef2_2',
          text: 'Occasionally',
          value: 3,
          indicators: { executiveFunction: 3 }
        },
        {
          id: 'ef2_3',
          text: 'Often',
          value: 7,
          indicators: { executiveFunction: 7 }
        },
        {
          id: 'ef2_4',
          text: 'Always or almost always',
          value: 10,
          indicators: { executiveFunction: 10 }
        }
      ],
      adaptations: {
        visualSupport: '/images/assessments/autism/executive-function.svg'
      }
    }
  ];
}

/**
 * Process results from a completed autism spectrum assessment
 */
export function processAutismSpectrumAssessmentResults(answers: Record<number, string>): AutismSpectrumIndicators {
  // Initialize all indicators at 0
  const indicators: AutismSpectrumIndicators = {
    socialCommunication: 0,
    flexibilityPreferences: 0,
    sensorySensitivity: 0,
    patternRecognition: 0,
    specialInterestFocus: 0,
    executiveFunction: 0
  };
  
  // Get all questions
  const questions = generateAutismSpectrumQuestions();
  
  // Process each answer
  let counts: Record<keyof AutismSpectrumIndicators, number> = {
    socialCommunication: 0,
    flexibilityPreferences: 0,
    sensorySensitivity: 0,
    patternRecognition: 0,
    specialInterestFocus: 0,
    executiveFunction: 0
  };
  
  Object.entries(answers).forEach(([questionIdStr, answerId]) => {
    const questionId = parseInt(questionIdStr);
    const question = questions.find(q => q.id === questionId);
    
    if (!question) return;
    
    const option = question.options.find(o => o.id === answerId);
    if (!option || !option.indicators) return;
    
    // Add indicator values
    Object.entries(option.indicators).forEach(([indicator, value]) => {
      const indicatorKey = indicator as keyof AutismSpectrumIndicators;
      if (indicatorKey in indicators) {
        indicators[indicatorKey] += value;
        counts[indicatorKey]++;
      }
    });
  });
  
  // Calculate averages for each indicator
  Object.keys(indicators).forEach(key => {
    const indicatorKey = key as keyof AutismSpectrumIndicators;
    if (counts[indicatorKey] > 0) {
      indicators[indicatorKey] = Math.round(indicators[indicatorKey] / counts[indicatorKey]);
    }
  });
  
  return indicators;
}

/**
 * Generate adaptation recommendations based on assessment results
 */
export function generateAutismSpectrumAdaptations(
  indicators: AutismSpectrumIndicators,
  adaptationLevel: AdaptationLevel
): Record<AdaptationCategory, string[]> {
  const adaptations: Record<AdaptationCategory, string[]> = {
    [AdaptationCategory.TEXT_PRESENTATION]: [],
    [AdaptationCategory.CONTENT_ORGANIZATION]: [],
    [AdaptationCategory.SENSORY_CONSIDERATIONS]: [],
    [AdaptationCategory.FOCUS_SUPPORTS]: [],
    [AdaptationCategory.PROCESSING_TIME]: [],
    [AdaptationCategory.INTERACTIVE_ELEMENTS]: []
  };
  
  // Add sensory considerations adaptations
  if (indicators.sensorySensitivity > 5) {
    const sensoryAdaptations = autismSpectrumAdaptations[AdaptationCategory.SENSORY_CONSIDERATIONS]
      .filter(a => adaptationLevelValue(a.level) <= adaptationLevelValue(adaptationLevel))
      .map(a => a.name);
      
    adaptations[AdaptationCategory.SENSORY_CONSIDERATIONS] = sensoryAdaptations;
  }
  
  // Add content organization adaptations
  if (indicators.flexibilityPreferences > 5 || indicators.executiveFunction > 5) {
    const orgAdaptations = autismSpectrumAdaptations[AdaptationCategory.CONTENT_ORGANIZATION]
      .filter(a => adaptationLevelValue(a.level) <= adaptationLevelValue(adaptationLevel))
      .map(a => a.name);
      
    adaptations[AdaptationCategory.CONTENT_ORGANIZATION] = orgAdaptations;
  }
  
  // Add interactive elements adaptations
  if (indicators.socialCommunication > 5 || indicators.patternRecognition > 5) {
    const interactiveAdaptations = autismSpectrumAdaptations[AdaptationCategory.INTERACTIVE_ELEMENTS]
      .filter(a => adaptationLevelValue(a.level) <= adaptationLevelValue(adaptationLevel))
      .map(a => a.name);
      
    adaptations[AdaptationCategory.INTERACTIVE_ELEMENTS] = interactiveAdaptations;
  }
  
  // Add text presentation adaptations
  if (indicators.socialCommunication > 6) {
    adaptations[AdaptationCategory.TEXT_PRESENTATION] = [
      'Clear, literal language',
      'Visual supports for abstract concepts',
      'Consistent terminology',
      'Explicit definitions for uncommon terms'
    ];
  }
  
  // Add processing time adaptations for executive function challenges
  if (indicators.executiveFunction > 6) {
    adaptations[AdaptationCategory.PROCESSING_TIME] = [
      'Self-paced learning progression',
      'Extended time for transitions between activities',
      'Step-by-step guidance for complex tasks',
      'Ample processing time for new concepts'
    ];
  }
  
  // Add focus supports that leverage special interests
  if (indicators.specialInterestFocus > 7) {
    adaptations[AdaptationCategory.FOCUS_SUPPORTS] = [
      'Special interest integration into content',
      'Interest-based examples and activities',
      'Pattern-based learning approaches',
      'Thematic connections to areas of expertise'
    ];
  }
  
  return adaptations;
}

/**
 * Convert adaptation level to numeric value for comparison
 */
function adaptationLevelValue(level: AdaptationLevel): number {
  switch (level) {
    case AdaptationLevel.MINIMAL:
      return 1;
    case AdaptationLevel.MODERATE:
      return 2;
    case AdaptationLevel.SIGNIFICANT:
      return 3;
    default:
      return 0;
  }
}