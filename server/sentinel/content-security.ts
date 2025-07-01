/**
 * Sentinel 4.5 Content Security Policy Module
 * 
 * This module implements Content Security Policy (CSP) headers to prevent XSS attacks
 * by restricting which domains can load scripts, styles, and other resources.
 */

import { Request, Response, NextFunction } from 'express';
import { logSecurityEvent } from './audit-log';
import { sendAlert, AlertSeverity, AlertType } from './alert-system';

// Configuration for various CSP directives
const CSP_CONFIG = {
  // Sources for JavaScript
  scriptSrc: [
    "'self'",                  // Allow scripts from same origin
    "'unsafe-inline'",         // Allow inline scripts (remove in production)
    "https://unpkg.com",       // Common CDN
    "https://cdn.jsdelivr.net",// Common CDN
    "https://www.google-analytics.com", // Analytics
    "https://www.googletagmanager.com"  // Tag Manager
  ],
  
  // Sources for CSS
  styleSrc: [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com",
    "https://cdn.jsdelivr.net"
  ],
  
  // Sources for fonts
  fontSrc: [
    "'self'",
    "https://fonts.gstatic.com",
    "data:"
  ],
  
  // Sources for images
  imgSrc: [
    "'self'",
    "data:",
    "blob:",
    "https://www.google-analytics.com",
    "https://*.googleapis.com"
  ],
  
  // Sources for media (audio/video)
  mediaSrc: [
    "'self'",
    "blob:"
  ],
  
  // Sources for object/embed
  objectSrc: [
    "'none'"
  ],
  
  // Connect-src defines valid targets for fetch, XHR, WebSockets
  connectSrc: [
    "'self'",
    "https://www.google-analytics.com",
    "https://*.googleapis.com",
    "https://api.openai.com",
    "https://api.elevenlabs.io",
    "wss://*.repl.co"
  ],
  
  // Frame sources
  frameSrc: [
    "'self'",
    "https://www.youtube.com"
  ],
  
  // Worker sources
  workerSrc: [
    "'self'",
    "blob:"
  ],
  
  // Manifest sources for web app manifests
  manifestSrc: [
    "'self'"
  ],
  
  // Form action targets
  formAction: [
    "'self'"
  ],
  
  // Frame ancestors (who can embed your site)
  frameAncestors: [
    "'self'"
  ],
  
  // Base URI
  baseUri: [
    "'self'"
  ],
  
  // Report URI for violations
  reportUri: "/api/security/csp-report"
};

/**
 * Build the complete CSP header string from configuration
 */
function buildCspString(cspConfig: typeof CSP_CONFIG): string {
  const directives = [
    `default-src 'self'`,
    `script-src ${cspConfig.scriptSrc.join(' ')}`,
    `style-src ${cspConfig.styleSrc.join(' ')}`,
    `font-src ${cspConfig.fontSrc.join(' ')}`,
    `img-src ${cspConfig.imgSrc.join(' ')}`,
    `media-src ${cspConfig.mediaSrc.join(' ')}`,
    `object-src ${cspConfig.objectSrc.join(' ')}`,
    `connect-src ${cspConfig.connectSrc.join(' ')}`,
    `frame-src ${cspConfig.frameSrc.join(' ')}`,
    `worker-src ${cspConfig.workerSrc.join(' ')}`,
    `manifest-src ${cspConfig.manifestSrc.join(' ')}`,
    `form-action ${cspConfig.formAction.join(' ')}`,
    `frame-ancestors ${cspConfig.frameAncestors.join(' ')}`,
    `base-uri ${cspConfig.baseUri.join(' ')}`,
    `report-uri ${cspConfig.reportUri}`
  ];
  
  return directives.join('; ');
}

// Store CSP violation reports for analysis
const cspViolations: Array<{
  blockedUri: string;
  documentUri: string;
  violatedDirective: string;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}> = [];

/**
 * Middleware to apply Content Security Policy headers
 */
export function contentSecurityPolicyMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Skip CSP for API routes (optional)
  if (req.path.startsWith('/api/') && !req.path.startsWith('/api/security/csp-report')) {
    return next();
  }
  
  // Set CSP header
  res.setHeader('Content-Security-Policy', buildCspString(CSP_CONFIG));
  
  // Set additional security headers
  
  // X-Content-Type-Options prevents MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // X-Frame-Options prevents clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // X-XSS-Protection enables browser's XSS filtering
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy controls how much referrer information is included
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy (formerly Feature Policy) controls browser features
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  next();
}

/**
 * Handler for CSP violation reports
 */
export function handleCspViolation(req: Request, res: Response): void {
  const report = req.body['csp-report'];
  
  if (report) {
    // Store the violation report
    const violation = {
      blockedUri: report.blockedUri,
      documentUri: report.documentUri,
      violatedDirective: report.violatedDirective,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
      ip: req.ip
    };
    
    cspViolations.push(violation);
    
    // Limit size of violation store
    if (cspViolations.length > 1000) {
      cspViolations.shift();
    }
    
    // Log the violation
    logSecurityEvent(
      'system',
      'CSP violation detected',
      violation,
      req.ip || 'unknown'
    );
    
    // Send an alert for certain types of violations
    const criticalDirectives = ['script-src', 'object-src', 'base-uri'];
    if (criticalDirectives.some(dir => report.violatedDirective.startsWith(dir))) {
      sendAlert(
        AlertSeverity.MEDIUM,
        AlertType.INJECTION,
        'Critical CSP violation detected',
        violation
      );
    }
  }
  
  // Always respond with 204 No Content
  res.status(204).end();
}

/**
 * Get recent CSP violations for the security dashboard
 */
export function getRecentCspViolations(): Array<{
  blockedUri: string;
  documentUri: string;
  violatedDirective: string;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}> {
  return [...cspViolations].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 100);
}

/**
 * Update CSP configuration (e.g., for admin panel)
 */
export function updateCspConfig(newConfig: Partial<typeof CSP_CONFIG>): boolean {
  try {
    // Merge new config with existing
    Object.assign(CSP_CONFIG, newConfig);
    
    // Log the update
    logSecurityEvent(
      'system',
      'CSP configuration updated',
      { newConfig },
      'system'
    );
    
    return true;
  } catch (error) {
    console.error('Error updating CSP config:', error);
    return false;
  }
}