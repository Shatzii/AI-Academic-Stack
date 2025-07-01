/**
 * Curriculum Transformation Worker
 * 
 * This worker thread handles CPU-intensive curriculum transformation tasks
 * to keep the main thread responsive.
 */

const { parentPort } = require('worker_threads');
const fetch = require('node-fetch');

// Configuration
const AI_ENGINE_BASE_URL = process.env.AI_ENGINE_URL || 'http://188.245.209.124:3721';
const AI_ENGINE_API_KEY = process.env.AI_ENGINE_API_KEY;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

// Cache for transformed content to avoid redundant processing
const transformationCache = new Map();
const CACHE_SIZE_LIMIT = 50; // Max number of cached transformations

// Listen for messages from the main thread
parentPort.on('message', async (message) => {
  try {
    const { messageId, action, content, learningDifference, gradeLevel, options } = message;
    
    if (action === 'transformCurriculum') {
      const result = await transformCurriculum(
        content, 
        learningDifference, 
        gradeLevel, 
        options
      );
      
      // Send the result back to the main thread
      parentPort.postMessage({
        messageId,
        result
      });
    } else {
      throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    // Send the error back to the main thread
    parentPort.postMessage({
      messageId: message.messageId,
      error: error.message
    });
  }
});

/**
 * Transform curriculum content for specific learning differences
 */
async function transformCurriculum(content, learningDifference, gradeLevel, options = {}) {
  // Generate a cache key based on input parameters
  const cacheKey = generateCacheKey(content, learningDifference, gradeLevel, options);
  
  // Check cache first
  if (transformationCache.has(cacheKey)) {
    const cachedResult = transformationCache.get(cacheKey);
    return {
      ...cachedResult,
      fromCache: true
    };
  }
  
  // CPU-intensive pre-processing optimizations
  const contentType = detectContentType(content);
  const preprocessed = preprocessContent(content, contentType);
  
  // Make the API request to the AI engine
  const requestBody = {
    content: preprocessed,
    learning_difference: learningDifference,
    grade_level: gradeLevel,
    output_language: options.outputLanguage || 'en',
    visual_style: options.visualStyle || 'standard',
    format: options.format || 'html',
    content_type: contentType
  };
  
  // Execute the request with retry logic
  const result = await executeWithRetry(() => sendRequest('/curriculum/transform', requestBody));
  
  // Post-process the result
  const processed = postprocessResult(result, contentType, learningDifference);
  
  // Cache the result
  if (transformationCache.size >= CACHE_SIZE_LIMIT) {
    // Remove the oldest entry if cache is full
    const firstKey = transformationCache.keys().next().value;
    transformationCache.delete(firstKey);
  }
  transformationCache.set(cacheKey, processed);
  
  return processed;
}

/**
 * Detect the type of content being transformed
 */
function detectContentType(content) {
  if (content.trim().startsWith('<')) {
    return 'html';
  } else if (content.includes('# ') || content.includes('## ')) {
    return 'markdown';
  } else {
    return 'text';
  }
}

/**
 * Preprocess content based on its type
 */
function preprocessContent(content, contentType) {
  // Content-specific optimizations
  switch (contentType) {
    case 'html':
      // Remove excessive whitespace but preserve structure
      return content.replace(/\\s+/g, ' ')
                   .replace(/> \\s+</g, '><')
                   .trim();
    case 'markdown':
      // Normalize markdown formatting
      return content.replace(/\\n{3,}/g, '\\n\\n')
                   .trim();
    default:
      // Default text processing
      return content.trim();
  }
}

/**
 * Post-process the transformation result
 */
function postprocessResult(result, contentType, learningDifference) {
  // Apply learning difference-specific enhancements
  if (learningDifference === 'dyslexia') {
    if (contentType === 'html') {
      // Add dyslexia-friendly formatting for HTML
      result.transformed = addDyslexiaFriendlyFormatting(result.transformed);
    }
  } else if (learningDifference === 'adhd') {
    // Add ADHD-friendly structure
    result.transformed = addADHDFriendlyStructure(result.transformed, contentType);
  }
  
  return result;
}

/**
 * Add dyslexia-friendly formatting to HTML content
 */
function addDyslexiaFriendlyFormatting(html) {
  if (!html.includes('<style>')) {
    // Add a style tag with dyslexia-friendly CSS if not present
    return `<style>
      body {
        line-height: 1.5;
        letter-spacing: 0.12em;
        word-spacing: 0.16em;
      }
      p {
        margin-bottom: 1em;
        max-width: 70ch;
      }
    </style>${html}`;
  }
  return html;
}

/**
 * Add ADHD-friendly structure to content
 */
function addADHDFriendlyStructure(content, contentType) {
  // Add breaks and visual cues for ADHD readers
  if (contentType === 'html') {
    // Add section breaks and visual cues for HTML
    return content.replace(/<h([2-6])([^>]*)>/g, 
      '<div class="section-break"></div><h$1$2>');
  } else if (contentType === 'markdown') {
    // Add section breaks for markdown
    return content.replace(/^#{2,6} /gm, 
      '\n---\n$&');
  }
  return content;
}

/**
 * Generate a cache key from transformation parameters
 */
function generateCacheKey(content, learningDifference, gradeLevel, options) {
  // Create a hash from the first 100 chars of content + other parameters
  const contentPreview = content.substring(0, 100);
  return `${contentPreview}|${learningDifference}|${gradeLevel}|${options.outputLanguage || 'en'}`;
}

/**
 * Send a request to the AI engine API
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

// Signal that the worker is ready
parentPort.postMessage({ type: 'ready', workerId: Date.now() });