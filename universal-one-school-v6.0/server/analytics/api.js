/**
 * ShatziiOS Analytics API
 * 
 * API endpoints for serving analytics data to the admin dashboard.
 */

const express = require('express');
const router = express.Router();
const analytics = require('./index');

/**
 * Middleware to verify admin access
 */
function verifyAdminAccess(req, res, next) {
  // Check if user is authenticated and has admin role
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Check for admin role
  if (!req.user || !req.user.roles || !req.user.roles.includes('admin')) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // Continue to route handler
  next();
}

/**
 * Middleware to verify school admin access
 */
function verifySchoolAdminAccess(req, res, next) {
  // Check if user is authenticated
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Get school ID from request
  const schoolId = req.params.schoolId || req.query.schoolId;
  
  // Check for admin role or school admin role for the specified school
  if (req.user && req.user.roles && (
      req.user.roles.includes('admin') ||
      (req.user.roles.includes('school_admin') && req.user.adminSchools && req.user.adminSchools.includes(schoolId))
  )) {
    return next();
  }
  
  return res.status(403).json({ error: 'Forbidden' });
}

// Apply admin access middleware to all routes
router.use(verifyAdminAccess);

/**
 * GET /api/analytics/dashboard
 * Get dashboard metrics for all schools or a specific school
 */
router.get('/dashboard', async (req, res) => {
  try {
    // Parse query parameters
    const schoolId = req.query.schoolId;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
    const metrics = req.query.metrics ? req.query.metrics.split(',') : undefined;
    
    // Get dashboard metrics
    const dashboardMetrics = await analytics.getDashboardMetrics({
      schoolId,
      startDate,
      endDate,
      metrics
    });
    
    res.json(dashboardMetrics);
  } catch (error) {
    console.error('Error getting dashboard metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/analytics/performance
 * Get system performance metrics
 */
router.get('/performance', async (req, res) => {
  try {
    // Parse query parameters
    const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
    const interval = req.query.interval || '5 minutes';
    
    // Get performance metrics
    const performanceMetrics = await analytics.getPerformanceMetrics({
      startDate,
      endDate,
      interval
    });
    
    res.json(performanceMetrics);
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/analytics/user/:userId
 * Get analytics for a specific user
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get user analytics
    const userAnalytics = await analytics.getUserAnalytics(userId);
    
    res.json(userAnalytics);
  } catch (error) {
    console.error('Error getting user analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/analytics/school/:schoolId
 * Get analytics for a specific school
 */
router.get('/school/:schoolId', verifySchoolAdminAccess, async (req, res) => {
  try {
    const schoolId = req.params.schoolId;
    
    // Get school analytics
    const schoolAnalytics = await analytics.getSchoolAnalytics(schoolId);
    
    res.json(schoolAnalytics);
  } catch (error) {
    console.error('Error getting school analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get analytics data in CSV format
 * @param {string} endpoint - API endpoint
 * @param {Object} params - URL parameters
 * @returns {string} CSV data
 */
function getAnalyticsAsCsv(endpoint, params) {
  // Implement CSV export functionality
}

/**
 * GET /api/analytics/export/dashboard
 * Export dashboard metrics as CSV
 */
router.get('/export/dashboard', async (req, res) => {
  try {
    // Parse query parameters
    const schoolId = req.query.schoolId;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
    const metrics = req.query.metrics ? req.query.metrics.split(',') : undefined;
    
    // Get dashboard metrics
    const dashboardMetrics = await analytics.getDashboardMetrics({
      schoolId,
      startDate,
      endDate,
      metrics
    });
    
    // Convert to CSV
    const csvData = convertMetricsToCSV(dashboardMetrics);
    
    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="dashboard-metrics.csv"');
    
    res.send(csvData);
  } catch (error) {
    console.error('Error exporting dashboard metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Convert metrics to CSV format
 * @param {Object} metrics - Metrics object
 * @returns {string} CSV data
 */
function convertMetricsToCSV(metrics) {
  // Simplified implementation - in a real scenario, this would be more complex
  let csv = 'Date,Metric,Value,School\n';
  
  // Add platform metrics
  if (metrics.platform) {
    // Active users
    metrics.platform.activeUsers.daily.forEach(item => {
      csv += `${item.date},active_users.daily,${item.value},platform\n`;
    });
    
    // Content metrics
    metrics.platform.content.views.forEach(item => {
      csv += `${item.date},content.views,${item.value},platform\n`;
    });
    
    // Learning metrics
    metrics.platform.learning.quizzesCompleted.forEach(item => {
      csv += `${item.date},learning.quizzes_completed,${item.value},platform\n`;
    });
  }
  
  // Add school metrics
  for (const schoolId in metrics.schools) {
    const schoolMetrics = metrics.schools[schoolId];
    
    // Active users
    schoolMetrics.activeUsers.daily.forEach(item => {
      csv += `${item.date},active_users.daily,${item.value},${schoolId}\n`;
    });
    
    // Content metrics
    schoolMetrics.content.views.forEach(item => {
      csv += `${item.date},content.views,${item.value},${schoolId}\n`;
    });
    
    // Learning metrics
    schoolMetrics.learning.quizzesCompleted.forEach(item => {
      csv += `${item.date},learning.quizzes_completed,${item.value},${schoolId}\n`;
    });
  }
  
  return csv;
}

// Export router
module.exports = router;