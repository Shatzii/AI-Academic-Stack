/**
 * Sentinel 4.5 Secure Session Management
 * 
 * This module enhances session security with features like session expiration,
 * device fingerprinting, and concurrent session limitations.
 */

import { Request, Response, NextFunction } from 'express';
import { logSecurityEvent, logAuditEvent } from './audit-log';
import { sendAlert, AlertSeverity, AlertType } from './alert-system';
import { getUserRiskScore } from './user-behavior';
import { getSecuritySettings } from './config';
import crypto from 'crypto';

// Interface for enhanced session
export interface EnhancedSession extends Express.Session {
  deviceFingerprint?: string;
  userAgent?: string;
  ip?: string;
  lastActive?: number;
  lastRotated?: number;
  issuedAt: number;
  expiresAt: number;
  idleTimeout: number;
  absoluteTimeout: number;
  loginMethod?: 'password' | 'oauth' | 'sso' | 'api-key' | 'mfa';
  hasMfa?: boolean;
  previousIps?: string[];
  originalLocation?: {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  privileges?: string[];
  activityCount?: number;
  highRiskActions?: string[];
  sessionExtensions?: number;
}

// Store active sessions
const activeSessions: Map<string, {
  userId: string;
  username: string;
  sessionId: string;
  fingerprint: string;
  ip: string;
  userAgent: string;
  issuedAt: number;
  expiresAt: number;
  lastActive: number;
}> = new Map();

// Settings
const DEFAULT_SESSION_SETTINGS = {
  idleTimeout: 30 * 60 * 1000, // 30 minutes
  absoluteTimeout: 8 * 60 * 60 * 1000, // 8 hours
  maxConcurrentSessions: 5,
  sessionRotationInterval: 60 * 60 * 1000, // 1 hour
  enforceSingleSession: false, // For high-security roles
  fingerprintValidation: true,
  trackPreviousIps: true,
  maxSessionExtensions: 3,
  requireMfaForHighRisk: true,
  allowedLocationChange: 'warn' // 'block', 'warn', 'allow'
};

/**
 * Initialize secure session management
 */
export function initSecureSessionManagement(): void {
  // Start session cleaner process
  setInterval(() => {
    cleanExpiredSessions();
  }, 15 * 60 * 1000); // Run every 15 minutes
  
  console.log('Secure Session Management module initialized');
}

/**
 * Middleware to enhance session security
 */
export function secureSessionMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Skip for non-authenticated routes
  if (!req.session || !req.session.user) {
    return next();
  }
  
  // Get settings
  const settings = getSecuritySettings();
  const sessionSettings = {
    ...DEFAULT_SESSION_SETTINGS,
    ...(settings.sessionSettings || {})
  };
  
  // Get the session
  const session = req.session as EnhancedSession;
  const userId = session.user?.id;
  const username = session.user?.username;
  
  // If this is a new session, initialize it
  if (!session.issuedAt) {
    initializeSession(req, sessionSettings);
    return next();
  }
  
  // Generate current device fingerprint
  const currentFingerprint = generateDeviceFingerprint(req);
  
  // Verify device fingerprint if enabled
  if (sessionSettings.fingerprintValidation && session.deviceFingerprint &&
      session.deviceFingerprint !== currentFingerprint) {
    
    // Log the fingerprint mismatch
    logSecurityEvent(
      username,
      'Session fingerprint mismatch',
      {
        sessionFingerprint: session.deviceFingerprint,
        currentFingerprint,
        ip: req.ip || req.socket.remoteAddress
      },
      req.ip || req.socket.remoteAddress
    );
    
    // Send alert for fingerprint mismatch
    sendAlert(
      AlertSeverity.HIGH,
      AlertType.AUTHENTICATION,
      'Possible session hijacking attempt detected',
      {
        username,
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        originalFingerprint: session.deviceFingerprint,
        currentFingerprint
      },
      username,
      req.ip || req.socket.remoteAddress
    );
    
    // Destroy the session
    destroySession(req);
    
    // Return unauthorized
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Session validation failed'
    });
  }
  
  // Check if session is expired
  const now = Date.now();
  
  // Check absolute timeout
  if (session.expiresAt && now > session.expiresAt) {
    // Session has absolutely expired
    logSecurityEvent(
      username,
      'Session expired (absolute timeout)',
      {
        issuedAt: new Date(session.issuedAt).toISOString(),
        expiresAt: new Date(session.expiresAt).toISOString()
      },
      req.ip || req.socket.remoteAddress
    );
    
    // Destroy the session
    destroySession(req);
    
    // Return unauthorized
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Session expired'
    });
  }
  
  // Check idle timeout
  if (session.lastActive && session.idleTimeout && now > (session.lastActive + session.idleTimeout)) {
    // Session has been idle too long
    logSecurityEvent(
      username,
      'Session expired (idle timeout)',
      {
        lastActive: new Date(session.lastActive).toISOString(),
        idleTimeout: session.idleTimeout / 60000 + ' minutes'
      },
      req.ip || req.socket.remoteAddress
    );
    
    // Destroy the session
    destroySession(req);
    
    // Return unauthorized
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Session expired due to inactivity'
    });
  }
  
  // Check if IP has changed dramatically
  if (session.ip && session.ip !== req.ip && sessionSettings.allowedLocationChange !== 'allow') {
    // Log the IP change
    logSecurityEvent(
      username,
      'Session IP changed',
      {
        originalIp: session.ip,
        currentIp: req.ip || req.socket.remoteAddress
      },
      req.ip || req.socket.remoteAddress
    );
    
    // Block the session if configured to do so
    if (sessionSettings.allowedLocationChange === 'block') {
      // Send alert
      sendAlert(
        AlertSeverity.HIGH,
        AlertType.AUTHENTICATION,
        'Session terminated due to IP change',
        {
          username,
          originalIp: session.ip,
          currentIp: req.ip || req.socket.remoteAddress
        },
        username,
        req.ip || req.socket.remoteAddress
      );
      
      // Destroy the session
      destroySession(req);
      
      // Return unauthorized
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Session invalid due to location change'
      });
    }
  }
  
  // Track previous IPs if enabled
  if (sessionSettings.trackPreviousIps && req.ip) {
    if (!session.previousIps) {
      session.previousIps = [];
    }
    
    if (!session.previousIps.includes(req.ip)) {
      session.previousIps.push(req.ip);
    }
  }
  
  // Check if session needs rotation
  if (session.lastRotated && 
      sessionSettings.sessionRotationInterval && 
      now > (session.lastRotated + sessionSettings.sessionRotationInterval)) {
    // Rotate session
    rotateSession(req);
  }
  
  // Check the user's risk score and require MFA for high-risk users if configured
  if (sessionSettings.requireMfaForHighRisk && !session.hasMfa) {
    const riskScore = getUserRiskScore(userId);
    
    if (riskScore && riskScore >= 75) {
      // Log the event
      logSecurityEvent(
        username,
        'MFA required due to high risk score',
        {
          riskScore,
          threshold: 75
        },
        req.ip || req.socket.remoteAddress
      );
      
      // Return 403 to trigger MFA challenge
      return res.status(403).json({
        error: 'MFA Required',
        message: 'Multi-factor authentication required',
        requireMfa: true
      });
    }
  }
  
  // Enforce maximum concurrent sessions if configured
  if (userId && sessionSettings.enforceSingleSession) {
    const userSessions = getSessions(userId);
    
    if (userSessions.length > 1) {
      // Current session ID
      const currentSessionId = req.sessionID;
      
      // Find sessions that are not this one
      const otherSessions = userSessions.filter(s => s.sessionId !== currentSessionId);
      
      // Terminate other sessions
      for (const session of otherSessions) {
        terminateSession(session.sessionId);
      }
      
      // Log the event
      logSecurityEvent(
        username,
        'Concurrent sessions terminated',
        {
          terminatedCount: otherSessions.length
        },
        req.ip || req.socket.remoteAddress
      );
    }
  } else if (userId && sessionSettings.maxConcurrentSessions > 0) {
    const userSessions = getSessions(userId);
    
    if (userSessions.length > sessionSettings.maxConcurrentSessions) {
      // Current session ID
      const currentSessionId = req.sessionID;
      
      // Find sessions that are not this one, sort by issuedAt (oldest first)
      const otherSessions = userSessions
        .filter(s => s.sessionId !== currentSessionId)
        .sort((a, b) => a.issuedAt - b.issuedAt);
      
      // Calculate how many sessions to terminate
      const terminateCount = userSessions.length - sessionSettings.maxConcurrentSessions;
      
      // Terminate oldest sessions
      for (let i = 0; i < terminateCount; i++) {
        if (otherSessions[i]) {
          terminateSession(otherSessions[i].sessionId);
        }
      }
      
      // Log the event
      logSecurityEvent(
        username,
        'Older sessions terminated due to maximum concurrent sessions',
        {
          terminatedCount,
          maxAllowed: sessionSettings.maxConcurrentSessions
        },
        req.ip || req.socket.remoteAddress
      );
    }
  }
  
  // Update session activity
  updateSessionActivity(req);
  
  next();
}

/**
 * Initialize a new session with security enhancements
 */
function initializeSession(req: Request, sessionSettings: any): void {
  const session = req.session as EnhancedSession;
  const username = session.user?.username;
  const userId = session.user?.id;
  const now = Date.now();
  
  // Generate device fingerprint
  const deviceFingerprint = generateDeviceFingerprint(req);
  
  // Set session properties
  session.deviceFingerprint = deviceFingerprint;
  session.userAgent = req.headers['user-agent'] as string;
  session.ip = req.ip || req.socket.remoteAddress;
  session.lastActive = now;
  session.lastRotated = now;
  session.issuedAt = now;
  session.expiresAt = now + sessionSettings.absoluteTimeout;
  session.idleTimeout = sessionSettings.idleTimeout;
  session.absoluteTimeout = sessionSettings.absoluteTimeout;
  session.previousIps = [session.ip as string];
  session.activityCount = 1;
  session.highRiskActions = [];
  session.sessionExtensions = 0;
  
  // Store in active sessions
  if (userId && username) {
    activeSessions.set(req.sessionID, {
      userId,
      username,
      sessionId: req.sessionID,
      fingerprint: deviceFingerprint,
      ip: session.ip as string,
      userAgent: session.userAgent as string,
      issuedAt: session.issuedAt,
      expiresAt: session.expiresAt,
      lastActive: session.lastActive
    });
  }
  
  // Log session creation
  logSecurityEvent(
    username,
    'New session created',
    {
      ip: session.ip,
      userAgent: session.userAgent,
      fingerprint: session.deviceFingerprint
    },
    session.ip
  );
}

/**
 * Update session activity
 */
function updateSessionActivity(req: Request): void {
  const session = req.session as EnhancedSession;
  const now = Date.now();
  
  // Update session properties
  session.lastActive = now;
  session.activityCount = (session.activityCount || 0) + 1;
  
  // Update in active sessions map
  if (req.sessionID && activeSessions.has(req.sessionID)) {
    const activeSession = activeSessions.get(req.sessionID);
    if (activeSession) {
      activeSession.lastActive = now;
      activeSessions.set(req.sessionID, activeSession);
    }
  }
}

/**
 * Rotate a session (generate new session ID while preserving data)
 */
function rotateSession(req: Request): void {
  const oldSessionID = req.sessionID;
  const session = req.session as EnhancedSession;
  const username = session.user?.username;
  const now = Date.now();
  
  // Store session data
  const sessionData = { ...session };
  
  // Regenerate session
  req.session.regenerate((err) => {
    if (err) {
      console.error('Error regenerating session:', err);
      return;
    }
    
    // Restore session data
    Object.assign(req.session, sessionData);
    
    // Update timestamps
    (req.session as EnhancedSession).lastRotated = now;
    
    // Update in active sessions map
    if (username && req.session.user?.id) {
      // Remove old session
      activeSessions.delete(oldSessionID);
      
      // Add new session
      activeSessions.set(req.sessionID, {
        userId: req.session.user.id,
        username,
        sessionId: req.sessionID,
        fingerprint: (req.session as EnhancedSession).deviceFingerprint || '',
        ip: (req.session as EnhancedSession).ip || req.ip || '',
        userAgent: (req.session as EnhancedSession).userAgent || '',
        issuedAt: (req.session as EnhancedSession).issuedAt,
        expiresAt: (req.session as EnhancedSession).expiresAt,
        lastActive: now
      });
    }
    
    // Log session rotation
    logSecurityEvent(
      username,
      'Session rotated',
      {
        oldSessionId: oldSessionID,
        newSessionId: req.sessionID
      },
      req.ip || req.socket.remoteAddress
    );
  });
}

/**
 * Destroy a session
 */
function destroySession(req: Request): void {
  const sessionId = req.sessionID;
  const session = req.session as EnhancedSession;
  const username = session?.user?.username;
  
  // Remove from active sessions
  activeSessions.delete(sessionId);
  
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
  });
  
  // Log session destruction
  if (username) {
    logSecurityEvent(
      username,
      'Session destroyed',
      { sessionId },
      req.ip || req.socket.remoteAddress
    );
  }
}

/**
 * Terminate a specific session by ID
 */
export function terminateSession(sessionId: string): boolean {
  const session = activeSessions.get(sessionId);
  if (!session) return false;
  
  // Remove from active sessions
  activeSessions.delete(sessionId);
  
  // In a real implementation, you would also invalidate the session in the session store
  // This varies based on the session store being used
  
  // Log session termination
  logSecurityEvent(
    session.username,
    'Session forcibly terminated',
    {
      sessionId,
      userId: session.userId,
      username: session.username
    },
    'system'
  );
  
  return true;
}

/**
 * Terminate all sessions for a user
 */
export function terminateAllUserSessions(userId: string, reason: string): number {
  // Find all sessions for this user
  const userSessions = getSessions(userId);
  
  // Terminate each session
  for (const session of userSessions) {
    terminateSession(session.sessionId);
  }
  
  // Log the action
  if (userSessions.length > 0) {
    logSecurityEvent(
      'system',
      'All user sessions terminated',
      {
        userId,
        reason,
        sessionCount: userSessions.length
      },
      'system'
    );
  }
  
  return userSessions.length;
}

/**
 * Get all active sessions
 */
export function getAllSessions(): Array<{
  userId: string;
  username: string;
  sessionId: string;
  fingerprint: string;
  ip: string;
  userAgent: string;
  issuedAt: number;
  expiresAt: number;
  lastActive: number;
}> {
  return Array.from(activeSessions.values());
}

/**
 * Get sessions for a specific user
 */
export function getSessions(userId: string): Array<{
  userId: string;
  username: string;
  sessionId: string;
  fingerprint: string;
  ip: string;
  userAgent: string;
  issuedAt: number;
  expiresAt: number;
  lastActive: number;
}> {
  return Array.from(activeSessions.values()).filter(session => session.userId === userId);
}

/**
 * Clean expired sessions
 */
function cleanExpiredSessions(): void {
  const now = Date.now();
  let expiredCount = 0;
  
  // Check each session
  for (const [sessionId, session] of activeSessions.entries()) {
    // Check if absolutely expired
    if (session.expiresAt < now) {
      // Remove from active sessions
      activeSessions.delete(sessionId);
      expiredCount++;
    }
  }
  
  // Log cleanup
  if (expiredCount > 0) {
    logSecurityEvent(
      'system',
      'Expired sessions cleaned up',
      { expiredCount },
      'system'
    );
  }
}

/**
 * Generate a device fingerprint from request information
 */
function generateDeviceFingerprint(req: Request): string {
  // Collect data points for fingerprinting
  const dataPoints = [
    req.headers['user-agent'] || '',
    req.headers['accept-language'] || '',
    req.headers['accept-encoding'] || ''
  ];
  
  // Generate fingerprint
  const fingerprint = crypto
    .createHash('sha256')
    .update(dataPoints.join('|'))
    .digest('hex');
  
  return fingerprint;
}

/**
 * Extend a session's expiration time
 */
export function extendSession(
  req: Request,
  extensionMinutes: number = 60
): boolean {
  const session = req.session as EnhancedSession;
  if (!session || !session.issuedAt) return false;
  
  // Get settings
  const settings = getSecuritySettings();
  const sessionSettings = {
    ...DEFAULT_SESSION_SETTINGS,
    ...(settings.sessionSettings || {})
  };
  
  // Check if maximum extensions reached
  if (session.sessionExtensions && 
      session.sessionExtensions >= sessionSettings.maxSessionExtensions) {
    return false;
  }
  
  // Update expiration time
  const extensionMs = extensionMinutes * 60 * 1000;
  session.expiresAt = Date.now() + extensionMs;
  
  // Increment extension count
  session.sessionExtensions = (session.sessionExtensions || 0) + 1;
  
  // Update in active sessions map
  if (req.sessionID && activeSessions.has(req.sessionID)) {
    const activeSession = activeSessions.get(req.sessionID);
    if (activeSession) {
      activeSession.expiresAt = session.expiresAt;
      activeSessions.set(req.sessionID, activeSession);
    }
  }
  
  // Log the extension
  const username = session.user?.username;
  logSecurityEvent(
    username,
    'Session extended',
    {
      extensionMinutes,
      newExpiryTime: new Date(session.expiresAt).toISOString(),
      extensionCount: session.sessionExtensions
    },
    req.ip || req.socket.remoteAddress
  );
  
  return true;
}

/**
 * Upgrade a session with MFA verification
 */
export function upgradeMfaSession(req: Request): boolean {
  const session = req.session as EnhancedSession;
  if (!session || !session.issuedAt) return false;
  
  // Mark session as MFA-authenticated
  session.hasMfa = true;
  
  // Log the upgrade
  const username = session.user?.username;
  logSecurityEvent(
    username,
    'Session upgraded with MFA',
    {},
    req.ip || req.socket.remoteAddress
  );
  
  return true;
}

/**
 * Track high-risk action in session
 */
export function trackHighRiskAction(req: Request, action: string): void {
  const session = req.session as EnhancedSession;
  if (!session || !session.issuedAt) return;
  
  // Initialize high risk actions array if it doesn't exist
  if (!session.highRiskActions) {
    session.highRiskActions = [];
  }
  
  // Add the action to the array
  session.highRiskActions.push(action);
  
  // Log the high-risk action
  const username = session.user?.username;
  logSecurityEvent(
    username,
    'High-risk action performed',
    { action },
    req.ip || req.socket.remoteAddress
  );
}