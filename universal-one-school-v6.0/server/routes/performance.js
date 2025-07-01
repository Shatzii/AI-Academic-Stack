/**
 * Performance Optimization API Routes
 * 
 * These routes handle performance tracking, analysis, and optimization recommendations.
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const performanceService = require('../../services/performance-optimization-service');

// Initialize service
performanceService.initializeService();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Performance Optimization API is operational'
  });
});

// Record a performance metric
router.post('/metrics', (req, res) => {
  try {
    const {
      studentId,
      assignmentId,
      subject,
      dimension,
      value,
      context,
      tags
    } = req.body;
    
    if (!studentId || !subject || dimension === undefined || value === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: studentId, subject, dimension, and value are required'
      });
    }
    
    const metricData = {
      studentId,
      assignmentId,
      subject,
      dimension,
      value: parseFloat(value),
      context: context || {},
      tags: tags || []
    };
    
    const metric = performanceService.recordPerformanceMetric(metricData);
    res.status(201).json(metric);
  } catch (error) {
    console.error('Error recording performance metric:', error);
    res.status(500).json({
      error: 'Failed to record performance metric',
      details: error.message
    });
  }
});

// Get performance metrics for a student
router.get('/metrics/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    const {
      subject,
      dimension,
      startDate,
      endDate,
      limit
    } = req.query;
    
    const filters = {};
    if (subject) filters.subject = subject;
    if (dimension) filters.dimension = dimension;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    
    const metrics = performanceService.getStudentPerformanceMetrics(
      studentId,
      filters,
      limit ? parseInt(limit) : 100
    );
    
    res.json(metrics);
  } catch (error) {
    console.error('Error retrieving performance metrics:', error);
    res.status(500).json({
      error: 'Failed to retrieve performance metrics',
      details: error.message
    });
  }
});

// Generate performance summary for a student
router.get('/summary/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    const {
      timeFrame,
      dimensions,
      subjects
    } = req.query;
    
    const options = {};
    if (timeFrame) options.timeFrame = timeFrame;
    if (dimensions) options.dimensions = dimensions.split(',');
    if (subjects) options.subjects = subjects.split(',');
    
    const summary = performanceService.generatePerformanceSummary(studentId, options);
    res.json(summary);
  } catch (error) {
    console.error('Error generating performance summary:', error);
    res.status(500).json({
      error: 'Failed to generate performance summary',
      details: error.message
    });
  }
});

// Generate optimization recommendations
router.get('/recommendations/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    const { neurotype } = req.query;
    
    const recommendations = performanceService.generateOptimizationRecommendations(
      studentId,
      neurotype
    );
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error generating optimization recommendations:', error);
    res.status(500).json({
      error: 'Failed to generate optimization recommendations',
      details: error.message
    });
  }
});

// Get optimization history for a student
router.get('/optimizations/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    const { limit } = req.query;
    
    const optimizations = performanceService.getStudentOptimizations(
      studentId,
      limit ? parseInt(limit) : 10
    );
    
    res.json(optimizations);
  } catch (error) {
    console.error('Error retrieving optimization history:', error);
    res.status(500).json({
      error: 'Failed to retrieve optimization history',
      details: error.message
    });
  }
});

// Track medication efficacy
router.post('/medication/track', (req, res) => {
  try {
    const {
      studentId,
      medication,
      dosage,
      timeOfDay,
      effects,
      context
    } = req.body;
    
    if (!studentId || !medication || !dosage) {
      return res.status(400).json({
        error: 'Missing required fields: studentId, medication, and dosage are required'
      });
    }
    
    const efficacyData = {
      studentId,
      medication,
      dosage,
      timeOfDay: timeOfDay || 'unknown',
      effects: effects || {},
      context: context || {}
    };
    
    const efficacy = performanceService.trackMedicationEfficacy(efficacyData);
    res.status(201).json(efficacy);
  } catch (error) {
    console.error('Error tracking medication efficacy:', error);
    res.status(500).json({
      error: 'Failed to track medication efficacy',
      details: error.message
    });
  }
});

// Analyze medication-performance correlation
router.get('/medication/analyze/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    const { medication } = req.query;
    
    const analysis = performanceService.analyzeMedicationPerformanceCorrelation(
      studentId,
      medication
    );
    
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing medication-performance correlation:', error);
    res.status(500).json({
      error: 'Failed to analyze medication-performance correlation',
      details: error.message
    });
  }
});

// Generate sample data for testing (this would be removed in production)
router.post('/sample/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    const { 
      subjects = ['Math', 'Science', 'English', 'History'],
      days = 30,
      includeADHD = false
    } = req.body;
    
    const dimensions = ['speed', 'accuracy', 'comprehension', 'overall'];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const metrics = [];
    
    // Generate sample metrics
    for (let day = 0; day < days; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);
      
      subjects.forEach(subject => {
        dimensions.forEach(dimension => {
          // Create a base value between 60-90
          let baseValue = 60 + Math.random() * 30;
          
          // Add some trend over time
          baseValue += (day / days) * 10 * (Math.random() > 0.5 ? 1 : -1);
          
          // Add some daily variation
          const value = Math.min(100, Math.max(0, baseValue + (Math.random() * 10 - 5)));
          
          const metricData = {
            studentId,
            subject,
            dimension,
            value,
            context: {
              source: 'sample_data'
            },
            tags: ['sample']
          };
          
          const metric = performanceService.recordPerformanceMetric(metricData);
          metrics.push(metric);
        });
      });
      
      // If ADHD data is requested, add medication tracking
      if (includeADHD && day % 3 === 0) {
        const medicationData = {
          studentId,
          medication: 'Methylphenidate',
          dosage: '10mg',
          timeOfDay: 'morning',
          effects: {
            focus: 70 + Math.random() * 20,
            duration: 4 + Math.random() * 2,
            side_effects: Math.random() * 30
          },
          context: {
            sleep_quality: Math.random() > 0.7 ? 'poor' : 'good',
            activity_level: Math.random() > 0.5 ? 'high' : 'low',
            source: 'sample_data'
          }
        };
        
        performanceService.trackMedicationEfficacy(medicationData);
      }
    }
    
    res.status(201).json({
      message: 'Sample data generated successfully',
      metrics_count: metrics.length
    });
  } catch (error) {
    console.error('Error generating sample data:', error);
    res.status(500).json({
      error: 'Failed to generate sample data',
      details: error.message
    });
  }
});

module.exports = router;