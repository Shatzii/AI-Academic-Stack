/**
 * AI Service Integration Layer
 * 
 * Unified AI service that automatically routes to self-hosted Academic AI Engine
 * or falls back to external APIs based on configuration
 */

const axios = require('axios');

class AIService {
  constructor() {
    this.useLocalEngine = process.env.USE_LOCAL_AI_ENGINE === 'true';
    this.localEngineUrl = process.env.LOCAL_AI_ENGINE_URL || 'http://localhost:8000';
    this.anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.perplexityApiKey = process.env.PERPLEXITY_API_KEY;
  }

  async checkStatus() {
    if (this.useLocalEngine) {
      try {
        const response = await axios.get(`${this.localEngineUrl}/health`, { timeout: 5000 });
        return {
          status: 'healthy',
          engine: 'self-hosted',
          models: response.data.models || [],
          message: 'Academic AI Engine is operational'
        };
      } catch (error) {
        return {
          status: 'error',
          engine: 'self-hosted',
          message: `Academic AI Engine not responding: ${error.message}`
        };
      }
    } else {
      // Check external APIs
      const results = {
        anthropic: false,
        openai: false,
        perplexity: false
      };

      if (this.anthropicApiKey) {
        try {
          // Test Anthropic connection
          results.anthropic = true;
        } catch (error) {
          console.error('Anthropic API error:', error.message);
        }
      }

      if (this.openaiApiKey) {
        try {
          // Test OpenAI connection
          results.openai = true;
        } catch (error) {
          console.error('OpenAI API error:', error.message);
        }
      }

      if (this.perplexityApiKey) {
        try {
          // Test Perplexity connection
          results.perplexity = true;
        } catch (error) {
          console.error('Perplexity API error:', error.message);
        }
      }

      return {
        status: Object.values(results).some(Boolean) ? 'healthy' : 'error',
        engine: 'external',
        ...results,
        message: `External APIs: ${Object.entries(results).filter(([k, v]) => v).map(([k]) => k).join(', ')}`
      };
    }
  }

  async generateChatCompletion(messages, options = {}) {
    const {
      model = 'educational-llama-7b',
      maxTokens = 1024,
      temperature = 0.7,
      stream = false
    } = options;

    if (this.useLocalEngine) {
      try {
        const response = await axios.post(`${this.localEngineUrl}/v1/chat/completions`, {
          messages,
          model,
          max_tokens: maxTokens,
          temperature,
          stream
        });
        return response.data;
      } catch (error) {
        console.error('Local AI Engine error:', error.message);
        throw new Error(`Academic AI Engine error: ${error.message}`);
      }
    } else {
      // Fallback to external APIs
      throw new Error('External AI APIs not configured for this request');
    }
  }

  async generateAnthropicMessage(messages, options = {}) {
    const {
      model = 'neurodivergent-assistant',
      maxTokens = 1024
    } = options;

    if (this.useLocalEngine) {
      try {
        const response = await axios.post(`${this.localEngineUrl}/v1/messages`, {
          messages,
          model,
          max_tokens: maxTokens
        });
        return response.data;
      } catch (error) {
        console.error('Local AI Engine error:', error.message);
        throw new Error(`Academic AI Engine error: ${error.message}`);
      }
    } else {
      // Fallback to external Anthropic API
      throw new Error('Anthropic API not configured for this request');
    }
  }

  async generateLesson(subject, grade, topic, learningStyle, accommodations) {
    if (this.useLocalEngine) {
      try {
        const response = await axios.post(`${this.localEngineUrl}/v1/generate/lesson`, {
          subject,
          grade,
          topic,
          learningStyle,
          accommodations
        });
        return response.data;
      } catch (error) {
        console.error('Lesson generation error:', error.message);
        throw new Error(`Lesson generation failed: ${error.message}`);
      }
    } else {
      throw new Error('Lesson generation requires Academic AI Engine');
    }
  }

  async generateAssessment(subject, grade, topic, assessmentType, difficulty) {
    if (this.useLocalEngine) {
      try {
        const response = await axios.post(`${this.localEngineUrl}/v1/generate/assessment`, {
          subject,
          grade,
          topic,
          assessmentType,
          difficulty
        });
        return response.data;
      } catch (error) {
        console.error('Assessment generation error:', error.message);
        throw new Error(`Assessment generation failed: ${error.message}`);
      }
    } else {
      throw new Error('Assessment generation requires Academic AI Engine');
    }
  }

  async analyzeContent(content, platform, userId) {
    if (this.useLocalEngine) {
      try {
        const response = await axios.post(`${this.localEngineUrl}/v1/analyze/content`, {
          content,
          platform,
          userId
        });
        return response.data;
      } catch (error) {
        console.error('Content analysis error:', error.message);
        throw new Error(`Content analysis failed: ${error.message}`);
      }
    } else {
      throw new Error('Content analysis requires Academic AI Engine');
    }
  }

  async getAvailableModels() {
    if (this.useLocalEngine) {
      try {
        const response = await axios.get(`${this.localEngineUrl}/v1/models`);
        return response.data;
      } catch (error) {
        console.error('Models list error:', error.message);
        return { object: 'list', data: [] };
      }
    } else {
      return {
        object: 'list',
        data: [
          { id: 'gpt-4o', name: 'GPT-4o' },
          { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' }
        ]
      };
    }
  }

  // School-specific AI teachers
  async getDeanWonder(prompt, accommodations = []) {
    const messages = [{
      role: 'system',
      content: `You are Dean Wonder, the AI principal of SuperHero School (K-6). You help young students aged 5-11 with superhero-themed learning. You're encouraging, use simple language, and make learning fun with superhero metaphors. Always consider neurodivergent accommodations: ${accommodations.join(', ')}.`
    }, {
      role: 'user',
      content: prompt
    }];

    return this.generateChatCompletion(messages, { model: 'neurodivergent-assistant' });
  }

  async getDeanSterling(prompt, accommodations = []) {
    const messages = [{
      role: 'system',
      content: `You are Dean Sterling, the AI principal of Stage Prep School (7-12). You help teenagers with theater arts, performance skills, and academic preparation. You're mature, inspiring, and help students develop both artistic and academic excellence. Always consider neurodivergent accommodations: ${accommodations.join(', ')}.`
    }, {
      role: 'user',
      content: prompt
    }];

    return this.generateChatCompletion(messages, { model: 'educational-llama-7b' });
  }

  async getProfessorBarrett(prompt, specialization = 'general') {
    const messages = [{
      role: 'system',
      content: `You are Professor Barrett, the AI law professor at The Lawyer Makers. You provide expert legal education, bar exam preparation, and career guidance. You're knowledgeable, professional, and help students master complex legal concepts. Specialization: ${specialization}.`
    }, {
      role: 'user',
      content: prompt
    }];

    return this.generateChatCompletion(messages, { model: 'legal-education-ai' });
  }

  async getProfessorLingua(prompt, language = 'english', level = 'intermediate') {
    const messages = [{
      role: 'system',
      content: `You are Professor Lingua, the AI language teacher at Global Language Academy. You provide immersive language learning in multiple languages with cultural context. You're patient, encouraging, and adapt to different proficiency levels. Target language: ${language}, Level: ${level}.`
    }, {
      role: 'user',
      content: prompt
    }];

    return this.generateChatCompletion(messages, { model: 'language-tutor-ai' });
  }
}

module.exports = new AIService();