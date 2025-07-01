/**
 * ShatziiOS API Bridge
 * 
 * This module provides a bridge between the main server and the API server.
 * It allows making API requests from the main server to the API server.
 * This is particularly useful for testing and diagnostics.
 */

const fetch = require('node-fetch');

class APIBridge {
  constructor(apiBaseUrl = 'http://localhost:5001/api/ai') {
    this.apiBaseUrl = apiBaseUrl;
  }

  /**
   * Check if the API server is available
   * @returns {Promise<boolean>} True if API server is available
   */
  async isAvailable() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/status`);
      return response.ok;
    } catch (error) {
      console.error('API Bridge: API server is not available:', error.message);
      return false;
    }
  }

  /**
   * Get the status of the AI integration
   * @returns {Promise<Object>} AI integration status
   */
  async getStatus() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/status`);
      if (!response.ok) {
        throw new Error(`API status check failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Bridge: Error getting API status:', error.message);
      return { 
        error: 'Failed to get API status',
        details: error.message
      };
    }
  }

  /**
   * Create an AI teacher based on the given configuration
   * @param {Object} teacherConfig - Teacher configuration
   * @returns {Promise<Object>} Created teacher data
   */
  async createTeacher(teacherConfig) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/create-teacher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(teacherConfig)
      });
      
      if (!response.ok) {
        throw new Error(`Teacher creation failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Bridge: Error creating teacher:', error.message);
      return { 
        error: 'Failed to create teacher',
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
  async getTeacherResponse(teacherConfig, conversationHistory, userMessage) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/teacher-response`, {
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
        throw new Error(`Teacher response failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Bridge: Error getting teacher response:', error.message);
      return { 
        error: 'Failed to get teacher response',
        details: error.message
      };
    }
  }

  /**
   * Generate a learning plan for a student
   * @param {Object} params - Learning plan parameters
   * @returns {Promise<Object>} Generated learning plan
   */
  async generateLearningPlan(params) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/learning-plan`, {
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
      console.error('API Bridge: Error generating learning plan:', error.message);
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
  async generateCurriculumContent(params) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/curriculum-content`, {
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
      console.error('API Bridge: Error generating curriculum content:', error.message);
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
  async assessLearningStyle(responses) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/learning-style-assessment`, {
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
      console.error('API Bridge: Error assessing learning style:', error.message);
      return { 
        error: 'Failed to assess learning style',
        details: error.message
      };
    }
  }
}

module.exports = APIBridge;