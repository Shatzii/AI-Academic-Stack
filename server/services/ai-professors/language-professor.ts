/**
 * AI Language Professor Implementation
 * 
 * This module implements a specialized language professor AI for teaching
 * various languages (English, Spanish, German, Chinese). It extends the base AI professor 
 * with language teaching methodologies, conversation practice, and pronunciation guidance.
 */

import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';
import { 
  BaseAIProfessor, 
  ProfessorProfile, 
  ContentRequest, 
  ContentResponse,
  Message, 
  Conversation,
  MessageRole,
  MessageType,
  ExpertiseLevel,
  TeachingStyle,
  PersonalityTrait,
  ContentType
} from './ai-professor-interface';
import { LearningProfile, Neurotype } from '../learning-profile-service';
import OpenAI from 'openai';

// In-memory storage for conversations
// In a production environment, this would be replaced with a database
const conversationStore = new Map<string, Conversation>();

/**
 * Language Learning Levels (CEFR)
 */
export enum LanguageLevel {
  A1 = 'a1', // Beginner
  A2 = 'a2', // Elementary
  B1 = 'b1', // Intermediate
  B2 = 'b2', // Upper Intermediate
  C1 = 'c1', // Advanced
  C2 = 'c2'  // Proficient
}

/**
 * Language Skills
 */
export enum LanguageSkill {
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  READING = 'reading',
  WRITING = 'writing',
  VOCABULARY = 'vocabulary',
  GRAMMAR = 'grammar',
  PRONUNCIATION = 'pronunciation',
  CULTURE = 'culture'
}

/**
 * Teaching Languages
 */
export enum TeachingLanguage {
  ENGLISH = 'english',
  SPANISH = 'spanish',
  GERMAN = 'german',
  CHINESE = 'chinese'
}

/**
 * Lesson Types
 */
export enum LessonType {
  GRAMMAR = 'grammar',
  VOCABULARY = 'vocabulary',
  CONVERSATION = 'conversation',
  READING = 'reading',
  WRITING = 'writing',
  PRONUNCIATION = 'pronunciation',
  CULTURE = 'culture',
  ASSESSMENT = 'assessment'
}

/**
 * AI Language Professor
 */
export class LanguageProfessor extends BaseAIProfessor {
  private anthropic: Anthropic;
  private openai: OpenAI;
  private teachingLanguage: TeachingLanguage;
  private languageSkills: LanguageSkill[];
  private lessonTypes: LessonType[];
  
  /**
   * Constructor
   */
  constructor(profile: ProfessorProfile, apiKey: string) {
    super(profile, apiKey);
    
    // Initialize Anthropic client
    // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
    this.anthropic = new Anthropic({
      apiKey: this.apiKey
    });
    
    // Initialize OpenAI client
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Determine teaching language from profile
    this.teachingLanguage = this.determineTeachingLanguage(profile.specialization);
    
    // Set language skills
    this.languageSkills = [
      LanguageSkill.LISTENING,
      LanguageSkill.SPEAKING,
      LanguageSkill.READING,
      LanguageSkill.WRITING,
      LanguageSkill.VOCABULARY,
      LanguageSkill.GRAMMAR,
      LanguageSkill.PRONUNCIATION,
      LanguageSkill.CULTURE
    ];
    
    // Set lesson types
    this.lessonTypes = [
      LessonType.GRAMMAR,
      LessonType.VOCABULARY,
      LessonType.CONVERSATION,
      LessonType.READING,
      LessonType.WRITING,
      LessonType.PRONUNCIATION,
      LessonType.CULTURE,
      LessonType.ASSESSMENT
    ];
  }
  
  /**
   * Generate educational content based on the request
   */
  public async generateContent(request: ContentRequest): Promise<ContentResponse> {
    try {
      // Create system prompt based on professor profile and learning profile
      const systemPrompt = this.createSystemPrompt(request.learningProfile);
      
      // Create the user prompt based on the content request
      let userPrompt = `I need you to generate ${request.contentType} content about ${request.topic} in ${this.teachingLanguage} language instruction.`;
      
      // Add difficulty level if specified
      if (request.difficultyLevel) {
        const languageLevel = this.mapDifficultyToLanguageLevel(request.difficultyLevel);
        userPrompt += ` The content should be at a ${languageLevel} (${request.difficultyLevel}) level.`;
      }
      
      // Add length specification if specified
      if (request.length) {
        userPrompt += ` Please make it ${request.length} in length.`;
      }
      
      // Add format specification if specified
      if (request.format) {
        userPrompt += ` Use a ${request.format} format.`;
      }
      
      // Add any additional instructions
      if (request.additionalInstructions) {
        userPrompt += `\n\nAdditional instructions: ${request.additionalInstructions}`;
      }
      
      // Add neurotype-specific adaptations
      if (request.learningProfile?.neurotype) {
        userPrompt += this.getNeurotypePromptAddition(request.learningProfile.neurotype);
      }
      
      // Add content type specific instructions
      userPrompt += this.getContentTypeInstructions(request.contentType);
      
      // Get response from the AI model
      const response = await this.anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      });
      
      // Extract content from the response
      const generatedContent = response.content[0].text;
      
      // Create content response
      const contentResponse: ContentResponse = {
        id: uuidv4(),
        professorId: this.profile.id || 'language-professor',
        userId: request.userId,
        contentType: request.contentType,
        topic: request.topic,
        content: generatedContent,
        timestamp: new Date(),
        adaptations: request.learningProfile ? this.getAdaptationsApplied(request.learningProfile) : undefined,
        metadata: {
          language: this.teachingLanguage,
          difficultyLevel: request.difficultyLevel,
          languageLevel: this.mapDifficultyToLanguageLevel(request.difficultyLevel),
          length: request.length,
          format: request.format,
          lessonType: this.determineLessonType(request.topic)
        }
      };
      
      return contentResponse;
    } catch (error) {
      console.error('Error generating content with Language Professor:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }
  
  /**
   * Handle student interaction in a conversation
   */
  public async handleInteraction(conversationId: string, message: Message): Promise<Message> {
    try {
      // Get the conversation
      const conversation = await this.getConversation(conversationId);
      
      if (!conversation) {
        throw new Error(`Conversation with ID ${conversationId} not found`);
      }
      
      // Add the new message to the conversation
      conversation.messages.push(message);
      conversation.lastUpdated = new Date();
      
      // Create system prompt
      let systemPrompt = this.createSystemPrompt();
      
      // Add language-specific instruction for conversation practice
      systemPrompt += `\n\nThis is a ${this.teachingLanguage} language conversation practice. As a language professor:
- Respond in ${this.teachingLanguage} at an appropriate level for the student
- Provide corrections for language errors in a supportive way
- Use vocabulary and grammar that's slightly above the student's current level
- Ask follow-up questions to encourage continued conversation
- If the student writes in English but should be practicing ${this.teachingLanguage}, gently encourage them to try in ${this.teachingLanguage}`;
      
      // Format conversation history for the model
      const messages = conversation.messages.map(msg => {
        let role: 'user' | 'assistant' | 'system' = 'user';
        
        if (msg.role === MessageRole.PROFESSOR || msg.role === MessageRole.ASSISTANT) {
          role = 'assistant';
        } else if (msg.role === MessageRole.SYSTEM) {
          role = 'system';
        }
        
        return {
          role,
          content: msg.content
        };
      });
      
      // Call the AI model
      const response = await this.anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 2000,
        system: systemPrompt,
        messages
      });
      
      // Create response message
      const responseMessage: Message = {
        id: uuidv4(),
        role: MessageRole.PROFESSOR,
        content: response.content[0].text,
        type: MessageType.TEXT,
        timestamp: new Date()
      };
      
      // Add the response to the conversation
      conversation.messages.push(responseMessage);
      
      // Update the conversation in the store
      conversationStore.set(conversationId, conversation);
      
      return responseMessage;
    } catch (error) {
      console.error('Error handling interaction with Language Professor:', error);
      throw new Error(`Failed to handle interaction: ${error.message}`);
    }
  }
  
  /**
   * Start a new conversation with the professor
   */
  public async startConversation(
    userId: number, 
    topic: string, 
    initialMessage?: string
  ): Promise<Conversation> {
    try {
      // Create a new conversation
      const conversationId = uuidv4();
      
      const conversation: Conversation = {
        id: conversationId,
        userId,
        professorId: this.profile.id || 'language-professor',
        topic,
        messages: [],
        status: 'active',
        lastUpdated: new Date(),
        metadata: {
          language: this.teachingLanguage,
          lessonType: this.determineLessonType(topic)
        }
      };
      
      // Add system message
      const systemMessage: Message = {
        role: MessageRole.SYSTEM,
        content: this.createSystemPrompt(),
        type: MessageType.TEXT,
        timestamp: new Date()
      };
      
      conversation.messages.push(systemMessage);
      
      // Add initial message if provided
      if (initialMessage) {
        const userMessage: Message = {
          id: uuidv4(),
          role: MessageRole.STUDENT,
          content: initialMessage,
          type: MessageType.TEXT,
          timestamp: new Date()
        };
        
        conversation.messages.push(userMessage);
        
        // Generate professor's response
        const professorMessage = await this.handleInteraction(conversationId, userMessage);
        conversation.messages.push(professorMessage);
      }
      
      // Store the conversation
      conversationStore.set(conversationId, conversation);
      
      return conversation;
    } catch (error) {
      console.error('Error starting conversation with Language Professor:', error);
      throw new Error(`Failed to start conversation: ${error.message}`);
    }
  }
  
  /**
   * Get a conversation by ID
   */
  public async getConversation(conversationId: string): Promise<Conversation | null> {
    return conversationStore.get(conversationId) || null;
  }
  
  /**
   * End a conversation with the professor
   */
  public async endConversation(conversationId: string): Promise<boolean> {
    // Get the conversation
    const conversation = conversationStore.get(conversationId);
    
    if (!conversation) {
      return false;
    }
    
    // Update status
    conversation.status = 'archived';
    conversation.lastUpdated = new Date();
    
    // Update in store
    conversationStore.set(conversationId, conversation);
    
    return true;
  }
  
  /**
   * Provide assessment or feedback on student work
   */
  public async provideAssessment(
    userId: number,
    submission: string,
    rubric?: Record<string, any>
  ): Promise<ContentResponse> {
    try {
      // Create system prompt
      const systemPrompt = `${this.createSystemPrompt()}\n\nYou are evaluating a student's ${this.teachingLanguage} language submission. Provide constructive feedback highlighting strengths and areas for improvement. Be specific, educational, and encouraging in your assessment.`;
      
      // Create user prompt
      let userPrompt = `Please evaluate the following ${this.teachingLanguage} language submission:\n\n`;
      userPrompt += submission;
      
      // Add rubric if provided
      if (rubric) {
        userPrompt += '\n\nPlease use the following criteria for assessment:\n';
        
        for (const [criterion, description] of Object.entries(rubric)) {
          userPrompt += `- ${criterion}: ${description}\n`;
        }
      } else {
        // Default assessment criteria
        userPrompt += '\n\nPlease assess based on the following criteria:\n';
        userPrompt += '- Grammar: Correct use of grammatical structures\n';
        userPrompt += '- Vocabulary: Appropriate and varied vocabulary usage\n';
        userPrompt += '- Fluency: Natural flow and coherence\n';
        userPrompt += '- Accuracy: Correct language use\n';
        userPrompt += '- Task Achievement: Fulfillment of the assignment requirements\n';
      }
      
      userPrompt += `\n\nPlease provide a comprehensive assessment with specific feedback and suggestions for improvement. Include examples of corrections where appropriate. Provide the feedback in both ${this.teachingLanguage} and English.`;
      
      // Call the AI model
      const response = await this.anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 3000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      });
      
      // Create content response
      const contentResponse: ContentResponse = {
        id: uuidv4(),
        professorId: this.profile.id || 'language-professor',
        userId,
        contentType: ContentType.ASSESSMENT,
        topic: `${this.teachingLanguage.charAt(0).toUpperCase() + this.teachingLanguage.slice(1)} Language Assessment`,
        content: response.content[0].text,
        timestamp: new Date(),
        metadata: {
          language: this.teachingLanguage,
          submissionLength: submission.length,
          rubric: rubric || 'default'
        }
      };
      
      return contentResponse;
    } catch (error) {
      console.error('Error providing assessment with Language Professor:', error);
      throw new Error(`Failed to provide assessment: ${error.message}`);
    }
  }
  
  /**
   * Adapt teaching approach based on learning profile
   */
  public async adaptToLearningProfile(
    learningProfile: LearningProfile
  ): Promise<Record<string, any>> {
    // Create adaptations based on learning profile
    const adaptations: Record<string, any> = {
      primaryStyle: learningProfile.primaryStyle,
      secondaryStyle: learningProfile.secondaryStyle,
      adaptationLevel: learningProfile.adaptationLevel,
      contentStrategies: []
    };
    
    // Add content strategies based on learning style
    switch (learningProfile.primaryStyle) {
      case 'visual':
        adaptations.contentStrategies.push(
          'Use images and diagrams for vocabulary learning',
          'Provide visual representations of grammar structures',
          'Include color-coding for different parts of speech',
          'Create visual concept maps for language relationships'
        );
        break;
        
      case 'auditory':
        adaptations.contentStrategies.push(
          'Emphasize listening exercises and pronunciation',
          'Use dialogues and audio recordings',
          'Create rhythm and mnemonic devices for grammar rules',
          'Incorporate songs and rhymes for vocabulary acquisition'
        );
        break;
        
      case 'kinesthetic':
        adaptations.contentStrategies.push(
          'Design role-playing activities for language practice',
          'Create interactive exercises requiring movement',
          'Incorporate gesture and movement for vocabulary retention',
          'Use physical manipulation of language elements (cards, objects)'
        );
        break;
        
      case 'reading_writing':
        adaptations.contentStrategies.push(
          'Provide written explanations of language concepts',
          'Include reading passages with comprehension questions',
          'Design writing exercises and journals',
          'Create note-taking templates for grammar rules'
        );
        break;
    }
    
    // Add neurotype-specific adaptations
    switch (learningProfile.neurotype) {
      case Neurotype.DYSLEXIA:
        adaptations.neurotypeAdaptations = [
          'Use clear, sans-serif fonts for all text',
          'Break down complex language structures into manageable parts',
          'Provide audio recordings alongside written text',
          'Use multisensory approaches to vocabulary learning',
          'Increase spacing in text and present information in smaller chunks'
        ];
        break;
        
      case Neurotype.ADHD:
        adaptations.neurotypeAdaptations = [
          'Break language learning into shorter, focused activities',
          'Use frequent comprehension checks',
          'Implement gamification elements for engagement',
          'Provide clear, structured approaches to language tasks',
          'Include movement and interactive elements'
        ];
        break;
        
      case Neurotype.AUTISM_SPECTRUM:
        adaptations.neurotypeAdaptations = [
          'Provide explicit, clear instructions for all language tasks',
          'Create predictable structures for language lessons',
          'Use literal explanations of idioms and figurative language',
          'Offer visual supports alongside linguistic content',
          'Minimize sensory distractions in learning materials'
        ];
        break;
    }
    
    // Return the adaptations
    return adaptations;
  }
  
  /**
   * Determine teaching language from specialization
   */
  private determineTeachingLanguage(specialization: string): TeachingLanguage {
    const specializationLower = specialization.toLowerCase();
    
    if (specializationLower.includes('spanish')) {
      return TeachingLanguage.SPANISH;
    } else if (specializationLower.includes('german')) {
      return TeachingLanguage.GERMAN;
    } else if (specializationLower.includes('chinese') || specializationLower.includes('mandarin')) {
      return TeachingLanguage.CHINESE;
    } else {
      // Default to English
      return TeachingLanguage.ENGLISH;
    }
  }
  
  /**
   * Map difficulty level to CEFR language level
   */
  private mapDifficultyToLanguageLevel(difficultyLevel?: string): LanguageLevel {
    if (!difficultyLevel) {
      return LanguageLevel.B1; // Default to intermediate
    }
    
    switch (difficultyLevel.toLowerCase()) {
      case 'beginner':
        return LanguageLevel.A1;
      case 'elementary':
        return LanguageLevel.A2;
      case 'intermediate':
        return LanguageLevel.B1;
      case 'upper intermediate':
        return LanguageLevel.B2;
      case 'advanced':
        return LanguageLevel.C1;
      case 'expert':
      case 'proficient':
        return LanguageLevel.C2;
      default:
        return LanguageLevel.B1;
    }
  }
  
  /**
   * Determine lesson type based on topic
   */
  private determineLessonType(topic: string): LessonType {
    const topicLower = topic.toLowerCase();
    
    if (topicLower.includes('grammar') || topicLower.includes('tense') || topicLower.includes('structure')) {
      return LessonType.GRAMMAR;
    } else if (topicLower.includes('vocabulary') || topicLower.includes('words')) {
      return LessonType.VOCABULARY;
    } else if (topicLower.includes('conversation') || topicLower.includes('speaking') || topicLower.includes('dialogue')) {
      return LessonType.CONVERSATION;
    } else if (topicLower.includes('reading') || topicLower.includes('text') || topicLower.includes('passage')) {
      return LessonType.READING;
    } else if (topicLower.includes('writing') || topicLower.includes('essay') || topicLower.includes('composition')) {
      return LessonType.WRITING;
    } else if (topicLower.includes('pronunciation') || topicLower.includes('accent') || topicLower.includes('phonetics')) {
      return LessonType.PRONUNCIATION;
    } else if (topicLower.includes('culture') || topicLower.includes('tradition') || topicLower.includes('custom')) {
      return LessonType.CULTURE;
    } else if (topicLower.includes('test') || topicLower.includes('exam') || topicLower.includes('assessment')) {
      return LessonType.ASSESSMENT;
    } else {
      // Default to conversation if no match
      return LessonType.CONVERSATION;
    }
  }
  
  /**
   * Get adaptations applied based on learning profile
   */
  private getAdaptationsApplied(learningProfile: LearningProfile): Record<string, any> {
    const adaptations: Record<string, any> = {};
    
    // Add learning style adaptations
    adaptations.learningStyle = {
      primary: learningProfile.primaryStyle,
      secondary: learningProfile.secondaryStyle || 'none',
      contentPreferences: learningProfile.contentPreferences
    };
    
    // Add neurotype adaptations
    adaptations.neurotype = {
      type: learningProfile.neurotype,
      level: learningProfile.adaptationLevel
    };
    
    // Add specific adaptations
    adaptations.specific = {};
    
    for (const [category, adaptation] of Object.entries(learningProfile.adaptations)) {
      if (adaptation?.required) {
        adaptations.specific[category] = adaptation.specifics;
      }
    }
    
    return adaptations;
  }
  
  /**
   * Get neurotype-specific prompt additions
   */
  private getNeurotypePromptAddition(neurotype: Neurotype): string {
    switch (neurotype) {
      case Neurotype.DYSLEXIA:
        return `\n\nThis content is for a student with dyslexia. Please:
- Use clear, straightforward language
- Break complex language concepts into smaller parts
- Use bullet points and numbered lists where appropriate
- Include visual elements to reinforce text
- Avoid dense blocks of text`;
        
      case Neurotype.ADHD:
        return `\n\nThis content is for a student with ADHD. Please:
- Keep explanations concise and engaging
- Use frequent subheadings to organize content
- Include interactive elements or activities
- Highlight key language points clearly
- Create a visually structured layout`;
        
      case Neurotype.AUTISM_SPECTRUM:
        return `\n\nThis content is for a student on the autism spectrum. Please:
- Use clear, literal language (avoid idioms or figurative speech until explicitly taught)
- Provide explicit step-by-step explanations
- Maintain consistent formatting and structure
- Use precise definitions for language terminology
- Present information in a predictable format`;
        
      default:
        return '';
    }
  }
  
  /**
   * Get content type specific instructions
   */
  private getContentTypeInstructions(contentType: ContentType): string {
    switch (contentType) {
      case ContentType.LECTURE:
        return `\n\nThis should be a language lesson that:
- Explains key ${this.teachingLanguage} language concepts clearly
- Includes examples and sample sentences
- Introduces vocabulary in context
- Provides cultural context where relevant
- Includes practice opportunities`;
        
      case ContentType.EXERCISE:
        return `\n\nThis should be a language practice exercise that:
- Reinforces specific ${this.teachingLanguage} language skills
- Includes clear instructions in both English and ${this.teachingLanguage}
- Provides examples before exercises
- Includes an answer key with explanations`;
        
      case ContentType.ASSESSMENT:
        return `\n\nThis should be a language assessment that:
- Evaluates understanding of ${this.teachingLanguage} language concepts
- Includes a mix of question types
- Tests both receptive and productive skills
- Includes a scoring guide`;
        
      case ContentType.EXPLANATION:
        return `\n\nThis should be a clear explanation of a ${this.teachingLanguage} language concept that:
- Breaks down complex grammar or vocabulary
- Uses examples and comparisons
- Anticipates common errors or misconceptions
- Includes practice applications`;
        
      case ContentType.CONVERSATION:
        return `\n\nThis should be a ${this.teachingLanguage} conversation lesson that:
- Provides dialogue examples on the topic
- Includes key vocabulary and phrases
- Offers cultural context
- Provides conversation prompts for practice`;
        
      default:
        return '';
    }
  }
  
  /**
   * Create a default Language Professor profile
   */
  public static createDefaultProfile(language: TeachingLanguage): ProfessorProfile {
    let name, title, description, systemPrompt;
    
    switch (language) {
      case TeachingLanguage.SPANISH:
        name = 'Profesora Isabella Martínez';
        title = 'Professor of Spanish Language';
        description = 'A native Spanish speaker from Madrid with over 15 years of teaching experience. Profesora Martínez specializes in Spanish language acquisition for English speakers, with expertise in Spanish grammar, conversation, and Hispanic cultures.';
        systemPrompt = 'You are Profesora Isabella Martínez, an experienced Spanish language professor from Madrid. You teach Spanish to non-native speakers with a focus on practical communication, proper grammar, and cultural understanding. You should provide accurate Spanish language instruction, incorporating examples from everyday usage and explaining concepts clearly. When appropriate, you may use Spanish phrases followed by translations, and you should correct student errors gently but thoroughly. Your teaching emphasizes both formal Spanish and conversational expressions used in Spain and Latin America.';
        break;
        
      case TeachingLanguage.GERMAN:
        name = 'Professor Lukas Weber';
        title = 'Professor of German Language';
        description = 'A native German speaker from Berlin with extensive experience teaching German as a foreign language. Professor Weber specializes in German grammar, pronunciation, and modern German culture and literature.';
        systemPrompt = 'You are Professor Lukas Weber, an experienced German language instructor from Berlin. You teach German to non-native speakers with a methodical approach focusing on grammar structures, precise pronunciation, and cultural context. You should provide accurate German language instruction with clear explanations of grammatical concepts, including examples that demonstrate German sentence structure and word formation. When appropriate, provide German phrases with translations, and correct student errors with thorough explanations. Your teaching covers both formal and conversational German, with attention to regional variations.';
        break;
        
      case TeachingLanguage.CHINESE:
        name = 'Professor Li Wei';
        title = 'Professor of Chinese Language';
        description = 'A native Mandarin speaker from Beijing with specialized training in teaching Chinese as a foreign language. Professor Li is an expert in Chinese characters, tones, and cultural nuances essential for effective communication.';
        systemPrompt = 'You are Professor Li Wei, an experienced teacher of Mandarin Chinese from Beijing. You teach Chinese to non-native speakers with a focus on pronunciation (especially tones), character recognition, and practical communication. You should provide accurate Chinese language instruction, explaining concepts clearly and including both simplified Chinese characters and pinyin when introducing new vocabulary. When appropriate, provide cultural context that aids in understanding language usage. Your teaching emphasizes both formal standard Mandarin and common conversational expressions used in everyday situations.';
        break;
        
      case TeachingLanguage.ENGLISH:
      default:
        name = 'Dr. Emily Johnson';
        title = 'Professor of English Language';
        description = 'A TESOL-certified English language educator with over a decade of experience teaching English to speakers of other languages. Dr. Johnson specializes in communicative language teaching, English grammar, and cross-cultural communication.';
        systemPrompt = 'You are Dr. Emily Johnson, an experienced TESOL-certified English language professor. You teach English to non-native speakers with a focus on communicative competence, proper grammar, and natural expression. You should provide accurate English language instruction, incorporating examples from real-world usage and explaining concepts clearly. When appropriate, you should identify and correct common errors made by language learners and provide alternative phrasings. Your teaching covers both formal academic English and conversational expressions, with attention to context and register.';
        break;
    }
    
    return {
      id: `${language}-professor`,
      name,
      title,
      specialization: `${language.charAt(0).toUpperCase() + language.slice(1)} Language Education`,
      expertiseLevel: ExpertiseLevel.EXPERT,
      teachingStyle: TeachingStyle.COMMUNICATION_BASED,
      personalityTraits: [
        PersonalityTrait.ENCOURAGING,
        PersonalityTrait.PATIENT,
        PersonalityTrait.ENGAGING
      ],
      description,
      systemPrompt,
      modelName: "claude-3-7-sonnet-20250219",
      credentials: [
        'M.A. in Applied Linguistics',
        'Certified Language Instructor',
        'Native Speaker Proficiency'
      ],
      avatarUrl: `/images/professors/${language}-professor.png`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}

// Add communication-based teaching style
export enum TeachingStyle {
  COMMUNICATION_BASED = 'communication_based'
}

// Create factory methods for different language professors
export const createEnglishProfessor = (): LanguageProfessor | null => {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('Missing API key for Language Professor');
    return null;
  }
  
  const profile = LanguageProfessor.createDefaultProfile(TeachingLanguage.ENGLISH);
  return new LanguageProfessor(profile, apiKey);
};

export const createSpanishProfessor = (): LanguageProfessor | null => {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('Missing API key for Language Professor');
    return null;
  }
  
  const profile = LanguageProfessor.createDefaultProfile(TeachingLanguage.SPANISH);
  return new LanguageProfessor(profile, apiKey);
};

export const createGermanProfessor = (): LanguageProfessor | null => {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('Missing API key for Language Professor');
    return null;
  }
  
  const profile = LanguageProfessor.createDefaultProfile(TeachingLanguage.GERMAN);
  return new LanguageProfessor(profile, apiKey);
};

export const createChineseProfessor = (): LanguageProfessor | null => {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('Missing API key for Language Professor');
    return null;
  }
  
  const profile = LanguageProfessor.createDefaultProfile(TeachingLanguage.CHINESE);
  return new LanguageProfessor(profile, apiKey);
};