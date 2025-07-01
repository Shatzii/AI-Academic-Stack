/**
 * Learning Styles Quiz Data and Types
 * 
 * This file contains all the types, questions, and sample data for the
 * learning styles assessment system
 */

export type LearningStyleType = 
  | 'visual' 
  | 'auditory' 
  | 'kinesthetic' 
  | 'reading' 
  | 'multimodal';

/**
 * Quiz Question Interface
 */
export interface QuizQuestion {
  id: number;
  text: string;
  answers: QuizAnswer[];
}

/**
 * Quiz Answer Interface
 */
export interface QuizAnswer {
  id: string;
  text: string;
  learningStyle: LearningStyleType;
}

/**
 * Quiz Response from User
 */
export interface QuizResponse {
  questionId: number;
  answerId: string;
}

/**
 * Learning Persona Interface
 */
export interface LearningPersona {
  name: string;
  avatarType: string;
  learningStyle: LearningStyleType | string;
  title: string;
  description: string;
  personalizedApproach: string;
  studyStrategies: string[];
  classroomBehavior: string;
  communicationStyle: string;
  challenges: string;
  strengths: string;
  interestSpecificStrategies?: string[];
}

/**
 * User Data Interface
 */
export interface UserData {
  name?: string;
  avatarType?: string; 
  interests?: string[];
  schoolTier?: 'elementary' | 'middle' | 'high';
}

/**
 * Quiz Questions
 * 
 * Each question has multiple answers, each associated with a learning style
 */
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    text: "When trying to learn something new, I prefer to:",
    answers: [
      {
        id: "1a",
        text: "See diagrams, charts, or demonstrations",
        learningStyle: "visual"
      },
      {
        id: "1b",
        text: "Listen to someone explain it to me",
        learningStyle: "auditory"
      },
      {
        id: "1c",
        text: "Try it out hands-on right away",
        learningStyle: "kinesthetic"
      },
      {
        id: "1d",
        text: "Read detailed instructions or explanations",
        learningStyle: "reading"
      }
    ]
  },
  {
    id: 2,
    text: "When I need to remember directions to a new place, I usually:",
    answers: [
      {
        id: "2a",
        text: "Visualize landmarks and turns in my mind",
        learningStyle: "visual"
      },
      {
        id: "2b",
        text: "Repeat the directions out loud or remember verbal cues",
        learningStyle: "auditory"
      },
      {
        id: "2c",
        text: "Remember the feeling of turning or moving in certain directions",
        learningStyle: "kinesthetic"
      },
      {
        id: "2d",
        text: "Write down detailed notes or prefer written directions",
        learningStyle: "reading"
      }
    ]
  },
  {
    id: 3,
    text: "When learning a new skill, I prefer to:",
    answers: [
      {
        id: "3a",
        text: "Watch someone demonstrate it first",
        learningStyle: "visual"
      },
      {
        id: "3b",
        text: "Talk through the steps with someone",
        learningStyle: "auditory"
      },
      {
        id: "3c",
        text: "Jump in and practice through trial and error",
        learningStyle: "kinesthetic"
      },
      {
        id: "3d",
        text: "Read about the technique and follow written instructions",
        learningStyle: "reading"
      }
    ]
  },
  {
    id: 4,
    text: "When studying for a test, I am most likely to:",
    answers: [
      {
        id: "4a",
        text: "Create visual aids like diagrams, mind maps, or charts",
        learningStyle: "visual"
      },
      {
        id: "4b",
        text: "Discuss the material out loud or record myself",
        learningStyle: "auditory"
      },
      {
        id: "4c",
        text: "Move around while studying or use physical objects to help me learn",
        learningStyle: "kinesthetic"
      },
      {
        id: "4d",
        text: "Write detailed notes and review written material",
        learningStyle: "reading"
      }
    ]
  },
  {
    id: 5,
    text: "When I'm explaining something to someone else, I tend to:",
    answers: [
      {
        id: "5a",
        text: "Draw pictures or diagrams to illustrate my points",
        learningStyle: "visual"
      },
      {
        id: "5b",
        text: "Use detailed verbal explanations and analogies",
        learningStyle: "auditory"
      },
      {
        id: "5c",
        text: "Use gestures and physical demonstrations",
        learningStyle: "kinesthetic"
      },
      {
        id: "5d",
        text: "Write out my explanation or refer to written resources",
        learningStyle: "reading"
      }
    ]
  },
  {
    id: 6,
    text: "When working on a group project, I prefer to contribute by:",
    answers: [
      {
        id: "6a",
        text: "Creating visual presentations or organizing visual elements",
        learningStyle: "visual"
      },
      {
        id: "6b",
        text: "Leading discussions or presenting verbal information",
        learningStyle: "auditory"
      },
      {
        id: "6c",
        text: "Building models or handling the hands-on activities",
        learningStyle: "kinesthetic"
      },
      {
        id: "6d",
        text: "Researching and writing the documentation or reports",
        learningStyle: "reading"
      }
    ]
  },
  {
    id: 7,
    text: "When I get distracted in class, it's usually because:",
    answers: [
      {
        id: "7a",
        text: "There's too much visual clutter or motion around me",
        learningStyle: "visual"
      },
      {
        id: "7b",
        text: "There are distracting sounds or conversations",
        learningStyle: "auditory"
      },
      {
        id: "7c",
        text: "I need to move around or feel restless sitting still",
        learningStyle: "kinesthetic"
      },
      {
        id: "7d",
        text: "I don't have good written notes to follow along with",
        learningStyle: "reading"
      }
    ]
  },
  {
    id: 8,
    text: "I find it easiest to remember:",
    answers: [
      {
        id: "8a",
        text: "Faces, places, and visual details",
        learningStyle: "visual"
      },
      {
        id: "8b",
        text: "Names, sounds, and conversations",
        learningStyle: "auditory"
      },
      {
        id: "8c",
        text: "Things I've done or experiences I've had",
        learningStyle: "kinesthetic"
      },
      {
        id: "8d",
        text: "Lists, facts, and written information",
        learningStyle: "reading"
      }
    ]
  }
];

/**
 * Learning Style Descriptions
 */
export const learningStyleDescriptions: Record<LearningStyleType, string> = {
  visual: "You learn best through visual aids like pictures, diagrams, and spatial organization. You benefit from seeing information presented visually and may think in pictures.",
  
  auditory: "You learn best by hearing and listening. You benefit from discussions, verbal instructions, and talking things through. You may repeat things out loud to understand them better.",
  
  kinesthetic: "You learn best through physical experiences and hands-on activities. You benefit from movement, touch, and practical applications. You prefer to learn by doing rather than watching or listening.",
  
  reading: "You learn best through reading and writing. You benefit from taking detailed notes and prefer text-based information. You process information well when it's presented in written form.",
  
  multimodal: "You have a flexible learning style, using multiple modes of learning depending on the situation. You can adapt to different teaching styles and benefit from varied presentation of information."
};

/**
 * Learning Style Icons 
 */
export const learningStyleIcons: Record<LearningStyleType, string> = {
  visual: "👁️",
  auditory: "👂",
  kinesthetic: "✋",
  reading: "📚",
  multimodal: "🔄"
};

/**
 * Learning Style Colors (for UI highlighting)
 */
export const learningStyleColors: Record<LearningStyleType, string> = {
  visual: "#5D8BF4", // Blue
  auditory: "#9376E0", // Purple
  kinesthetic: "#F7A76C", // Orange
  reading: "#7ED957", // Green
  multimodal: "#FF5F7E" // Pink
};

/**
 * Sample Learning Personas for each style
 * These can be used as fallbacks if AI generation fails
 */
export const sampleLearningPersonas: Record<LearningStyleType, LearningPersona> = {
  visual: {
    name: "Visual Learner",
    avatarType: "superhero",
    learningStyle: "visual",
    title: "The Visual Navigator",
    description: "You process information best through images, charts, and visual aids.",
    personalizedApproach: "Your learning journey is guided by visual cues and spatial organization. You create mental pictures when learning new concepts and benefit from color-coding and visual patterns.",
    studyStrategies: [
      "Use mind maps to organize concepts",
      "Color-code your notes for different topics",
      "Draw diagrams to represent relationships",
      "Watch educational videos and demonstrations",
      "Use flashcards with images and symbols",
      "Create visual timelines for sequences",
      "Convert text into charts or graphs when possible"
    ],
    classroomBehavior: "You may sketch during lectures to help focus and prefer sitting where you can clearly see visual presentations.",
    communicationStyle: "You often use visual language and may gesture while speaking to illustrate points.",
    challenges: "Text-only materials without visual aids can be difficult to process, and lengthy verbal instructions may be hard to follow.",
    strengths: "You excel at spatial tasks, visual arts, and can easily remember what you've seen."
  },
  
  auditory: {
    name: "Auditory Learner",
    avatarType: "superhero",
    learningStyle: "auditory",
    title: "The Sound Sage",
    description: "You learn best through listening, discussions, and verbal explanations.",
    personalizedApproach: "Your learning journey resonates through sound and speech. You process information by hearing it and talking it through, often remembering what you hear more easily than what you see.",
    studyStrategies: [
      "Record lectures to listen to later",
      "Read material aloud to yourself",
      "Discuss concepts with study partners",
      "Use rhymes or songs to remember information",
      "Participate actively in class discussions",
      "Listen to educational podcasts or audiobooks",
      "Explain concepts out loud even when studying alone"
    ],
    classroomBehavior: "You may subvocalize when reading and prefer class discussions to silent reading assignments.",
    communicationStyle: "You express yourself well verbally and may use varied tones to emphasize points.",
    challenges: "Noisy environments can be distracting, and purely visual presentations without verbal explanation may be hard to process.",
    strengths: "You excel at language skills, verbal memory, and can follow complex verbal instructions."
  },
  
  kinesthetic: {
    name: "Kinesthetic Learner",
    avatarType: "superhero",
    learningStyle: "kinesthetic",
    title: "The Hands-On Explorer",
    description: "You learn best through physical activity, touch, and movement.",
    personalizedApproach: "Your learning journey is an active adventure guided by touch and movement. You understand and remember information best when you physically engage with it through hands-on activities.",
    studyStrategies: [
      "Create physical models or demonstrations",
      "Use manipulatives when learning abstract concepts",
      "Take breaks to move around during study sessions",
      "Act out processes or historical events",
      "Use gesture-based memory techniques",
      "Study while walking or moving gently",
      "Apply concepts through experiments or real-world activities"
    ],
    classroomBehavior: "You may fidget when forced to sit still for long periods and prefer labs and interactive activities.",
    communicationStyle: "You often use gestures and may demonstrate concepts physically rather than just describing them.",
    challenges: "Long periods of sitting still can be difficult, and purely theoretical learning without practical application may be hard to grasp.",
    strengths: "You excel at physical activities, spatial awareness, and learn procedures quickly through practice."
  },
  
  reading: {
    name: "Reading/Writing Learner",
    avatarType: "superhero",
    learningStyle: "reading",
    title: "The Word Wizard",
    description: "You learn best through reading and writing text-based materials.",
    personalizedApproach: "Your learning journey unfolds through words on pages and notes you create. You process information most effectively when it's presented in written form, and you solidify your understanding by writing things down.",
    studyStrategies: [
      "Take detailed notes during lectures",
      "Rewrite key concepts in your own words",
      "Create outlines and lists to organize information",
      "Use reference books and written resources",
      "Write summaries after reading or listening",
      "Create written flashcards with definitions",
      "Keep a learning journal or concept glossary"
    ],
    classroomBehavior: "You often take extensive notes and prefer written instructions to verbal ones.",
    communicationStyle: "You express yourself clearly in writing and may prefer written communication over conversation for complex topics.",
    challenges: "Demonstrations without written explanation or purely verbal instructions may be harder to follow.",
    strengths: "You excel at written assignments, vocabulary, and can remember information you've written down."
  },
  
  multimodal: {
    name: "Multimodal Learner",
    avatarType: "superhero",
    learningStyle: "multimodal",
    title: "The Adaptive Scholar",
    description: "You learn effectively through multiple channels, adapting your approach to different situations.",
    personalizedApproach: "Your learning journey follows multiple paths, as you can absorb information through various methods. You have the flexibility to switch between different learning modes depending on the subject and context.",
    studyStrategies: [
      "Combine visual aids with written notes",
      "Discuss concepts aloud while creating diagrams",
      "Move between reading, listening, and hands-on activities",
      "Create multi-sensory study materials",
      "Teach concepts to others using various methods",
      "Use technology that combines text, audio, and visuals",
      "Identify which learning mode works best for specific subjects"
    ],
    classroomBehavior: "You can adapt to different teaching styles and may use different approaches for different subjects.",
    communicationStyle: "You adjust your communication style based on the situation and audience, using multiple methods to explain complex ideas.",
    challenges: "You may need to recognize which learning mode is most effective for specific types of information.",
    strengths: "You are highly adaptable and can learn in almost any environment using whatever resources are available."
  }
};