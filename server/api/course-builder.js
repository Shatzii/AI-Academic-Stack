/**
 * Course Builder API
 * 
 * This module provides API endpoints for the course builder feature,
 * including saving/loading courses and AI-powered course adaptations.
 */

const express = require('express');
const router = express.Router();
const aiEngine = require('../services/ai-engine-service');
const { db } = require('../db');
const { eq } = require('drizzle-orm');

// Sample in-memory storage until we set up the database schema
let courses = [];

/**
 * Verify the AI engine is available
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/ai-status', async (req, res) => {
  try {
    const isAvailable = await aiEngine.checkStatus();
    res.json({ available: isAvailable });
  } catch (error) {
    console.error('Failed to check AI engine status:', error);
    res.status(500).json({ error: 'Failed to check AI engine status', details: error.message });
  }
});

/**
 * Save a course
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/courses', async (req, res) => {
  try {
    const courseData = req.body;
    
    // Add validation here
    if (!courseData.title) {
      return res.status(400).json({ error: 'Course title is required' });
    }
    
    // Add a creation timestamp and ID if one doesn't exist
    const timestamp = new Date().toISOString();
    const courseToSave = {
      ...courseData,
      id: courseData.id || `course_${Date.now()}`,
      createdAt: courseData.createdAt || timestamp,
      updatedAt: timestamp,
      createdBy: req.user?.id || 'anonymous' // In a real implementation, this would be the user's ID
    };
    
    // Save to in-memory storage for now
    // In a production implementation, this would save to the database
    const existingIndex = courses.findIndex(c => c.id === courseToSave.id);
    
    if (existingIndex !== -1) {
      courses[existingIndex] = courseToSave;
    } else {
      courses.push(courseToSave);
    }
    
    res.status(201).json({ 
      success: true, 
      course: courseToSave 
    });
  } catch (error) {
    console.error('Failed to save course:', error);
    res.status(500).json({ error: 'Failed to save course', details: error.message });
  }
});

/**
 * Get all courses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/courses', async (req, res) => {
  try {
    // In a real implementation, this would retrieve courses from the database
    // and filter by user ID, permissions, etc.
    res.json({ courses });
  } catch (error) {
    console.error('Failed to retrieve courses:', error);
    res.status(500).json({ error: 'Failed to retrieve courses', details: error.message });
  }
});

/**
 * Get a specific course by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/courses/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    
    // Find the course
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json({ course });
  } catch (error) {
    console.error(`Failed to retrieve course ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to retrieve course', details: error.message });
  }
});

/**
 * Update a course
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.put('/courses/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    const courseData = req.body;
    
    // Find the course
    const existingIndex = courses.findIndex(c => c.id === courseId);
    
    if (existingIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Update the course
    const updatedCourse = {
      ...courses[existingIndex],
      ...courseData,
      id: courseId, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    courses[existingIndex] = updatedCourse;
    
    res.json({ success: true, course: updatedCourse });
  } catch (error) {
    console.error(`Failed to update course ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update course', details: error.message });
  }
});

/**
 * Delete a course
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.delete('/courses/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    
    // Find the course
    const existingIndex = courses.findIndex(c => c.id === courseId);
    
    if (existingIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Remove the course
    courses.splice(existingIndex, 1);
    
    res.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete course ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete course', details: error.message });
  }
});

/**
 * Generate a quiz for a course module
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/generate-quiz', async (req, res) => {
  try {
    const { content, options } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const quiz = await aiEngine.generateQuiz(content, options);
    
    res.json({ quiz });
  } catch (error) {
    console.error('Failed to generate quiz:', error);
    res.status(500).json({ error: 'Failed to generate quiz', details: error.message });
  }
});

/**
 * Transform course content for neurodivergent learners
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/transform-course', async (req, res) => {
  try {
    const { course, options } = req.body;
    
    if (!course) {
      return res.status(400).json({ error: 'Course data is required' });
    }
    
    const transformedCourse = await aiEngine.transformCourseContent(course, options);
    
    res.json({ course: transformedCourse });
  } catch (error) {
    console.error('Failed to transform course:', error);
    res.status(500).json({ error: 'Failed to transform course', details: error.message });
  }
});

/**
 * Simplify text content
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/simplify-text', async (req, res) => {
  try {
    const { text, gradeLevel } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const simplified = await aiEngine.simplifyText(text, gradeLevel);
    
    res.json({ simplified });
  } catch (error) {
    console.error('Failed to simplify text:', error);
    res.status(500).json({ error: 'Failed to simplify text', details: error.message });
  }
});

/**
 * Adapt content for dyslexia
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/adapt-for-dyslexia', async (req, res) => {
  try {
    const { content, options } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const adapted = await aiEngine.adaptForDyslexia(content, options);
    
    res.json(adapted);
  } catch (error) {
    console.error('Failed to adapt for dyslexia:', error);
    res.status(500).json({ error: 'Failed to adapt for dyslexia', details: error.message });
  }
});

/**
 * Adapt content for ADHD
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/adapt-for-adhd', async (req, res) => {
  try {
    const { content, options } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const adapted = await aiEngine.adaptForADHD(content, options);
    
    res.json(adapted);
  } catch (error) {
    console.error('Failed to adapt for ADHD:', error);
    res.status(500).json({ error: 'Failed to adapt for ADHD', details: error.message });
  }
});

/**
 * Adapt content for autism
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/adapt-for-autism', async (req, res) => {
  try {
    const { content, options } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const adapted = await aiEngine.adaptForAutism(content, options);
    
    res.json(adapted);
  } catch (error) {
    console.error('Failed to adapt for autism:', error);
    res.status(500).json({ error: 'Failed to adapt for autism', details: error.message });
  }
});

module.exports = router;