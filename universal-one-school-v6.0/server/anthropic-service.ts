/**
 * Anthropic AI Service
 * 
 * This module provides a reusable interface for interacting with the Anthropic API
 * for all ShotziOS AI-powered features.
 */

import Anthropic from '@anthropic-ai/sdk';
import { Request } from 'express';

// Constants
// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const ANTHROPIC_MODEL = 'claude-3-7-sonnet-20250219';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Types
export interface AnthropicTextAnalysisOptions {
  maxTokens?: number;
  systemPrompt?: string;
  temperature?: number;
}

export interface AnthropicMultimodalAnalysisOptions extends AnthropicTextAnalysisOptions {
  imageBase64: string;
  imageType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'; // Supported formats by Anthropic
}

// Service methods
export const AnthropicService = {
  /**
   * Get the Anthropic client instance
   */
  getClient(): Anthropic {
    return anthropic;
  },

  /**
   * Generate a text response using the Anthropic API
   */
  async generateText(
    prompt: string,
    options: AnthropicTextAnalysisOptions = {}
  ): Promise<string> {
    try {
      const response = await anthropic.messages.create({
        model: ANTHROPIC_MODEL,
        max_tokens: options.maxTokens || 1024,
        system: options.systemPrompt || undefined,
        temperature: options.temperature,
        messages: [{ role: 'user', content: prompt }],
      });

      // Extract text content from response
      let result = '';
      for (const block of response.content) {
        if ('text' in block) {
          result += block.text;
        }
      }
      
      return result;
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw new Error(`Anthropic API error: ${(error as Error).message}`);
    }
  },

  /**
   * Analyze content using multimodal capabilities
   */
  async analyzeMultimodal(
    prompt: string,
    options: AnthropicMultimodalAnalysisOptions
  ): Promise<string> {
    try {
      // Validate required parameters
      if (!options.imageBase64) {
        throw new Error('Image data is required for multimodal analysis');
      }
      
      if (!options.imageType) {
        throw new Error('Image type is required for multimodal analysis');
      }
      
      console.log(`Analyzing image of type ${options.imageType} with prompt: ${prompt.substring(0, 50)}...`);
      
      // Call Anthropic API
      const response = await anthropic.messages.create({
        model: ANTHROPIC_MODEL,
        max_tokens: options.maxTokens || 1024,
        system: options.systemPrompt || undefined,
        temperature: options.temperature,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: options.imageType,
                data: options.imageBase64
              }
            }
          ]
        }]
      });
      
      // Extract text content from response
      let result = '';
      for (const block of response.content) {
        if ('text' in block) {
          result += block.text;
        }
      }
      
      return result;
    } catch (error) {
      console.error('Anthropic Multimodal API error:', error);
      throw new Error(`Anthropic Multimodal API error: ${(error as Error).message}`);
    }
  },

  /**
   * Analyze an educational concept with personalized learning adaptation
   */
  async generateEducationalContent(
    subject: string,
    concept: string,
    gradeLevel: string,
    neurotypeFocus: string | null = null,
    format: string = 'text'
  ): Promise<string> {
    const systemPrompt = `You are an expert educational content creator specializing in creating 
    engaging, accessible learning materials for students of diverse abilities and needs.
    
    Your content should be:
    1. Age-appropriate for the specified grade level
    2. Pedagogically sound with clear learning objectives
    3. Engaging and interactive where possible
    4. Designed with universal accessibility principles in mind
    ${neurotypeFocus ? `5. Specially optimized for learners with ${neurotypeFocus}` : ''}
    
    When responding, use a supportive, encouraging tone that builds confidence.
    Emphasize real-world connections and practical applications of concepts.
    Include opportunities for active learning and self-assessment.`;
    
    return this.generateText(
      `Create educational content about "${concept}" for ${subject} at ${gradeLevel} grade level in ${format} format.`,
      {
        systemPrompt,
        maxTokens: 2048,
        temperature: 0.7
      }
    );
  }
};

/**
 * Helper function to check if the Anthropic API key is available
 */
export function isAnthropicAPIAvailable(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

/**
 * Helper function to extract image data from a request
 */
export function extractImageFromRequest(req: Request): { base64: string, type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' } | null {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return null;
    }
    
    const imageFile = req.files.image;
    if (!imageFile || Array.isArray(imageFile)) {
      return null;
    }
    
    // Convert file to base64
    const base64 = imageFile.data.toString('base64');
    const mimeType = imageFile.mimetype;
    
    // Validate supported image types
    if (
      mimeType !== 'image/jpeg' && 
      mimeType !== 'image/png' && 
      mimeType !== 'image/gif' && 
      mimeType !== 'image/webp'
    ) {
      console.error('Unsupported image type:', mimeType);
      return null;
    }
    
    return { 
      base64, 
      type: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
    };
  } catch (error) {
    console.error('Error extracting image from request:', error);
    return null;
  }
}

export default AnthropicService;