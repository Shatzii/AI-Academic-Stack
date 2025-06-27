/**
 * ShatziiOS AI API Client
 * 
 * This module provides functions for interacting with the ShatziiOS AI API
 * to access AI-powered educational features.
 */

// API Endpoint Configuration
// Use the integration routes in our main server
const API_BASE_URL = '/api/ai/integration';

// Add a console log to help debugging
console.log(`API client connecting to: ${window.location.origin}${API_BASE_URL}`);

// Function to check if API server is available
function pingAPIServer() {
  return fetch(`${API_BASE_URL}/status`, { 
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    // Add cache busting to prevent browser caching
    cache: 'no-cache'
  }).then(response => {
    if (!response.ok) {
      throw new Error(`API server returned status ${response.status}`);
    }
    return response.json();
  }).catch(error => {
    console.error('Error pinging API server:', error);
    return { 
      error: 'Failed to connect to API server',
      details: error.message
    };
  });
}

// Ping the API server immediately
pingAPIServer().then(result => {
  if (result.error) {
    console.error('API connection test failed:', result.error);
  } else {
    console.log('API connection successful:', result);
  }
});

/**
 * Check the status of the AI integration
 * @returns {Promise<Object>} AI integration status
 */
async function checkAIIntegrationStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/status`);
    if (!response.ok) {
      throw new Error(`AI integration status check failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error checking AI integration status:', error);
    return { 
      error: 'Failed to connect to AI API',
      details: error.message
    };
  }
}

/**
 * Create an AI teacher based on the given configuration
 * @param {Object} teacherConfig - Teacher configuration
 * @returns {Promise<Object>} Created teacher data
 */
async function createAITeacher(teacherConfig) {
  try {
    const response = await fetch(`${API_BASE_URL}/create-teacher`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(teacherConfig)
    });
    
    if (!response.ok) {
      throw new Error(`AI teacher creation failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating AI teacher:', error);
    return { 
      error: 'Failed to create AI teacher',
      details: error.message
    };
  }
}

/**
 * Get a response from an AI teacher
 * @param {Object} teacherConfig - Teacher configuration
 * @param {Array} conversationHistory - Previous messages
 * @param {string} userMessage - User's message
 * @returns {Promise<Object>} AI teacher response
 */
async function getAITeacherResponse(teacherConfig, conversationHistory, userMessage) {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher-response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        teacherConfig,
        conversationHistory,
        userMessage
      })
    });
    
    if (!response.ok) {
      throw new Error(`AI teacher response failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting AI teacher response:', error);
    return { 
      error: 'Failed to get AI teacher response',
      details: error.message
    };
  }
}

/**
 * Generate a learning plan for a student
 * @param {Object} params - Learning plan parameters
 * @returns {Promise<Object>} Generated learning plan
 */
async function generateLearningPlan(params) {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      throw new Error(`Learning plan generation failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating learning plan:', error);
    return { 
      error: 'Failed to generate learning plan',
      details: error.message
    };
  }
}

/**
 * Generate curriculum content
 * @param {Object} params - Curriculum content parameters
 * @returns {Promise<Object>} Generated curriculum content
 */
async function generateCurriculumContent(params) {
  try {
    const response = await fetch(`${API_BASE_URL}/curriculum-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      throw new Error(`Curriculum content generation failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating curriculum content:', error);
    return { 
      error: 'Failed to generate curriculum content',
      details: error.message
    };
  }
}

/**
 * Assess a student's learning style based on questionnaire responses
 * @param {Array} responses - Questionnaire responses
 * @returns {Promise<Object>} Learning style assessment results
 */
async function assessLearningStyle(responses) {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-style-assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ responses })
    });
    
    if (!response.ok) {
      throw new Error(`Learning style assessment failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error assessing learning style:', error);
    return { 
      error: 'Failed to assess learning style',
      details: error.message
    };
  }
}

// Export all functions for use in other modules
window.ShatziiOS = window.ShatziiOS || {};
window.ShatziiOS.AI = {
  checkAIIntegrationStatus,
  createAITeacher,
  getAITeacherResponse,
  generateLearningPlan,
  generateCurriculumContent,
  assessLearningStyle
};