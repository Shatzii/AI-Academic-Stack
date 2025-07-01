/**
 * Sentinel 4.5 Two-Factor Authentication Module
 * 
 * This module provides 2FA functionality for enhanced account security.
 * Supports time-based one-time passwords (TOTP) via authenticator apps.
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { sendAlert, AlertSeverity, AlertType } from './alert-system';
import { logSecurityEvent, logAuditEvent } from './audit-log';

// Store user 2FA secrets and verification status
// In a production app, these would be stored in a database
interface TwoFactorSecret {
  secret: string;
  verified: boolean;
  backupCodes: string[];
  createdAt: number;
}

// In-memory storage for 2FA secrets and active challenges
const twoFactorSecrets: Map<string, TwoFactorSecret> = new Map();
const activeChallenges: Map<string, { userId: string, expiresAt: number }> = new Map();

// Configuration
const CHALLENGE_EXPIRY_SECONDS = 300; // 5 minutes
const TOTP_WINDOW = 1; // Allow 1 step before/after current time
const BACKUP_CODE_COUNT = 8;
const BACKUP_CODE_LENGTH = 10;

/**
 * Generate a new TOTP secret for a user
 */
export function generateTOTPSecret(userId: string): { secret: string, qrCodeUrl: string } {
  // Generate a random secret
  const secret = crypto.randomBytes(20).toString('hex');
  
  // Generate backup codes
  const backupCodes = Array.from({ length: BACKUP_CODE_COUNT }, () => 
    crypto.randomBytes(BACKUP_CODE_LENGTH / 2).toString('hex')
  );
  
  // Store the secret for this user
  twoFactorSecrets.set(userId, {
    secret,
    verified: false,
    backupCodes,
    createdAt: Date.now()
  });
  
  // Generate a QR code URL that users can scan with authenticator apps
  // Format: otpauth://totp/App:user@example.com?secret=SECRET&issuer=App
  const appName = 'ShotziOS';
  const encodedName = encodeURIComponent(`${appName}:${userId}`);
  const qrCodeUrl = `otpauth://totp/${encodedName}?secret=${secret}&issuer=${encodeURIComponent(appName)}`;
  
  // Log the action
  logAuditEvent(
    userId,
    'Two-factor authentication setup initiated',
    {},
    'system'
  );
  
  return { secret, qrCodeUrl };
}

/**
 * Generate a TOTP code from a secret and timestamp
 * Implementation follows RFC 6238
 */
function generateTOTP(secret: string, timeStep: number = 30): string {
  // Convert the secret from hex to binary
  const buffer = Buffer.from(secret, 'hex');
  
  // Calculate the counter value (number of time steps since Unix epoch)
  const counter = Math.floor(Date.now() / 1000 / timeStep);
  
  // Convert counter to buffer
  const counterBuffer = Buffer.alloc(8);
  for (let i = 0; i < 8; i++) {
    counterBuffer[7 - i] = counter >> (i * 8) & 0xff;
  }
  
  // Calculate HMAC-SHA1
  const hmac = crypto.createHmac('sha1', buffer);
  hmac.update(counterBuffer);
  const digest = hmac.digest();
  
  // Dynamic truncation
  const offset = digest[digest.length - 1] & 0xf;
  
  // Generate 6-digit code
  const code = (
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff)
  ) % 1000000;
  
  // Pad with leading zeros if necessary
  return code.toString().padStart(6, '0');
}

/**
 * Verify a TOTP code
 */
export function verifyTOTP(userId: string, code: string): boolean {
  // Get the user's 2FA secret
  const twoFactorData = twoFactorSecrets.get(userId);
  if (!twoFactorData) return false;
  
  // Check for backup code
  if (twoFactorData.backupCodes.includes(code)) {
    // Remove used backup code
    twoFactorData.backupCodes = twoFactorData.backupCodes.filter(c => c !== code);
    
    // Log the use of a backup code
    logAuditEvent(
      userId,
      'Two-factor authentication backup code used',
      {},
      'system'
    );
    
    return true;
  }
  
  // Verify the code within a time window to account for clock skew
  const timeStep = 30;
  const currentCounter = Math.floor(Date.now() / 1000 / timeStep);
  
  // Check current and adjacent time windows
  for (let i = -TOTP_WINDOW; i <= TOTP_WINDOW; i++) {
    const counter = currentCounter + i;
    const counterTime = counter * timeStep * 1000;
    const expectedCode = generateTOTP(twoFactorData.secret, timeStep);
    
    if (code === expectedCode) {
      // If this is the first successful verification, mark as verified
      if (!twoFactorData.verified) {
        twoFactorData.verified = true;
        twoFactorSecrets.set(userId, twoFactorData);
        
        // Log the verification
        logAuditEvent(
          userId,
          'Two-factor authentication verified and enabled',
          {},
          'system'
        );
        
        // Send alert for new 2FA setup
        sendAlert(
          AlertSeverity.LOW,
          AlertType.AUTHENTICATION,
          'Two-factor authentication enabled',
          { userId }
        );
      }
      
      return true;
    }
  }
  
  // Invalid code
  return false;
}

/**
 * Create a 2FA challenge for a user during login
 */
export function createTwoFactorChallenge(userId: string): string {
  // Generate a unique challenge ID
  const challengeId = crypto.randomBytes(16).toString('hex');
  
  // Store the challenge
  activeChallenges.set(challengeId, {
    userId,
    expiresAt: Date.now() + (CHALLENGE_EXPIRY_SECONDS * 1000)
  });
  
  // Log the challenge creation
  logAuditEvent(
    userId,
    'Two-factor authentication challenge created',
    {},
    'system'
  );
  
  return challengeId;
}

/**
 * Verify a 2FA challenge response
 */
export function verifyTwoFactorChallenge(challengeId: string, code: string): { success: boolean, userId?: string } {
  // Get the challenge
  const challenge = activeChallenges.get(challengeId);
  if (!challenge) {
    return { success: false };
  }
  
  // Check if challenge has expired
  if (Date.now() > challenge.expiresAt) {
    activeChallenges.delete(challengeId);
    return { success: false };
  }
  
  // Verify the code
  const verified = verifyTOTP(challenge.userId, code);
  
  // Clean up the challenge
  activeChallenges.delete(challengeId);
  
  // Log the verification attempt
  logAuditEvent(
    challenge.userId,
    `Two-factor authentication ${verified ? 'succeeded' : 'failed'}`,
    {},
    'system'
  );
  
  // If failed, send an alert
  if (!verified) {
    sendAlert(
      AlertSeverity.MEDIUM,
      AlertType.AUTHENTICATION,
      'Failed two-factor authentication attempt',
      { userId: challenge.userId }
    );
  }
  
  return { 
    success: verified,
    userId: verified ? challenge.userId : undefined
  };
}

/**
 * Check if a user has 2FA enabled
 */
export function isTwoFactorEnabled(userId: string): boolean {
  const twoFactorData = twoFactorSecrets.get(userId);
  return !!twoFactorData && twoFactorData.verified;
}

/**
 * Disable 2FA for a user
 */
export function disableTwoFactor(userId: string): boolean {
  if (!twoFactorSecrets.has(userId)) {
    return false;
  }
  
  twoFactorSecrets.delete(userId);
  
  // Log the action
  logAuditEvent(
    userId,
    'Two-factor authentication disabled',
    {},
    'system'
  );
  
  // Send an alert
  sendAlert(
    AlertSeverity.MEDIUM,
    AlertType.AUTHENTICATION,
    'Two-factor authentication disabled',
    { userId }
  );
  
  return true;
}

/**
 * Generate new backup codes for a user
 */
export function generateNewBackupCodes(userId: string): string[] | null {
  const twoFactorData = twoFactorSecrets.get(userId);
  if (!twoFactorData) {
    return null;
  }
  
  // Generate new backup codes
  const backupCodes = Array.from({ length: BACKUP_CODE_COUNT }, () => 
    crypto.randomBytes(BACKUP_CODE_LENGTH / 2).toString('hex')
  );
  
  // Update the user's 2FA data
  twoFactorData.backupCodes = backupCodes;
  twoFactorSecrets.set(userId, twoFactorData);
  
  // Log the action
  logAuditEvent(
    userId,
    'New two-factor authentication backup codes generated',
    {},
    'system'
  );
  
  return backupCodes;
}

/**
 * Get a user's backup codes
 */
export function getBackupCodes(userId: string): string[] | null {
  const twoFactorData = twoFactorSecrets.get(userId);
  if (!twoFactorData) {
    return null;
  }
  
  return [...twoFactorData.backupCodes];
}

/**
 * Middleware to require 2FA for sensitive routes
 */
export function requireTwoFactor(req: Request, res: Response, next: NextFunction): void {
  // Get the authenticated user
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Check if user has 2FA enabled
  if (isTwoFactorEnabled(user.username)) {
    // Check if the session has already completed 2FA
    if ((req as any).session?.twoFactorVerified) {
      return next();
    }
    
    // Create a 2FA challenge
    const challengeId = createTwoFactorChallenge(user.username);
    
    // Return a response requiring 2FA
    return res.status(403).json({
      error: 'Two-factor authentication required',
      challengeId
    });
  }
  
  // User doesn't have 2FA enabled, allow access
  next();
}