/**
 * Sentinel 4.5 Audit Logging
 * 
 * This module provides security event logging functions to maintain
 * a comprehensive audit trail of security-related activities.
 */

import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { LOG_FILE_PATH, AUDIT_LOG_FILE, SECURITY_LOG_FILE, ERROR_LOG_FILE } from './config';

// Log levels for different types of events
enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

// Ensure log directories exist
function ensureLogDirectory() {
  try {
    if (!fs.existsSync(LOG_FILE_PATH)) {
      fs.mkdirSync(LOG_FILE_PATH, { recursive: true });
    }
  } catch (error) {
    console.error('Failed to create log directory:', error);
  }
}

/**
 * Write a message to a log file
 * @param logFile The path to the log file
 * @param message The message to log
 * @param level The severity level of the log
 * @param details Optional details to include in the log
 */
function writeToLog(logFile: string, message: string, level: LogLevel = LogLevel.INFO, details?: any) {
  ensureLogDirectory();
  
  try {
    const timestamp = new Date().toISOString();
    let logMessage = `${timestamp} - [${level}] ${message}`;
    
    if (details) {
      // For security reasons, we don't log sensitive data
      const safeDetails = { ...details };
      
      // Remove sensitive fields if they exist
      if (safeDetails.password) safeDetails.password = '********';
      if (safeDetails.token) safeDetails.token = '********';
      if (safeDetails.apiKey) safeDetails.apiKey = '********';
      if (safeDetails.secretKey) safeDetails.secretKey = '********';
      
      // Convert object to string
      const detailsStr = typeof safeDetails === 'object' 
        ? JSON.stringify(safeDetails)
        : String(safeDetails);
      
      logMessage += ` | Details: ${detailsStr}`;
    }
    
    fs.appendFileSync(logFile, logMessage + '\n');
  } catch (error) {
    console.error(`Failed to write to log file ${logFile}:`, error);
  }
}

/**
 * Log a security event
 * @param message Description of the security event
 * @param details Additional details about the event
 * @param level Severity level of the event
 */
export function logSecurityEvent(message: string, details?: any, level: LogLevel = LogLevel.INFO) {
  writeToLog(SECURITY_LOG_FILE, message, level, details);
}

/**
 * Log an audit event (user or system action)
 * @param user The user who performed the action
 * @param action Description of the action performed
 * @param details Additional details about the action
 */
export function logAuditEvent(user: string, action: string, details?: any) {
  const message = `User '${user}' ${action}`;
  writeToLog(AUDIT_LOG_FILE, message, LogLevel.INFO, details);
}

/**
 * Log an error event
 * @param message Description of the error
 * @param error The error object
 * @param user Username or identifier of the affected user
 * @param ip Client IP address (optional)
 * @param userAgent User agent string (optional)
 * @param level Severity level of the error
 */
export function logErrorEvent(
  message: string,
  error: Error | string,
  user: string = 'unknown',
  ip?: string,
  userAgent?: string,
  level: LogLevel = LogLevel.ERROR
) {
  const errorMessage = error instanceof Error ? error.message : error;
  const details = error instanceof Error 
    ? { 
        name: error.name, 
        stack: error.stack,
        user,
        ip,
        userAgent
      } 
    : { user, ip, userAgent };
  
  writeToLog(ERROR_LOG_FILE, `${message}: ${errorMessage}`, level, details);
}

/**
 * Utility function to get the IP address from a request object
 * @param req The Express request object
 * @returns The client IP address
 */
export function getRequestIP(req: Request): string {
  // Check for proxy-provided IP (X-Forwarded-For header)
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor && typeof xForwardedFor === 'string') {
    // X-Forwarded-For can contain multiple IPs - we want the first one (client IP)
    return xForwardedFor.split(',')[0].trim();
  }
  
  // Fall back to connection remote address
  return req.ip || (req.connection?.remoteAddress || 'unknown');
}

/**
 * Middleware to audit API requests
 * @param req The Express request object
 * @param res The Express response object
 * @param next The next middleware function
 */
export function apiAuditMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const ip = getRequestIP(req);
  const method = req.method;
  const path = req.originalUrl || req.url;
  const user = (req as any).user?.username || 'anonymous';
  const userAgent = req.headers['user-agent'] || 'unknown';
  
  // Log the API request
  logAuditEvent(
    user,
    `API Request: ${method} ${path}`,
    {
      ip,
      method,
      path,
      userAgent,
      query: req.query,
      body: req.body
    }
  );
  
  // Log response on finish
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    // Log the API response
    logAuditEvent(
      user,
      `API Response: ${method} ${path} (${res.statusCode})`,
      {
        ip,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`
      }
    );
  });
  
  next();
}