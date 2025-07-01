/**
 * Learning Profile Service
 * 
 * This service manages the creation, retrieval, and updating of learning profiles
 * for neurodivergent learners. It integrates with assessment results to provide
 * personalized learning experiences across all schools in the ShatziiOS platform.
 * 
 * @module learning-profile-service
 */

import { db } from '../db';
import { eq, and, or, SQL, sql as drizzleSql } from 'drizzle-orm';
import { 
  learningProfiles, 
  assessmentResults, 
  users,
  LearningProfile,
  InsertLearningProfile,
  AssessmentResult,
  InsertAssessmentResult,
  NeurodivergentType,
  AssessmentType
} from '@shared/schema';
import { storage } from '../storage';

// Define adaptation categories for learning content
export enum AdaptationCategory {
  TEXT_PRESENTATION = 'text_presentation',
  CONTENT_ORGANIZATION = 'content_organization',
  SENSORY_CONSIDERATIONS = 'sensory_considerations',
  FOCUS_SUPPORTS = 'focus_supports',
  PROCESSING_TIME = 'processing_time',
  INTERACTIVE_ELEMENTS = 'interactive_elements'
}

// Define adaptation levels for content modifications
export enum AdaptationLevel {
  MINIMAL = 1,
  MODERATE = 2,
  SIGNIFICANT = 3
}

// Learning styles for content presentation
export enum LearningStyle {
  VISUAL = 'visual',
  AUDITORY = 'auditory',
  KINESTHETIC = 'kinesthetic',
  READING_WRITING = 'reading_writing'
}

// Neurotype categories for learning differences
export enum Neurotype {
  NEUROTYPICAL = 'neurotypical',
  DYSLEXIA = 'dyslexia',
  ADHD = 'adhd',
  AUTISM_SPECTRUM = 'autism_spectrum'
}

// Define the LearningProfile interface for service functions
export interface LearningProfile {
  userId: number;
  primaryStyle: string;
  secondaryStyle?: string;
  neurotype: Neurotype;
  adaptationLevel: AdaptationLevel;
  adaptations: {
    text_presentation: {
      required: boolean;
      specifics: string[];
    };
    content_organization: {
      required: boolean;
      specifics: string[];
    };
    sensory_considerations: {
      required: boolean;
      specifics: string[];
    };
    focus_supports: {
      required: boolean;
      specifics: string[];
    };
    processing_time: {
      required: boolean;
      specifics: string[];
    };
    interactive_elements: {
      required: boolean;
      specifics: string[];
    };
  };
  contentPreferences: {
    visualElements: number;
    audioElements: number;
    textElements: number;
    interactiveElements: number;
  };
  lastUpdated: Date;
  version: string;
}

// Type definitions for assessment scores
interface AssessmentScore {
  overall: number;
  severity?: number;
  [key: string]: any;
}

interface LearningStyleScore extends AssessmentScore {
  styles: {
    [style: string]: number;
  };
}

interface ReadingSkillsScore extends AssessmentScore {
  readingSpeed: number;
  comprehension: number;
  decoding: number;
  fluency: number;
}

interface AttentionAssessmentScore extends AssessmentScore {
  focusDuration: number;
  distractibility: number;
  impulsivity: number;
  hyperactivity: number;
}

interface SocialCommunicationScore extends AssessmentScore {
  expressiveLanguage: number;
  receptiveLanguage: number;
  nonverbalCommunication: number;
  socialInteraction: number;
}

// Type guards for assessment scores
function isLearningStyleScore(score: any): score is LearningStyleScore {
  return score && 
    typeof score === 'object' && 
    typeof score.overall === 'number' && 
    score.styles && 
    typeof score.styles === 'object';
}

function isReadingSkillsScore(score: any): score is ReadingSkillsScore {
  return score && 
    typeof score === 'object' && 
    typeof score.overall === 'number' && 
    typeof score.readingSpeed === 'number' && 
    typeof score.comprehension === 'number';
}

function isAttentionAssessmentScore(score: any): score is AttentionAssessmentScore {
  return score && 
    typeof score === 'object' && 
    typeof score.overall === 'number' && 
    typeof score.focusDuration === 'number' && 
    typeof score.distractibility === 'number';
}

function isSocialCommunicationScore(score: any): score is SocialCommunicationScore {
  return score && 
    typeof score === 'object' && 
    typeof score.overall === 'number' && 
    typeof score.expressiveLanguage === 'number' && 
    typeof score.receptiveLanguage === 'number';
}

function hasOverallScore(score: any): score is AssessmentScore {
  return score && 
    typeof score === 'object' && 
    typeof score.overall === 'number';
}

// Define content preferences interface
export interface ContentPreferences {
  preferredFormat: string;
  contentDensity: string;
  breakFrequency: string;
  textSpeed?: string;
  contentChunkSize?: string;
  [key: string]: any;
}

// Default preferences by neurodivergent type
const DEFAULT_PREFERENCES: Record<string, {
  contentPreferences: ContentPreferences
}> = {
  [NeurodivergentType.DYSLEXIA]: {
    contentPreferences: {
      preferredFormat: 'simplified',
      contentDensity: 'low',
      breakFrequency: 'high',
      textSpeed: 'slow'
    }
  },
  [NeurodivergentType.ADHD]: {
    contentPreferences: {
      preferredFormat: 'chunked',
      contentDensity: 'moderate',
      breakFrequency: 'very-high',
      contentChunkSize: 'small'
    }
  },
  [NeurodivergentType.AUTISM_SPECTRUM]: {
    contentPreferences: {
      preferredFormat: 'structured',
      contentDensity: 'high',
      breakFrequency: 'moderate',
      contentChunkSize: 'medium'
    }
  },
  [NeurodivergentType.COMBINED]: {
    contentPreferences: {
      preferredFormat: 'simplified',
      contentDensity: 'low',
      breakFrequency: 'high',
      textSpeed: 'moderate',
      contentChunkSize: 'small'
    }
  },
  [NeurodivergentType.OTHER]: {
    contentPreferences: {
      preferredFormat: 'standard',
      contentDensity: 'moderate',
      breakFrequency: 'moderate'
    }
  }
};

/**
 * Get a user's learning profile
 * @param userId - The user ID
 * @returns The learning profile if found, null otherwise
 */
export async function getLearningProfile(userId: number): Promise<LearningProfile | null> {
  return storage.getLearningProfile(userId);
}

/**
 * Create a new learning profile for a user
 * @param profile - The learning profile data
 * @returns The created learning profile
 */
export async function createLearningProfile(profile: InsertLearningProfile): Promise<LearningProfile> {
  // Add default values for any missing fields
  const enhancedProfile: InsertLearningProfile = {
    ...profile,
    primaryStyle: profile.primaryStyle || 'visual',
    adaptationLevel: profile.adaptationLevel || 3,
    contentPreferences: profile.contentPreferences || DEFAULT_PREFERENCES[profile.neurodivergentType]?.contentPreferences || {
      preferredFormat: 'standard',
      contentDensity: 'moderate',
      breakFrequency: 'moderate'
    },
    lastUpdated: new Date()
  };
  
  return storage.saveLearningProfile(enhancedProfile as any);
}

/**
 * Update an existing learning profile
 * @param userId - The user ID
 * @param profileData - Partial profile data to update
 * @returns The updated learning profile
 */
export async function updateLearningProfile(
  userId: number, 
  profileData: Partial<InsertLearningProfile>
): Promise<LearningProfile | null> {
  // Get existing profile
  const existingProfile = await getLearningProfile(userId);
  
  if (!existingProfile) {
    return null;
  }
  
  // Merge existing profile with updates
  const updatedProfile = {
    ...existingProfile,
    ...profileData,
    lastUpdated: new Date()
  };
  
  return storage.saveLearningProfile(updatedProfile);
}

/**
 * Generate a learning profile from assessment results
 * @param userId - The user ID
 * @returns The generated learning profile
 */
export async function generateProfileFromAssessments(userId: number): Promise<LearningProfile> {
  // Get all assessment results for the user
  const assessments = await getAssessmentResultsByUser(userId);
  
  if (assessments.length === 0) {
    throw new Error('No assessments found for user');
  }
  
  // Determine neurodivergent type
  const neurodivergentType = determineNeurodivergentType(assessments);
  
  // Extract learning styles
  const learningStyleAssessment = assessments.find(a => a.assessmentType === AssessmentType.LEARNING_STYLE);
  const primaryStyle = extractPrimaryLearningStyle(learningStyleAssessment);
  const secondaryStyle = extractSecondaryLearningStyle(learningStyleAssessment);
  
  // Calculate adaptation level
  const adaptationLevel = calculateAdaptationLevel(assessments);
  
  // Generate content preferences
  const contentPreferences = generateContentPreferences(assessments, neurodivergentType);
  
  // Create profile data
  const profileData: InsertLearningProfile = {
    userId,
    neurodivergentType,
    primaryStyle,
    secondaryStyle,
    adaptationLevel,
    contentPreferences,
    lastUpdated: new Date(),
    version: '1.0'
  };
  
  // Save and return the profile
  return createLearningProfile(profileData);
}

/**
 * Save an assessment result
 * @param assessment - The assessment data to save
 * @returns The saved assessment result
 */
export async function saveAssessmentResult(assessment: InsertAssessmentResult): Promise<AssessmentResult> {
  return storage.saveAssessmentResult(assessment as any);
}

/**
 * Get assessment results for a user
 * @param userId - The user ID
 * @param type - Optional assessment type filter
 * @returns The assessment results
 */
export async function getAssessmentResultsByUser(
  userId: number,
  type?: AssessmentType
): Promise<AssessmentResult[]> {
  let assessments = await storage.getAssessmentResultsByUser(userId);
  
  // Filter by type if provided
  if (type) {
    assessments = assessments.filter(a => a.assessmentType === type);
  }
  
  return assessments;
}

/**
 * Check if a user has completed a specific type of assessment
 * @param userId - The user ID
 * @param type - Assessment type to check
 * @returns True if the user has completed the assessment
 */
export async function hasCompletedAssessment(
  userId: number,
  type: AssessmentType
): Promise<boolean> {
  const assessments = await getAssessmentResultsByUser(userId, type);
  return assessments.length > 0;
}

/**
 * Check if a user has completed all required assessments
 * @param userId - The user ID
 * @returns True if all required assessments are completed
 */
export async function hasCompletedAllRequiredAssessments(userId: number): Promise<boolean> {
  const requiredTypes = [
    AssessmentType.LEARNING_STYLE,
    AssessmentType.READING_SKILLS,
    AssessmentType.ATTENTION_ASSESSMENT
  ];
  
  for (const type of requiredTypes) {
    const completed = await hasCompletedAssessment(userId, type);
    if (!completed) {
      return false;
    }
  }
  
  return true;
}

/**
 * Determine the neurodivergent type based on assessment results
 */
function determineNeurodivergentType(assessments: AssessmentResult[]): NeurodivergentType {
  // Check if we have reading skills assessment
  const readingSkills = assessments.find(a => a.assessmentType === AssessmentType.READING_SKILLS);
  const readingScore = readingSkills && hasOverallScore(readingSkills.score) ? readingSkills.score.overall : 0;
  
  // Check if we have attention assessment
  const attentionAssessment = assessments.find(a => a.assessmentType === AssessmentType.ATTENTION_ASSESSMENT);
  const attentionScore = attentionAssessment && hasOverallScore(attentionAssessment.score) ? attentionAssessment.score.overall : 0;
  
  // Check if we have social communication assessment
  const socialCommunication = assessments.find(a => a.assessmentType === AssessmentType.SOCIAL_COMMUNICATION);
  const socialScore = socialCommunication && hasOverallScore(socialCommunication.score) ? socialCommunication.score.overall : 0;
  
  // Determine neurodivergent type based on highest score
  // Higher score indicates more significant challenges
  if (readingScore > 0.7 && readingScore >= attentionScore && readingScore >= socialScore) {
    return NeurodivergentType.DYSLEXIA;
  } else if (attentionScore > 0.7 && attentionScore >= readingScore && attentionScore >= socialScore) {
    return NeurodivergentType.ADHD;
  } else if (socialScore > 0.7 && socialScore >= readingScore && socialScore >= attentionScore) {
    return NeurodivergentType.AUTISM_SPECTRUM;
  } else if (readingScore > 0.5 || attentionScore > 0.5 || socialScore > 0.5) {
    return NeurodivergentType.COMBINED;
  } else {
    return NeurodivergentType.OTHER;
  }
}

/**
 * Extract primary learning style from assessment
 */
function extractPrimaryLearningStyle(assessment: AssessmentResult | undefined): string {
  if (!assessment || !isLearningStyleScore(assessment.score)) {
    return 'visual'; // Default to visual if no assessment
  }
  
  const styles = assessment.score.styles;
  let highestStyle = 'visual';
  let highestScore = 0;
  
  // Find style with highest score
  for (const [style, score] of Object.entries(styles)) {
    if (score > highestScore) {
      highestScore = score;
      highestStyle = style;
    }
  }
  
  return highestStyle;
}

/**
 * Extract secondary learning style from assessment
 */
function extractSecondaryLearningStyle(assessment: AssessmentResult | undefined): string | null {
  if (!assessment || !isLearningStyleScore(assessment.score)) {
    return null; // No secondary style if no assessment
  }
  
  const styles = assessment.score.styles;
  let highestStyle = '';
  let highestScore = 0;
  let secondHighestStyle = '';
  let secondHighestScore = 0;
  
  // Find style with second highest score
  for (const [style, score] of Object.entries(styles)) {
    if (score > highestScore) {
      secondHighestScore = highestScore;
      secondHighestStyle = highestStyle;
      highestScore = score;
      highestStyle = style;
    } else if (score > secondHighestScore) {
      secondHighestScore = score;
      secondHighestStyle = style;
    }
  }
  
  // Only return secondary style if the score is significant
  return secondHighestScore > 0.3 ? secondHighestStyle : null;
}

/**
 * Calculate adaptation level from assessments
 */
function calculateAdaptationLevel(assessments: AssessmentResult[]): number {
  // Get severity scores from all assessments
  const severityScores = assessments
    .map(a => hasOverallScore(a.score) ? a.score.severity || a.score.overall : 0)
    .filter(score => score > 0);
  
  if (severityScores.length === 0) {
    return 3; // Default adaptation level
  }
  
  // Calculate average severity
  const avgSeverity = severityScores.reduce((sum, score) => sum + score, 0) / severityScores.length;
  
  // Convert to adaptation level (1-5 scale)
  return Math.min(5, Math.max(1, Math.round(avgSeverity * 5)));
}

/**
 * Generate content preferences based on assessments and neurodivergent type
 */
function generateContentPreferences(
  assessments: AssessmentResult[],
  neurodivergentType: NeurodivergentType
): ContentPreferences {
  // Start with default preferences for the neurodivergent type
  const basePreferences: ContentPreferences = {
    ...(DEFAULT_PREFERENCES[neurodivergentType]?.contentPreferences || {
      preferredFormat: 'standard',
      contentDensity: 'moderate',
      breakFrequency: 'moderate'
    })
  };
  
  // Customize based on assessment results
  const readingAssessment = assessments.find(a => a.assessmentType === AssessmentType.READING_SKILLS);
  const attentionAssessment = assessments.find(a => a.assessmentType === AssessmentType.ATTENTION_ASSESSMENT);
  
  // Reading speed adjustment with type checking
  if (readingAssessment?.score && typeof readingAssessment.score === 'object') {
    const score = readingAssessment.score as Record<string, any>;
    if (typeof score.readingSpeed === 'number') {
      const readingSpeed = score.readingSpeed;
      
      // Add textSpeed to preferences
      if (readingSpeed < 0.3) {
        basePreferences.textSpeed = 'very-slow';
      } else if (readingSpeed < 0.5) {
        basePreferences.textSpeed = 'slow';
      } else if (readingSpeed > 0.8) {
        basePreferences.textSpeed = 'fast';
      } else {
        basePreferences.textSpeed = 'moderate';
      }
    }
  }
  
  // Focus duration adjustment with type checking
  if (attentionAssessment?.score && typeof attentionAssessment.score === 'object') {
    const score = attentionAssessment.score as Record<string, any>;
    if (typeof score.focusDuration === 'number') {
      const focusDuration = score.focusDuration;
      
      if (focusDuration < 0.3) {
        basePreferences.contentChunkSize = 'very-small';
        basePreferences.breakFrequency = 'very-high';
      } else if (focusDuration < 0.5) {
        basePreferences.contentChunkSize = 'small';
        basePreferences.breakFrequency = 'high';
      } else if (focusDuration > 0.8) {
        basePreferences.contentChunkSize = 'large';
        basePreferences.breakFrequency = 'low';
      }
    }
  }
  
  return basePreferences;
}