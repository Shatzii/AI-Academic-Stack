/**
 * ADHD Assessment Module
 * 
 * A specialized assessment module for identifying ADHD-specific learning needs
 * and generating appropriate adaptations for personalized learning.
 */

import { 
  AssessmentType, 
  AssessmentModule, 
  AssessmentQuestion, 
  AssessmentOption, 
  ResultScale,
  ADHDIndicators
} from '../assessment-framework';
import { AdaptationCategory, AdaptationLevel } from '../learning-profile-service';

/**
 * ADHD Assessment Subtypes
 */
export enum ADHDAssessmentArea {
  ATTENTION = 'sustained_attention',
  IMPULSE_CONTROL = 'impulse_control',
  HYPERACTIVITY = 'hyperactivity',
  TASK_PERSISTENCE = 'task_persistence',
  ORGANIZATION = 'organizational_skills',
  WORKING_MEMORY = 'working_memory'
}

/**
 * ADHD-Specific Adaptations
 */
export const adhdAdaptations = {
  [AdaptationCategory.FOCUS_SUPPORTS]: [
    {
      name: 'Distraction-reduced interface',
      description: 'Clean, minimal UI with reduced visual distractions',
      level: AdaptationLevel.MINIMAL
    },
    {
      name: 'Time management tools',
      description: 'Visual timers, progress bars, and time estimation guides',
      level: AdaptationLevel.MINIMAL
    },
    {
      name: 'Focus mode',
      description: 'Option to temporarily hide non-essential screen elements',
      level: AdaptationLevel.MODERATE
    },
    {
      name: 'Scheduled movement breaks',
      description: 'Integrated movement break reminders between learning activities',
      level: AdaptationLevel.MODERATE
    },
    {
      name: 'Adaptive difficulty',
      description: 'Automatic adjustment of difficulty based on attention patterns',
      level: AdaptationLevel.SIGNIFICANT
    },
    {
      name: 'Gamified focus tracking',
      description: 'Game elements that reward sustained attention',
      level: AdaptationLevel.SIGNIFICANT
    }
  ],
  [AdaptationCategory.CONTENT_ORGANIZATION]: [
    {
      name: 'Clear visual structure',
      description: 'Consistently organized content with visual cues for navigation',
      level: AdaptationLevel.MINIMAL
    },
    {
      name: 'Progress tracking',
      description: 'Visual representation of progress and completion status',
      level: AdaptationLevel.MINIMAL
    },
    {
      name: 'Task checklists',
      description: 'Interactive checklists for multi-step activities',
      level: AdaptationLevel.MODERATE
    },
    {
      name: 'Graphic organizers',
      description: 'Visual frameworks for organizing information and ideas',
      level: AdaptationLevel.MODERATE
    },
    {
      name: 'Step-by-step instructions',
      description: 'Clear, sequential instructions with one step visible at a time',
      level: AdaptationLevel.SIGNIFICANT
    }
  ],
  [AdaptationCategory.INTERACTIVE_ELEMENTS]: [
    {
      name: 'Interactive engagement',
      description: 'Regular interactive elements that require active participation',
      level: AdaptationLevel.MINIMAL
    },
    {
      name: 'Immediate feedback',
      description: 'Instant feedback on actions and responses',
      level: AdaptationLevel.MINIMAL
    },
    {
      name: 'Multimodal learning',
      description: 'Content presented through multiple sensory channels',
      level: AdaptationLevel.MODERATE
    },
    {
      name: 'Movement-based interactions',
      description: 'Learning activities that incorporate physical movement',
      level: AdaptationLevel.SIGNIFICANT
    }
  ]
};

/**
 * Create the ADHD assessment module
 */
export const createADHDAssessmentModule = (): AssessmentModule => {
  return {
    type: AssessmentType.ATTENTION_ASSESSMENT,
    name: 'Attention and Executive Function Assessment',
    description: 'A comprehensive assessment of attention patterns and executive function skills designed to identify ADHD-specific learning needs.',
    targetAgeRange: [6, 18], // Ages 6-18
    estimatedTimeMinutes: 15,
    requiresSpecialist: false,
    questions: generateADHDQuestions(),
    resultSchema: {
      sustainedAttention: ResultScale.NUMERIC_SCALE,
      impulseControl: ResultScale.NUMERIC_SCALE,
      hyperactivity: ResultScale.NUMERIC_SCALE,
      taskPersistence: ResultScale.NUMERIC_SCALE,
      organizationalSkills: ResultScale.NUMERIC_SCALE,
      workingMemory: ResultScale.NUMERIC_SCALE
    }
  };
};

/**
 * Generate the assessment questions for ADHD assessment
 */
function generateADHDQuestions(): AssessmentQuestion[] {
  return [
    // Sustained Attention
    {
      id: 1,
      assessmentType: AssessmentType.ATTENTION_ASSESSMENT,
      text: 'How often do you have trouble staying focused on tasks that require sustained mental effort?',
      options: [
        {
          id: 'sa1_1',
          text: 'Never or rarely',
          value: 1,
          indicators: { sustainedAttention: 1 }
        },
        {
          id: 'sa1_2',
          text: 'Occasionally',
          value: 3,
          indicators: { sustainedAttention: 3 }
        },
        {
          id: 'sa1_3',
          text: 'Often',
          value: 7,
          indicators: { sustainedAttention: 7 }
        },
        {
          id: 'sa1_4',
          text: 'Always or almost always',
          value: 10,
          indicators: { sustainedAttention: 10 }
        }
      ],
      adaptations: {
        visualSupport: '/images/assessments/adhd/sustained-attention.svg'
      }
    },
    {
      id: 2,
      assessmentType: AssessmentType.ATTENTION_ASSESSMENT,
      text: 'How easily are you distracted by unrelated thoughts or stimuli in your environment?',
      options: [
        {
          id: 'sa2_1',
          text: 'Not easily at all',
          value: 1,
          indicators: { sustainedAttention: 1 }
        },
        {
          id: 'sa2_2',
          text: 'Somewhat easily',
          value: 3,
          indicators: { sustainedAttention: 3 }
        },
        {
          id: 'sa2_3',
          text: 'Quite easily',
          value: 7,
          indicators: { sustainedAttention: 7 }
        },
        {
          id: 'sa2_4',
          text: 'Extremely easily',
          value: 10,
          indicators: { sustainedAttention: 10 }
        }
      ]
    },
    
    // Impulse Control
    {
      id: 3,
      assessmentType: AssessmentType.ATTENTION_ASSESSMENT,
      text: 'How often do you find yourself interrupting others when they are speaking?',
      options: [
        {
          id: 'ic1_1',
          text: 'Never or rarely',
          value: 1,
          indicators: { impulseControl: 1 }
        },
        {
          id: 'ic1_2',
          text: 'Occasionally',
          value: 3,
          indicators: { impulseControl: 3 }
        },
        {
          id: 'ic1_3',
          text: 'Often',
          value: 7,
          indicators: { impulseControl: 7 }
        },
        {
          id: 'ic1_4',
          text: 'Always or almost always',
          value: 10,
          indicators: { impulseControl: 10 }
        }
      ]
    },
    {
      id: 4,
      assessmentType: AssessmentType.ATTENTION_ASSESSMENT,
      text: 'How difficult is it for you to wait your turn in activities or conversations?',
      options: [
        {
          id: 'ic2_1',
          text: 'Not difficult at all',
          value: 1,
          indicators: { impulseControl: 1 }
        },
        {
          id: 'ic2_2',
          text: 'Slightly difficult',
          value: 3,
          indicators: { impulseControl: 3 }
        },
        {
          id: 'ic2_3',
          text: 'Moderately difficult',
          value: 7,
          indicators: { impulseControl: 7 }
        },
        {
          id: 'ic2_4',
          text: 'Very difficult',
          value: 10,
          indicators: { impulseControl: 10 }
        }
      ]
    },
    
    // Hyperactivity
    {
      id: 5,
      assessmentType: AssessmentType.ATTENTION_ASSESSMENT,
      text: 'How often do you feel the need to move or fidget when you\'re expected to stay still?',
      options: [
        {
          id: 'h1_1',
          text: 'Never or rarely',
          value: 1,
          indicators: { hyperactivity: 1 }
        },
        {
          id: 'h1_2',
          text: 'Occasionally',
          value: 3,
          indicators: { hyperactivity: 3 }
        },
        {
          id: 'h1_3',
          text: 'Often',
          value: 7,
          indicators: { hyperactivity: 7 }
        },
        {
          id: 'h1_4',
          text: 'Always or almost always',
          value: 10,
          indicators: { hyperactivity: 10 }
        }
      ],
      adaptations: {
        visualSupport: '/images/assessments/adhd/hyperactivity.svg'
      }
    },
    {
      id: 6,
      assessmentType: AssessmentType.ATTENTION_ASSESSMENT,
      text: 'How difficult is it for you to engage in leisure activities quietly?',
      options: [
        {
          id: 'h2_1',
          text: 'Not difficult at all',
          value: 1,
          indicators: { hyperactivity: 1 }
        },
        {
          id: 'h2_2',
          text: 'Slightly difficult',
          value: 3,
          indicators: { hyperactivity: 3 }
        },
        {
          id: 'h2_3',
          text: 'Moderately difficult',
          value: 7,
          indicators: { hyperactivity: 7 }
        },
        {
          id: 'h2_4',
          text: 'Very difficult',
          value: 10,
          indicators: { hyperactivity: 10 }
        }
      ]
    },
    
    // Task Persistence
    {
      id: 7,
      assessmentType: AssessmentType.ATTENTION_ASSESSMENT,
      text: 'How often do you start tasks but have difficulty finishing them?',
      options: [
        {
          id: 'tp1_1',
          text: 'Never or rarely',
          value: 1,
          indicators: { taskPersistence: 1 }
        },
        {
          id: 'tp1_2',
          text: 'Occasionally',
          value: 3,
          indicators: { taskPersistence: 3 }
        },
        {
          id: 'tp1_3',
          text: 'Often',
          value: 7,
          indicators: { taskPersistence: 7 }
        },
        {
          id: 'tp1_4',
          text: 'Always or almost always',
          value: 10,
          indicators: { taskPersistence: 10 }
        }
      ]
    },
    {
      id: 8,
      assessmentType: AssessmentType.ATTENTION_ASSESSMENT,
      text: 'How difficult is it for you to maintain effort throughout a longer assignment or project?',
      options: [
        {
          id: 'tp2_1',
          text: 'Not difficult at all',
          value: 1,
          indicators: { taskPersistence: 1, sustainedAttention: 1 }
        },
        {
          id: 'tp2_2',
          text: 'Slightly difficult',
          value: 3,
          indicators: { taskPersistence: 3, sustainedAttention: 3 }
        },
        {
          id: 'tp2_3',
          text: 'Moderately difficult',
          value: 7,
          indicators: { taskPersistence: 7, sustainedAttention: 7 }
        },
        {
          id: 'tp2_4',
          text: 'Very difficult',
          value: 10,
          indicators: { taskPersistence: 10, sustainedAttention: 10 }
        }
      ]
    },
    
    // Organizational Skills
    {
      id: 9,
      assessmentType: AssessmentType.ATTENTION_ASSESSMENT,
      text: 'How often do you have trouble organizing tasks and activities?',
      options: [
        {
          id: 'os1_1',
          text: 'Never or rarely',
          value: 1,
          indicators: { organizationalSkills: 1 }
        },
        {
          id: 'os1_2',
          text: 'Occasionally',
          value: 3,
          indicators: { organizationalSkills: 3 }
        },
        {
          id: 'os1_3',
          text: 'Often',
          value: 7,
          indicators: { organizationalSkills: 7 }
        },
        {
          id: 'os1_4',
          text: 'Always or almost always',
          value: 10,
          indicators: { organizationalSkills: 10 }
        }
      ],
      adaptations: {
        visualSupport: '/images/assessments/adhd/organization.svg'
      }
    },
    {
      id: 10,
      assessmentType: AssessmentType.ATTENTION_ASSESSMENT,
      text: 'How difficult is it for you to keep track of materials and belongings?',
      options: [
        {
          id: 'os2_1',
          text: 'Not difficult at all',
          value: 1,
          indicators: { organizationalSkills: 1 }
        },
        {
          id: 'os2_2',
          text: 'Slightly difficult',
          value: 3,
          indicators: { organizationalSkills: 3 }
        },
        {
          id: 'os2_3',
          text: 'Moderately difficult',
          value: 7,
          indicators: { organizationalSkills: 7 }
        },
        {
          id: 'os2_4',
          text: 'Very difficult',
          value: 10,
          indicators: { organizationalSkills: 10 }
        }
      ]
    },
    
    // Working Memory
    {
      id: 11,
      assessmentType: AssessmentType.ATTENTION_ASSESSMENT,
      text: 'How often do you forget what you were doing in the middle of a task?',
      options: [
        {
          id: 'wm1_1',
          text: 'Never or rarely',
          value: 1,
          indicators: { workingMemory: 1 }
        },
        {
          id: 'wm1_2',
          text: 'Occasionally',
          value: 3,
          indicators: { workingMemory: 3 }
        },
        {
          id: 'wm1_3',
          text: 'Often',
          value: 7,
          indicators: { workingMemory: 7 }
        },
        {
          id: 'wm1_4',
          text: 'Always or almost always',
          value: 10,
          indicators: { workingMemory: 10 }
        }
      ]
    },
    {
      id: 12,
      assessmentType: AssessmentType.ATTENTION_ASSESSMENT,
      text: 'How difficult is it for you to remember multi-step instructions?',
      options: [
        {
          id: 'wm2_1',
          text: 'Not difficult at all',
          value: 1,
          indicators: { workingMemory: 1 }
        },
        {
          id: 'wm2_2',
          text: 'Slightly difficult',
          value: 3,
          indicators: { workingMemory: 3 }
        },
        {
          id: 'wm2_3',
          text: 'Moderately difficult',
          value: 7,
          indicators: { workingMemory: 7 }
        },
        {
          id: 'wm2_4',
          text: 'Very difficult',
          value: 10,
          indicators: { workingMemory: 10 }
        }
      ],
      adaptations: {
        visualSupport: '/images/assessments/adhd/working-memory.svg'
      }
    }
  ];
}

/**
 * Process results from a completed ADHD assessment
 */
export function processADHDAssessmentResults(answers: Record<number, string>): ADHDIndicators {
  // Initialize all indicators at 0
  const indicators: ADHDIndicators = {
    sustainedAttention: 0,
    impulseControl: 0,
    hyperactivity: 0,
    taskPersistence: 0,
    organizationalSkills: 0,
    workingMemory: 0
  };
  
  // Get all questions
  const questions = generateADHDQuestions();
  
  // Process each answer
  let counts: Record<keyof ADHDIndicators, number> = {
    sustainedAttention: 0,
    impulseControl: 0,
    hyperactivity: 0,
    taskPersistence: 0,
    organizationalSkills: 0,
    workingMemory: 0
  };
  
  Object.entries(answers).forEach(([questionIdStr, answerId]) => {
    const questionId = parseInt(questionIdStr);
    const question = questions.find(q => q.id === questionId);
    
    if (!question) return;
    
    const option = question.options.find(o => o.id === answerId);
    if (!option || !option.indicators) return;
    
    // Add indicator values
    Object.entries(option.indicators).forEach(([indicator, value]) => {
      const indicatorKey = indicator as keyof ADHDIndicators;
      if (indicatorKey in indicators) {
        indicators[indicatorKey] += value;
        counts[indicatorKey]++;
      }
    });
  });
  
  // Calculate averages for each indicator
  Object.keys(indicators).forEach(key => {
    const indicatorKey = key as keyof ADHDIndicators;
    if (counts[indicatorKey] > 0) {
      indicators[indicatorKey] = Math.round(indicators[indicatorKey] / counts[indicatorKey]);
    }
  });
  
  return indicators;
}

/**
 * Generate adaptation recommendations based on assessment results
 */
export function generateADHDAdaptations(
  indicators: ADHDIndicators,
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
  
  // Add focus support adaptations
  if (indicators.sustainedAttention > 5 || indicators.hyperactivity > 5) {
    const focusAdaptations = adhdAdaptations[AdaptationCategory.FOCUS_SUPPORTS]
      .filter(a => adaptationLevelValue(a.level) <= adaptationLevelValue(adaptationLevel))
      .map(a => a.name);
      
    adaptations[AdaptationCategory.FOCUS_SUPPORTS] = focusAdaptations;
  }
  
  // Add content organization adaptations
  if (indicators.organizationalSkills > 5 || indicators.taskPersistence > 5) {
    const orgAdaptations = adhdAdaptations[AdaptationCategory.CONTENT_ORGANIZATION]
      .filter(a => adaptationLevelValue(a.level) <= adaptationLevelValue(adaptationLevel))
      .map(a => a.name);
      
    adaptations[AdaptationCategory.CONTENT_ORGANIZATION] = orgAdaptations;
  }
  
  // Add interactive elements adaptations
  if (indicators.sustainedAttention > 6 || indicators.hyperactivity > 6) {
    const interactiveAdaptations = adhdAdaptations[AdaptationCategory.INTERACTIVE_ELEMENTS]
      .filter(a => adaptationLevelValue(a.level) <= adaptationLevelValue(adaptationLevel))
      .map(a => a.name);
      
    adaptations[AdaptationCategory.INTERACTIVE_ELEMENTS] = interactiveAdaptations;
  }
  
  // Add text presentation adaptations for working memory issues
  if (indicators.workingMemory > 6) {
    adaptations[AdaptationCategory.TEXT_PRESENTATION] = [
      'Chunked text with visual breaks',
      'Key information highlighted',
      'Important terms bolded',
      'Visual summaries and reminders'
    ];
  }
  
  // Add processing time adaptations
  if (indicators.taskPersistence > 6) {
    adaptations[AdaptationCategory.PROCESSING_TIME] = [
      'Self-paced progression through content',
      'Checkpoint reminders for progress',
      'Shorter learning sessions with frequent breaks',
      'Option to extend time on activities'
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