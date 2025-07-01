/**
 * Dyslexia Assessment Module
 * 
 * A specialized assessment module for identifying dyslexia-specific learning needs
 * and generating appropriate adaptations for personalized learning.
 */

import { 
  AssessmentType, 
  AssessmentModule, 
  AssessmentQuestion, 
  AssessmentOption, 
  ResultScale,
  DyslexiaIndicators
} from '../assessment-framework';
import { AdaptationCategory, AdaptationLevel } from '../learning-profile-service';

/**
 * Dyslexia Assessment Subtypes
 */
export enum DyslexiaAssessmentArea {
  PHONOLOGICAL = 'phonological_awareness',
  DECODING = 'decoding_ability',
  FLUENCY = 'reading_fluency',
  COMPREHENSION = 'reading_comprehension',
  SPELLING = 'spelling_patterns',
  VISUAL_PROCESSING = 'visual_processing'
}

/**
 * Dyslexia-Specific Adaptations
 */
export const dyslexiaAdaptations = {
  [AdaptationCategory.TEXT_PRESENTATION]: [
    {
      name: 'Dyslexia-friendly font',
      description: 'Use specialized fonts designed for dyslexic readers that increase readability',
      level: AdaptationLevel.MINIMAL
    },
    {
      name: 'Text spacing adjustments',
      description: 'Increased letter spacing, word spacing, and line height',
      level: AdaptationLevel.MINIMAL
    },
    {
      name: 'Color overlays',
      description: 'Optional colored backgrounds or overlays to reduce visual stress',
      level: AdaptationLevel.MODERATE
    },
    {
      name: 'Text-to-speech integration',
      description: 'Built-in text-to-speech functionality for all written content',
      level: AdaptationLevel.SIGNIFICANT
    }
  ],
  [AdaptationCategory.CONTENT_ORGANIZATION]: [
    {
      name: 'Chunked content',
      description: 'Break text into smaller, manageable sections',
      level: AdaptationLevel.MINIMAL
    },
    {
      name: 'Visual supports',
      description: 'Include diagrams, images, and visual organizers alongside text',
      level: AdaptationLevel.MODERATE
    },
    {
      name: 'Pre-teaching vocabulary',
      description: 'Introduce and explain key terminology before main content',
      level: AdaptationLevel.MODERATE
    },
    {
      name: 'Multi-sensory presentation',
      description: 'Present content through multiple modalities (visual, auditory, kinesthetic)',
      level: AdaptationLevel.SIGNIFICANT
    }
  ],
  [AdaptationCategory.PROCESSING_TIME]: [
    {
      name: 'Extended time',
      description: 'Allow additional time for reading and processing text',
      level: AdaptationLevel.MINIMAL
    },
    {
      name: 'Self-paced progress',
      description: 'Enable learner control over advancement through material',
      level: AdaptationLevel.MODERATE
    },
    {
      name: 'Recursive learning',
      description: 'Build in opportunities to revisit and reinforce content',
      level: AdaptationLevel.SIGNIFICANT
    }
  ]
};

/**
 * Create the dyslexia assessment module
 */
export const createDyslexiaAssessmentModule = (): AssessmentModule => {
  return {
    type: AssessmentType.READING_SKILLS,
    name: 'Reading Skills Profile Assessment',
    description: 'A comprehensive assessment of reading skills designed to identify dyslexia-specific learning needs.',
    targetAgeRange: [6, 18], // Ages 6-18
    estimatedTimeMinutes: 20,
    requiresSpecialist: false,
    questions: generateDyslexiaQuestions(),
    resultSchema: {
      readingFluency: ResultScale.NUMERIC_SCALE,
      phonologicalAwareness: ResultScale.NUMERIC_SCALE,
      spelling: ResultScale.NUMERIC_SCALE,
      wordRecognition: ResultScale.NUMERIC_SCALE,
      sequencing: ResultScale.NUMERIC_SCALE,
      processingSpeed: ResultScale.NUMERIC_SCALE
    }
  };
};

/**
 * Generate the assessment questions for dyslexia assessment
 */
function generateDyslexiaQuestions(): AssessmentQuestion[] {
  return [
    // Phonological Awareness
    {
      id: 1,
      assessmentType: AssessmentType.READING_SKILLS,
      text: 'How often do you have difficulty recognizing or producing rhyming words?',
      options: [
        {
          id: 'p1_1',
          text: 'Never or rarely',
          value: 1,
          indicators: { phonologicalAwareness: 1 }
        },
        {
          id: 'p1_2',
          text: 'Occasionally',
          value: 3,
          indicators: { phonologicalAwareness: 3 }
        },
        {
          id: 'p1_3',
          text: 'Often',
          value: 7,
          indicators: { phonologicalAwareness: 7 }
        },
        {
          id: 'p1_4',
          text: 'Always or almost always',
          value: 10,
          indicators: { phonologicalAwareness: 10 }
        }
      ],
      adaptations: {
        audioSupport: '/audio/assessments/dyslexia/question1.mp3',
        visualSupport: '/images/assessments/dyslexia/rhyming-words.svg'
      }
    },
    {
      id: 2,
      assessmentType: AssessmentType.READING_SKILLS,
      text: 'How difficult is it for you to break words down into individual sounds?',
      options: [
        {
          id: 'p2_1',
          text: 'Not difficult at all',
          value: 1,
          indicators: { phonologicalAwareness: 1 }
        },
        {
          id: 'p2_2',
          text: 'Slightly difficult',
          value: 3,
          indicators: { phonologicalAwareness: 3 }
        },
        {
          id: 'p2_3',
          text: 'Moderately difficult',
          value: 7,
          indicators: { phonologicalAwareness: 7 }
        },
        {
          id: 'p2_4',
          text: 'Very difficult',
          value: 10,
          indicators: { phonologicalAwareness: 10 }
        }
      ],
      adaptations: {
        audioSupport: '/audio/assessments/dyslexia/question2.mp3',
        visualSupport: '/images/assessments/dyslexia/word-sounds.svg'
      }
    },
    
    // Reading Fluency
    {
      id: 3,
      assessmentType: AssessmentType.READING_SKILLS,
      text: 'When reading aloud, how often do you read slowly or with great effort?',
      options: [
        {
          id: 'f1_1',
          text: 'Never or rarely',
          value: 1,
          indicators: { readingFluency: 1 }
        },
        {
          id: 'f1_2',
          text: 'Occasionally',
          value: 3,
          indicators: { readingFluency: 3 }
        },
        {
          id: 'f1_3',
          text: 'Often',
          value: 7,
          indicators: { readingFluency: 7 }
        },
        {
          id: 'f1_4',
          text: 'Always or almost always',
          value: 10,
          indicators: { readingFluency: 10 }
        }
      ]
    },
    {
      id: 4,
      assessmentType: AssessmentType.READING_SKILLS,
      text: 'How often do you need to re-read text to understand it?',
      options: [
        {
          id: 'f2_1',
          text: 'Never or rarely',
          value: 1,
          indicators: { readingFluency: 1, processingSpeed: 1 }
        },
        {
          id: 'f2_2',
          text: 'Occasionally',
          value: 3,
          indicators: { readingFluency: 3, processingSpeed: 3 }
        },
        {
          id: 'f2_3',
          text: 'Often',
          value: 7,
          indicators: { readingFluency: 7, processingSpeed: 7 }
        },
        {
          id: 'f2_4',
          text: 'Always or almost always',
          value: 10,
          indicators: { readingFluency: 10, processingSpeed: 10 }
        }
      ]
    },
    
    // Word Recognition
    {
      id: 5,
      assessmentType: AssessmentType.READING_SKILLS,
      text: 'How often do you have trouble recognizing common words by sight?',
      options: [
        {
          id: 'w1_1',
          text: 'Never or rarely',
          value: 1,
          indicators: { wordRecognition: 1 }
        },
        {
          id: 'w1_2',
          text: 'Occasionally',
          value: 3,
          indicators: { wordRecognition: 3 }
        },
        {
          id: 'w1_3',
          text: 'Often',
          value: 7,
          indicators: { wordRecognition: 7 }
        },
        {
          id: 'w1_4',
          text: 'Always or almost always',
          value: 10,
          indicators: { wordRecognition: 10 }
        }
      ],
      adaptations: {
        visualSupport: '/images/assessments/dyslexia/sight-words.svg'
      }
    },
    
    // Spelling
    {
      id: 6,
      assessmentType: AssessmentType.READING_SKILLS,
      text: 'How difficult is it for you to spell words correctly, even common words?',
      options: [
        {
          id: 's1_1',
          text: 'Not difficult at all',
          value: 1,
          indicators: { spelling: 1 }
        },
        {
          id: 's1_2',
          text: 'Slightly difficult',
          value: 3,
          indicators: { spelling: 3 }
        },
        {
          id: 's1_3',
          text: 'Moderately difficult',
          value: 7,
          indicators: { spelling: 7 }
        },
        {
          id: 's1_4',
          text: 'Very difficult',
          value: 10,
          indicators: { spelling: 10 }
        }
      ]
    },
    {
      id: 7,
      assessmentType: AssessmentType.READING_SKILLS,
      text: 'How often do you mix up the order of letters when spelling?',
      options: [
        {
          id: 's2_1',
          text: 'Never or rarely',
          value: 1,
          indicators: { spelling: 1, sequencing: 1 }
        },
        {
          id: 's2_2',
          text: 'Occasionally',
          value: 3,
          indicators: { spelling: 3, sequencing: 3 }
        },
        {
          id: 's2_3',
          text: 'Often',
          value: 7,
          indicators: { spelling: 7, sequencing: 7 }
        },
        {
          id: 's2_4',
          text: 'Always or almost always',
          value: 10,
          indicators: { spelling: 10, sequencing: 10 }
        }
      ]
    },
    
    // Sequencing
    {
      id: 8,
      assessmentType: AssessmentType.READING_SKILLS,
      text: 'How difficult is it for you to remember the correct order of things (like days of the week, months, or steps in a process)?',
      options: [
        {
          id: 'seq1_1',
          text: 'Not difficult at all',
          value: 1,
          indicators: { sequencing: 1 }
        },
        {
          id: 'seq1_2',
          text: 'Slightly difficult',
          value: 3,
          indicators: { sequencing: 3 }
        },
        {
          id: 'seq1_3',
          text: 'Moderately difficult',
          value: 7,
          indicators: { sequencing: 7 }
        },
        {
          id: 'seq1_4',
          text: 'Very difficult',
          value: 10,
          indicators: { sequencing: 10 }
        }
      ],
      adaptations: {
        visualSupport: '/images/assessments/dyslexia/sequence-example.svg'
      }
    },
    
    // Processing Speed
    {
      id: 9,
      assessmentType: AssessmentType.READING_SKILLS,
      text: 'How often do you need more time than others to complete reading assignments?',
      options: [
        {
          id: 'ps1_1',
          text: 'Never or rarely',
          value: 1,
          indicators: { processingSpeed: 1 }
        },
        {
          id: 'ps1_2',
          text: 'Occasionally',
          value: 3,
          indicators: { processingSpeed: 3 }
        },
        {
          id: 'ps1_3',
          text: 'Often',
          value: 7,
          indicators: { processingSpeed: 7 }
        },
        {
          id: 'ps1_4',
          text: 'Always or almost always',
          value: 10,
          indicators: { processingSpeed: 10 }
        }
      ]
    },
    {
      id: 10,
      assessmentType: AssessmentType.READING_SKILLS,
      text: 'How difficult is it for you to take notes while listening?',
      options: [
        {
          id: 'ps2_1',
          text: 'Not difficult at all',
          value: 1,
          indicators: { processingSpeed: 1 }
        },
        {
          id: 'ps2_2',
          text: 'Slightly difficult',
          value: 3,
          indicators: { processingSpeed: 3 }
        },
        {
          id: 'ps2_3',
          text: 'Moderately difficult',
          value: 7,
          indicators: { processingSpeed: 7 }
        },
        {
          id: 'ps2_4',
          text: 'Very difficult',
          value: 10,
          indicators: { processingSpeed: 10 }
        }
      ]
    }
  ];
}

/**
 * Process results from a completed dyslexia assessment
 */
export function processDyslexiaAssessmentResults(answers: Record<number, string>): DyslexiaIndicators {
  // Initialize all indicators at 0
  const indicators: DyslexiaIndicators = {
    readingFluency: 0,
    phonologicalAwareness: 0,
    spelling: 0,
    wordRecognition: 0,
    sequencing: 0,
    processingSpeed: 0
  };
  
  // Get all questions
  const questions = generateDyslexiaQuestions();
  
  // Process each answer
  let counts: Record<keyof DyslexiaIndicators, number> = {
    readingFluency: 0,
    phonologicalAwareness: 0,
    spelling: 0,
    wordRecognition: 0,
    sequencing: 0,
    processingSpeed: 0
  };
  
  Object.entries(answers).forEach(([questionIdStr, answerId]) => {
    const questionId = parseInt(questionIdStr);
    const question = questions.find(q => q.id === questionId);
    
    if (!question) return;
    
    const option = question.options.find(o => o.id === answerId);
    if (!option || !option.indicators) return;
    
    // Add indicator values
    Object.entries(option.indicators).forEach(([indicator, value]) => {
      const indicatorKey = indicator as keyof DyslexiaIndicators;
      if (indicatorKey in indicators) {
        indicators[indicatorKey] += value;
        counts[indicatorKey]++;
      }
    });
  });
  
  // Calculate averages for each indicator
  Object.keys(indicators).forEach(key => {
    const indicatorKey = key as keyof DyslexiaIndicators;
    if (counts[indicatorKey] > 0) {
      indicators[indicatorKey] = Math.round(indicators[indicatorKey] / counts[indicatorKey]);
    }
  });
  
  return indicators;
}

/**
 * Generate adaptation recommendations based on assessment results
 */
export function generateDyslexiaAdaptations(
  indicators: DyslexiaIndicators,
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
  
  // Add text presentation adaptations
  if (indicators.readingFluency > 5 || indicators.wordRecognition > 5) {
    const textAdaptations = dyslexiaAdaptations[AdaptationCategory.TEXT_PRESENTATION]
      .filter(a => adaptationLevelValue(a.level) <= adaptationLevelValue(adaptationLevel))
      .map(a => a.name);
      
    adaptations[AdaptationCategory.TEXT_PRESENTATION] = textAdaptations;
  }
  
  // Add content organization adaptations
  if (indicators.sequencing > 5 || indicators.processingSpeed > 5) {
    const orgAdaptations = dyslexiaAdaptations[AdaptationCategory.CONTENT_ORGANIZATION]
      .filter(a => adaptationLevelValue(a.level) <= adaptationLevelValue(adaptationLevel))
      .map(a => a.name);
      
    adaptations[AdaptationCategory.CONTENT_ORGANIZATION] = orgAdaptations;
  }
  
  // Add processing time adaptations
  if (indicators.processingSpeed > 5) {
    const timeAdaptations = dyslexiaAdaptations[AdaptationCategory.PROCESSING_TIME]
      .filter(a => adaptationLevelValue(a.level) <= adaptationLevelValue(adaptationLevel))
      .map(a => a.name);
      
    adaptations[AdaptationCategory.PROCESSING_TIME] = timeAdaptations;
  }
  
  // For interactive elements, consider adding appropriate adaptations
  if (indicators.phonologicalAwareness > 7 || indicators.spelling > 7) {
    adaptations[AdaptationCategory.INTERACTIVE_ELEMENTS] = [
      'Text-to-speech functionality for all content',
      'Speech-to-text options for responses',
      'Interactive word-building activities',
      'Multisensory spelling practice'
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