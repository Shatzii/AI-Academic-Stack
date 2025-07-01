/**
 * Sentinel 4.5 Honeypot System
 * 
 * This module provides honeypot routes and detection mechanisms to catch
 * unauthorized access attempts and potential attackers.
 */

import { Request, Response } from 'express';
import { sendAlert, AlertSeverity, AlertType } from './alert-system';
import { logSecurityEvent, getRequestIP } from './audit-log';

// List of common honeypot paths that attackers typically look for
const HONEYPOT_ROUTES = [
  '/admin',
  '/wp-admin',
  '/administrator',
  '/phpmyadmin',
  '/wp-login.php',
  '/login.php',
  '/config.php',
  '/.env',
  '/api/debug',
  '/api/internal',
  '/console',
  '/actuator',
  '/graphql/console',
  '/v1/secret',
  '/swagger'
];

/**
 * Handle requests to honeypot routes
 */
export function honeypotHandler(req: Request, res: Response): void {
  const ip = getRequestIP(req);
  const url = req.originalUrl;
  const method = req.method;
  const userAgent = req.headers['user-agent'] || '';
  
  // Log the honeypot access
  logSecurityEvent(
    'HONEYPOT',
    `Honeypot accessed: ${method} ${url}`,
    { headers: req.headers, query: req.query, body: req.body },
    ip,
    userAgent
  );
  
  // Send security alert
  sendAlert(
    AlertSeverity.MEDIUM,
    AlertType.HONEYPOT,
    `Honeypot accessed: ${method} ${url}`,
    { ip, userAgent, method, url },
    undefined,
    ip,
    userAgent
  );
  
  // Return a generic response to not reveal it's a honeypot
  res.status(403).json({ 
    message: 'Access denied. This attempt has been logged.'
  });
}

/**
 * Register honeypot routes with the Express app
 */
export function registerHoneypots(app: any): void {
  HONEYPOT_ROUTES.forEach(route => {
    // Register GET handler
    app.get(route, honeypotHandler);
    
    // Register POST handler
    app.post(route, honeypotHandler);
  });
  
  // Create fake API endpoints
  app.get('/api/v1/internal/users', honeypotHandler);
  app.get('/api/v1/internal/config', honeypotHandler);
  app.post('/api/v1/internal/auth', honeypotHandler);
  
  console.log(`✅ Registered ${HONEYPOT_ROUTES.length} honeypot routes`);
}

/**
 * Check if a login is for a honeypot user
 */
export function isHoneypotUser(username: string): boolean {
  const honeypotUsers = [
    'admin',
    'administrator',
    'root',
    'user',
    'test',
    'guest',
    'system'
  ];
  
  return honeypotUsers.includes(username.toLowerCase());
}

/**
 * Handle honeypot user login attempts
 */
export function handleHoneypotUserLogin(req: Request, res: Response): void {
  const username = req.body.username;
  const ip = getRequestIP(req);
  const userAgent = req.headers['user-agent'] || '';
  
  // Log the honeypot user access
  logSecurityEvent(
    'HONEYPOT_USER',
    `Login attempt with honeypot username: ${username}`,
    { ip, userAgent },
    ip,
    userAgent
  );
  
  // Send security alert
  sendAlert(
    AlertSeverity.MEDIUM,
    AlertType.HONEYPOT,
    `Login attempt with honeypot username: ${username}`,
    { ip, userAgent },
    username,
    ip,
    userAgent
  );
  
  // Return a realistic-looking error to not reveal it's a honeypot
  setTimeout(() => {
    res.status(401).json({ 
      success: false,
      message: 'Invalid username or password'
    });
  }, 1000); // Add delay to simulate processing
}