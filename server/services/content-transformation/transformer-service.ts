/**
 * Content Transformer Service
 * 
 * This service transforms educational content to be more accessible for neurodivergent learners.
 * It handles different types of transformations based on learning profiles and content types.
 */

import { NeurodivergentType, type InsertTransformedContent, type LearningProfile } from '@shared/schema';
import { db } from '../../db';
import { transformedContent, learningProfiles } from '@shared/schema';
import { eq } from 'drizzle-orm';
import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client if API key is available
const anthropic = process.env.ANTHROPIC_API_KEY 
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export interface TransformationOptions {
  userId: number;
  assignmentId?: number;
  sourceMaterialUrl?: string;
  sourceContent?: string;
  transformationType?: NeurodivergentType;
}

export interface TransformedResult {
  success: boolean;
  transformedContentId?: number;
  error?: string;
  data?: any;
}

export class ContentTransformerService {
  /**
   * Transform content based on user's learning profile and content type
   */
  async transformContent(options: TransformationOptions): Promise<TransformedResult> {
    try {
      // Validate inputs
      if (!options.sourceContent && !options.sourceMaterialUrl) {
        throw new Error('Either sourceContent or sourceMaterialUrl must be provided');
      }

      // Get the user's learning profile if transformationType is not specified
      let transformationType = options.transformationType;
      if (!transformationType) {
        const userProfile = await this.getUserLearningProfile(options.userId);
        if (userProfile) {
          transformationType = userProfile.neurodivergentType;
        } else {
          transformationType = NeurodivergentType.DYSLEXIA; // Default if no profile exists
        }
      }

      // Create a record for the transformation request
      const transformationData: InsertTransformedContent = {
        userId: options.userId,
        assignmentId: options.assignmentId,
        sourceMaterialUrl: options.sourceMaterialUrl,
        sourceContent: options.sourceContent,
        transformationType,
        status: 'processing',
        transformedContentData: null,
      };

      const [transformation] = await db.insert(transformedContent).values(transformationData).returning();

      // Process the content based on the transformation type
      let transformedData;
      switch (transformationType) {
        case NeurodivergentType.DYSLEXIA:
          transformedData = await this.transformForDyslexia(options.sourceContent || '', options.userId);
          break;
        case NeurodivergentType.ADHD:
          transformedData = await this.transformForADHD(options.sourceContent || '', options.userId);
          break;
        case NeurodivergentType.AUTISM_SPECTRUM:
          transformedData = await this.transformForAutismSpectrum(options.sourceContent || '', options.userId);
          break;
        default:
          transformedData = await this.transformForGeneral(options.sourceContent || '', options.userId);
      }

      // Update the transformation record with the results
      await db.update(transformedContent)
        .set({
          status: 'completed',
          transformedContentData: transformedData,
          updatedAt: new Date()
        })
        .where(eq(transformedContent.id, transformation.id));

      return {
        success: true,
        transformedContentId: transformation.id,
        data: transformedData
      };
    } catch (error: any) {
      console.error('Content transformation failed:', error.message);
      
      // If a transformation record was created, update it with error
      if (options.assignmentId) {
        const existingTransformations = await db.select().from(transformedContent)
          .where(eq(transformedContent.assignmentId, options.assignmentId))
          .where(eq(transformedContent.userId, options.userId));
        
        if (existingTransformations.length > 0) {
          await db.update(transformedContent)
            .set({
              status: 'failed',
              error: error.message,
              updatedAt: new Date()
            })
            .where(eq(transformedContent.id, existingTransformations[0].id));
        }
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user's learning profile
   */
  private async getUserLearningProfile(userId: number): Promise<LearningProfile | null> {
    const profiles = await db.select().from(learningProfiles)
      .where(eq(learningProfiles.userId, userId));
    
    return profiles.length > 0 ? profiles[0] : null;
  }

  /**
   * Transform content for students with dyslexia
   */
  private async transformForDyslexia(content: string, userId: number): Promise<any> {
    const profile = await this.getUserLearningProfile(userId);
    const fontPreferences = profile?.fontPreferences || this.getDefaultDyslexiaFontPreferences();
    
    // Use AI to analyze and transform the content if available
    if (anthropic) {
      try {
        const aiResponse = await this.getAITransformation(
          content,
          'dyslexia',
          fontPreferences
        );
        
        return {
          original: content,
          transformedText: aiResponse.text,
          audio: this.shouldCreateAudio(profile),
          fontSettings: fontPreferences,
          visualAids: this.getVisualAidsForDyslexia(),
          chunks: this.chunkContent(aiResponse.text, profile?.contentChunkSize || 300)
        };
      } catch (error: any) {
        console.error('AI transformation failed, falling back to manual transformation', error.message);
      }
    }
    
    // Manual transformation as fallback
    return {
      original: content,
      transformedText: this.applyDyslexiaFormatting(content),
      audio: this.shouldCreateAudio(profile),
      fontSettings: fontPreferences,
      visualAids: this.getVisualAidsForDyslexia(),
      chunks: this.chunkContent(content, profile?.contentChunkSize || 300)
    };
  }

  /**
   * Transform content for students with ADHD
   */
  private async transformForADHD(content: string, userId: number): Promise<any> {
    const profile = await this.getUserLearningProfile(userId);
    
    // Use AI to analyze and transform the content if available
    if (anthropic) {
      try {
        const aiResponse = await this.getAITransformation(
          content,
          'adhd',
          profile?.colorPreferences
        );
        
        return {
          original: content,
          transformedText: aiResponse.text,
          visualFocus: true,
          interactiveElements: this.getInteractiveElementsForADHD(),
          chunks: this.chunkContent(aiResponse.text, profile?.contentChunkSize || 150),
          checkpoints: this.createCheckpoints(aiResponse.text),
          colorSettings: profile?.colorPreferences || this.getDefaultADHDColorPreferences()
        };
      } catch (error: any) {
        console.error('AI transformation failed, falling back to manual transformation', error.message);
      }
    }
    
    // Manual transformation as fallback
    return {
      original: content,
      transformedText: this.highlightImportantPoints(content),
      visualFocus: true,
      interactiveElements: this.getInteractiveElementsForADHD(),
      chunks: this.chunkContent(content, profile?.contentChunkSize || 150),
      checkpoints: this.createCheckpoints(content),
      colorSettings: profile?.colorPreferences || this.getDefaultADHDColorPreferences()
    };
  }

  /**
   * Transform content for students on the autism spectrum
   */
  private async transformForAutismSpectrum(content: string, userId: number): Promise<any> {
    const profile = await this.getUserLearningProfile(userId);
    
    // Use AI to analyze and transform the content if available
    if (anthropic) {
      try {
        const aiResponse = await this.getAITransformation(
          content,
          'autism_spectrum',
          profile?.additionalAccommodations
        );
        
        return {
          original: content,
          transformedText: aiResponse.text,
          structuredFormat: true,
          visualSchedule: this.createVisualSchedule(aiResponse.text),
          explicitInstructions: this.extractExplicitInstructions(aiResponse.text),
          sensoryConsiderations: profile?.additionalAccommodations || this.getDefaultSensoryConsiderations(),
          predictableSequence: this.createPredictableSequence(aiResponse.text)
        };
      } catch (error: any) {
        console.error('AI transformation failed, falling back to manual transformation', error.message);
      }
    }
    
    // Manual transformation as fallback
    return {
      original: content,
      transformedText: this.addExplicitStructure(content),
      structuredFormat: true,
      visualSchedule: this.createVisualSchedule(content),
      explicitInstructions: this.extractExplicitInstructions(content),
      sensoryConsiderations: profile?.additionalAccommodations || this.getDefaultSensoryConsiderations(),
      predictableSequence: this.createPredictableSequence(content)
    };
  }

  /**
   * General transformation when specific type isn't identified
   */
  private async transformForGeneral(content: string, userId: number): Promise<any> {
    // Use AI to analyze and transform the content if available
    if (anthropic) {
      try {
        const aiResponse = await this.getAITransformation(
          content,
          'general',
          null
        );
        
        return {
          original: content,
          transformedText: aiResponse.text,
          multimodalPresentation: true,
          adaptiveElements: {
            visualAids: true,
            audioSupport: true,
            interactiveElements: true
          },
          chunks: this.chunkContent(aiResponse.text, 200)
        };
      } catch (error: any) {
        console.error('AI transformation failed, falling back to manual transformation', error.message);
      }
    }
    
    // Manual transformation as fallback
    return {
      original: content,
      transformedText: this.enhanceWithMultimodal(content),
      multimodalPresentation: true,
      adaptiveElements: {
        visualAids: true,
        audioSupport: true,
        interactiveElements: true
      },
      chunks: this.chunkContent(content, 200)
    };
  }

  /**
   * Use AI to transform content
   */
  private async getAITransformation(
    content: string,
    transformationType: string,
    preferences: any
  ): Promise<{ text: string }> {
    if (!anthropic) {
      throw new Error('Anthropic API not configured');
    }

    // Create the prompt based on transformation type and preferences
    let prompt = `Transform the following educational content to make it more accessible for a student with ${transformationType}.\n\n`;
    
    if (transformationType === 'dyslexia') {
      prompt += 'Please make these adaptations:\n';
      prompt += '1. Simplify complex sentences while preserving meaning\n';
      prompt += '2. Use dyslexia-friendly vocabulary and phrasing\n';
      prompt += '3. Add clear structure with headings and bullet points\n';
      prompt += '4. Include conceptual summaries at the start of each section\n';
      prompt += '5. Highlight key terms that need to be learned\n\n';
    } else if (transformationType === 'adhd') {
      prompt += 'Please make these adaptations:\n';
      prompt += '1. Break content into very short, focused chunks\n';
      prompt += '2. Create frequent engagement checkpoints with questions\n';
      prompt += '3. Use visually distinct formatting for different content types\n';
      prompt += '4. Add clear navigation markers to show progress\n';
      prompt += '5. Include active learning elements like "Try this now"\n\n';
    } else if (transformationType === 'autism_spectrum') {
      prompt += 'Please make these adaptations:\n';
      prompt += '1. Use concrete, literal language avoiding idioms and metaphors\n';
      prompt += '2. Create explicit step-by-step instructions for any tasks\n';
      prompt += '3. Add visual structured organization with clear sections\n';
      prompt += '4. Explain social context where relevant\n';
      prompt += '5. Include predictable patterns and transitions\n\n';
    } else {
      prompt += 'Create a multimodal version with:\n';
      prompt += '1. Clear visual organization\n';
      prompt += '2. Simplified language while maintaining educational value\n';
      prompt += '3. Broken down complex concepts\n';
      prompt += '4. Engagement elements to maintain focus\n';
      prompt += '5. Multiple ways of understanding the content\n\n';
    }

    if (preferences) {
      prompt += `Apply these specific preferences: ${JSON.stringify(preferences)}\n\n`;
    }

    prompt += `ORIGINAL CONTENT:\n${content}\n\n`;
    prompt += 'TRANSFORMED CONTENT:';

    // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 4000,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    return { text: response.content[0].text };
  }

  // Helper methods for manual transformations

  private applyDyslexiaFormatting(content: string): string {
    // Simplified implementation - in a real system this would be more sophisticated
    return content
      .split('\n\n')
      .map(paragraph => {
        // Break long sentences
        let processed = paragraph.replace(/([.!?]) /g, '$1\n');
        
        // Add bullet points for lists
        if (processed.includes(',')) {
          const parts = processed.split(',');
          if (parts.length > 2) {
            processed = parts.map(p => `• ${p.trim()}`).join('\n');
          }
        }
        
        return processed;
      })
      .join('\n\n');
  }

  private highlightImportantPoints(content: string): string {
    // Simplified implementation
    return content
      .split('\n')
      .map(line => {
        if (line.includes(':') || line.match(/^[A-Z]/) || line.includes('important')) {
          return `FOCUS: ${line}`;
        }
        return line;
      })
      .join('\n');
  }

  private addExplicitStructure(content: string): string {
    // Simplified implementation
    let structured = 'STEP-BY-STEP GUIDE:\n\n';
    
    const lines = content.split('\n');
    let stepCount = 1;
    
    for (const line of lines) {
      if (line.trim().length > 0) {
        if (line.match(/^[A-Z]/)) {
          structured += `SECTION: ${line}\n`;
        } else {
          structured += `Step ${stepCount}: ${line}\n`;
          stepCount++;
        }
      }
    }
    
    return structured;
  }

  private enhanceWithMultimodal(content: string): string {
    // Simplified implementation
    return `
VISUAL SUMMARY:
${content.substring(0, 100)}...

DETAILED CONTENT:
${content}

INTERACTIVE ELEMENTS: 
[Click to expand key concepts]
[Audio version available]
[Visual diagram]
    `;
  }

  private chunkContent(content: string, chunkSize: number): string[] {
    // Very simplified chunking - in a real implementation this would preserve
    // semantic meaning and natural break points
    const chunks: string[] = [];
    const words = content.split(' ');
    
    let currentChunk = '';
    for (const word of words) {
      if ((currentChunk + ' ' + word).length > chunkSize) {
        chunks.push(currentChunk);
        currentChunk = word;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + word;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk);
    }
    
    return chunks;
  }

  private createCheckpoints(content: string): any[] {
    // Simplified implementation
    const lines = content.split('\n');
    const checkpoints = [];
    
    for (let i = 0; i < lines.length; i += 5) {
      if (i < lines.length) {
        checkpoints.push({
          id: i / 5 + 1,
          title: `Checkpoint ${i / 5 + 1}`,
          question: `What did you learn from the section about "${lines[i].substring(0, 30)}..."?`,
          position: i
        });
      }
    }
    
    return checkpoints;
  }

  private createVisualSchedule(content: string): any[] {
    // Simplified implementation
    const lines = content.split('\n');
    return lines
      .filter(line => line.trim().length > 0)
      .slice(0, 5)
      .map((line, index) => ({
        step: index + 1,
        description: line.substring(0, 50),
        completed: false
      }));
  }

  private extractExplicitInstructions(content: string): string[] {
    // Simplified implementation
    return content
      .split('\n')
      .filter(line => 
        line.includes('must') || 
        line.includes('should') || 
        line.includes('need to') ||
        line.match(/^\d+\./)
      )
      .map(line => line.trim());
  }

  private createPredictableSequence(content: string): any {
    // Simplified implementation
    const sections = content.split('\n\n');
    return {
      totalSections: sections.length,
      currentSection: 1,
      nextSection: 2,
      sectionsCompleted: 0,
      totalSteps: sections.length * 3, // Each section has approximately 3 steps
      completedSteps: 0
    };
  }

  private shouldCreateAudio(profile: LearningProfile | null): boolean {
    return profile?.audioSupport || false;
  }

  private getDefaultDyslexiaFontPreferences(): any {
    return {
      fontFamily: 'OpenDyslexic, Arial, sans-serif',
      fontSize: '18px',
      lineSpacing: '1.5',
      letterSpacing: '0.1em',
      paragraphSpacing: '2em',
      useHighlighting: true
    };
  }

  private getVisualAidsForDyslexia(): any {
    return {
      colorCoding: true,
      visualSummaries: true,
      conceptMaps: true,
      keywordHighlighting: true
    };
  }

  private getDefaultADHDColorPreferences(): any {
    return {
      backgroundColor: '#f7f7f7',
      textColor: '#333333',
      headingColor: '#0066cc',
      highlightColor: '#ffffd9',
      focusColor: '#e6f2ff',
      lowDistraction: true
    };
  }

  private getInteractiveElementsForADHD(): any {
    return {
      progressChecks: true,
      clickableElements: true,
      expandableExplanations: true,
      quickQuizzes: true,
      timers: true
    };
  }

  private getDefaultSensoryConsiderations(): any {
    return {
      lowSensoryStimulation: true,
      predictableElements: true,
      noFlashingElements: true,
      textToSpeechCompatible: true,
      clearTransitions: true
    };
  }
}