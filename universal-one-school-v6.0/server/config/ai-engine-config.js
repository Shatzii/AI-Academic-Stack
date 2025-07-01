/**
 * AI Academic Engine Configuration
 * 
 * This file contains the configuration for connecting to the AI academic engine
 * hosted on the Shatzii server. It provides access to AI-powered features without
 * relying on external APIs like OpenAI or Anthropic.
 */

const config = {
  // Base URL for the AI engine API
  baseUrl: process.env.AI_ENGINE_URL || 'http://188.245.209.124:3721/api',
  
  // Timeout for API requests in milliseconds
  timeout: 30000,
  
  // API version
  apiVersion: 'v1',
  
  // Default parameters for generation requests
  defaultParams: {
    maxTokens: 1000,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0.1,
    presencePenalty: 0.1
  },
  
  // Endpoints
  endpoints: {
    // Text generation endpoints
    generate: '/generate',
    chat: '/chat',
    
    // Educational content specific endpoints
    simplifyText: '/education/simplify',
    adaptForDyslexia: '/education/adapt/dyslexia',
    adaptForADHD: '/education/adapt/adhd',
    adaptForAutism: '/education/adapt/autism',
    
    // Image and media endpoints
    generateImage: '/media/image',
    generateAudio: '/media/audio',
    
    // Assessment endpoints
    generateQuiz: '/assessment/quiz',
    generateFeedback: '/assessment/feedback',
    
    // Status endpoint
    status: '/status'
  },
  
  // Models available on the academic engine
  models: {
    default: 'shatzii-edu-v1',
    advanced: 'shatzii-edu-v2',
    specialized: {
      dyslexia: 'shatzii-dyslexia-v1',
      adhd: 'shatzii-adhd-v1',
      autism: 'shatzii-autism-v1'
    }
  },
  
  // Headers to include with all requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

module.exports = config;