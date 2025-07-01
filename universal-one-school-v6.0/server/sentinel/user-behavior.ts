/**
 * Sentinel 4.5 User Behavior Analytics Module
 * 
 * This module builds profiles of normal user behavior and flags anomalous activities
 * such as unusual access times, unexpected location changes, or atypical navigation patterns.
 */

import { sendAlert, AlertSeverity, AlertType } from './alert-system';
import { logSecurityEvent } from './audit-log';
import { Request, Response, NextFunction } from 'express';

// Define types for user behavior tracking
interface UserActivity {
  endpoint: string;
  method: string;
  timestamp: number;
  ip: string;
  userAgent: string;
  geoLocation?: {
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  sessionId?: string;
  processingTime?: number;
  statusCode?: number;
}

interface UserProfile {
  username: string;
  activityHistory: UserActivity[];
  commonIPs: Map<string, number>;
  commonUserAgents: Map<string, number>;
  commonAccessTimes: Map<string, number>; // Hour of day
  commonDaysOfWeek: Map<number, number>; // 0-6 for Sunday-Saturday
  typicalSessionDuration: number;
  typicalRequestsPerSession: number;
  typicalRequestsPerHour: number;
  lastActivity: number;
  riskScore: number;
  anomalies: Array<{
    type: string;
    severity: AlertSeverity;
    details: any;
    timestamp: number;
  }>;
}

// Store user behavior profiles
const userProfiles: Map<string, UserProfile> = new Map();

// Configuration
const MAX_HISTORY_PER_USER = 1000;
const ANOMALY_THRESHOLD = 0.8; // 0.0-1.0, higher = more sensitive
const MAX_ALLOWED_RISK_SCORE = 75; // 0-100
const HISTORY_RETENTION_DAYS = 30;

/**
 * Initialize or get a user profile
 */
function getUserProfile(username: string): UserProfile {
  let profile = userProfiles.get(username);
  
  if (!profile) {
    profile = {
      username,
      activityHistory: [],
      commonIPs: new Map(),
      commonUserAgents: new Map(),
      commonAccessTimes: new Map(),
      commonDaysOfWeek: new Map(),
      typicalSessionDuration: 0,
      typicalRequestsPerSession: 0,
      typicalRequestsPerHour: 0,
      lastActivity: Date.now(),
      riskScore: 0,
      anomalies: []
    };
    
    userProfiles.set(username, profile);
  }
  
  return profile;
}

/**
 * Record a user activity
 */
export function recordUserActivity(
  username: string,
  req: Request,
  res: Response,
  processingTime?: number
): void {
  if (!username || username === 'anonymous') return;
  
  const profile = getUserProfile(username);
  const now = Date.now();
  
  // Create activity record
  const activity: UserActivity = {
    endpoint: req.path,
    method: req.method,
    timestamp: now,
    ip: req.ip || req.socket.remoteAddress || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
    sessionId: (req as any).sessionID,
    processingTime,
    statusCode: res.statusCode
  };
  
  // Add to history
  profile.activityHistory.unshift(activity);
  
  // Trim history if needed
  if (profile.activityHistory.length > MAX_HISTORY_PER_USER) {
    profile.activityHistory = profile.activityHistory.slice(0, MAX_HISTORY_PER_USER);
  }
  
  // Update common patterns
  // IP address
  profile.commonIPs.set(
    activity.ip,
    (profile.commonIPs.get(activity.ip) || 0) + 1
  );
  
  // User agent
  profile.commonUserAgents.set(
    activity.userAgent,
    (profile.commonUserAgents.get(activity.userAgent) || 0) + 1
  );
  
  // Hour of day (0-23)
  const hourOfDay = new Date(now).getHours().toString();
  profile.commonAccessTimes.set(
    hourOfDay,
    (profile.commonAccessTimes.get(hourOfDay) || 0) + 1
  );
  
  // Day of week (0-6)
  const dayOfWeek = new Date(now).getDay();
  profile.commonDaysOfWeek.set(
    dayOfWeek,
    (profile.commonDaysOfWeek.get(dayOfWeek) || 0) + 1
  );
  
  // Update last activity timestamp
  profile.lastActivity = now;
  
  // Calculate typical values after we have enough data
  if (profile.activityHistory.length > 20) {
    updateUserMetrics(profile);
  }
  
  // Check for anomalies
  const anomalies = detectAnomalies(profile, activity);
  if (anomalies.length > 0) {
    handleAnomalies(profile, anomalies, activity);
  }
  
  // Clean up old data periodically
  if (Math.random() < 0.01) { // ~1% chance on each request
    cleanupOldData();
  }
}

/**
 * Update user metrics based on historical data
 */
function updateUserMetrics(profile: UserProfile): void {
  // Calculate typical requests per hour
  const hourlyRequests: Map<string, number> = new Map();
  let totalHours = 0;
  
  profile.activityHistory.forEach(activity => {
    const hour = new Date(activity.timestamp).toISOString().slice(0, 13);
    hourlyRequests.set(hour, (hourlyRequests.get(hour) || 0) + 1);
    totalHours = hourlyRequests.size;
  });
  
  const totalRequests = profile.activityHistory.length;
  profile.typicalRequestsPerHour = totalHours > 0 ? totalRequests / totalHours : 0;
  
  // Calculate typical session metrics
  const sessions: Map<string, { requests: number, duration: number }> = new Map();
  
  profile.activityHistory.forEach(activity => {
    if (!activity.sessionId) return;
    
    const session = sessions.get(activity.sessionId) || { requests: 0, duration: 0 };
    session.requests++;
    
    // Update session duration if this is a more recent activity
    const existingSession = sessions.get(activity.sessionId);
    if (existingSession) {
      const earliestActivity = profile.activityHistory
        .filter(a => a.sessionId === activity.sessionId)
        .reduce((earliest, current) => 
          current.timestamp < earliest.timestamp ? current : earliest
        );
      
      const latestActivity = profile.activityHistory
        .filter(a => a.sessionId === activity.sessionId)
        .reduce((latest, current) => 
          current.timestamp > latest.timestamp ? current : latest
        );
      
      session.duration = latestActivity.timestamp - earliestActivity.timestamp;
    }
    
    sessions.set(activity.sessionId, session);
  });
  
  // Calculate averages across sessions
  let totalSessionDuration = 0;
  let totalSessionRequests = 0;
  let sessionCount = sessions.size;
  
  for (const session of sessions.values()) {
    totalSessionDuration += session.duration;
    totalSessionRequests += session.requests;
  }
  
  profile.typicalSessionDuration = sessionCount > 0 ? totalSessionDuration / sessionCount : 0;
  profile.typicalRequestsPerSession = sessionCount > 0 ? totalSessionRequests / sessionCount : 0;
}

/**
 * Detect anomalies in user behavior
 */
function detectAnomalies(profile: UserProfile, activity: UserActivity): Array<{
  type: string;
  severity: AlertSeverity;
  details: any;
}> {
  const anomalies: Array<{
    type: string;
    severity: AlertSeverity;
    details: any;
  }> = [];
  
  // Skip anomaly detection for users with limited history
  if (profile.activityHistory.length < 10) return anomalies;
  
  // Check for unusual IP address
  const ipFrequency = profile.commonIPs.get(activity.ip) || 0;
  const totalActivities = profile.activityHistory.length;
  const ipFrequencyRatio = ipFrequency / totalActivities;
  
  if (ipFrequencyRatio < 0.1 && totalActivities > 20) {
    anomalies.push({
      type: 'unusual_ip',
      severity: AlertSeverity.MEDIUM,
      details: {
        ip: activity.ip,
        usualIPs: Array.from(profile.commonIPs.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([ip, count]) => ip)
      }
    });
  }
  
  // Check for unusual access time
  const hourOfDay = new Date(activity.timestamp).getHours().toString();
  const hourFrequency = profile.commonAccessTimes.get(hourOfDay) || 0;
  const hourFrequencyRatio = hourFrequency / totalActivities;
  
  if (hourFrequencyRatio < 0.05 && totalActivities > 50) {
    anomalies.push({
      type: 'unusual_time',
      severity: AlertSeverity.LOW,
      details: {
        accessTime: hourOfDay,
        usualTimes: Array.from(profile.commonAccessTimes.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([hour, count]) => hour)
      }
    });
  }
  
  // Check for unusual user agent
  const uaFrequency = profile.commonUserAgents.get(activity.userAgent) || 0;
  const uaFrequencyRatio = uaFrequency / totalActivities;
  
  if (uaFrequencyRatio < 0.1 && totalActivities > 20) {
    anomalies.push({
      type: 'unusual_user_agent',
      severity: AlertSeverity.MEDIUM,
      details: {
        userAgent: activity.userAgent,
        usualUserAgents: Array.from(profile.commonUserAgents.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2)
          .map(([ua, count]) => ua)
      }
    });
  }
  
  // Check for unusually high activity rate
  if (profile.sessionId && profile.typicalRequestsPerSession > 0) {
    const sessionRequests = profile.activityHistory
      .filter(a => a.sessionId === activity.sessionId)
      .length;
    
    const requestRatio = sessionRequests / profile.typicalRequestsPerSession;
    
    if (requestRatio > 2 && sessionRequests > 20) {
      anomalies.push({
        type: 'high_activity_rate',
        severity: AlertSeverity.MEDIUM,
        details: {
          sessionRequests,
          typicalRequests: profile.typicalRequestsPerSession,
          ratio: requestRatio
        }
      });
    }
  }
  
  return anomalies;
}

/**
 * Handle detected anomalies
 */
function handleAnomalies(
  profile: UserProfile,
  anomalies: Array<{ type: string; severity: AlertSeverity; details: any }>,
  activity: UserActivity
): void {
  // Add anomalies to profile
  anomalies.forEach(anomaly => {
    profile.anomalies.push({
      ...anomaly,
      timestamp: Date.now()
    });
    
    // Adjust risk score based on anomaly severity
    switch (anomaly.severity) {
      case AlertSeverity.LOW:
        profile.riskScore += 5;
        break;
      case AlertSeverity.MEDIUM:
        profile.riskScore += 15;
        break;
      case AlertSeverity.HIGH:
        profile.riskScore += 25;
        break;
      case AlertSeverity.CRITICAL:
        profile.riskScore += 40;
        break;
    }
  });
  
  // Cap risk score
  profile.riskScore = Math.min(profile.riskScore, 100);
  
  // Send alert if significant anomalies detected
  const highestSeverity = anomalies.reduce((highest, current) => {
    const severityValues = {
      [AlertSeverity.LOW]: 1,
      [AlertSeverity.MEDIUM]: 2,
      [AlertSeverity.HIGH]: 3,
      [AlertSeverity.CRITICAL]: 4
    };
    
    return severityValues[current.severity] > severityValues[highest] 
      ? current.severity 
      : highest;
  }, AlertSeverity.LOW);
  
  // Log the anomalies
  logSecurityEvent(
    profile.username,
    'User behavior anomalies detected',
    { 
      anomalies,
      currentRiskScore: profile.riskScore
    },
    activity.ip
  );
  
  // Send alert for important anomalies
  if (highestSeverity !== AlertSeverity.LOW || profile.riskScore > MAX_ALLOWED_RISK_SCORE) {
    sendAlert(
      highestSeverity,
      AlertType.AUTHENTICATION,
      `Unusual user behavior detected for ${profile.username}`,
      { 
        username: profile.username,
        anomalies,
        riskScore: profile.riskScore,
        ip: activity.ip,
        userAgent: activity.userAgent
      }
    );
  }
  
  // Take action if risk score is too high
  if (profile.riskScore >= MAX_ALLOWED_RISK_SCORE) {
    // Force logout or require additional verification
    // In a real implementation, this would trigger actions
    logSecurityEvent(
      profile.username,
      'Automatic protective action taken due to high risk score',
      { 
        riskScore: profile.riskScore,
        action: 'forcing verification',
        threshold: MAX_ALLOWED_RISK_SCORE
      },
      activity.ip
    );
  }
}

/**
 * Clean up old user behavior data
 */
function cleanupOldData(): void {
  const now = Date.now();
  const cutoffTime = now - (HISTORY_RETENTION_DAYS * 24 * 60 * 60 * 1000);
  
  for (const [username, profile] of userProfiles.entries()) {
    // Remove old activities
    profile.activityHistory = profile.activityHistory.filter(
      activity => activity.timestamp >= cutoffTime
    );
    
    // Remove old anomalies
    profile.anomalies = profile.anomalies.filter(
      anomaly => anomaly.timestamp >= cutoffTime
    );
    
    // Gradually decay risk score
    profile.riskScore = Math.max(0, profile.riskScore - 5);
    
    // Rebuild common patterns
    profile.commonIPs = new Map();
    profile.commonUserAgents = new Map();
    profile.commonAccessTimes = new Map();
    profile.commonDaysOfWeek = new Map();
    
    profile.activityHistory.forEach(activity => {
      const ip = activity.ip;
      profile.commonIPs.set(ip, (profile.commonIPs.get(ip) || 0) + 1);
      
      const userAgent = activity.userAgent;
      profile.commonUserAgents.set(userAgent, (profile.commonUserAgents.get(userAgent) || 0) + 1);
      
      const hour = new Date(activity.timestamp).getHours().toString();
      profile.commonAccessTimes.set(hour, (profile.commonAccessTimes.get(hour) || 0) + 1);
      
      const day = new Date(activity.timestamp).getDay();
      profile.commonDaysOfWeek.set(day, (profile.commonDaysOfWeek.get(day) || 0) + 1);
    });
    
    // Recalculate metrics
    updateUserMetrics(profile);
  }
}

/**
 * Middleware to track user behavior
 */
export function userBehaviorMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const username = (req as any).user?.username || 'anonymous';
  
  // Save original res.end to intercept it
  const originalEnd = res.end;
  
  // Override res.end to capture response details
  res.end = function(chunk?: any, encoding?: BufferEncoding | string, callback?: () => void): any {
    // Restore original end method
    res.end = originalEnd;
    
    // Calculate processing time
    const processingTime = Date.now() - startTime;
    
    // Record the activity
    recordUserActivity(username, req, res, processingTime);
    
    // Call the original end method
    return originalEnd.call(this, chunk, encoding as BufferEncoding, callback);
  };
  
  next();
}

/**
 * Get a user's risk score
 */
export function getUserRiskScore(username: string): number {
  const profile = userProfiles.get(username);
  return profile ? profile.riskScore : 0;
}

/**
 * Get a user's behavior profile
 */
export function getUserBehaviorProfile(username: string): any {
  const profile = userProfiles.get(username);
  if (!profile) return null;
  
  // Return a summarized version for the dashboard
  return {
    username: profile.username,
    riskScore: profile.riskScore,
    lastActivity: profile.lastActivity,
    anomalyCount: profile.anomalies.length,
    recentAnomalies: profile.anomalies.slice(0, 5),
    topLocations: Array.from(profile.commonIPs.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([ip, count]) => ({ ip, count })),
    accessTimes: Array.from(profile.commonAccessTimes.entries())
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => a.hour - b.hour)
  };
}

/**
 * Reset a user's risk score
 */
export function resetUserRiskScore(username: string): boolean {
  const profile = userProfiles.get(username);
  if (!profile) return false;
  
  profile.riskScore = 0;
  return true;
}