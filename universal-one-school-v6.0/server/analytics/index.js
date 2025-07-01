/**
 * ShatziiOS Analytics Engine
 * 
 * Comprehensive analytics system for monitoring platform usage, performance,
 * and educational outcomes across all schools.
 */

const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Create connection to database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3, // Limit connections for analytics
  idleTimeoutMillis: 30000
});

// In-memory cache for frequently accessed metrics
const metricsCache = {
  lastUpdated: {},
  data: {}
};

// Analytics configuration
const config = {
  // Retention periods (in days)
  retention: {
    rawEvents: 30,      // Raw event data
    dailyAggregates: 365, // Daily aggregated metrics
    monthlyAggregates: 1825 // Monthly aggregated metrics (5 years)
  },
  
  // Sampling rates (0-1)
  sampling: {
    detailedPerformance: 0.1,  // Sample 10% for detailed performance metrics
    userJourney: 0.25,         // Sample 25% for user journey tracking
    fullTracking: 1.0          // Track 100% for core analytics
  },
  
  // Cache TTLs (in seconds)
  cacheTTL: {
    dashboardMetrics: 300,  // 5 minutes
    schoolMetrics: 600,     // 10 minutes
    systemMetrics: 60,      // 1 minute
    userMetrics: 1800       // 30 minutes
  }
};

/**
 * Initialize analytics tables
 * @returns {Promise<void>}
 */
async function initializeAnalytics() {
  console.log('Initializing ShatziiOS Analytics Engine...');
  
  // Create necessary tables if they don't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      event_type VARCHAR(50) NOT NULL,
      school_id VARCHAR(50),
      user_id VARCHAR(50),
      props JSONB,
      session_id VARCHAR(100)
    );
    
    CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp 
      ON analytics_events(timestamp);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type 
      ON analytics_events(event_type);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_school_id 
      ON analytics_events(school_id);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id 
      ON analytics_events(user_id);
  `);
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS analytics_daily_metrics (
      id SERIAL PRIMARY KEY,
      metric_date DATE NOT NULL,
      school_id VARCHAR(50),
      metric_name VARCHAR(100) NOT NULL,
      metric_value NUMERIC,
      dimensions JSONB,
      UNIQUE(metric_date, school_id, metric_name, (dimensions->>'dimension_key'))
    );
    
    CREATE INDEX IF NOT EXISTS idx_analytics_daily_metrics_date 
      ON analytics_daily_metrics(metric_date);
    CREATE INDEX IF NOT EXISTS idx_analytics_daily_metrics_school 
      ON analytics_daily_metrics(school_id);
    CREATE INDEX IF NOT EXISTS idx_analytics_daily_metrics_name 
      ON analytics_daily_metrics(metric_name);
  `);
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS analytics_performance_log (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      server_id VARCHAR(50),
      cpu_usage NUMERIC,
      memory_usage NUMERIC,
      active_connections INTEGER,
      request_count INTEGER,
      average_response_time NUMERIC,
      error_count INTEGER,
      details JSONB
    );
    
    CREATE INDEX IF NOT EXISTS idx_analytics_performance_timestamp 
      ON analytics_performance_log(timestamp);
  `);
  
  console.log('Analytics tables initialized.');
}

/**
 * Track an analytics event
 * @param {string} eventType - Type of event
 * @param {Object} props - Event properties
 * @param {Object} context - Event context (user, school, etc.)
 * @returns {Promise<void>}
 */
async function trackEvent(eventType, props = {}, context = {}) {
  // Apply sampling based on event type
  const samplingRate = getSamplingRate(eventType);
  if (Math.random() > samplingRate) {
    return; // Skip event based on sampling
  }
  
  try {
    const { schoolId, userId, sessionId } = context;
    
    await pool.query(
      `INSERT INTO analytics_events 
       (event_type, school_id, user_id, props, session_id) 
       VALUES ($1, $2, $3, $4, $5)`,
      [eventType, schoolId, userId, props, sessionId]
    );
  } catch (error) {
    console.error('Error tracking analytics event:', error);
  }
}

/**
 * Get sampling rate for event type
 * @param {string} eventType - Type of event
 * @returns {number} Sampling rate (0-1)
 */
function getSamplingRate(eventType) {
  if (eventType.startsWith('performance.')) {
    return config.sampling.detailedPerformance;
  } else if (eventType.startsWith('journey.')) {
    return config.sampling.userJourney;
  } else {
    return config.sampling.fullTracking;
  }
}

/**
 * Record a performance snapshot
 * @returns {Promise<void>}
 */
async function recordPerformanceSnapshot() {
  try {
    // Get basic system metrics
    const cpuUsage = os.loadavg()[0] / os.cpus().length; // Average load per CPU
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const memoryUsage = 1 - (freeMemory / totalMemory);
    
    // Get application metrics (mock for now, replace with actual metrics)
    const activeConnections = Math.floor(Math.random() * 50);
    const requestCount = Math.floor(Math.random() * 1000);
    const avgResponseTime = Math.random() * 500;
    const errorCount = Math.floor(Math.random() * 10);
    
    // Server identifier (hostname or container ID)
    const serverId = os.hostname();
    
    // Record in database
    await pool.query(
      `INSERT INTO analytics_performance_log 
       (server_id, cpu_usage, memory_usage, active_connections, 
        request_count, average_response_time, error_count, details) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        serverId, 
        cpuUsage, 
        memoryUsage, 
        activeConnections,
        requestCount,
        avgResponseTime,
        errorCount,
        {
          uptime: os.uptime(),
          totalMemory,
          freeMemory,
          cpuInfo: os.cpus()[0].model,
          platform: os.platform(),
          nodeVersion: process.version
        }
      ]
    );
  } catch (error) {
    console.error('Error recording performance snapshot:', error);
  }
}

/**
 * Start scheduled analytics tasks
 */
function startScheduledTasks() {
  // Record performance snapshots every minute
  setInterval(recordPerformanceSnapshot, 60000);
  
  // Aggregate daily metrics (at midnight)
  scheduleDaily(aggregateDailyMetrics, 0, 0);
  
  // Clean up old data (at 2 AM)
  scheduleDaily(cleanupOldData, 2, 0);
}

/**
 * Schedule a daily task
 * @param {Function} task - Task function
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 */
function scheduleDaily(task, hour, minute) {
  const now = new Date();
  let scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute,
    0,
    0
  );
  
  // If the scheduled time has already passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  const timeUntilTask = scheduledTime.getTime() - now.getTime();
  
  // Schedule the task
  setTimeout(() => {
    task();
    // After first execution, schedule to run daily
    setInterval(task, 24 * 60 * 60 * 1000);
  }, timeUntilTask);
}

/**
 * Aggregate daily metrics from events
 * @returns {Promise<void>}
 */
async function aggregateDailyMetrics() {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];
    
    console.log(`Aggregating daily metrics for ${dateStr}...`);
    
    // Get schools for aggregation
    const schoolsResult = await pool.query(`
      SELECT DISTINCT school_id FROM analytics_events
      WHERE school_id IS NOT NULL
    `);
    
    const schools = schoolsResult.rows.map(row => row.school_id);
    
    // Add null for platform-wide metrics
    schools.push(null);
    
    for (const schoolId of schools) {
      // Aggregate active users
      await aggregateActiveUsers(dateStr, schoolId);
      
      // Aggregate content engagement
      await aggregateContentEngagement(dateStr, schoolId);
      
      // Aggregate learning progress
      await aggregateLearningProgress(dateStr, schoolId);
      
      // Aggregate error rates
      await aggregateErrorRates(dateStr, schoolId);
    }
    
    console.log('Daily metrics aggregation completed.');
  } catch (error) {
    console.error('Error aggregating daily metrics:', error);
  }
}

/**
 * Aggregate active users metric
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @param {string|null} schoolId - School ID or null for all schools
 */
async function aggregateActiveUsers(dateStr, schoolId) {
  const schoolFilter = schoolId ? 'AND school_id = $2' : 'AND school_id IS NOT NULL';
  const params = schoolId ? [dateStr, schoolId] : [dateStr];
  
  // Daily active users
  const dauResult = await pool.query(`
    SELECT COUNT(DISTINCT user_id) as count
    FROM analytics_events
    WHERE timestamp::date = $1::date
    ${schoolFilter}
    AND user_id IS NOT NULL
  `, params);
  
  // Weekly active users (last 7 days)
  const wauResult = await pool.query(`
    SELECT COUNT(DISTINCT user_id) as count
    FROM analytics_events
    WHERE timestamp::date BETWEEN ($1::date - INTERVAL '6 days') AND $1::date
    ${schoolFilter}
    AND user_id IS NOT NULL
  `, params);
  
  // Monthly active users (last 30 days)
  const mauResult = await pool.query(`
    SELECT COUNT(DISTINCT user_id) as count
    FROM analytics_events
    WHERE timestamp::date BETWEEN ($1::date - INTERVAL '29 days') AND $1::date
    ${schoolFilter}
    AND user_id IS NOT NULL
  `, params);
  
  // Store daily active users metric
  await pool.query(`
    INSERT INTO analytics_daily_metrics 
    (metric_date, school_id, metric_name, metric_value, dimensions)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (metric_date, school_id, metric_name, (dimensions->>'dimension_key'))
    DO UPDATE SET metric_value = EXCLUDED.metric_value
  `, [
    dateStr, 
    schoolId, 
    'active_users.daily', 
    dauResult.rows[0].count,
    { dimension_key: 'none' }
  ]);
  
  // Store weekly active users metric
  await pool.query(`
    INSERT INTO analytics_daily_metrics 
    (metric_date, school_id, metric_name, metric_value, dimensions)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (metric_date, school_id, metric_name, (dimensions->>'dimension_key'))
    DO UPDATE SET metric_value = EXCLUDED.metric_value
  `, [
    dateStr, 
    schoolId, 
    'active_users.weekly', 
    wauResult.rows[0].count,
    { dimension_key: 'none' }
  ]);
  
  // Store monthly active users metric
  await pool.query(`
    INSERT INTO analytics_daily_metrics 
    (metric_date, school_id, metric_name, metric_value, dimensions)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (metric_date, school_id, metric_name, (dimensions->>'dimension_key'))
    DO UPDATE SET metric_value = EXCLUDED.metric_value
  `, [
    dateStr, 
    schoolId, 
    'active_users.monthly', 
    mauResult.rows[0].count,
    { dimension_key: 'none' }
  ]);
}

/**
 * Aggregate content engagement metrics
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @param {string|null} schoolId - School ID or null for all schools
 */
async function aggregateContentEngagement(dateStr, schoolId) {
  const schoolFilter = schoolId ? 'AND school_id = $2' : 'AND school_id IS NOT NULL';
  const params = schoolId ? [dateStr, schoolId] : [dateStr];
  
  // Content views
  const viewsResult = await pool.query(`
    SELECT COUNT(*) as count
    FROM analytics_events
    WHERE timestamp::date = $1::date
    ${schoolFilter}
    AND event_type = 'content.view'
  `, params);
  
  // Content completion
  const completionResult = await pool.query(`
    SELECT COUNT(*) as count
    FROM analytics_events
    WHERE timestamp::date = $1::date
    ${schoolFilter}
    AND event_type = 'content.complete'
  `, params);
  
  // Average time spent (in seconds)
  const timeSpentResult = await pool.query(`
    SELECT AVG((props->>'duration')::numeric) as avg_time
    FROM analytics_events
    WHERE timestamp::date = $1::date
    ${schoolFilter}
    AND event_type = 'content.view'
    AND props->>'duration' IS NOT NULL
  `, params);
  
  // Store content views metric
  await pool.query(`
    INSERT INTO analytics_daily_metrics 
    (metric_date, school_id, metric_name, metric_value, dimensions)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (metric_date, school_id, metric_name, (dimensions->>'dimension_key'))
    DO UPDATE SET metric_value = EXCLUDED.metric_value
  `, [
    dateStr, 
    schoolId, 
    'content.views', 
    viewsResult.rows[0].count,
    { dimension_key: 'none' }
  ]);
  
  // Store content completions metric
  await pool.query(`
    INSERT INTO analytics_daily_metrics 
    (metric_date, school_id, metric_name, metric_value, dimensions)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (metric_date, school_id, metric_name, (dimensions->>'dimension_key'))
    DO UPDATE SET metric_value = EXCLUDED.metric_value
  `, [
    dateStr, 
    schoolId, 
    'content.completions', 
    completionResult.rows[0].count,
    { dimension_key: 'none' }
  ]);
  
  // Store average time spent metric
  await pool.query(`
    INSERT INTO analytics_daily_metrics 
    (metric_date, school_id, metric_name, metric_value, dimensions)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (metric_date, school_id, metric_name, (dimensions->>'dimension_key'))
    DO UPDATE SET metric_value = EXCLUDED.metric_value
  `, [
    dateStr, 
    schoolId, 
    'content.avg_time_spent', 
    timeSpentResult.rows[0].avg_time || 0,
    { dimension_key: 'none' }
  ]);
}

/**
 * Aggregate learning progress metrics
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @param {string|null} schoolId - School ID or null for all schools
 */
async function aggregateLearningProgress(dateStr, schoolId) {
  const schoolFilter = schoolId ? 'AND school_id = $2' : 'AND school_id IS NOT NULL';
  const params = schoolId ? [dateStr, schoolId] : [dateStr];
  
  // Assignments completed
  const assignmentsResult = await pool.query(`
    SELECT COUNT(*) as count
    FROM analytics_events
    WHERE timestamp::date = $1::date
    ${schoolFilter}
    AND event_type = 'assignment.complete'
  `, params);
  
  // Quizzes completed
  const quizzesResult = await pool.query(`
    SELECT COUNT(*) as count
    FROM analytics_events
    WHERE timestamp::date = $1::date
    ${schoolFilter}
    AND event_type = 'quiz.complete'
  `, params);
  
  // Average quiz score
  const scoreResult = await pool.query(`
    SELECT AVG((props->>'score')::numeric) as avg_score
    FROM analytics_events
    WHERE timestamp::date = $1::date
    ${schoolFilter}
    AND event_type = 'quiz.complete'
    AND props->>'score' IS NOT NULL
  `, params);
  
  // Store assignments completed metric
  await pool.query(`
    INSERT INTO analytics_daily_metrics 
    (metric_date, school_id, metric_name, metric_value, dimensions)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (metric_date, school_id, metric_name, (dimensions->>'dimension_key'))
    DO UPDATE SET metric_value = EXCLUDED.metric_value
  `, [
    dateStr, 
    schoolId, 
    'learning.assignments_completed', 
    assignmentsResult.rows[0].count,
    { dimension_key: 'none' }
  ]);
  
  // Store quizzes completed metric
  await pool.query(`
    INSERT INTO analytics_daily_metrics 
    (metric_date, school_id, metric_name, metric_value, dimensions)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (metric_date, school_id, metric_name, (dimensions->>'dimension_key'))
    DO UPDATE SET metric_value = EXCLUDED.metric_value
  `, [
    dateStr, 
    schoolId, 
    'learning.quizzes_completed', 
    quizzesResult.rows[0].count,
    { dimension_key: 'none' }
  ]);
  
  // Store average quiz score metric
  await pool.query(`
    INSERT INTO analytics_daily_metrics 
    (metric_date, school_id, metric_name, metric_value, dimensions)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (metric_date, school_id, metric_name, (dimensions->>'dimension_key'))
    DO UPDATE SET metric_value = EXCLUDED.metric_value
  `, [
    dateStr, 
    schoolId, 
    'learning.avg_quiz_score', 
    scoreResult.rows[0].avg_score || 0,
    { dimension_key: 'none' }
  ]);
}

/**
 * Aggregate error rate metrics
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @param {string|null} schoolId - School ID or null for all schools
 */
async function aggregateErrorRates(dateStr, schoolId) {
  const schoolFilter = schoolId ? 'AND school_id = $2' : 'AND school_id IS NOT NULL';
  const params = schoolId ? [dateStr, schoolId] : [dateStr];
  
  // Error events
  const errorsResult = await pool.query(`
    SELECT COUNT(*) as count
    FROM analytics_events
    WHERE timestamp::date = $1::date
    ${schoolFilter}
    AND event_type = 'error'
  `, params);
  
  // Total events for error rate calculation
  const totalEventsResult = await pool.query(`
    SELECT COUNT(*) as count
    FROM analytics_events
    WHERE timestamp::date = $1::date
    ${schoolFilter}
  `, params);
  
  // Calculate error rate
  const errorCount = errorsResult.rows[0].count;
  const totalEvents = totalEventsResult.rows[0].count;
  const errorRate = totalEvents > 0 ? (errorCount / totalEvents) : 0;
  
  // Store error count metric
  await pool.query(`
    INSERT INTO analytics_daily_metrics 
    (metric_date, school_id, metric_name, metric_value, dimensions)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (metric_date, school_id, metric_name, (dimensions->>'dimension_key'))
    DO UPDATE SET metric_value = EXCLUDED.metric_value
  `, [
    dateStr, 
    schoolId, 
    'errors.count', 
    errorCount,
    { dimension_key: 'none' }
  ]);
  
  // Store error rate metric
  await pool.query(`
    INSERT INTO analytics_daily_metrics 
    (metric_date, school_id, metric_name, metric_value, dimensions)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (metric_date, school_id, metric_name, (dimensions->>'dimension_key'))
    DO UPDATE SET metric_value = EXCLUDED.metric_value
  `, [
    dateStr, 
    schoolId, 
    'errors.rate', 
    errorRate,
    { dimension_key: 'none' }
  ]);
}

/**
 * Clean up old analytics data
 * @returns {Promise<void>}
 */
async function cleanupOldData() {
  try {
    console.log('Cleaning up old analytics data...');
    
    // Delete old raw events
    const rawEventsDate = new Date();
    rawEventsDate.setDate(rawEventsDate.getDate() - config.retention.rawEvents);
    
    await pool.query(`
      DELETE FROM analytics_events
      WHERE timestamp < $1
    `, [rawEventsDate]);
    
    // Delete old daily aggregates
    const dailyAggregatesDate = new Date();
    dailyAggregatesDate.setDate(dailyAggregatesDate.getDate() - config.retention.dailyAggregates);
    
    await pool.query(`
      DELETE FROM analytics_daily_metrics
      WHERE metric_date < $1
    `, [dailyAggregatesDate]);
    
    // Delete old performance logs (30 days)
    const performanceLogsDate = new Date();
    performanceLogsDate.setDate(performanceLogsDate.getDate() - 30);
    
    await pool.query(`
      DELETE FROM analytics_performance_log
      WHERE timestamp < $1
    `, [performanceLogsDate]);
    
    console.log('Analytics data cleanup completed.');
  } catch (error) {
    console.error('Error cleaning up old analytics data:', error);
  }
}

/**
 * Get dashboard metrics
 * @param {Object} filters - Metric filters
 * @returns {Promise<Object>} Dashboard metrics
 */
async function getDashboardMetrics(filters = {}) {
  const { 
    schoolId,
    startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Default to last 30 days
    endDate = new Date(),
    metrics = ['active_users', 'content', 'learning', 'errors']
  } = filters;
  
  // Check cache for recent results
  const cacheKey = `dashboard_${schoolId || 'all'}_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}`;
  
  if (metricsCache.data[cacheKey] && 
      Date.now() - metricsCache.lastUpdated[cacheKey] < config.cacheTTL.dashboardMetrics * 1000) {
    return metricsCache.data[cacheKey];
  }
  
  // Convert dates to strings
  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];
  
  // Build query filters
  const schoolFilter = schoolId ? 'AND school_id = $3' : '';
  const params = [startDateStr, endDateStr];
  if (schoolId) params.push(schoolId);
  
  // Build metrics filter
  const metricsFilter = metrics.map(m => `metric_name LIKE '${m}%'`).join(' OR ');
  
  // Get metrics from database
  const result = await pool.query(`
    SELECT 
      metric_date,
      metric_name,
      metric_value,
      school_id
    FROM analytics_daily_metrics
    WHERE metric_date BETWEEN $1 AND $2
    ${schoolFilter}
    AND (${metricsFilter})
    ORDER BY metric_date, metric_name
  `, params);
  
  // Process results
  const dashboardMetrics = {
    timeRange: {
      start: startDateStr,
      end: endDateStr
    },
    schools: {},
    platform: {
      activeUsers: {
        daily: [],
        weekly: [],
        monthly: []
      },
      content: {
        views: [],
        completions: [],
        avgTimeSpent: []
      },
      learning: {
        assignmentsCompleted: [],
        quizzesCompleted: [],
        avgQuizScore: []
      },
      errors: {
        count: [],
        rate: []
      }
    }
  };
  
  // Process rows
  for (const row of result.rows) {
    const { metric_date, metric_name, metric_value, school_id } = row;
    
    // Determine target object (platform or specific school)
    let target;
    if (school_id) {
      if (!dashboardMetrics.schools[school_id]) {
        // Initialize school metrics structure
        dashboardMetrics.schools[school_id] = {
          activeUsers: {
            daily: [],
            weekly: [],
            monthly: []
          },
          content: {
            views: [],
            completions: [],
            avgTimeSpent: []
          },
          learning: {
            assignmentsCompleted: [],
            quizzesCompleted: [],
            avgQuizScore: []
          },
          errors: {
            count: [],
            rate: []
          }
        };
      }
      target = dashboardMetrics.schools[school_id];
    } else {
      target = dashboardMetrics.platform;
    }
    
    // Add metric to appropriate array
    if (metric_name === 'active_users.daily') {
      target.activeUsers.daily.push({ date: metric_date, value: metric_value });
    } else if (metric_name === 'active_users.weekly') {
      target.activeUsers.weekly.push({ date: metric_date, value: metric_value });
    } else if (metric_name === 'active_users.monthly') {
      target.activeUsers.monthly.push({ date: metric_date, value: metric_value });
    } else if (metric_name === 'content.views') {
      target.content.views.push({ date: metric_date, value: metric_value });
    } else if (metric_name === 'content.completions') {
      target.content.completions.push({ date: metric_date, value: metric_value });
    } else if (metric_name === 'content.avg_time_spent') {
      target.content.avgTimeSpent.push({ date: metric_date, value: metric_value });
    } else if (metric_name === 'learning.assignments_completed') {
      target.learning.assignmentsCompleted.push({ date: metric_date, value: metric_value });
    } else if (metric_name === 'learning.quizzes_completed') {
      target.learning.quizzesCompleted.push({ date: metric_date, value: metric_value });
    } else if (metric_name === 'learning.avg_quiz_score') {
      target.learning.avgQuizScore.push({ date: metric_date, value: metric_value });
    } else if (metric_name === 'errors.count') {
      target.errors.count.push({ date: metric_date, value: metric_value });
    } else if (metric_name === 'errors.rate') {
      target.errors.rate.push({ date: metric_date, value: metric_value });
    }
  }
  
  // Sort data by date
  const sortByDate = (a, b) => new Date(a.date) - new Date(b.date);
  
  // Sort platform metrics
  dashboardMetrics.platform.activeUsers.daily.sort(sortByDate);
  dashboardMetrics.platform.activeUsers.weekly.sort(sortByDate);
  dashboardMetrics.platform.activeUsers.monthly.sort(sortByDate);
  dashboardMetrics.platform.content.views.sort(sortByDate);
  dashboardMetrics.platform.content.completions.sort(sortByDate);
  dashboardMetrics.platform.content.avgTimeSpent.sort(sortByDate);
  dashboardMetrics.platform.learning.assignmentsCompleted.sort(sortByDate);
  dashboardMetrics.platform.learning.quizzesCompleted.sort(sortByDate);
  dashboardMetrics.platform.learning.avgQuizScore.sort(sortByDate);
  dashboardMetrics.platform.errors.count.sort(sortByDate);
  dashboardMetrics.platform.errors.rate.sort(sortByDate);
  
  // Sort school metrics
  for (const schoolId in dashboardMetrics.schools) {
    const school = dashboardMetrics.schools[schoolId];
    school.activeUsers.daily.sort(sortByDate);
    school.activeUsers.weekly.sort(sortByDate);
    school.activeUsers.monthly.sort(sortByDate);
    school.content.views.sort(sortByDate);
    school.content.completions.sort(sortByDate);
    school.content.avgTimeSpent.sort(sortByDate);
    school.learning.assignmentsCompleted.sort(sortByDate);
    school.learning.quizzesCompleted.sort(sortByDate);
    school.learning.avgQuizScore.sort(sortByDate);
    school.errors.count.sort(sortByDate);
    school.errors.rate.sort(sortByDate);
  }
  
  // Cache results
  metricsCache.data[cacheKey] = dashboardMetrics;
  metricsCache.lastUpdated[cacheKey] = Date.now();
  
  return dashboardMetrics;
}

/**
 * Get system performance metrics
 * @param {Object} filters - Metric filters
 * @returns {Promise<Object>} System performance metrics
 */
async function getPerformanceMetrics(filters = {}) {
  const { 
    startDate = new Date(Date.now() - 24 * 60 * 60 * 1000), // Default to last 24 hours
    endDate = new Date(),
    interval = '5 minutes'
  } = filters;
  
  // Check cache for recent results
  const cacheKey = `performance_${interval}_${startDate.toISOString()}_${endDate.toISOString()}`;
  
  if (metricsCache.data[cacheKey] && 
      Date.now() - metricsCache.lastUpdated[cacheKey] < config.cacheTTL.systemMetrics * 1000) {
    return metricsCache.data[cacheKey];
  }
  
  // Get performance data with time bucketing
  const result = await pool.query(`
    SELECT 
      time_bucket($3, timestamp) AS time_bucket,
      AVG(cpu_usage) AS avg_cpu,
      AVG(memory_usage) AS avg_memory,
      AVG(active_connections) AS avg_connections,
      SUM(request_count) AS total_requests,
      AVG(average_response_time) AS avg_response_time,
      SUM(error_count) AS total_errors
    FROM analytics_performance_log
    WHERE timestamp BETWEEN $1 AND $2
    GROUP BY time_bucket
    ORDER BY time_bucket
  `, [startDate, endDate, interval]);
  
  // Process results
  const performanceMetrics = {
    timeRange: {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      interval
    },
    metrics: {
      cpu: result.rows.map(row => ({ 
        time: row.time_bucket, 
        value: parseFloat(row.avg_cpu) 
      })),
      memory: result.rows.map(row => ({ 
        time: row.time_bucket, 
        value: parseFloat(row.avg_memory) 
      })),
      connections: result.rows.map(row => ({ 
        time: row.time_bucket, 
        value: parseFloat(row.avg_connections) 
      })),
      requests: result.rows.map(row => ({ 
        time: row.time_bucket, 
        value: parseInt(row.total_requests) 
      })),
      responseTime: result.rows.map(row => ({ 
        time: row.time_bucket, 
        value: parseFloat(row.avg_response_time) 
      })),
      errors: result.rows.map(row => ({ 
        time: row.time_bucket, 
        value: parseInt(row.total_errors) 
      }))
    },
    summary: {
      avgCpu: result.rows.reduce((sum, row) => sum + parseFloat(row.avg_cpu), 0) / Math.max(1, result.rows.length),
      avgMemory: result.rows.reduce((sum, row) => sum + parseFloat(row.avg_memory), 0) / Math.max(1, result.rows.length),
      peakCpu: Math.max(...result.rows.map(row => parseFloat(row.avg_cpu))),
      peakMemory: Math.max(...result.rows.map(row => parseFloat(row.avg_memory))),
      totalRequests: result.rows.reduce((sum, row) => sum + parseInt(row.total_requests), 0),
      totalErrors: result.rows.reduce((sum, row) => sum + parseInt(row.total_errors), 0),
      avgResponseTime: result.rows.reduce((sum, row) => sum + parseFloat(row.avg_response_time), 0) / Math.max(1, result.rows.length)
    }
  };
  
  // Cache results
  metricsCache.data[cacheKey] = performanceMetrics;
  metricsCache.lastUpdated[cacheKey] = Date.now();
  
  return performanceMetrics;
}

/**
 * Get user analytics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User analytics
 */
async function getUserAnalytics(userId) {
  // Check cache for recent results
  const cacheKey = `user_${userId}`;
  
  if (metricsCache.data[cacheKey] && 
      Date.now() - metricsCache.lastUpdated[cacheKey] < config.cacheTTL.userMetrics * 1000) {
    return metricsCache.data[cacheKey];
  }
  
  // Get user activity data
  const activityResult = await pool.query(`
    SELECT 
      DATE_TRUNC('day', timestamp) AS day,
      COUNT(*) AS event_count
    FROM analytics_events
    WHERE user_id = $1
    GROUP BY day
    ORDER BY day DESC
    LIMIT 30
  `, [userId]);
  
  // Get user content engagement
  const contentResult = await pool.query(`
    SELECT 
      props->>'content_id' AS content_id,
      props->>'content_type' AS content_type,
      props->>'content_title' AS content_title,
      MAX(timestamp) AS last_access,
      COUNT(*) AS access_count
    FROM analytics_events
    WHERE user_id = $1
    AND event_type = 'content.view'
    AND props->>'content_id' IS NOT NULL
    GROUP BY props->>'content_id', props->>'content_type', props->>'content_title'
    ORDER BY last_access DESC
    LIMIT 10
  `, [userId]);
  
  // Get user learning progress
  const learningResult = await pool.query(`
    SELECT 
      props->>'quiz_id' AS quiz_id,
      props->>'quiz_title' AS quiz_title,
      props->>'score' AS score,
      timestamp AS completion_time
    FROM analytics_events
    WHERE user_id = $1
    AND event_type = 'quiz.complete'
    AND props->>'quiz_id' IS NOT NULL
    ORDER BY timestamp DESC
    LIMIT 10
  `, [userId]);
  
  // Process results
  const userAnalytics = {
    userId,
    activity: {
      daily: activityResult.rows.map(row => ({
        date: row.day,
        count: parseInt(row.event_count)
      }))
    },
    content: {
      recent: contentResult.rows.map(row => ({
        id: row.content_id,
        type: row.content_type,
        title: row.content_title,
        lastAccess: row.last_access,
        accessCount: parseInt(row.access_count)
      }))
    },
    learning: {
      quizzes: learningResult.rows.map(row => ({
        id: row.quiz_id,
        title: row.quiz_title,
        score: parseFloat(row.score),
        completionTime: row.completion_time
      }))
    },
    summary: {
      totalEvents: activityResult.rows.reduce((sum, row) => sum + parseInt(row.event_count), 0),
      lastActive: activityResult.rows.length > 0 ? activityResult.rows[0].day : null,
      contentEngagement: contentResult.rows.length,
      quizzesCompleted: learningResult.rows.length,
      avgQuizScore: learningResult.rows.length > 0 
        ? learningResult.rows.reduce((sum, row) => sum + parseFloat(row.score), 0) / learningResult.rows.length
        : 0
    }
  };
  
  // Cache results
  metricsCache.data[cacheKey] = userAnalytics;
  metricsCache.lastUpdated[cacheKey] = Date.now();
  
  return userAnalytics;
}

/**
 * Get school analytics
 * @param {string} schoolId - School ID
 * @returns {Promise<Object>} School analytics
 */
async function getSchoolAnalytics(schoolId) {
  // Check cache for recent results
  const cacheKey = `school_${schoolId}`;
  
  if (metricsCache.data[cacheKey] && 
      Date.now() - metricsCache.lastUpdated[cacheKey] < config.cacheTTL.schoolMetrics * 1000) {
    return metricsCache.data[cacheKey];
  }
  
  // Get daily active users for last 30 days
  const dauResult = await pool.query(`
    SELECT 
      metric_date,
      metric_value
    FROM analytics_daily_metrics
    WHERE school_id = $1
    AND metric_name = 'active_users.daily'
    ORDER BY metric_date DESC
    LIMIT 30
  `, [schoolId]);
  
  // Get content engagement
  const contentResult = await pool.query(`
    SELECT 
      props->>'content_id' AS content_id,
      props->>'content_title' AS content_title,
      COUNT(*) AS view_count
    FROM analytics_events
    WHERE school_id = $1
    AND event_type = 'content.view'
    AND props->>'content_id' IS NOT NULL
    GROUP BY props->>'content_id', props->>'content_title'
    ORDER BY view_count DESC
    LIMIT 10
  `, [schoolId]);
  
  // Get curriculum areas
  const curriculumResult = await pool.query(`
    SELECT 
      props->>'curriculum_area' AS curriculum_area,
      COUNT(*) AS interaction_count
    FROM analytics_events
    WHERE school_id = $1
    AND props->>'curriculum_area' IS NOT NULL
    GROUP BY props->>'curriculum_area'
    ORDER BY interaction_count DESC
  `, [schoolId]);
  
  // Process results
  const schoolAnalytics = {
    schoolId,
    activeUsers: {
      daily: dauResult.rows.map(row => ({
        date: row.metric_date,
        count: parseInt(row.metric_value)
      }))
    },
    content: {
      popular: contentResult.rows.map(row => ({
        id: row.content_id,
        title: row.content_title,
        viewCount: parseInt(row.view_count)
      }))
    },
    curriculum: {
      areas: curriculumResult.rows.map(row => ({
        area: row.curriculum_area,
        count: parseInt(row.interaction_count)
      }))
    },
    summary: {
      avgDailyUsers: dauResult.rows.length > 0 
        ? dauResult.rows.reduce((sum, row) => sum + parseInt(row.metric_value), 0) / dauResult.rows.length
        : 0,
      topContent: contentResult.rows.length > 0 ? contentResult.rows[0].content_title : null,
      topContentViews: contentResult.rows.length > 0 ? parseInt(contentResult.rows[0].view_count) : 0,
      topCurriculumArea: curriculumResult.rows.length > 0 ? curriculumResult.rows[0].curriculum_area : null
    }
  };
  
  // Cache results
  metricsCache.data[cacheKey] = schoolAnalytics;
  metricsCache.lastUpdated[cacheKey] = Date.now();
  
  return schoolAnalytics;
}

// Export analytics functions
module.exports = {
  initializeAnalytics,
  trackEvent,
  startScheduledTasks,
  getDashboardMetrics,
  getPerformanceMetrics,
  getUserAnalytics,
  getSchoolAnalytics
};