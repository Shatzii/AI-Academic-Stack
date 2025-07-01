/**
 * Sentinel 4.5 Security Event Correlation Engine
 * 
 * This module implements a security event correlation engine that can connect
 * multiple security events to identify coordinated attacks that might otherwise
 * appear as isolated incidents.
 */

import { logSecurityEvent } from './audit-log';
import { sendAlert, AlertSeverity, AlertType, SecurityAlert } from './alert-system';
import { createSecurityIncident, IncidentType } from './incident-response';
import { getSecuritySettings } from './config';

// Types of correlation patterns
export enum CorrelationPatternType {
  IP_BASED = 'ip_based',
  USER_BASED = 'user_based',
  TEMPORAL = 'temporal',
  MULTI_STAGE = 'multi_stage',
  DISTRIBUTED = 'distributed',
  BEHAVIORAL = 'behavioral'
}

// Correlation rule definition
export interface CorrelationRule {
  id: string;
  name: string;
  description: string;
  type: CorrelationPatternType;
  enabled: boolean;
  conditions: {
    eventTypes?: string[];
    minEvents?: number;
    timeWindowMs?: number;
    requiredPatterns?: string[];
    thresholdCount?: number;
    groupBy?: string[];
  };
  actions: {
    createIncident?: boolean;
    incidentType?: IncidentType;
    alertSeverity?: AlertSeverity;
    alertMessage?: string;
  };
  createdAt: number;
  updatedAt: number;
  lastTriggered?: number;
  triggerCount: number;
}

// Detected correlation (an attack)
export interface Attack {
  id: string;
  ruleId: string;
  ruleName: string;
  type: CorrelationPatternType;
  sourceIp?: string;
  userId?: string;
  eventIds: string[];
  alertIds: string[];
  incidentId?: string;
  detectedAt: number;
  confidence: number;
  severity: AlertSeverity;
  description: string;
  stage?: string;
  status: 'new' | 'investigating' | 'mitigated' | 'resolved' | 'false_positive';
  assignedTo?: string;
  resolvedBy?: string;
  resolvedAt?: number;
  notes?: string[];
}

// Security event for correlation
interface SecurityEvent {
  id: string;
  type: string;
  timestamp: number;
  sourceIp?: string;
  userId?: string;
  username?: string;
  details: any;
  alertId?: string;
}

// Store correlation rules
const correlationRules: Map<string, CorrelationRule> = new Map();

// Store detected attacks
const detectedAttacks: Map<string, Attack> = new Map();

// Store recent security events for correlation
const recentEvents: SecurityEvent[] = [];

// Maximum number of events to keep in memory
const MAX_EVENTS = 10000;

// Maximum age of events to keep (in milliseconds)
const MAX_EVENT_AGE = 24 * 60 * 60 * 1000; // 24 hours

// Default correlation rules
const DEFAULT_CORRELATION_RULES: CorrelationRule[] = [
  {
    id: 'rule-brute-force',
    name: 'Authentication Brute Force',
    description: 'Detects multiple failed login attempts from the same IP address',
    type: CorrelationPatternType.IP_BASED,
    enabled: true,
    conditions: {
      eventTypes: ['authentication_failure'],
      minEvents: 5,
      timeWindowMs: 5 * 60 * 1000, // 5 minutes
      groupBy: ['sourceIp']
    },
    actions: {
      createIncident: true,
      incidentType: IncidentType.BRUTE_FORCE,
      alertSeverity: AlertSeverity.HIGH,
      alertMessage: 'Brute force attack detected: %count% failed login attempts from IP %sourceIp% in %timeWindow% minutes'
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    triggerCount: 0
  },
  {
    id: 'rule-account-takeover',
    name: 'Account Takeover Attempt',
    description: 'Detects successful login from a new location after multiple failed attempts',
    type: CorrelationPatternType.USER_BASED,
    enabled: true,
    conditions: {
      eventTypes: ['authentication_failure', 'authentication_success'],
      requiredPatterns: ['multiple_failures_then_success'],
      timeWindowMs: 30 * 60 * 1000, // 30 minutes
      groupBy: ['userId']
    },
    actions: {
      createIncident: true,
      incidentType: IncidentType.ACCOUNT_TAKEOVER,
      alertSeverity: AlertSeverity.HIGH,
      alertMessage: 'Possible account takeover for user %username%: successful login after multiple failures'
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    triggerCount: 0
  },
  {
    id: 'rule-recon-then-attack',
    name: 'Reconnaissance Followed by Attack',
    description: 'Detects reconnaissance activities followed by exploitation attempts',
    type: CorrelationPatternType.MULTI_STAGE,
    enabled: true,
    conditions: {
      eventTypes: ['honeypot_trigger', 'path_traversal', 'sql_injection', 'authentication_failure'],
      requiredPatterns: ['honeypot_then_attack'],
      timeWindowMs: 60 * 60 * 1000, // 1 hour
      groupBy: ['sourceIp']
    },
    actions: {
      createIncident: true,
      incidentType: IncidentType.SUSPICIOUS_ACTIVITY,
      alertSeverity: AlertSeverity.HIGH,
      alertMessage: 'Multi-stage attack detected from IP %sourceIp%: reconnaissance followed by attack attempts'
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    triggerCount: 0
  },
  {
    id: 'rule-distributed-scan',
    name: 'Distributed Port/Path Scanning',
    description: 'Detects distributed scanning from multiple IPs in the same subnet',
    type: CorrelationPatternType.DISTRIBUTED,
    enabled: true,
    conditions: {
      eventTypes: ['path_not_found', 'honeypot_trigger'],
      minEvents: 20,
      timeWindowMs: 15 * 60 * 1000, // 15 minutes
    },
    actions: {
      createIncident: true,
      incidentType: IncidentType.SUSPICIOUS_ACTIVITY,
      alertSeverity: AlertSeverity.MEDIUM,
      alertMessage: 'Distributed scanning detected from multiple related IPs'
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    triggerCount: 0
  },
  {
    id: 'rule-data-exfiltration',
    name: 'Potential Data Exfiltration',
    description: 'Detects unusual data access patterns that may indicate exfiltration',
    type: CorrelationPatternType.BEHAVIORAL,
    enabled: true,
    conditions: {
      eventTypes: ['large_data_query', 'sensitive_data_access'],
      minEvents: 3,
      timeWindowMs: 60 * 60 * 1000, // 1 hour
      groupBy: ['userId']
    },
    actions: {
      createIncident: true,
      incidentType: IncidentType.DATA_EXFILTRATION,
      alertSeverity: AlertSeverity.HIGH,
      alertMessage: 'Potential data exfiltration by user %username%: unusual access to large amounts of sensitive data'
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    triggerCount: 0
  }
];

/**
 * Initialize correlation engine
 */
export function initCorrelationEngine(): void {
  // Load default correlation rules
  for (const rule of DEFAULT_CORRELATION_RULES) {
    correlationRules.set(rule.id, rule);
  }
  
  // Start periodic cleanup of old events
  setInterval(() => {
    cleanupOldEvents();
  }, 30 * 60 * 1000); // Run every 30 minutes
  
  console.log('Security Event Correlation Engine initialized');
}

/**
 * Process a security event for correlation
 */
export function processSecurityEvent(event: SecurityEvent): void {
  // Add to recent events
  recentEvents.push(event);
  
  // Limit the number of events kept in memory
  if (recentEvents.length > MAX_EVENTS) {
    recentEvents.shift();
  }
  
  // Correlate events
  correlateEvents();
}

/**
 * Correlate security events to detect attacks
 */
function correlateEvents(): void {
  // For each rule, check if it matches
  for (const rule of correlationRules.values()) {
    // Skip disabled rules
    if (!rule.enabled) {
      continue;
    }
    
    // Apply the rule
    applyCorrelationRule(rule);
  }
}

/**
 * Apply a correlation rule to the recent events
 */
function applyCorrelationRule(rule: CorrelationRule): void {
  // Get events that match the rule's event types
  let matchingEvents = recentEvents;
  
  if (rule.conditions.eventTypes && rule.conditions.eventTypes.length > 0) {
    matchingEvents = matchingEvents.filter(event => 
      rule.conditions.eventTypes!.includes(event.type)
    );
  }
  
  // Filter by time window
  if (rule.conditions.timeWindowMs) {
    const cutoffTime = Date.now() - rule.conditions.timeWindowMs;
    matchingEvents = matchingEvents.filter(event => event.timestamp >= cutoffTime);
  }
  
  // If not enough events, skip
  if (rule.conditions.minEvents && matchingEvents.length < rule.conditions.minEvents) {
    return;
  }
  
  // Group events if necessary
  if (rule.conditions.groupBy && rule.conditions.groupBy.length > 0) {
    const groupedEvents: Record<string, SecurityEvent[]> = {};
    
    for (const event of matchingEvents) {
      // Create a key based on the groupBy fields
      const groupKey = rule.conditions.groupBy.map(field => 
        field === 'sourceIp' ? event.sourceIp :
        field === 'userId' ? event.userId :
        field === 'username' ? event.username : 
        JSON.stringify(event.details[field])
      ).join('|');
      
      if (!groupedEvents[groupKey]) {
        groupedEvents[groupKey] = [];
      }
      
      groupedEvents[groupKey].push(event);
    }
    
    // Check each group for patterns
    for (const [groupKey, events] of Object.entries(groupedEvents)) {
      if (rule.conditions.minEvents && events.length < rule.conditions.minEvents) {
        continue;
      }
      
      // Check for specific patterns
      if (rule.conditions.requiredPatterns && rule.conditions.requiredPatterns.length > 0) {
        // Sort events by timestamp
        events.sort((a, b) => a.timestamp - b.timestamp);
        
        for (const pattern of rule.conditions.requiredPatterns) {
          if (matchesPattern(events, pattern, rule)) {
            // Create an attack
            createAttackFromRule(rule, events, groupKey);
            break;
          }
        }
      } else {
        // No specific pattern required, just the count
        createAttackFromRule(rule, events, groupKey);
      }
    }
  } else if (rule.conditions.requiredPatterns && rule.conditions.requiredPatterns.length > 0) {
    // Sort events by timestamp
    matchingEvents.sort((a, b) => a.timestamp - b.timestamp);
    
    // Check for specific patterns without grouping
    for (const pattern of rule.conditions.requiredPatterns) {
      if (matchesPattern(matchingEvents, pattern, rule)) {
        createAttackFromRule(rule, matchingEvents, 'global');
        break;
      }
    }
  } else {
    // No grouping or specific patterns, just check the count
    createAttackFromRule(rule, matchingEvents, 'global');
  }
}

/**
 * Check if events match a specific pattern
 */
function matchesPattern(events: SecurityEvent[], pattern: string, rule: CorrelationRule): boolean {
  switch (pattern) {
    case 'multiple_failures_then_success':
      // Find failures followed by success for the same user
      const userIds = new Set<string>();
      const failuresByUser: Record<string, SecurityEvent[]> = {};
      
      // Collect failures by user
      for (const event of events) {
        if (event.type === 'authentication_failure' && event.userId) {
          if (!failuresByUser[event.userId]) {
            failuresByUser[event.userId] = [];
          }
          failuresByUser[event.userId].push(event);
          userIds.add(event.userId);
        }
      }
      
      // Check for successful login after failures
      for (const userId of userIds) {
        if (failuresByUser[userId] && failuresByUser[userId].length >= 3) {
          // Find successful login after the failures
          const lastFailureTime = Math.max(...failuresByUser[userId].map(e => e.timestamp));
          
          const successAfterFailure = events.find(e => 
            e.type === 'authentication_success' &&
            e.userId === userId &&
            e.timestamp > lastFailureTime
          );
          
          if (successAfterFailure) {
            return true;
          }
        }
      }
      return false;
      
    case 'honeypot_then_attack':
      // Find honeypot triggers followed by attack attempts from the same IP
      const honeypotEvents = events.filter(e => e.type === 'honeypot_trigger');
      const honeypotIps = new Set(honeypotEvents.map(e => e.sourceIp).filter(Boolean));
      
      for (const ip of honeypotIps) {
        // Find the latest honeypot trigger time for this IP
        const latestHoneypotTime = Math.max(
          ...honeypotEvents
            .filter(e => e.sourceIp === ip)
            .map(e => e.timestamp)
        );
        
        // Check for attack events after the honeypot trigger
        const attackEvents = events.filter(e => 
          e.sourceIp === ip &&
          e.timestamp > latestHoneypotTime &&
          (e.type === 'path_traversal' || e.type === 'sql_injection' || e.type === 'authentication_failure')
        );
        
        if (attackEvents.length > 0) {
          return true;
        }
      }
      return false;
      
    // Add more pattern matchers as needed
      
    default:
      return false;
  }
}

/**
 * Create an attack from a matched rule
 */
function createAttackFromRule(rule: CorrelationRule, events: SecurityEvent[], groupKey: string): void {
  // Update rule statistics
  rule.lastTriggered = Date.now();
  rule.triggerCount++;
  correlationRules.set(rule.id, rule);
  
  // Generate attack ID
  const attackId = `attack-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Determine source IP or user ID from events
  const sourceIp = events[0].sourceIp;
  const userId = events[0].userId;
  const username = events[0].username;
  
  // Create the attack object
  const attack: Attack = {
    id: attackId,
    ruleId: rule.id,
    ruleName: rule.name,
    type: rule.type,
    sourceIp,
    userId,
    eventIds: events.map(e => e.id),
    alertIds: events.filter(e => e.alertId).map(e => e.alertId!),
    detectedAt: Date.now(),
    confidence: calculateConfidence(rule, events),
    severity: rule.actions.alertSeverity || AlertSeverity.MEDIUM,
    description: formatAlertMessage(rule.actions.alertMessage || rule.description, {
      count: events.length.toString(),
      sourceIp: sourceIp || 'unknown',
      userId: userId || 'unknown',
      username: username || 'unknown',
      timeWindow: (rule.conditions.timeWindowMs ? (rule.conditions.timeWindowMs / (60 * 1000)) : 0).toString()
    }),
    status: 'new'
  };
  
  // Store the attack
  detectedAttacks.set(attackId, attack);
  
  // Log the attack detection
  logSecurityEvent(
    'system',
    'Correlated attack detected',
    {
      attackId,
      ruleId: rule.id,
      ruleName: rule.name,
      eventCount: events.length,
      sourceIp,
      userId
    },
    'system'
  );
  
  // Send alert
  sendAlert(
    attack.severity,
    AlertType.CORRELATION,
    attack.description,
    {
      attackId,
      ruleId: rule.id,
      ruleName: rule.name,
      sourceIp,
      userId,
      eventCount: events.length
    },
    userId,
    sourceIp
  );
  
  // Create incident if configured
  if (rule.actions.createIncident) {
    const incidentType = rule.actions.incidentType || IncidentType.SUSPICIOUS_ACTIVITY;
    
    const incident = createSecurityIncident(
      incidentType,
      attack.severity,
      attack.description,
      {
        attackId,
        ruleId: rule.id,
        ruleName: rule.name,
        correlatedEvents: events.map(e => ({
          id: e.id,
          type: e.type,
          timestamp: e.timestamp
        }))
      },
      sourceIp,
      userId
    );
    
    // Link incident to attack
    attack.incidentId = incident.id;
    detectedAttacks.set(attackId, attack);
  }
}

/**
 * Calculate confidence score for a correlation
 */
function calculateConfidence(rule: CorrelationRule, events: SecurityEvent[]): number {
  // Start with base confidence
  let confidence = 0.7;
  
  // Adjust based on number of events (more events = higher confidence)
  const eventCountFactor = Math.min(1, events.length / 10);
  confidence += eventCountFactor * 0.1;
  
  // Adjust based on time span (shorter time span = higher confidence)
  if (events.length > 1) {
    const timeSpanMs = Math.max(...events.map(e => e.timestamp)) - Math.min(...events.map(e => e.timestamp));
    const timeWindowMs = rule.conditions.timeWindowMs || 24 * 60 * 60 * 1000;
    const timeSpanFactor = 1 - Math.min(1, timeSpanMs / timeWindowMs);
    confidence += timeSpanFactor * 0.1;
  }
  
  // Adjust based on IP reputation (if available)
  // This would be implemented in a real system
  
  // Adjust based on user risk score (if available)
  // This would be implemented in a real system
  
  // Cap at 0.99
  return Math.min(0.99, confidence);
}

/**
 * Format an alert message with variables
 */
function formatAlertMessage(message: string, variables: Record<string, string>): string {
  let formattedMessage = message;
  
  for (const [key, value] of Object.entries(variables)) {
    formattedMessage = formattedMessage.replace(new RegExp(`%${key}%`, 'g'), value);
  }
  
  return formattedMessage;
}

/**
 * Clean up old events
 */
function cleanupOldEvents(): void {
  const cutoffTime = Date.now() - MAX_EVENT_AGE;
  const initialCount = recentEvents.length;
  
  // Remove events older than the cutoff time
  for (let i = recentEvents.length - 1; i >= 0; i--) {
    if (recentEvents[i].timestamp < cutoffTime) {
      recentEvents.splice(i, 1);
    }
  }
  
  const removedCount = initialCount - recentEvents.length;
  
  if (removedCount > 0) {
    logSecurityEvent(
      'system',
      'Cleaned up old security events',
      {
        removedCount,
        remainingCount: recentEvents.length
      },
      'system'
    );
  }
}

/**
 * Get all correlation rules
 */
export function getAllCorrelationRules(): CorrelationRule[] {
  return Array.from(correlationRules.values());
}

/**
 * Get a specific correlation rule
 */
export function getCorrelationRule(ruleId: string): CorrelationRule | undefined {
  return correlationRules.get(ruleId);
}

/**
 * Add or update a correlation rule
 */
export function saveCorrelationRule(rule: CorrelationRule, updatedBy: string): CorrelationRule {
  // Set updated timestamp
  rule.updatedAt = Date.now();
  
  // If new rule, set created timestamp and trigger count
  if (!rule.createdAt) {
    rule.createdAt = Date.now();
    rule.triggerCount = 0;
  }
  
  // Store the rule
  correlationRules.set(rule.id, rule);
  
  // Log the update
  logSecurityEvent(
    updatedBy,
    'Correlation rule saved',
    {
      ruleId: rule.id,
      ruleName: rule.name,
      enabled: rule.enabled
    },
    'system'
  );
  
  return rule;
}

/**
 * Delete a correlation rule
 */
export function deleteCorrelationRule(ruleId: string, deletedBy: string): boolean {
  const rule = correlationRules.get(ruleId);
  if (!rule) return false;
  
  // Delete the rule
  correlationRules.delete(ruleId);
  
  // Log the deletion
  logSecurityEvent(
    deletedBy,
    'Correlation rule deleted',
    {
      ruleId,
      ruleName: rule.name
    },
    'system'
  );
  
  return true;
}

/**
 * Get all detected attacks
 */
export function getAllAttacks(
  filters?: {
    status?: 'new' | 'investigating' | 'mitigated' | 'resolved' | 'false_positive';
    sourceIp?: string;
    userId?: string;
    ruleId?: string;
    severity?: AlertSeverity;
  }
): Attack[] {
  let attacks = Array.from(detectedAttacks.values());
  
  // Apply filters if provided
  if (filters) {
    if (filters.status) {
      attacks = attacks.filter(a => a.status === filters.status);
    }
    
    if (filters.sourceIp) {
      attacks = attacks.filter(a => a.sourceIp === filters.sourceIp);
    }
    
    if (filters.userId) {
      attacks = attacks.filter(a => a.userId === filters.userId);
    }
    
    if (filters.ruleId) {
      attacks = attacks.filter(a => a.ruleId === filters.ruleId);
    }
    
    if (filters.severity) {
      attacks = attacks.filter(a => a.severity === filters.severity);
    }
  }
  
  // Sort by detection time, most recent first
  attacks.sort((a, b) => b.detectedAt - a.detectedAt);
  
  return attacks;
}

/**
 * Get a specific attack
 */
export function getAttack(attackId: string): Attack | undefined {
  return detectedAttacks.get(attackId);
}

/**
 * Update attack status
 */
export function updateAttackStatus(
  attackId: string,
  status: 'new' | 'investigating' | 'mitigated' | 'resolved' | 'false_positive',
  updatedBy: string,
  notes?: string
): boolean {
  const attack = detectedAttacks.get(attackId);
  if (!attack) return false;
  
  // Update status
  attack.status = status;
  
  // If resolved or false positive, set resolved info
  if (status === 'resolved' || status === 'false_positive') {
    attack.resolvedBy = updatedBy;
    attack.resolvedAt = Date.now();
  }
  
  // Add notes if provided
  if (notes) {
    if (!attack.notes) attack.notes = [];
    attack.notes.push(`[${new Date().toISOString()}] [${updatedBy}] ${notes}`);
  }
  
  // Save attack
  detectedAttacks.set(attackId, attack);
  
  // Log the update
  logSecurityEvent(
    updatedBy,
    'Attack status updated',
    {
      attackId,
      newStatus: status,
      notes
    },
    'system'
  );
  
  return true;
}

/**
 * Assign an attack to a user for investigation
 */
export function assignAttack(
  attackId: string,
  assignedTo: string,
  assignedBy: string,
  notes?: string
): boolean {
  const attack = detectedAttacks.get(attackId);
  if (!attack) return false;
  
  // Update assignment
  attack.assignedTo = assignedTo;
  
  // Update status if it's new
  if (attack.status === 'new') {
    attack.status = 'investigating';
  }
  
  // Add notes if provided
  if (notes) {
    if (!attack.notes) attack.notes = [];
    attack.notes.push(`[${new Date().toISOString()}] [${assignedBy}] Assigned to ${assignedTo}: ${notes}`);
  }
  
  // Save attack
  detectedAttacks.set(attackId, attack);
  
  // Log the assignment
  logSecurityEvent(
    assignedBy,
    'Attack assigned for investigation',
    {
      attackId,
      assignedTo,
      notes
    },
    'system'
  );
  
  return true;
}

/**
 * Process a security alert for correlation
 */
export function processSecurityAlert(alert: SecurityAlert): void {
  // Create a security event from the alert
  const event: SecurityEvent = {
    id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: alert.type.toLowerCase(),
    timestamp: Date.now(),
    sourceIp: alert.sourceIp,
    userId: alert.userId,
    details: alert.details,
    alertId: alert.id
  };
  
  // Process the event
  processSecurityEvent(event);
}