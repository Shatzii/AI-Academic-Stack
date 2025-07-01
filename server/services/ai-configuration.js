/**
 * AI Configuration for ShatziiOS
 * 
 * This file provides a centralized configuration for all AI services
 * and makes it easy to switch between external APIs and the local academic AI engine.
 */

// Environment setup
const USE_LOCAL_AI_ENGINE = process.env.USE_LOCAL_AI_ENGINE === 'true';
const LOCAL_AI_ENGINE_URL = process.env.LOCAL_AI_ENGINE_URL || 'http://localhost:8000';

// Model mapping configuration
// Maps external API model names to equivalent local academic models
const MODEL_MAPPING = {
  // Anthropic models
  'claude-3-7-sonnet-20250219': 'academic-llama-7b-chat',
  'claude-3-7-opus-20250219': 'academic-llama-13b-chat', 
  'claude-3-5-sonnet-20240620': 'academic-llama-7b-chat',
  
  // OpenAI models
  'gpt-4o': 'academic-mixtral-8x7b',
  'gpt-4o-mini': 'academic-llama-7b-instruct',
  'gpt-4': 'academic-mixtral-8x7b',
  
  // Perplexity models
  'llama-3-sonar-small-32k-online': 'academic-llama-7b-chat',
  'llama-3-sonar-large-32k-online': 'academic-llama-13b-chat',
  'llama-3-sonar-huge-128k-online': 'academic-mixtral-8x7b'
};

/**
 * Get the appropriate model name based on configuration
 * @param {string} externalModel - The external API model name
 * @returns {string} The model name to use
 */
function getModelName(externalModel) {
  if (!USE_LOCAL_AI_ENGINE) {
    return externalModel;
  }
  
  return MODEL_MAPPING[externalModel] || 'academic-llama-7b-chat'; // Default fallback
}

/**
 * Check if we should use the local academic AI engine
 * @returns {boolean} True if local engine should be used
 */
function useLocalEngine() {
  return USE_LOCAL_AI_ENGINE;
}

/**
 * Get the URL for the local academic AI engine
 * @returns {string} The URL for the local engine
 */
function getLocalEngineUrl() {
  return LOCAL_AI_ENGINE_URL;
}

module.exports = {
  useLocalEngine,
  getLocalEngineUrl,
  getModelName,
  MODEL_MAPPING
};