/**
 * Sentinel 4.5 Advanced Rate Limiter
 * 
 * This module provides advanced rate limiting with adaptive thresholds
 * based on user roles and historical patterns.
 */

import { Request, Response, NextFunction } from 'express';
import { sendAlert, AlertSeverity, AlertType } from './alert-system';
import { logSecurityEvent } from './audit-log';

// Configuration
interface RateLimitConfig {
  windowMs: number;       // Time window in milliseconds
  maxRequests: number;    // Maximum requests per window
  message: string;        // Response message when limit is exceeded
  statusCode: number;     // Response status code when limit is exceeded
  headers: boolean;       // Whether to send rate limit headers
  skipSuccessfulRequests: boolean; // Skip counting successful responses
}

// Default configuration
const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,         // 100 requests per 15 minutes
  message: 'Too many requests, please try again later.',
  statusCode: 429,          // Too Many Requests
  headers: true,
  skipSuccessfulRequests: false
};

// Role-based limits
const ROLE_LIMITS: { [role: string]: number } = {
  'student': 150,
  'teacher': 300,
  'admin': 500,
  'ceo': 1000
};

// Path-specific limits
const PATH_LIMITS: { [path: string]: number } = {
  '/api/login': 10,        // Login more restrictive
  '/api/signup': 5,        // Signup very restrictive
  '/api/security': 30,     // Security endpoints more restrictive
  '/api/admin': 50         // Admin endpoints more restrictive
};

// Endpoint sensitivity levels (1-5)
const ENDPOINT_SENSITIVITY: { [pathPattern: string]: number } = {
  '^/api/login': 5,
  '^/api/admin': 4,
  '^/api/security': 4,
  '^/api/users': 3,
  '^/api/courses': 2,
  '^/api/public': 1
};

// Store request counts
interface RequestCounter {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockExpires: number | null;
  consecutiveViolations: number;
  history: Array<{
    timestamp: number;
    path: string;
    statusCode?: number;
  }>;
}

// Storage for tracking requests
const requestCounters: Map<string, RequestCounter> = new Map();

// Track IP reputation scores (lower is worse)
const ipReputationScores: Map<string, number> = new Map();

/**
 * Generate a key from the request
 * Can be IP-based, user-based, or a combination
 */
function getRequestKey(req: Request, keyType: 'ip' | 'user' | 'combined' = 'ip'): string {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const user = (req as any).user?.username || 'anonymous';
  
  switch (keyType) {
    case 'user':
      return `user:${user}`;
    case 'combined':
      return `combined:${user}:${ip}`;
    case 'ip':
    default:
      return `ip:${ip}`;
  }
}

/**
 * Determine request limit based on path and user role
 */
function getRequestLimit(req: Request, baseLimit: number): number {
  const path = req.path;
  const role = (req as any).user?.role || 'anonymous';
  
  // Start with base limit
  let limit = baseLimit;
  
  // Apply role-based adjustment
  if (ROLE_LIMITS[role]) {
    limit = ROLE_LIMITS[role];
  }
  
  // Apply path-based adjustment (most specific)
  for (const pathPrefix in PATH_LIMITS) {
    if (path.startsWith(pathPrefix)) {
      limit = PATH_LIMITS[pathPrefix];
      break;
    }
  }
  
  // Apply IP reputation adjustment
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const reputation = ipReputationScores.get(ip) || 100; // Default to 100 (good)
  
  // Adjust limit based on reputation (reduce by up to 80% for bad reputation)
  const reputationFactor = Math.max(0.2, reputation / 100);
  limit = Math.floor(limit * reputationFactor);
  
  return limit;
}

/**
 * Get the sensitivity level of an endpoint (1-5)
 */
function getEndpointSensitivity(path: string): number {
  for (const pattern in ENDPOINT_SENSITIVITY) {
    if (new RegExp(pattern).test(path)) {
      return ENDPOINT_SENSITIVITY[pattern];
    }
  }
  
  return 1; // Default sensitivity level
}

/**
 * Update IP reputation score based on behavior
 */
function updateIpReputation(ip: string, change: number): void {
  const currentScore = ipReputationScores.get(ip) || 100;
  
  // Calculate new score
  let newScore = currentScore + change;
  
  // Keep score between 0 and 100
  newScore = Math.max(0, Math.min(100, newScore));
  
  // Update score
  ipReputationScores.set(ip, newScore);
  
  // Log significant reputation changes
  if (Math.abs(change) >= 10) {
    logSecurityEvent(
      'system',
      `IP reputation ${change > 0 ? 'increased' : 'decreased'}`,
      { 
        ip,
        change,
        newScore,
        previousScore: currentScore
      },
      ip
    );
  }
  
  // Alert on very low reputation
  if (newScore <= 30 && currentScore > 30) {
    sendAlert(
      AlertSeverity.MEDIUM,
      AlertType.RATE_LIMIT,
      `IP address has gained a poor reputation score`,
      { 
        ip,
        score: newScore,
        reason: 'Multiple rate limit violations or suspicious behavior patterns'
      }
    );
  }
}

/**
 * Create an advanced rate limiter middleware
 */
export function createRateLimiter(options: Partial<RateLimitConfig> = {}): (req: Request, res: Response, next: NextFunction) => void {
  // Merge options with defaults
  const config: RateLimitConfig = { ...DEFAULT_CONFIG, ...options };
  
  // Return middleware function
  return function rateLimiterMiddleware(req: Request, res: Response, next: NextFunction): void {
    // Skip rate limiting for specific paths or IPs if needed
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    
    // Skip rate limiting for local development
    if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
      return next();
    }
    
    // Get key for this request
    const key = getRequestKey(req);
    
    // Determine limit for this request
    const limit = getRequestLimit(req, config.maxRequests);
    
    // Initialize or get counter
    let counter = requestCounters.get(key);
    const now = Date.now();
    
    if (!counter || counter.resetTime <= now) {
      // Create new counter or reset expired counter
      counter = {
        count: 0,
        resetTime: now + config.windowMs,
        blocked: false,
        blockExpires: null,
        consecutiveViolations: 0,
        history: []
      };
      
      requestCounters.set(key, counter);
    }
    
    // Check if currently blocked
    if (counter.blocked && counter.blockExpires !== null) {
      if (now <= counter.blockExpires) {
        // Still blocked
        const timeLeft = Math.ceil((counter.blockExpires - now) / 1000 / 60); // minutes
        
        // Send headers if enabled
        if (config.headers) {
          res.setHeader('Retry-After', Math.ceil((counter.blockExpires - now) / 1000));
          res.setHeader('X-RateLimit-Limit', limit);
          res.setHeader('X-RateLimit-Remaining', 0);
          res.setHeader('X-RateLimit-Reset', Math.ceil(counter.blockExpires / 1000));
        }
        
        // Log continued attempts during block
        logSecurityEvent(
          (req as any).user?.username || 'anonymous',
          'Request attempted during rate limit block',
          { 
            ip,
            path: req.path,
            method: req.method,
            blockExpiresIn: `${timeLeft} minutes`
          },
          ip
        );
        
        // Penalize reputation for ignoring block
        updateIpReputation(ip, -5);
        
        return res.status(config.statusCode).json({
          error: 'Rate limit exceeded',
          message: `${config.message} Please retry after ${timeLeft} ${timeLeft === 1 ? 'minute' : 'minutes'}.`
        });
      } else {
        // Block expired, reset counter
        counter.blocked = false;
        counter.blockExpires = null;
        counter.count = 0;
        counter.resetTime = now + config.windowMs;
        counter.consecutiveViolations = 0;
        
        requestCounters.set(key, counter);
      }
    }
    
    // Track request in history
    counter.history.push({
      timestamp: now,
      path: req.path
    });
    
    // Keep history manageable
    if (counter.history.length > 100) {
      counter.history = counter.history.slice(-100);
    }
    
    // Increment counter
    counter.count++;
    
    // Check if over limit
    if (counter.count > limit) {
      // Increment consecutive violations
      counter.consecutiveViolations++;
      
      // Calculate block duration based on consecutive violations
      let blockDuration = 0;
      
      if (counter.consecutiveViolations === 1) {
        blockDuration = 5 * 60 * 1000; // 5 minutes
      } else if (counter.consecutiveViolations === 2) {
        blockDuration = 15 * 60 * 1000; // 15 minutes
      } else if (counter.consecutiveViolations === 3) {
        blockDuration = 60 * 60 * 1000; // 1 hour
      } else {
        blockDuration = 24 * 60 * 60 * 1000; // 24 hours
      }
      
      // Apply block
      counter.blocked = true;
      counter.blockExpires = now + blockDuration;
      
      requestCounters.set(key, counter);
      
      // Determine sensitivity of targeted endpoint
      const sensitivity = getEndpointSensitivity(req.path);
      
      // Penalize IP reputation based on endpoint sensitivity
      updateIpReputation(ip, -(5 * sensitivity));
      
      // Send rate limit headers if enabled
      if (config.headers) {
        res.setHeader('Retry-After', Math.ceil(blockDuration / 1000));
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', 0);
        res.setHeader('X-RateLimit-Reset', Math.ceil(counter.blockExpires! / 1000));
      }
      
      // Log the rate limit event
      logSecurityEvent(
        (req as any).user?.username || 'anonymous',
        'Rate limit exceeded',
        { 
          ip,
          path: req.path,
          method: req.method,
          requestCount: counter.count,
          limit,
          blockDuration: `${blockDuration / 60000} minutes`,
          consecutiveViolations: counter.consecutiveViolations,
          historySize: counter.history.length
        },
        ip
      );
      
      // Send an alert for multiple violations or sensitive endpoints
      if (counter.consecutiveViolations >= 2 || sensitivity >= 4) {
        const severity = counter.consecutiveViolations >= 3 ? AlertSeverity.HIGH :
                         counter.consecutiveViolations === 2 ? AlertSeverity.MEDIUM :
                         AlertSeverity.LOW;
                         
        sendAlert(
          severity,
          AlertType.RATE_LIMIT,
          `Rate limit exceeded for ${ip}`,
          {
            ip,
            path: req.path,
            method: req.method,
            requestCount: counter.count,
            limit,
            blockDuration: `${blockDuration / 60000} minutes`,
            consecutiveViolations: counter.consecutiveViolations,
            endpointSensitivity: sensitivity,
            user: (req as any).user?.username || 'anonymous'
          }
        );
      }
      
      return res.status(config.statusCode).json({
        error: 'Rate limit exceeded',
        message: `${config.message} Please retry after ${Math.ceil(blockDuration / 60000)} minutes.`
      });
    }
    
    // Update remaining info in headers
    if (config.headers) {
      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - counter.count));
      res.setHeader('X-RateLimit-Reset', Math.ceil(counter.resetTime / 1000));
    }
    
    // If skipping successful requests, intercept response
    if (config.skipSuccessfulRequests) {
      // Save original end to restore it later
      const originalEnd = res.end;
      
      // Override end method
      res.end = function(chunk?: any, encoding?: BufferEncoding | string, callback?: () => void): any {
        // Update status code in history
        if (counter?.history.length) {
          counter.history[counter.history.length - 1].statusCode = res.statusCode;
        }
        
        // Don't count successful responses
        if (res.statusCode < 400 && counter) {
          counter.count--;
          
          // For successful auth, slightly boost reputation
          if (req.path.includes('/login') || req.path.includes('/authenticate')) {
            updateIpReputation(ip, 1);
          }
        } else if (res.statusCode >= 400) {
          // For errors, especially auth errors, penalize reputation
          if (res.statusCode === 401 || res.statusCode === 403) {
            updateIpReputation(ip, -2);
          }
        }
        
        // Restore original end
        res.end = originalEnd;
        
        // Call original end
        return originalEnd.call(this, chunk, encoding as BufferEncoding, callback);
      };
    }
    
    // Proceed to next middleware
    next();
  };
}

/**
 * Export a standard rate limiter for general use
 */
export const standardRateLimiter = createRateLimiter();

/**
 * Create a more restrictive rate limiter for sensitive endpoints
 */
export const strictRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  maxRequests: 30,          // 30 requests per 10 minutes
  message: 'Rate limit exceeded for sensitive operations. Please try again later.'
});

/**
 * Get rate limit status for the security dashboard
 */
export function getRateLimitStatus(): any[] {
  const now = Date.now();
  const result: any[] = [];
  
  for (const [key, counter] of requestCounters.entries()) {
    // Skip entries that aren't blocked or have low counts
    if (!counter.blocked && counter.count < 5) continue;
    
    // Parse key to get type and identifier
    const [type, identifier] = key.split(':');
    
    // Calculate reset time
    const resetTime = counter.resetTime > now ? 
      Math.ceil((counter.resetTime - now) / 1000) : 0;
    
    // Calculate block time remaining
    const blockTimeRemaining = counter.blockExpires && counter.blockExpires > now ?
      Math.ceil((counter.blockExpires - now) / 1000) : 0;
    
    result.push({
      key,
      type,
      identifier,
      count: counter.count,
      blocked: counter.blocked,
      blockTimeRemaining,
      resetTime,
      consecutiveViolations: counter.consecutiveViolations,
      recentPaths: counter.history
        .slice(-5)
        .map(h => h.path)
        .filter((path, index, self) => self.indexOf(path) === index)
    });
  }
  
  return result.sort((a, b) => {
    // Sort by blocked status first, then by count
    if (a.blocked && !b.blocked) return -1;
    if (!a.blocked && b.blocked) return 1;
    return b.count - a.count;
  });
}

/**
 * Unblock a rate-limited identifier
 */
export function unblockRateLimit(key: string): boolean {
  const counter = requestCounters.get(key);
  if (!counter) return false;
  
  counter.blocked = false;
  counter.blockExpires = null;
  counter.count = 0;
  counter.consecutiveViolations = 0;
  counter.resetTime = Date.now() + DEFAULT_CONFIG.windowMs;
  
  requestCounters.set(key, counter);
  
  // Extract IP if it's an IP-based key
  if (key.startsWith('ip:')) {
    const ip = key.split(':')[1];
    logSecurityEvent(
      'system',
      'Rate limit manually unblocked',
      { ip, key },
      'system'
    );
  } else {
    logSecurityEvent(
      'system',
      'Rate limit manually unblocked',
      { key },
      'system'
    );
  }
  
  return true;
}