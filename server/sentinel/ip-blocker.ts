/**
 * Sentinel 4.5 IP Blocker System
 * 
 * This module provides automatic blocking of suspicious IPs after detecting 
 * multiple failed login attempts or malicious activity patterns.
 */

import { sendAlert, AlertSeverity, AlertType } from './alert-system';
import { logSecurityEvent } from './audit-log';
import { NextFunction, Request, Response } from 'express';

// Configuration
const BLOCK_THRESHOLD = 5; // Number of suspicious activities before blocking
const BLOCK_DURATION_MS = 3600000; // Block duration in milliseconds (1 hour)
const SUSPICIOUS_ACTIVITY_EXPIRY = 7200000; // Activity tracking expiry (2 hours)

// Track suspicious activities by IP
interface SuspiciousActivity {
  count: number;
  firstDetected: number;
  lastDetected: number;
  activities: Array<{
    type: string;
    timestamp: number;
    details?: any;
  }>;
}

// Track blocked IPs with expiration
interface BlockedIP {
  ip: string;
  reason: string;
  blockedAt: number;
  expiresAt: number;
  activities: Array<{
    type: string;
    timestamp: number;
    details?: any;
  }>;
}

// In-memory storage for suspicious activities and blocked IPs
const suspiciousActivities: Map<string, SuspiciousActivity> = new Map();
const blockedIPs: Map<string, BlockedIP> = new Map();

/**
 * Record a suspicious activity for an IP address
 */
export function recordSuspiciousActivity(
  ip: string,
  activityType: string,
  details?: any
): void {
  const now = Date.now();
  
  // Get or create activity record for this IP
  let activity = suspiciousActivities.get(ip);
  if (!activity) {
    activity = {
      count: 0,
      firstDetected: now,
      lastDetected: now,
      activities: []
    };
    suspiciousActivities.set(ip, activity);
  }
  
  // Update activity record
  activity.count++;
  activity.lastDetected = now;
  activity.activities.push({
    type: activityType,
    timestamp: now,
    details
  });
  
  // Check if IP should be blocked
  if (activity.count >= BLOCK_THRESHOLD) {
    blockIP(ip, `Exceeded threshold with ${activity.count} suspicious activities`);
  }
  
  // Cleanup expired activities
  cleanupExpiredActivities();
}

/**
 * Block an IP address
 */
export function blockIP(ip: string, reason: string): void {
  const now = Date.now();
  const activities = suspiciousActivities.get(ip)?.activities || [];
  
  // Create block record
  const blockRecord: BlockedIP = {
    ip,
    reason,
    blockedAt: now,
    expiresAt: now + BLOCK_DURATION_MS,
    activities
  };
  
  // Add to blocked IPs
  blockedIPs.set(ip, blockRecord);
  
  // Remove from suspicious activities
  suspiciousActivities.delete(ip);
  
  // Log the block
  logSecurityEvent(
    'system',
    'IP address blocked',
    { ip, reason, expiresAt: new Date(blockRecord.expiresAt).toISOString() },
    ip
  );
  
  // Send an alert
  sendAlert(
    AlertSeverity.MEDIUM,
    AlertType.SYSTEM,
    `IP address blocked: ${ip}`,
    { 
      reason, 
      blockDuration: `${BLOCK_DURATION_MS / 60000} minutes`,
      activities
    }
  );
}

/**
 * Check if an IP is blocked
 */
export function isIPBlocked(ip: string): boolean {
  const blockRecord = blockedIPs.get(ip);
  if (!blockRecord) return false;
  
  // Check if block has expired
  if (Date.now() > blockRecord.expiresAt) {
    // Block expired, remove it
    blockedIPs.delete(ip);
    return false;
  }
  
  return true;
}

/**
 * Get information about a blocked IP
 */
export function getBlockInfo(ip: string): BlockedIP | null {
  const blockRecord = blockedIPs.get(ip);
  if (!blockRecord) return null;
  
  // Check if block has expired
  if (Date.now() > blockRecord.expiresAt) {
    // Block expired, remove it
    blockedIPs.delete(ip);
    return null;
  }
  
  return blockRecord;
}

/**
 * Unblock an IP address
 */
export function unblockIP(ip: string): boolean {
  if (!blockedIPs.has(ip)) return false;
  
  blockedIPs.delete(ip);
  
  // Log the unblock
  logSecurityEvent(
    'system',
    'IP address unblocked',
    { ip },
    'system'
  );
  
  return true;
}

/**
 * Cleanup expired activities and blocks
 */
function cleanupExpiredActivities(): void {
  const now = Date.now();
  
  // Clean up suspicious activities
  for (const [ip, activity] of suspiciousActivities.entries()) {
    if (now - activity.lastDetected > SUSPICIOUS_ACTIVITY_EXPIRY) {
      suspiciousActivities.delete(ip);
    }
  }
  
  // Clean up expired blocks
  for (const [ip, block] of blockedIPs.entries()) {
    if (now > block.expiresAt) {
      blockedIPs.delete(ip);
    }
  }
}

/**
 * Express middleware to block suspicious IPs
 */
export function ipBlockerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  
  // Skip for localhost and internal IPs during development
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return next();
  }
  
  // Check if IP is blocked
  if (isIPBlocked(ip)) {
    const blockInfo = getBlockInfo(ip);
    const timeRemaining = Math.ceil((blockInfo!.expiresAt - Date.now()) / 60000); // minutes
    
    // Log attempt from blocked IP
    logSecurityEvent(
      'system',
      'Blocked request from banned IP',
      { 
        ip, 
        path: req.path, 
        method: req.method,
        timeRemaining: `${timeRemaining} minutes`
      },
      ip
    );
    
    // Return 403 Forbidden
    return res.status(403).json({
      error: 'Access denied',
      message: `Your IP address has been temporarily blocked due to suspicious activity. Try again in ${timeRemaining} minutes.`
    });
  }
  
  next();
}

// Export a function to get all blocked IPs for the security dashboard
export function getAllBlockedIPs(): BlockedIP[] {
  const now = Date.now();
  const activeBlocks: BlockedIP[] = [];
  
  for (const [ip, block] of blockedIPs.entries()) {
    if (now <= block.expiresAt) {
      activeBlocks.push(block);
    }
  }
  
  return activeBlocks;
}