/**
 * Sentinel 4.5 Authentication System
 * 
 * This module provides authentication-related security for the application.
 */

import { Request, Response, NextFunction } from 'express';
import { logSecurityEvent, getRequestIP } from './audit-log';
import { sendAlert, AlertSeverity, AlertType } from './alert-system';
import { RED_ZONE_THRESHOLD, JWT_SECRET } from './config';
import jwt from 'jsonwebtoken';

// Store failed login attempts by IP
interface FailedAttempt {
  count: number;
  lastAttempt: number;
  blocked: boolean;
}

const failedAttempts: Record<string, FailedAttempt> = {};

/**
 * Check if an IP is in the red zone (too many failed attempts)
 */
export function checkRedZone(ip: string): boolean {
  if (!failedAttempts[ip]) {
    return false;
  }
  
  return failedAttempts[ip].blocked || failedAttempts[ip].count >= RED_ZONE_THRESHOLD;
}

/**
 * Record a failed login attempt
 */
export function recordFailedLoginAttempt(ip: string, username: string): void {
  if (!failedAttempts[ip]) {
    failedAttempts[ip] = {
      count: 0,
      lastAttempt: Date.now(),
      blocked: false
    };
  }
  
  failedAttempts[ip].count += 1;
  failedAttempts[ip].lastAttempt = Date.now();
  
  // Log the failed attempt
  logSecurityEvent(
    username,
    'Failed login attempt',
    { ip, attemptCount: failedAttempts[ip].count },
    ip
  );
  
  // Check if this IP should be blocked
  if (failedAttempts[ip].count >= RED_ZONE_THRESHOLD) {
    failedAttempts[ip].blocked = true;
    
    // Send a security alert
    sendAlert(
      AlertSeverity.HIGH,
      AlertType.AUTHENTICATION,
      `IP Address blocked after ${RED_ZONE_THRESHOLD} failed login attempts`,
      { ip, username, attemptCount: failedAttempts[ip].count },
      username,
      ip
    );
  }
}

/**
 * Reset failed login attempts after successful login
 */
export function resetFailedLoginAttempts(ip: string): void {
  if (failedAttempts[ip]) {
    failedAttempts[ip].count = 0;
    failedAttempts[ip].blocked = false;
  }
}

/**
 * Clear expired red zone entries (reset after 24 hours)
 */
export function clearExpiredRedZoneEntries(): void {
  const now = Date.now();
  const RESET_AFTER_MS = 24 * 60 * 60 * 1000; // 24 hours
  
  Object.keys(failedAttempts).forEach(ip => {
    if (now - failedAttempts[ip].lastAttempt > RESET_AFTER_MS) {
      delete failedAttempts[ip];
    }
  });
}

// Start a timer to periodically clear expired red zone entries
setInterval(clearExpiredRedZoneEntries, 60 * 60 * 1000); // Every hour

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: any): string {
  // Don't include sensitive fields in the token
  const { password, ...userForToken } = user;
  
  return jwt.sign(userForToken, JWT_SECRET, {
    expiresIn: '24h' // Token expires in 24 hours
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Middleware to check if a request is authenticated
 */
export function loginRequired(req: Request, res: Response, next: NextFunction): void {
  // Check for token in Authorization header or session
  const token = req.headers.authorization?.split(' ')[1] || (req as any).session?.token;
  
  if (!token) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
  
  // Attach user information to the request
  (req as any).user = decoded;
  next();
}

/**
 * Middleware to check if a user has a specific role
 */
export function roleRequired(role: string | string[]) {
  const roles = Array.isArray(role) ? role : [role];
  
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!(req as any).user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    const userRole = (req as any).user.role;
    
    if (!roles.includes(userRole)) {
      logSecurityEvent(
        (req as any).user.username,
        'Unauthorized access attempt',
        { requiredRoles: roles, userRole },
        getRequestIP(req),
        req.headers['user-agent']
      );
      
      res.status(403).json({ message: 'Unauthorized access' });
      return;
    }
    
    next();
  };
}

/**
 * Middleware to prevent Red Zone IPs from making requests
 */
export function redZoneMiddleware(req: Request, res: Response, next: NextFunction): void {
  const ip = getRequestIP(req);
  
  if (checkRedZone(ip)) {
    logSecurityEvent(
      'BLOCKED',
      'Blocked request from Red Zone IP',
      { ip, path: req.path },
      ip,
      req.headers['user-agent']
    );
    
    res.status(403).json({ message: 'Too many failed attempts. Please try again later.' });
    return;
  }
  
  next();
}