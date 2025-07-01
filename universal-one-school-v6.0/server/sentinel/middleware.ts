/**
 * Sentinel 4.5 Security Middleware
 * 
 * This module provides the main security middleware for Express applications,
 * integrating all Sentinel 4.5 security features.
 */

import { Request, Response, NextFunction } from 'express';
// @ts-ignore
import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW_MS } from './config';
import { 
  sendAlert, 
  AlertSeverity, 
  AlertType
} from './alert-system';
// @ts-ignore
import helmet from 'helmet';

// Create rate limiter
const apiRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    
    sendAlert(
      AlertSeverity.MEDIUM,
      AlertType.RATE_LIMIT,
      `Rate limit exceeded for IP: ${ip}`,
      { 
        path: req.path, 
        method: req.method,
        headers: req.headers,
        userAgent: req.headers['user-agent'],
        ip
      }
    );
    
    res.status(429).json({
      message: 'Too many requests, please try again later.'
    });
  }
});

/**
 * Apply all Sentinel security middleware to an Express app
 */
export function applySentinelSecurity(app: any): void {
  console.log('🛡️ Applying Sentinel 4.5 Security System...');
  
  // Create logs directory if it doesn't exist
  try {
    import('fs').then(fs => {
      fs.mkdirSync('./logs', { recursive: true });
      fs.mkdirSync('./logs/sentinel', { recursive: true });
    }).catch(error => {
      console.error('Error creating log directories:', error);
    });
  } catch (error) {
    console.error('Error creating log directories:', error);
  }
  
  // Apply security headers with Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],  // Less strict for development
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https://*'],
        connectSrc: ["'self'", 'https://*'],
      },
    },
    xssFilter: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));
  
  // Apply rate limiting to API routes
  app.use('/api', apiRateLimiter);
  
  // Import and use API audit middleware dynamically
  import('./audit-log').then(({ apiAuditMiddleware }) => {
    // Log all API requests for auditing
    app.use('/api', apiAuditMiddleware);
  }).catch(error => {
    console.error('Error importing audit-log module:', error);
  });
  
  // Log all errors
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // Log the error but continue processing
    import('./audit-log').then(({ logErrorEvent, getRequestIP }) => {
      const user = (req as any).user?.username || 'anonymous';
      const ip = getRequestIP(req);
      const userAgent = req.headers['user-agent'] as string;
      
      logErrorEvent(
        `Error in ${req.method} ${req.path}`,
        err,
        user,
        ip,
        userAgent
      );
    }).catch(importError => {
      console.error('Error importing audit-log module:', importError);
    });
    
    next(err);
  });
  
  console.log('✅ Sentinel 4.5 Security System initialized successfully');
}

/**
 * Middleware for securing specific routes
 */
export function secureRoute(req: Request, res: Response, next: NextFunction): void {
  // Check if user is authenticated
  if (!(req as any).user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  
  // Additional security checks can be added here
  
  next();
}