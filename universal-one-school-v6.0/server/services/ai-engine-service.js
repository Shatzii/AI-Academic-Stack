/**
 * AI Academic Engine Service
 * 
 * This service provides integration with the self-hosted AI academic engine
 * for curriculum transformation and other educational AI features.
 * 
 * The engine is hosted at: 188.245.209.124:3721
 */

import fetch from 'node-fetch';

const AI_ENGINE_BASE_URL = process.env.AI_ENGINE_URL || 'http://188.245.209.124:3721';
const AI_ENGINE_API_KEY = process.env.AI_ENGINE_API_KEY;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Create and initialize the AI Engine Service
 * This is the main function expected by server/index.ts
 */
export function createAIEngineService() {
  // Return the AI engine service interface
  return {
    initialize: initializeAIEngine,
    generateText,
    analyzeContent,
    transformCurriculum,
    generateEducationalMaterial,
    generateFallbackResponse
  };
}

// Initialize and verify the connection to the AI engine
export async function initializeAIEngine() {
  try {
    const response = await fetch(`${AI_ENGINE_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-Key': AI_ENGINE_API_KEY
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ AI Engine connection successful:', data.status);
      return true;
    } else {
      console.error('❌ AI Engine connection failed:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ AI Engine connection error:', error.message);
    return false;
  }
}

/**
 * Generate text using the AI academic engine
 * 
 * @param {string} systemPrompt - The system prompt to guide the AI
 * @param {string} userInput - The user's input text
 * @param {Object} options - Additional options for the request
 * @returns {Promise<string>} - The generated text
 */
export async function generateText(systemPrompt, userInput, options = {}) {
  const requestBody = {
    system: systemPrompt,
    prompt: userInput,
    max_tokens: options.maxTokens || 2048,
    temperature: options.temperature || 0.7,
    model: options.model || 'academic-lite', // Use the academic-lite model by default
    stream: false
  };
  
  return await executeWithRetry(() => sendRequest('/generate', requestBody));
}

/**
 * Analyze content for educational assessment
 * 
 * @param {string} content - The content to analyze
 * @param {string} analysisType - The type of analysis to perform
 * @param {Object} options - Additional options for the request
 * @returns {Promise<Object>} - The analysis results
 */
export async function analyzeContent(content, analysisType, options = {}) {
  const requestBody = {
    content,
    analysis_type: analysisType,
    options: {
      detail_level: options.detailLevel || 'standard',
      format: options.format || 'json',
      ...options
    }
  };
  
  return await executeWithRetry(() => sendRequest('/analyze', requestBody));
}

/**
 * Transform curriculum content for specific learning differences
 * 
 * @param {string} content - The curriculum content to transform
 * @param {string} learningDifference - The learning difference to target
 * @param {string} gradeLevel - The grade level to target
 * @param {Object} options - Additional options for the transformation
 * @returns {Promise<Object>} - The transformed curriculum content
 */
export async function transformCurriculum(content, learningDifference, gradeLevel, options = {}) {
  const requestBody = {
    content,
    learning_difference: learningDifference,
    grade_level: gradeLevel,
    output_language: options.outputLanguage || 'en',
    visual_style: options.visualStyle || 'standard',
    format: options.format || 'html'
  };
  
  return await executeWithRetry(() => sendRequest('/curriculum/transform', requestBody));
}

/**
 * Generate educational materials based on topic and parameters
 * 
 * @param {string} topic - The topic to generate materials for
 * @param {string} materialType - The type of material to generate
 * @param {Object} options - Additional options for generation
 * @returns {Promise<Object>} - The generated educational materials
 */
export async function generateEducationalMaterial(topic, materialType, options = {}) {
  const requestBody = {
    topic,
    material_type: materialType,
    grade_level: options.gradeLevel || 'high-school',
    learning_difference: options.learningDifference || 'none',
    format: options.format || 'html',
    length: options.length || 'medium',
    language: options.language || 'en'
  };
  
  return await executeWithRetry(() => sendRequest('/materials/generate', requestBody));
}

/**
 * Send a request to the AI engine API
 * 
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - The request data
 * @returns {Promise<any>} - The response data
 */
async function sendRequest(endpoint, data) {
  try {
    const response = await fetch(`${AI_ENGINE_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Key': AI_ENGINE_API_KEY
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      const errorText = await response.text();
      throw new Error(`AI Engine API error (${response.status}): ${errorText}`);
    }
  } catch (error) {
    console.error(`Error in AI Engine request to ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Execute a function with retry logic
 * 
 * @param {Function} fn - The function to execute
 * @returns {Promise<any>} - The result of the function
 */
async function executeWithRetry(fn) {
  let lastError;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}`);
      
      if (attempt < MAX_RETRIES) {
        // Use standard setTimeout with a promise
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
      }
    }
  }
  
  throw lastError;
}

// Add a special fallback method for use when the AI engine is unavailable
export async function generateFallbackResponse(prompt, context, type = 'text') {
  console.warn('Using fallback response generator - AI Engine unavailable');
  
  // Create a simplified fallback response based on the requested type
  switch (type) {
    case 'html':
      return `<div class="fallback-response">
        <h2>AI Engine Temporarily Unavailable</h2>
        <p>The academic AI engine is currently unavailable. Please try again later.</p>
        <div class="request-details">
          <p><strong>Request context:</strong> ${context.substring(0, 100)}...</p>
        </div>
      </div>`;
      
    case 'json':
      return {
        status: 'fallback',
        message: 'AI Engine temporarily unavailable',
        fallback_data: {
          prompt_summary: prompt.substring(0, 100) + '...',
          context_length: context.length
        }
      };
      
    default:
      return "The academic AI engine is currently unavailable. Please try again later.";
  }
}