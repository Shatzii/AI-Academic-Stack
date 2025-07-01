/**
 * ShatziiOS Academic AI Engine Adapter
 * 
 * This service provides an adapter to connect the ShatziiOS platform to the locally
 * hosted academic AI engine. It follows the same interface as the external API services
 * but directs requests to the local AI system instead of external APIs.
 */

// Environment configuration - this will point to your local AI engine
const LOCAL_AI_ENGINE_URL = process.env.LOCAL_AI_ENGINE_URL || 'http://localhost:8000';

/**
 * Interface for model inputs
 */
export interface ModelInput {
  messages: Array<{role: string, content: string}>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  response_format?: { type: string };
}

/**
 * Academic AI Engine Adapter
 * This class provides a standardized interface to the academic AI engine
 */
export class AcademicAIAdapter {
  baseUrl: string;
  
  constructor() {
    this.baseUrl = LOCAL_AI_ENGINE_URL;
  }
  
  /**
   * Send a completion request to the academic AI engine
   */
  async completion(input: ModelInput): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      
      if (!response.ok) {
        throw new Error(`Academic AI engine request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Academic AI Engine Error:', error);
      throw error;
    }
  }
  
  /**
   * Format the response to match the expected format from external APIs
   */
  formatOpenAIResponse(result: any): any {
    return {
      choices: [
        {
          message: {
            content: result.generated_text || result.response || '',
          },
        },
      ],
    };
  }
  
  /**
   * Format the response to match Anthropic Claude's format
   */
  formatAnthropicResponse(result: any): any {
    return {
      content: [
        {
          type: 'text',
          text: result.generated_text || result.response || '',
        }
      ],
    };
  }
  
  /**
   * Get a completion that matches the OpenAI interface
   */
  async getOpenAICompletion(prompt: string, model: string = 'gpt-4o', options: any = {}): Promise<any> {
    const messages = [{ role: 'user', content: prompt }];
    
    if (options.systemPrompt) {
      messages.unshift({ role: 'system', content: options.systemPrompt });
    }
    
    const result = await this.completion({
      messages,
      model,
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1000,
      response_format: options.response_format,
    });
    
    return this.formatOpenAIResponse(result);
  }
  
  /**
   * Get a completion that matches the Anthropic Claude interface
   */
  async getAnthropicCompletion(prompt: string, model: string = 'claude-3-7-sonnet-20250219', options: any = {}): Promise<any> {
    const messages = [{ role: 'user', content: prompt }];
    
    if (options.systemPrompt) {
      messages.unshift({ role: 'system', content: options.systemPrompt });
    }
    
    const result = await this.completion({
      messages,
      model,
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1000,
    });
    
    return this.formatAnthropicResponse(result);
  }

  /**
   * Get a completion that matches the Perplexity interface
   */
  async getPerplexityCompletion(prompt: string, model: string = 'llama-3-sonar-small-32k-online', options: any = {}): Promise<any> {
    const result = await this.completion({
      messages: [{ role: 'user', content: prompt }],
      model,
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1000,
    });
    
    return {
      choices: [
        {
          message: {
            content: result.generated_text || result.response || '',
          },
        },
      ],
    };
  }
  
  /**
   * Check if the academic AI engine is running
   */
  async checkStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/status`);
      return response.ok;
    } catch (error) {
      console.error('Academic AI Engine Status Check Error:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const academicAI = new AcademicAIAdapter();

export default academicAI;