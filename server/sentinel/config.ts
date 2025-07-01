/**
 * Sentinel 4.5 Security System Configuration
 */

import path from 'path';
import fs from 'fs';

// Log file paths
export const LOG_FILE_PATH = './logs/sentinel';
export const AUDIT_LOG_FILE = path.join(LOG_FILE_PATH, 'audit.log');
export const SECURITY_LOG_FILE = path.join(LOG_FILE_PATH, 'security.log');
export const ERROR_LOG_FILE = path.join(LOG_FILE_PATH, 'error.log');

// Authentication security settings
export const AUTHENTICATION_ATTEMPTS_THRESHOLD = 5;
export const RED_ZONE_THRESHOLD = 5;
export const SESSION_TIMEOUT_MINUTES = 60;
export const RATE_LIMIT_REQUESTS = 100;
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const FILE_SIZE_LIMIT_MB = 10;

// API security settings
export const API_KEY_EXPIRY_DAYS = 90;

// File upload security settings
export const ALLOWED_FILE_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.svg', // Images
  '.pdf', '.doc', '.docx', '.txt', '.md', // Documents
  '.mp3', '.wav', '.mp4', '.webm', // Media
  '.json', '.xml', '.csv' // Data
];

// JWT and cookie security
export const JWT_SECRET = process.env.JWT_SECRET || 'shatzios-sentinel-security-jwt-secret';
export const COOKIE_SECRET = process.env.COOKIE_SECRET || 'shatzios-sentinel-security-cookie-secret';

// Alert notification configurations
export const ALERT_EMAIL = 'security@shatzios.com';
export const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK || '';

// Security modules status
export const SECURITY_MODULES_STATUS = {
  authentication: true,
  authorization: true,
  contentSecurity: true,
  rateLimiter: true,
  fileGuard: true,
  honeypot: true,
  databaseMonitor: true,
  threatIntelligence: true,
  anomalyDetection: true,
  ipBlocker: true,
  userBehavior: true,
  correlationEngine: true,
  twoFactorAuth: true,
  secureSession: true,
  vulnerabilityScanner: true,
  apiKeyManager: true,
  incidentResponse: true,
  securityScoring: true,
  securityEducation: true,
  healthChecker: true,
  complianceFramework: true,
  chaosTesting: true
};