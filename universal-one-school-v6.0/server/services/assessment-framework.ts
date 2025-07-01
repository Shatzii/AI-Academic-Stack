/**
 * Assessment Framework
 * 
 * This module defines the core assessment system for the ShatziiOS educational platform.
 * It provides interfaces and types for various assessment modules to implement,
 * as well as utilities for processing assessment results and generating learning profiles.
 */

import { storage } from '../storage';
import { NeurodivergentType } from '@shared/schema';

// Define enums that were previously imported
export enum LearningStyle {
  VISUAL = 'visual',
  AUDITORY = 'auditory',
  KINESTHETIC = 'kinesthetic',
  READING_WRITING = 'reading_writing'
}

export enum Neurotype {
  NEUROTYPICAL = 'neurotypical',
  DYSLEXIA = 'dyslexia',
  ADHD = 'adhd',
  AUTISM_SPECTRUM = 'autism_spectrum'
}

export enum AdaptationLevel {
  MINIMAL = 1,
  LIGHT = 2,
  MODERATE = 3,
  SIGNIFICANT = 4,
  EXTENSIVE = 5
}

// Define the LearningProfile interface for local use
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

/**
 * Assessment Types
 */
export enum AssessmentType {
  LEARNING_STYLE = 'learning_style',
  NEUROTYPE = 'neurotype',
  READING_SKILLS = 'reading_skills',
  ATTENTION_ASSESSMENT = 'attention_assessment',
  SOCIAL_COMMUNICATION = 'social_communication'
}

/**
 * Result Scale Types
 */
export enum ResultScale {
  NUMERIC_SCALE = 'numeric_scale', // 1-10 rating
  BOOLEAN = 'boolean', // yes/no
  CATEGORICAL = 'categorical', // predefined categories
  PERCENTAGE = 'percentage', // 0-100%
  CUSTOM = 'custom' // custom scale with defined properties
}

/**
 * Assessment Option Interface
 */
export interface AssessmentOption {
  id: string;
  text: string;
  value?: number;
  indicators?: Record<string, number>;
}

/**
 * Assessment Question Interface
 */
export interface AssessmentQuestion {
  id: number;
  assessmentType: AssessmentType;
  text: string;
  options: AssessmentOption[];
  adaptations?: {
    visualSupport?: string;
    audioSupport?: string;
    simplifiedText?: string;
  };
}

/**
 * Assessment Module Interface
 */
export interface AssessmentModule {
  type: AssessmentType;
  name: string;
  description: string;
  targetAgeRange: [number, number]; // min and max age
  estimatedTimeMinutes: number;
  requiresSpecialist: boolean;
  questions: AssessmentQuestion[];
  resultSchema: Record<string, ResultScale>;
}

/**
 * Assessment Result Interface
 */
export interface AssessmentResult {
  id?: number;
  userId: number;
  assessmentType: AssessmentType;
  completedDate: Date;
  results: Record<string, any>;
  recommendedAdaptations: string[];
  version: string;
}

/**
 * Learning Style Indicators
 */
export interface LearningStyleIndicators {
  visual: number;
  auditory: number;
  kinesthetic: number;
  readingWriting: number;
}

/**
 * Dyslexia Indicators
 */
export interface DyslexiaIndicators {
  readingFluency: number;
  phonologicalAwareness: number;
  spelling: number;
  wordRecognition: number;
  sequencing: number;
  processingSpeed: number;
}

/**
 * ADHD Indicators
 */
export interface ADHDIndicators {
  sustainedAttention: number;
  impulseControl: number;
  hyperactivity: number;
  taskPersistence: number;
  organizationalSkills: number;
  workingMemory: number;
}

/**
 * Autism Spectrum Indicators
 */
export interface AutismSpectrumIndicators {
  socialCommunication: number;
  flexibilityPreferences: number;
  sensorySensitivity: number;
  patternRecognition: number;
  specialInterestFocus: number;
  executiveFunction: number;
}

/**
 * Assessment Framework
 * 
 * Core functionality for assessment administration, processing, and profile generation
 */
class AssessmentFramework {
  /**
   * Generate a learning profile for a user based on their assessment results
   */
  async generateLearningProfile(userId: number): Promise<LearningProfile | null> {
    try {
      // Get all assessment results for the user
      const assessmentResults = await storage.getAssessmentResultsByUser(userId);
      
      if (!assessmentResults || assessmentResults.length === 0) {
        console.warn(`No assessment results found for user ${userId}`);
        return null;
      }
      
      // Look for learning style assessment
      const learningStyleResult = assessmentResults.find(
        result => result.assessmentType === AssessmentType.LEARNING_STYLE
      );
      
      // Look for neurotype assessments
      const neurotypeResults = assessmentResults.filter(
        result => result.assessmentType !== AssessmentType.LEARNING_STYLE
      );
      
      // Generate the learning profile
      const profile: LearningProfile = {
        userId,
        primaryStyle: LearningStyle.VISUAL, // Default, will be overridden
        secondaryStyle: undefined,
        neurotype: Neurotype.NEUROTYPICAL, // Default, will be overridden
        adaptationLevel: AdaptationLevel.MINIMAL, // Default, will be overridden
        adaptations: {
          text_presentation: {
            required: false,
            specifics: []
          },
          content_organization: {
            required: false,
            specifics: []
          },
          sensory_considerations: {
            required: false,
            specifics: []
          },
          focus_supports: {
            required: false,
            specifics: []
          },
          processing_time: {
            required: false,
            specifics: []
          },
          interactive_elements: {
            required: false,
            specifics: []
          }
        },
        contentPreferences: {
          visualElements: 5, // Default medium
          audioElements: 5, // Default medium
          textElements: 5, // Default medium
          interactiveElements: 5 // Default medium
        },
        lastUpdated: new Date(),
        version: '1.0'
      };
      
      // Process learning style assessment
      if (learningStyleResult) {
        const results = learningStyleResult.results;
        
        // Determine primary learning style
        const styles = [
          { style: LearningStyle.VISUAL, score: results.visual },
          { style: LearningStyle.AUDITORY, score: results.auditory },
          { style: LearningStyle.KINESTHETIC, score: results.kinesthetic },
          { style: LearningStyle.READING_WRITING, score: results.readingWriting }
        ];
        
        // Sort by score (highest first)
        styles.sort((a, b) => b.score - a.score);
        
        profile.primaryStyle = styles[0].style;
        
        // Set secondary style if there's a close second
        if (styles[1].score > 0.7 * styles[0].score) {
          profile.secondaryStyle = styles[1].style;
        }
        
        // Set content preferences based on learning style
        profile.contentPreferences.visualElements = Math.min(10, Math.round(results.visual * 1.5));
        profile.contentPreferences.audioElements = Math.min(10, Math.round(results.auditory * 1.5));
        profile.contentPreferences.textElements = Math.min(10, Math.round(results.readingWriting * 1.5));
        profile.contentPreferences.interactiveElements = Math.min(10, Math.round(results.kinesthetic * 1.5));
      }
      
      // Process neurotype assessments
      if (neurotypeResults.length > 0) {
        // Sort by completedDate (latest first)
        neurotypeResults.sort((a, b) => 
          new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime()
        );
        
        // Get the most recent neurotype assessment
        const latestNeurotypeResult = neurotypeResults[0];
        
        // Determine neurotype based on assessment type
        switch (latestNeurotypeResult.assessmentType) {
          case AssessmentType.READING_SKILLS:
            profile.neurotype = Neurotype.DYSLEXIA;
            break;
          case AssessmentType.ATTENTION_ASSESSMENT:
            profile.neurotype = Neurotype.ADHD;
            break;
          case AssessmentType.SOCIAL_COMMUNICATION:
            profile.neurotype = Neurotype.AUTISM_SPECTRUM;
            break;
          default:
            profile.neurotype = Neurotype.NEUROTYPICAL;
        }
        
        // Determine adaptation level
        const results = latestNeurotypeResult.results;
        const scores = Object.values(results);
        const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        
        if (averageScore > 7) {
          profile.adaptationLevel = AdaptationLevel.SIGNIFICANT;
        } else if (averageScore > 4) {
          profile.adaptationLevel = AdaptationLevel.MODERATE;
        } else {
          profile.adaptationLevel = AdaptationLevel.MINIMAL;
        }
        
        // Extract adaptations from assessment result
        if (latestNeurotypeResult.recommendedAdaptations && 
            latestNeurotypeResult.recommendedAdaptations.length > 0) {
          // Process recommended adaptations
          this.processRecommendedAdaptations(
            profile, 
            latestNeurotypeResult.recommendedAdaptations
          );
        }
      }
      
      // Save the profile to storage
      const savedProfile = await storage.saveLearningProfile(profile);
      
      return savedProfile;
    } catch (error) {
      console.error('Error generating learning profile:', error);
      return null;
    }
  }
  
  /**
   * Process recommended adaptations and update the learning profile
   */
  private processRecommendedAdaptations(
    profile: LearningProfile, 
    adaptations: string[]
  ): void {
    // Text presentation adaptations
    const textPresentationAdaptations = adaptations.filter(
      a => a.includes('font') || a.includes('text') || a.includes('color') || 
      a.includes('spacing') || a.includes('visual stress')
    );
    
    if (textPresentationAdaptations.length > 0) {
      profile.adaptations.text_presentation = {
        required: true,
        specifics: textPresentationAdaptations
      };
    }
    
    // Content organization adaptations
    const contentOrganizationAdaptations = adaptations.filter(
      a => a.includes('chunked') || a.includes('visual support') || 
      a.includes('organization') || a.includes('structure') ||
      a.includes('schedule') || a.includes('preview')
    );
    
    if (contentOrganizationAdaptations.length > 0) {
      profile.adaptations.content_organization = {
        required: true,
        specifics: contentOrganizationAdaptations
      };
    }
    
    // Sensory considerations adaptations
    const sensoryAdaptations = adaptations.filter(
      a => a.includes('sensory') || a.includes('audio') || 
      a.includes('visual complexity') || a.includes('brightness') ||
      a.includes('sound')
    );
    
    if (sensoryAdaptations.length > 0) {
      profile.adaptations.sensory_considerations = {
        required: true,
        specifics: sensoryAdaptations
      };
    }
    
    // Focus supports adaptations
    const focusAdaptations = adaptations.filter(
      a => a.includes('focus') || a.includes('distraction') || 
      a.includes('attention') || a.includes('timer') ||
      a.includes('break')
    );
    
    if (focusAdaptations.length > 0) {
      profile.adaptations.focus_supports = {
        required: true,
        specifics: focusAdaptations
      };
    }
    
    // Processing time adaptations
    const timeAdaptations = adaptations.filter(
      a => a.includes('time') || a.includes('pace') || 
      a.includes('progress') || a.includes('speed') ||
      a.includes('deadline')
    );
    
    if (timeAdaptations.length > 0) {
      profile.adaptations.processing_time = {
        required: true,
        specifics: timeAdaptations
      };
    }
    
    // Interactive elements adaptations
    const interactiveAdaptations = adaptations.filter(
      a => a.includes('interactive') || a.includes('hands-on') || 
      a.includes('game') || a.includes('simulation') ||
      a.includes('activity')
    );
    
    if (interactiveAdaptations.length > 0) {
      profile.adaptations.interactive_elements = {
        required: true,
        specifics: interactiveAdaptations
      };
    }
  }
}

export const assessmentFramework = new AssessmentFramework();