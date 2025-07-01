/**
 * AI Professor Interface
 * 
 * This module defines the base interface and types for AI professors across
 * different academic domains. It provides a common structure for professor creation,
 * content generation, and interaction handling.
 */

import { LearningProfile } from '../learning-profile-service';

/**
 * Professor Expertise Level
 */
export enum ExpertiseLevel {
  INTRODUCTORY = 'introductory',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

/**
 * Teaching Style
 */
export enum TeachingStyle {
  STRUCTURED = 'structured',
  SOCRATIC = 'socratic', 
  EXPERIENTIAL = 'experiential',
  PROBLEM_BASED = 'problem_based',
  DISCUSSION_BASED = 'discussion_based',
  LECTURE_BASED = 'lecture_based',
  CASE_STUDY = 'case_study'
}

/**
 * Content Type
 */
export enum ContentType {
  LECTURE = 'lecture',
  EXERCISE = 'exercise',
  ASSESSMENT = 'assessment',
  EXPLANATION = 'explanation',
  SUMMARY = 'summary',
  FEEDBACK = 'feedback',
  CONVERSATION = 'conversation',
  CASE_ANALYSIS = 'case_analysis'
}

/**
 * Professor Personality Traits
 */
export enum PersonalityTrait {
  ENCOURAGING = 'encouraging',
  CHALLENGING = 'challenging',
  PATIENT = 'patient',
  RIGOROUS = 'rigorous',
  INSPIRING = 'inspiring',
  ANALYTICAL = 'analytical',
  SUPPORTIVE = 'supportive',
  ENGAGING = 'engaging'
}

/**
 * Message Type
 */
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  CODE = 'code',
  GRAPH = 'graph',
  DIAGRAM = 'diagram',
  DOCUMENT = 'document',
  INTERACTIVE = 'interactive'
}

/**
 * Message Role
 */
export enum MessageRole {
  SYSTEM = 'system',
  PROFESSOR = 'professor',
  STUDENT = 'student',
  ASSISTANT = 'assistant'
}

/**
 * Message interface
 */
export interface Message {
  id?: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Conversation interface
 */
export interface Conversation {
  id?: string;
  userId: number;
  professorId: string;
  topic: string;
  messages: Message[];
  status: 'active' | 'archived' | 'deleted';
  lastUpdated: Date;
  metadata?: Record<string, any>;
}

/**
 * Professor Profile
 */
export interface ProfessorProfile {
  id?: string;
  name: string;
  title: string;
  specialization: string;
  expertiseLevel: ExpertiseLevel;
  teachingStyle: TeachingStyle;
  personalityTraits: PersonalityTrait[];
  description: string;
  systemPrompt: string;
  modelName: string;
  credentials: string[];
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Professor Content Request
 */
export interface ContentRequest {
  professorId: string;
  userId: number;
  contentType: ContentType;
  topic: string;
  previousContent?: string;
  learningProfile?: LearningProfile;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  length?: 'brief' | 'standard' | 'detailed' | 'comprehensive';
  format?: 'text' | 'structured' | 'interactive' | 'visual';
  additionalInstructions?: string;
}

/**
 * Professor Content Response
 */
export interface ContentResponse {
  id?: string;
  professorId: string;
  userId: number;
  contentType: ContentType;
  topic: string;
  content: string;
  contentParts?: {
    type: MessageType;
    content: string;
    order: number;
  }[];
  timestamp: Date;
  adaptations?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * AI Professor Interface
 */
export interface AIProfessor {
  /**
   * Get the professor's profile
   */
  getProfile(): ProfessorProfile;
  
  /**
   * Generate educational content based on the request
   */
  generateContent(request: ContentRequest): Promise<ContentResponse>;
  
  /**
   * Handle student interaction in a conversation
   */
  handleInteraction(conversationId: string, message: Message): Promise<Message>;
  
  /**
   * Start a new conversation with the professor
   */
  startConversation(
    userId: number, 
    topic: string, 
    initialMessage?: string
  ): Promise<Conversation>;
  
  /**
   * Get a conversation by ID
   */
  getConversation(conversationId: string): Promise<Conversation | null>;
  
  /**
   * End a conversation with the professor
   */
  endConversation(conversationId: string): Promise<boolean>;
  
  /**
   * Provide assessment or feedback on student work
   */
  provideAssessment(
    userId: number,
    submission: string,
    rubric?: Record<string, any>
  ): Promise<ContentResponse>;
  
  /**
   * Adapt teaching approach based on learning profile
   */
  adaptToLearningProfile(
    learningProfile: LearningProfile
  ): Promise<Record<string, any>>;
}

/**
 * Base AI Professor implementation
 */
export abstract class BaseAIProfessor implements AIProfessor {
  protected profile: ProfessorProfile;
  protected apiKey: string;
  
  constructor(profile: ProfessorProfile, apiKey: string) {
    this.profile = profile;
    this.apiKey = apiKey;
  }
  
  public getProfile(): ProfessorProfile {
    return this.profile;
  }
  
  public abstract generateContent(request: ContentRequest): Promise<ContentResponse>;
  
  public abstract handleInteraction(conversationId: string, message: Message): Promise<Message>;
  
  public abstract startConversation(
    userId: number, 
    topic: string, 
    initialMessage?: string
  ): Promise<Conversation>;
  
  public abstract getConversation(conversationId: string): Promise<Conversation | null>;
  
  public abstract endConversation(conversationId: string): Promise<boolean>;
  
  public abstract provideAssessment(
    userId: number,
    submission: string,
    rubric?: Record<string, any>
  ): Promise<ContentResponse>;
  
  public abstract adaptToLearningProfile(
    learningProfile: LearningProfile
  ): Promise<Record<string, any>>;
  
  /**
   * Create the system prompt based on professor profile and learning profile
   */
  protected createSystemPrompt(learningProfile?: LearningProfile): string {
    // Start with the professor's base system prompt
    let systemPrompt = this.profile.systemPrompt;
    
    // Add personality and teaching style aspects
    systemPrompt += `\n\nYou should teach with a ${this.profile.teachingStyle.toLowerCase()} teaching style.`;
    systemPrompt += `\n\nYour personality should be ${this.profile.personalityTraits.map(t => t.toLowerCase()).join(', ')}.`;
    
    // Add expertise level context
    systemPrompt += `\n\nYou have ${this.profile.expertiseLevel.toLowerCase()} level expertise in ${this.profile.specialization}.`;
    
    // If a learning profile is provided, adapt the prompt
    if (learningProfile) {
      systemPrompt += `\n\nYou are teaching a student with the following learning profile:`;
      systemPrompt += `\n- Primary learning style: ${learningProfile.primaryStyle}`;
      
      if (learningProfile.secondaryStyle) {
        systemPrompt += `\n- Secondary learning style: ${learningProfile.secondaryStyle}`;
      }
      
      systemPrompt += `\n- Neurotype: ${learningProfile.neurotype}`;
      systemPrompt += `\n- Adaptation level: ${learningProfile.adaptationLevel}`;
      
      // Add content format preferences
      systemPrompt += `\n\nPreferred content formats (1-10 scale):`;
      systemPrompt += `\n- Visual elements: ${learningProfile.contentPreferences.visualElements}`;
      systemPrompt += `\n- Audio elements: ${learningProfile.contentPreferences.audioElements}`;
      systemPrompt += `\n- Text elements: ${learningProfile.contentPreferences.textElements}`;
      systemPrompt += `\n- Interactive elements: ${learningProfile.contentPreferences.interactiveElements}`;
      
      // Add required adaptations if any
      let hasAdaptations = false;
      const adaptationCategories = Object.entries(learningProfile.adaptations);
      
      for (const [category, adaptation] of adaptationCategories) {
        if (adaptation?.required && adaptation.specifics.length > 0) {
          if (!hasAdaptations) {
            systemPrompt += `\n\nRequired adaptations:`;
            hasAdaptations = true;
          }
          
          systemPrompt += `\n- ${category.replace('_', ' ')}: ${adaptation.specifics.join(', ')}`;
        }
      }
    }
    
    return systemPrompt;
  }
}

/**
 * AI Professor Factory
 */
export class AIProfessorFactory {
  /**
   * Create a professor instance based on domain/subject
   */
  static createProfessor(
    domain: string, 
    profile: ProfessorProfile
  ): AIProfessor | null {
    // Check for required API keys based on domain
    const apiKey = this.getApiKeyForDomain(domain);
    if (!apiKey) {
      console.error(`Missing API key for domain: ${domain}`);
      return null;
    }
    
    // Import the appropriate professor class based on domain
    switch (domain.toLowerCase()) {
      case 'law':
      case 'legal':
        // Defer actual import to avoid circular dependencies
        const { LawProfessor } = require('./law-professor');
        return new LawProfessor(profile, apiKey);
        
      case 'language':
      case 'linguistics':
        // Defer actual import to avoid circular dependencies
        const { LanguageProfessor } = require('./language-professor');
        return new LanguageProfessor(profile, apiKey);
        
      // Add other domains as needed
        
      default:
        console.error(`Unsupported professor domain: ${domain}`);
        return null;
    }
  }
  
  /**
   * Get API key for the specified domain
   */
  private static getApiKeyForDomain(domain: string): string | null {
    // Get API keys from environment
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const perplexityKey = process.env.PERPLEXITY_API_KEY;
    
    // Return appropriate key based on domain
    // This can be enhanced with more sophisticated logic
    // For now, prefer Anthropic for law due to its stronger legal reasoning
    if (domain.toLowerCase() === 'law' || domain.toLowerCase() === 'legal') {
      return anthropicKey || openaiKey || perplexityKey || null;
    }
    
    // For languages, any of the models work well
    if (domain.toLowerCase() === 'language' || domain.toLowerCase() === 'linguistics') {
      return openaiKey || anthropicKey || perplexityKey || null;
    }
    
    // Default to any available API key
    return openaiKey || anthropicKey || perplexityKey || null;
  }
}