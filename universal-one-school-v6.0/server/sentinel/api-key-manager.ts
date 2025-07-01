/**
 * Sentinel 4.5 API Key Management System
 * 
 * This module provides secure API key management with automatic rotation,
 * expiration, and validation.
 */

import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { sendAlert, AlertSeverity, AlertType } from './alert-system';
import { logSecurityEvent, logAuditEvent } from './audit-log';
import { API_KEY_EXPIRY_DAYS } from './config';

// API key status
export enum ApiKeyStatus {
  ACTIVE = 'active',
  ROTATED = 'rotated',
  EXPIRED = 'expired',
  REVOKED = 'revoked'
}

// API key types
export enum ApiKeyType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  SERVICE = 'service',
  ADMIN = 'admin',
  READ_ONLY = 'read_only'
}

// API key scope definitions
export interface ApiKeyScope {
  resource: string;
  actions: string[];
}

// API key record
export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  keyHash: string;
  type: ApiKeyType;
  status: ApiKeyStatus;
  scopes: ApiKeyScope[];
  createdBy: string;
  createdAt: number;
  expiresAt: number;
  lastUsedAt?: number;
  usageCount: number;
  revokedAt?: number;
  revokedBy?: string;
  revokedReason?: string;
  replacedBy?: string;
  replacedAt?: number;
  ipRestrictions?: string[];
  metadata?: Record<string, any>;
}

// Store API keys (in-memory for this example, would be in a database in production)
const apiKeys: Map<string, ApiKey> = new Map();

// Store revoked keys for rapid lookup
const revokedKeys: Set<string> = new Set();

// Track active keys by user
const userKeys: Map<string, Set<string>> = new Map();

// Key prefix lookup for rapid validation
const keyPrefixLookup: Map<string, string> = new Map();

// Track API key usage
const keyUsage: Map<string, {
  count: number;
  lastUsed: number;
  recentEndpoints: string[];
  recentIps: string[];
}> = new Map();

// Configuration
const KEY_PREFIX_LENGTH = 8;
const KEY_LENGTH = 36;
const ROTATION_WARNING_DAYS = 7; // Warn days before expiration
const ROTATION_GRACE_PERIOD_DAYS = 7; // Days the old key works after rotation

/**
 * Create a new API key
 */
export function createApiKey(
  name: string,
  type: ApiKeyType,
  scopes: ApiKeyScope[],
  createdBy: string,
  expiryDays: number = API_KEY_EXPIRY_DAYS,
  ipRestrictions: string[] = [],
  metadata: Record<string, any> = {}
): { apiKey: ApiKey, plaintextKey: string } {
  // Generate key components
  const keyId = crypto.randomBytes(16).toString('hex');
  const prefix = crypto.randomBytes(4).toString('hex');
  const secret = crypto.randomBytes(24).toString('hex');
  
  // Create full key string
  const plaintextKey = `${prefix}.${secret}`;
  
  // Hash the key for storage
  const keyHash = crypto.createHash('sha256').update(plaintextKey).digest('hex');
  
  // Calculate expiration date
  const now = Date.now();
  const expiresAt = now + (expiryDays * 24 * 60 * 60 * 1000);
  
  // Create the key record
  const apiKey: ApiKey = {
    id: keyId,
    name,
    prefix,
    keyHash,
    type,
    status: ApiKeyStatus.ACTIVE,
    scopes,
    createdBy,
    createdAt: now,
    expiresAt,
    usageCount: 0,
    ipRestrictions,
    metadata
  };
  
  // Store the key
  apiKeys.set(keyId, apiKey);
  
  // Add to prefix lookup
  keyPrefixLookup.set(prefix, keyId);
  
  // Add to user keys
  if (!userKeys.has(createdBy)) {
    userKeys.set(createdBy, new Set());
  }
  userKeys.get(createdBy)!.add(keyId);
  
  // Log the creation
  logAuditEvent(
    createdBy,
    'API key created',
    { 
      keyId,
      name,
      type,
      expiresAt: new Date(expiresAt).toISOString()
    },
    'system'
  );
  
  return {
    apiKey,
    plaintextKey
  };
}

/**
 * Validate an API key
 */
export function validateApiKey(
  plaintextKey: string,
  requiredScopes?: ApiKeyScope[],
  ip?: string
): { valid: boolean; key?: ApiKey; reason?: string } {
  // Split key into prefix and secret
  const [prefix, secret] = plaintextKey.split('.');
  
  // Check if prefix exists
  if (!prefix || !secret || !keyPrefixLookup.has(prefix)) {
    return { valid: false, reason: 'Invalid API key' };
  }
  
  // Get key ID
  const keyId = keyPrefixLookup.get(prefix)!;
  
  // Get key record
  const key = apiKeys.get(keyId);
  if (!key) {
    return { valid: false, reason: 'API key not found' };
  }
  
  // Check if key is active
  if (key.status === ApiKeyStatus.REVOKED) {
    return { valid: false, reason: 'API key revoked', key };
  }
  
  // Check if key is expired
  if (key.status === ApiKeyStatus.EXPIRED || key.expiresAt < Date.now()) {
    // Auto-update status if needed
    if (key.status !== ApiKeyStatus.EXPIRED) {
      key.status = ApiKeyStatus.EXPIRED;
      apiKeys.set(keyId, key);
      
      // Log the expiration
      logSecurityEvent(
        'system',
        'API key expired',
        { keyId, name: key.name },
        'system'
      );
    }
    
    return { valid: false, reason: 'API key expired', key };
  }
  
  // Verify the key hash
  const keyHash = crypto.createHash('sha256').update(plaintextKey).digest('hex');
  if (keyHash !== key.keyHash) {
    return { valid: false, reason: 'Invalid API key' };
  }
  
  // Check IP restrictions if applicable
  if (ip && key.ipRestrictions && key.ipRestrictions.length > 0) {
    const ipAllowed = key.ipRestrictions.some(allowedIp => {
      // Check for CIDR notation or exact match
      if (allowedIp.includes('/')) {
        // Simple CIDR check (would be more sophisticated in production)
        const [network, bits] = allowedIp.split('/');
        const networkParts = network.split('.').map(Number);
        const ipParts = ip.split('.').map(Number);
        
        // Check network match (simplified)
        for (let i = 0; i < parseInt(bits) / 8; i++) {
          if (networkParts[i] !== ipParts[i]) {
            return false;
          }
        }
        
        return true;
      }
      
      // Exact match
      return allowedIp === ip;
    });
    
    if (!ipAllowed) {
      // Log the IP restriction violation
      logSecurityEvent(
        'system',
        'API key used from unauthorized IP',
        { 
          keyId,
          name: key.name,
          ip,
          allowedIps: key.ipRestrictions
        },
        ip
      );
      
      return { valid: false, reason: 'IP not authorized', key };
    }
  }
  
  // Check scopes if required
  if (requiredScopes && requiredScopes.length > 0) {
    const hasRequiredScopes = requiredScopes.every(requiredScope => {
      return key.scopes.some(keyScope => {
        if (keyScope.resource !== requiredScope.resource) {
          return false;
        }
        
        return requiredScope.actions.every(action => 
          keyScope.actions.includes(action) || keyScope.actions.includes('*')
        );
      });
    });
    
    if (!hasRequiredScopes) {
      // Log the scope violation
      logSecurityEvent(
        'system',
        'API key used with insufficient scopes',
        { 
          keyId,
          name: key.name,
          requiredScopes,
          keyScopes: key.scopes
        },
        ip || 'unknown'
      );
      
      return { valid: false, reason: 'Insufficient permissions', key };
    }
  }
  
  // Update usage metrics
  key.lastUsedAt = Date.now();
  key.usageCount++;
  
  // Update key usage tracking
  if (!keyUsage.has(keyId)) {
    keyUsage.set(keyId, {
      count: 0,
      lastUsed: Date.now(),
      recentEndpoints: [],
      recentIps: []
    });
  }
  
  const usage = keyUsage.get(keyId)!;
  usage.count++;
  usage.lastUsed = Date.now();
  
  // Valid key
  return { valid: true, key };
}

/**
 * Rotate an API key
 */
export function rotateApiKey(
  keyId: string,
  rotatedBy: string
): { success: boolean; newKey?: string; key?: ApiKey } {
  // Get key record
  const key = apiKeys.get(keyId);
  if (!key) {
    return { success: false };
  }
  
  // Create new key
  const { apiKey: newApiKey, plaintextKey } = createApiKey(
    `${key.name} (Rotated)`,
    key.type,
    key.scopes,
    rotatedBy,
    API_KEY_EXPIRY_DAYS,
    key.ipRestrictions,
    { ...key.metadata, previousKey: keyId }
  );
  
  // Calculate grace period
  const graceEndDate = Date.now() + (ROTATION_GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);
  
  // Update old key
  key.status = ApiKeyStatus.ROTATED;
  key.replacedBy = newApiKey.id;
  key.replacedAt = Date.now();
  key.expiresAt = graceEndDate; // Extend old key for grace period
  
  // Update storage
  apiKeys.set(keyId, key);
  
  // Log the rotation
  logAuditEvent(
    rotatedBy,
    'API key rotated',
    { 
      oldKeyId: keyId,
      newKeyId: newApiKey.id,
      name: key.name
    },
    'system'
  );
  
  // Return the new key
  return {
    success: true,
    newKey: plaintextKey,
    key: newApiKey
  };
}

/**
 * Revoke an API key
 */
export function revokeApiKey(
  keyId: string,
  revokedBy: string,
  reason: string
): boolean {
  // Get key record
  const key = apiKeys.get(keyId);
  if (!key) {
    return false;
  }
  
  // Update key
  key.status = ApiKeyStatus.REVOKED;
  key.revokedAt = Date.now();
  key.revokedBy = revokedBy;
  key.revokedReason = reason;
  
  // Update storage
  apiKeys.set(keyId, key);
  
  // Add to revoked set for faster lookups
  revokedKeys.add(keyId);
  
  // Log the revocation
  logAuditEvent(
    revokedBy,
    'API key revoked',
    { 
      keyId,
      name: key.name,
      reason
    },
    'system'
  );
  
  return true;
}

/**
 * Get API keys for a user
 */
export function getUserApiKeys(username: string): ApiKey[] {
  const userKeyIds = userKeys.get(username);
  if (!userKeyIds) return [];
  
  return Array.from(userKeyIds)
    .map(keyId => apiKeys.get(keyId))
    .filter(key => key !== undefined) as ApiKey[];
}

/**
 * Get API key by ID
 */
export function getApiKey(keyId: string): ApiKey | undefined {
  return apiKeys.get(keyId);
}

/**
 * Get all API keys
 */
export function getAllApiKeys(): ApiKey[] {
  return Array.from(apiKeys.values());
}

/**
 * Check for expiring keys and send notifications
 */
export function checkExpiringKeys(): void {
  const now = Date.now();
  const warningThreshold = now + (ROTATION_WARNING_DAYS * 24 * 60 * 60 * 1000);
  
  for (const key of apiKeys.values()) {
    // Skip keys that are not active
    if (key.status !== ApiKeyStatus.ACTIVE) continue;
    
    // Check if key is about to expire
    if (key.expiresAt <= warningThreshold && key.expiresAt > now) {
      // Calculate days remaining
      const daysRemaining = Math.ceil((key.expiresAt - now) / (24 * 60 * 60 * 1000));
      
      // Send alert
      sendAlert(
        AlertSeverity.LOW,
        AlertType.SYSTEM,
        `API key expiring soon: ${key.name}`,
        {
          keyId: key.id,
          name: key.name,
          daysRemaining,
          expiresAt: new Date(key.expiresAt).toISOString(),
          createdBy: key.createdBy
        }
      );
      
      // Add expiration warning to metadata to avoid duplicate alerts
      if (!key.metadata) key.metadata = {};
      key.metadata.expirationWarningDate = Date.now();
      apiKeys.set(key.id, key);
      
      // Log the warning
      logSecurityEvent(
        'system',
        'API key expiring soon',
        { 
          keyId: key.id,
          name: key.name,
          daysRemaining,
          expiresAt: new Date(key.expiresAt).toISOString()
        },
        'system'
      );
    }
  }
}

/**
 * Schedule routine key maintenance
 * This would run periodically to handle expirations, rotation notices, etc.
 */
export function startKeyMaintenanceSchedule(): void {
  // Run key maintenance every day
  setInterval(() => {
    // Check for expiring keys
    checkExpiringKeys();
    
    // Update expired keys
    const now = Date.now();
    for (const key of apiKeys.values()) {
      if (key.status === ApiKeyStatus.ACTIVE && key.expiresAt <= now) {
        key.status = ApiKeyStatus.EXPIRED;
        
        // Log the expiration
        logSecurityEvent(
          'system',
          'API key expired',
          { 
            keyId: key.id,
            name: key.name
          },
          'system'
        );
      }
    }
    
    // Clean up old usage data
    for (const [keyId, usage] of keyUsage.entries()) {
      // Remove usage data for keys that haven't been used in 30 days
      if (now - usage.lastUsed > 30 * 24 * 60 * 60 * 1000) {
        keyUsage.delete(keyId);
      }
    }
  }, 24 * 60 * 60 * 1000); // Run every 24 hours
}

/**
 * Express middleware to validate API keys
 */
export function apiKeyAuthMiddleware(
  requiredScopes?: ApiKeyScope[]
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Get API key from request
    const apiKey = req.headers['x-api-key'] as string;
    
    // If no API key provided, return unauthorized
    if (!apiKey) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'API key is required'
      });
    }
    
    // Validate the API key
    const validation = validateApiKey(
      apiKey,
      requiredScopes,
      req.ip || req.socket.remoteAddress
    );
    
    // If invalid, return error
    if (!validation.valid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: validation.reason || 'Invalid API key'
      });
    }
    
    // Add key information to request
    (req as any).apiKey = validation.key;
    
    // Continue to next middleware
    next();
  };
}