/**
 * Sentinel 4.5 Security Incident Response Automation
 * 
 * This module handles automated responses to security incidents,
 * implementing predefined workflows for different types of threats.
 */

import { sendAlert, AlertSeverity, AlertType, SecurityAlert } from './alert-system';
import { logSecurityEvent, logAuditEvent } from './audit-log';
import { blockIP } from './ip-blocker';
import { disableTwoFactor } from './two-factor-auth';
import { getUserRiskScore, resetUserRiskScore } from './user-behavior';
import { NextFunction, Request, Response } from 'express';
import fetch from 'node-fetch';
import { DISCORD_WEBHOOK, ALERT_EMAIL } from './config';

// Incident types with response actions
export enum IncidentType {
  BRUTE_FORCE = 'brute_force',
  ACCOUNT_TAKEOVER = 'account_takeover',
  DATA_EXFILTRATION = 'data_exfiltration',
  API_ABUSE = 'api_abuse',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  FILE_UPLOAD_ABUSE = 'file_upload_abuse',
  XSS_ATTEMPT = 'xss_attempt',
  SQL_INJECTION = 'sql_injection',
  HONEYPOT_TRIGGERED = 'honeypot_triggered',
  SYSTEM_MISCONFIGURATION = 'system_misconfiguration'
}

// Response action status
export enum ResponseStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REQUIRES_APPROVAL = 'requires_approval'
}

// Response action with status
interface ResponseAction {
  id: string;
  name: string;
  description: string;
  status: ResponseStatus;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  incident: SecurityIncident;
  result?: any;
  error?: string;
  approvedBy?: string;
  approvedAt?: number;
}

// Security incident record
export interface SecurityIncident {
  id: string;
  type: IncidentType;
  severity: AlertSeverity;
  summary: string;
  details: any;
  timestamp: number;
  sourceIP?: string;
  user?: string;
  status: 'open' | 'mitigated' | 'resolved' | 'false_positive';
  alert?: SecurityAlert;
  relatedIncidents?: string[];
  actions: ResponseAction[];
  assignedTo?: string;
  resolvedBy?: string;
  resolvedAt?: number;
  notes?: string[];
}

// Store security incidents
const securityIncidents: Map<string, SecurityIncident> = new Map();

// Store response actions
const responseActions: Map<string, ResponseAction> = new Map();

// Default response workflows by incident type
const defaultResponseWorkflows: Record<IncidentType, Array<{
  name: string;
  description: string;
  handler: (incident: SecurityIncident) => Promise<any>;
  requiresApproval: boolean;
}>> = {
  [IncidentType.BRUTE_FORCE]: [
    {
      name: 'Block Source IP',
      description: 'Automatically block the source IP address',
      requiresApproval: false,
      handler: async (incident) => {
        if (!incident.sourceIP) throw new Error('No source IP available');
        return blockIP(incident.sourceIP, 'Brute force attack detected');
      }
    },
    {
      name: 'Lock User Account',
      description: 'Temporarily lock the affected user account',
      requiresApproval: true,
      handler: async (incident) => {
        if (!incident.user) throw new Error('No user specified');
        // This would be replaced with actual account locking code
        return { accountLocked: true, user: incident.user };
      }
    },
    {
      name: 'Send Notification',
      description: 'Send notification to security team',
      requiresApproval: false,
      handler: async (incident) => {
        return sendSecurityNotification(
          `Brute Force Attack Detected: ${incident.summary}`,
          formatIncidentDetails(incident)
        );
      }
    }
  ],
  
  [IncidentType.ACCOUNT_TAKEOVER]: [
    {
      name: 'Force Password Reset',
      description: 'Force a password reset for the affected account',
      requiresApproval: false,
      handler: async (incident) => {
        if (!incident.user) throw new Error('No user specified');
        // This would be replaced with actual password reset code
        return { passwordResetInitiated: true, user: incident.user };
      }
    },
    {
      name: 'Invalidate Sessions',
      description: 'Invalidate all active sessions for the user',
      requiresApproval: false,
      handler: async (incident) => {
        if (!incident.user) throw new Error('No user specified');
        // This would be replaced with actual session invalidation code
        return { sessionsInvalidated: true, user: incident.user };
      }
    },
    {
      name: 'Reset 2FA',
      description: 'Reset two-factor authentication for the account',
      requiresApproval: true,
      handler: async (incident) => {
        if (!incident.user) throw new Error('No user specified');
        return disableTwoFactor(incident.user);
      }
    }
  ],
  
  [IncidentType.DATA_EXFILTRATION]: [
    {
      name: 'Throttle User Requests',
      description: 'Apply stricter rate limits to the user',
      requiresApproval: false,
      handler: async (incident) => {
        if (!incident.user) throw new Error('No user specified');
        // This would apply stricter rate limits
        return { rateLimit: 'strict', user: incident.user };
      }
    },
    {
      name: 'Block Data Access',
      description: 'Temporarily block access to sensitive data',
      requiresApproval: true,
      handler: async (incident) => {
        if (!incident.user) throw new Error('No user specified');
        // This would block access to sensitive data
        return { dataAccessBlocked: true, user: incident.user };
      }
    },
    {
      name: 'Send High Priority Alert',
      description: 'Send high priority alert to security team',
      requiresApproval: false,
      handler: async (incident) => {
        return sendSecurityNotification(
          `URGENT: Data Exfiltration Detected: ${incident.summary}`,
          formatIncidentDetails(incident),
          true
        );
      }
    }
  ],
  
  [IncidentType.API_ABUSE]: [
    {
      name: 'Disable API Key',
      description: 'Temporarily disable the abused API key',
      requiresApproval: false,
      handler: async (incident) => {
        const apiKey = incident.details.apiKey;
        if (!apiKey) throw new Error('No API key specified');
        // This would disable the API key
        return { apiKeyDisabled: true, key: apiKey };
      }
    },
    {
      name: 'Block Source IP',
      description: 'Block the source IP address',
      requiresApproval: false,
      handler: async (incident) => {
        if (!incident.sourceIP) throw new Error('No source IP available');
        return blockIP(incident.sourceIP, 'API abuse detected');
      }
    }
  ],
  
  [IncidentType.SUSPICIOUS_ACTIVITY]: [
    {
      name: 'Increase Risk Score',
      description: 'Increase user risk score for monitoring',
      requiresApproval: false,
      handler: async (incident) => {
        if (!incident.user) throw new Error('No user specified');
        // In a real implementation, you would update the risk score
        return { riskScoreIncreased: true, user: incident.user };
      }
    },
    {
      name: 'Enable Enhanced Monitoring',
      description: 'Apply enhanced monitoring to the user',
      requiresApproval: false,
      handler: async (incident) => {
        if (!incident.user) throw new Error('No user specified');
        // This would enable enhanced monitoring
        return { enhancedMonitoring: true, user: incident.user };
      }
    }
  ],
  
  [IncidentType.FILE_UPLOAD_ABUSE]: [
    {
      name: 'Quarantine File',
      description: 'Move the file to quarantine for further analysis',
      requiresApproval: false,
      handler: async (incident) => {
        const filePath = incident.details.filePath;
        if (!filePath) throw new Error('No file path specified');
        // This would quarantine the file
        return { fileQuarantined: true, path: filePath };
      }
    },
    {
      name: 'Block Upload Capability',
      description: 'Temporarily block the user from uploading files',
      requiresApproval: true,
      handler: async (incident) => {
        if (!incident.user) throw new Error('No user specified');
        // This would block upload capability
        return { uploadBlocked: true, user: incident.user };
      }
    }
  ],
  
  [IncidentType.XSS_ATTEMPT]: [
    {
      name: 'Sanitize User Input',
      description: 'Apply additional sanitization to user input',
      requiresApproval: false,
      handler: async (incident) => {
        if (!incident.user) throw new Error('No user specified');
        // This would enable additional input sanitization
        return { sanitizationEnhanced: true, user: incident.user };
      }
    },
    {
      name: 'Block User Session',
      description: 'Terminate and block the current user session',
      requiresApproval: false, 
      handler: async (incident) => {
        if (!incident.user) throw new Error('No user specified');
        // This would block the session
        return { sessionBlocked: true, user: incident.user };
      }
    }
  ],
  
  [IncidentType.SQL_INJECTION]: [
    {
      name: 'Block Database Access',
      description: 'Temporarily block database access for the user',
      requiresApproval: true,
      handler: async (incident) => {
        if (!incident.user) throw new Error('No user specified');
        // This would block database access
        return { databaseAccessBlocked: true, user: incident.user };
      }
    },
    {
      name: 'Apply Query Sanitization',
      description: 'Apply additional query sanitization for the user',
      requiresApproval: false,
      handler: async (incident) => {
        if (!incident.user) throw new Error('No user specified');
        // This would enable additional query sanitization
        return { querySanitizationEnhanced: true, user: incident.user };
      }
    },
    {
      name: 'Send Critical Alert',
      description: 'Send critical alert to security team',
      requiresApproval: false,
      handler: async (incident) => {
        return sendSecurityNotification(
          `CRITICAL: SQL Injection Attempt: ${incident.summary}`,
          formatIncidentDetails(incident),
          true
        );
      }
    }
  ],
  
  [IncidentType.HONEYPOT_TRIGGERED]: [
    {
      name: 'Block Source IP',
      description: 'Block the source IP address',
      requiresApproval: false,
      handler: async (incident) => {
        if (!incident.sourceIP) throw new Error('No source IP available');
        return blockIP(incident.sourceIP, 'Honeypot triggered');
      }
    },
    {
      name: 'Add to Watchlist',
      description: 'Add the IP to a security watchlist',
      requiresApproval: false,
      handler: async (incident) => {
        if (!incident.sourceIP) throw new Error('No source IP available');
        // This would add the IP to a watchlist
        return { addedToWatchlist: true, ip: incident.sourceIP };
      }
    }
  ],
  
  [IncidentType.SYSTEM_MISCONFIGURATION]: [
    {
      name: 'Apply Default Configuration',
      description: 'Revert to default secure configuration',
      requiresApproval: true,
      handler: async (incident) => {
        const component = incident.details.component;
        if (!component) throw new Error('No component specified');
        // This would apply default configuration
        return { defaultConfigApplied: true, component };
      }
    },
    {
      name: 'Notify Administrator',
      description: 'Send notification to system administrator',
      requiresApproval: false,
      handler: async (incident) => {
        return sendSecurityNotification(
          `System Misconfiguration Detected: ${incident.summary}`,
          formatIncidentDetails(incident)
        );
      }
    }
  ]
};

/**
 * Format incident details for notifications
 */
function formatIncidentDetails(incident: SecurityIncident): string {
  return `
Incident ID: ${incident.id}
Type: ${incident.type}
Severity: ${incident.severity}
Timestamp: ${new Date(incident.timestamp).toISOString()}
User: ${incident.user || 'N/A'}
Source IP: ${incident.sourceIP || 'N/A'}
Status: ${incident.status}

Summary: ${incident.summary}

Details:
${JSON.stringify(incident.details, null, 2)}

Actions:
${incident.actions.map(a => `- ${a.name}: ${a.status}`).join('\n')}
`;
}

/**
 * Send a security notification
 */
async function sendSecurityNotification(
  subject: string,
  message: string,
  highPriority: boolean = false
): Promise<any> {
  // Log the notification
  logSecurityEvent(
    'system',
    `Security notification sent: ${subject}`,
    { highPriority },
    'system'
  );
  
  // This would send an email in a real implementation
  console.log(`[Security Notification] ${highPriority ? 'HIGH PRIORITY: ' : ''}${subject}`);
  console.log(message);
  
  // If Discord webhook is configured, send notification
  if (DISCORD_WEBHOOK) {
    try {
      await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: highPriority ? '@here ' : '',
          embeds: [{
            title: subject,
            description: message.length > 2000 ? message.substring(0, 1997) + '...' : message,
            color: highPriority ? 16711680 : 15105570, // Red or orange
            timestamp: new Date().toISOString()
          }]
        })
      });
    } catch (error) {
      console.error('Error sending Discord notification:', error);
    }
  }
  
  return { notificationSent: true, subject };
}

/**
 * Create a new security incident
 */
export function createSecurityIncident(
  type: IncidentType,
  severity: AlertSeverity,
  summary: string,
  details: any,
  sourceIP?: string,
  user?: string,
  alert?: SecurityAlert
): SecurityIncident {
  // Generate a unique ID
  const id = `INC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const timestamp = Date.now();
  
  // Create the incident record
  const incident: SecurityIncident = {
    id,
    type,
    severity,
    summary,
    details,
    timestamp,
    sourceIP,
    user,
    status: 'open',
    alert,
    actions: []
  };
  
  // Store the incident
  securityIncidents.set(id, incident);
  
  // Log the incident creation
  logSecurityEvent(
    'system',
    `Security incident created: ${summary}`,
    { incidentId: id, type, severity },
    sourceIP || 'system'
  );
  
  // Create automated response actions based on incident type
  createResponseActions(incident);
  
  return incident;
}

/**
 * Create response actions for an incident
 */
function createResponseActions(incident: SecurityIncident): void {
  // Get default workflow for this incident type
  const workflow = defaultResponseWorkflows[incident.type];
  if (!workflow) return;
  
  // Create response actions
  for (const action of workflow) {
    const actionId = `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = Date.now();
    
    const responseAction: ResponseAction = {
      id: actionId,
      name: action.name,
      description: action.description,
      status: action.requiresApproval ? ResponseStatus.REQUIRES_APPROVAL : ResponseStatus.PENDING,
      createdAt: now,
      updatedAt: now,
      incident
    };
    
    // Add action to incident
    incident.actions.push(responseAction);
    
    // Store the action
    responseActions.set(actionId, responseAction);
    
    // Execute actions that don't require approval
    if (!action.requiresApproval) {
      executeResponseAction(actionId, action.handler);
    }
  }
  
  // Update the incident with actions
  securityIncidents.set(incident.id, incident);
}

/**
 * Execute a response action
 */
async function executeResponseAction(
  actionId: string,
  handler: (incident: SecurityIncident) => Promise<any>
): Promise<void> {
  // Get the action
  const action = responseActions.get(actionId);
  if (!action) return;
  
  // Update status to in progress
  action.status = ResponseStatus.IN_PROGRESS;
  action.updatedAt = Date.now();
  responseActions.set(actionId, action);
  
  try {
    // Execute the handler
    const result = await handler(action.incident);
    
    // Update action with result
    action.status = ResponseStatus.COMPLETED;
    action.completedAt = Date.now();
    action.updatedAt = Date.now();
    action.result = result;
    
    // Log the successful action
    logAuditEvent(
      'system',
      `Security response action completed: ${action.name}`,
      { 
        incidentId: action.incident.id,
        actionId,
        result
      },
      'system'
    );
  } catch (error) {
    // Update action with error
    action.status = ResponseStatus.FAILED;
    action.updatedAt = Date.now();
    action.error = error.message;
    
    // Log the failed action
    logSecurityEvent(
      'system',
      `Security response action failed: ${action.name}`,
      { 
        incidentId: action.incident.id,
        actionId,
        error: error.message
      },
      'system'
    );
  }
  
  // Update the action
  responseActions.set(actionId, action);
  
  // Check if all actions are completed or failed
  const incident = action.incident;
  const allActionsComplete = incident.actions.every(a => 
    a.status === ResponseStatus.COMPLETED || 
    a.status === ResponseStatus.FAILED ||
    a.status === ResponseStatus.REQUIRES_APPROVAL
  );
  
  // If all actions are complete, update incident status
  if (allActionsComplete) {
    const anySuccessful = incident.actions.some(a => a.status === ResponseStatus.COMPLETED);
    
    if (anySuccessful) {
      incident.status = 'mitigated';
      
      // Log the mitigation
      logSecurityEvent(
        'system',
        `Security incident mitigated: ${incident.summary}`,
        { incidentId: incident.id },
        'system'
      );
    }
    
    // Update the incident
    securityIncidents.set(incident.id, incident);
  }
}

/**
 * Approve a response action that requires approval
 */
export function approveResponseAction(actionId: string, approvedBy: string): boolean {
  // Get the action
  const action = responseActions.get(actionId);
  if (!action) return false;
  
  // Check if action requires approval
  if (action.status !== ResponseStatus.REQUIRES_APPROVAL) return false;
  
  // Update approval information
  action.approvedBy = approvedBy;
  action.approvedAt = Date.now();
  action.status = ResponseStatus.PENDING;
  action.updatedAt = Date.now();
  
  // Update the action
  responseActions.set(actionId, action);
  
  // Log the approval
  logAuditEvent(
    approvedBy,
    `Security response action approved: ${action.name}`,
    { 
      incidentId: action.incident.id,
      actionId
    },
    'system'
  );
  
  // Get the workflow for this incident type
  const workflow = defaultResponseWorkflows[action.incident.type];
  if (!workflow) return true;
  
  // Find the matching handler
  const workflowAction = workflow.find(wa => wa.name === action.name);
  if (!workflowAction) return true;
  
  // Execute the action
  executeResponseAction(actionId, workflowAction.handler);
  
  return true;
}

/**
 * Resolve a security incident
 */
export function resolveSecurityIncident(incidentId: string, resolvedBy: string, notes?: string): boolean {
  // Get the incident
  const incident = securityIncidents.get(incidentId);
  if (!incident) return false;
  
  // Update incident status
  incident.status = 'resolved';
  incident.resolvedBy = resolvedBy;
  incident.resolvedAt = Date.now();
  
  if (notes) {
    if (!incident.notes) incident.notes = [];
    incident.notes.push(notes);
  }
  
  // Update the incident
  securityIncidents.set(incidentId, incident);
  
  // Log the resolution
  logAuditEvent(
    resolvedBy,
    `Security incident resolved: ${incident.summary}`,
    { 
      incidentId,
      notes
    },
    'system'
  );
  
  // Clear user risk score if applicable
  if (incident.user) {
    resetUserRiskScore(incident.user);
  }
  
  return true;
}

/**
 * Mark a security incident as a false positive
 */
export function markAsfalsePositive(incidentId: string, markedBy: string, notes?: string): boolean {
  // Get the incident
  const incident = securityIncidents.get(incidentId);
  if (!incident) return false;
  
  // Update incident status
  incident.status = 'false_positive';
  incident.resolvedBy = markedBy;
  incident.resolvedAt = Date.now();
  
  if (notes) {
    if (!incident.notes) incident.notes = [];
    incident.notes.push(notes);
  }
  
  // Update the incident
  securityIncidents.set(incidentId, incident);
  
  // Log the false positive
  logAuditEvent(
    markedBy,
    `Security incident marked as false positive: ${incident.summary}`,
    { 
      incidentId,
      notes
    },
    'system'
  );
  
  // Clear user risk score if applicable
  if (incident.user) {
    resetUserRiskScore(incident.user);
  }
  
  return true;
}

/**
 * Get all security incidents
 */
export function getAllSecurityIncidents(): SecurityIncident[] {
  return Array.from(securityIncidents.values()).sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Get a specific security incident
 */
export function getSecurityIncident(incidentId: string): SecurityIncident | undefined {
  return securityIncidents.get(incidentId);
}

/**
 * Add a note to a security incident
 */
export function addIncidentNote(incidentId: string, note: string, addedBy: string): boolean {
  // Get the incident
  const incident = securityIncidents.get(incidentId);
  if (!incident) return false;
  
  // Initialize notes array if it doesn't exist
  if (!incident.notes) incident.notes = [];
  
  // Add the note with context
  const formattedNote = `[${new Date().toISOString()}] ${addedBy}: ${note}`;
  incident.notes.push(formattedNote);
  
  // Update the incident
  securityIncidents.set(incidentId, incident);
  
  // Log the note addition
  logAuditEvent(
    addedBy,
    `Note added to security incident`,
    { 
      incidentId,
      note
    },
    'system'
  );
  
  return true;
}

/**
 * Assign a security incident to a user
 */
export function assignSecurityIncident(incidentId: string, assignedTo: string, assignedBy: string): boolean {
  // Get the incident
  const incident = securityIncidents.get(incidentId);
  if (!incident) return false;
  
  // Update assignment
  incident.assignedTo = assignedTo;
  
  // Update the incident
  securityIncidents.set(incidentId, incident);
  
  // Log the assignment
  logAuditEvent(
    assignedBy,
    `Security incident assigned`,
    { 
      incidentId,
      assignedTo
    },
    'system'
  );
  
  return true;
}

/**
 * Middleware to detect and auto-respond to security threats
 */
export function securityResponseMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Store original res.end to intercept responses
  const originalEnd = res.end;
  
  // Override end method to check for security indicators after request is processed
  res.end = function(chunk?: any, encoding?: BufferEncoding | string, callback?: () => void): any {
    // Restore original end
    res.end = originalEnd;
    
    // Check for indicators of security issues
    const statusCode = res.statusCode;
    const path = req.path;
    const method = req.method;
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const user = (req as any).user?.username || 'anonymous';
    
    // Check for authentication failures
    if (statusCode === 401 && (path.includes('/login') || path.includes('/auth'))) {
      // Could be part of a brute force attack
      // This would be expanded in a real implementation with tracking of repeated failures
    }
    
    // Check for authorization failures
    if (statusCode === 403) {
      // Could indicate privilege escalation attempts
      // This would be expanded in a real implementation
    }
    
    // Check for signs of injection attempts in request parameters
    const possibleInjectionPatterns = [
      /SELECT.*FROM/i,
      /UNION.*SELECT/i,
      /INSERT.*INTO/i,
      /DROP.*TABLE/i,
      /<script>/i,
      /javascript:/i,
      /eval\(/i,
      /document\.cookie/i
    ];
    
    // Check query params, body, and headers for injection patterns
    const queryParams = req.query ? JSON.stringify(req.query) : '';
    const bodyContent = req.body ? JSON.stringify(req.body) : '';
    const headerContent = req.headers ? JSON.stringify(req.headers) : '';
    
    // Combine all content to check
    const contentToCheck = `${queryParams} ${bodyContent} ${headerContent}`;
    
    // Check for injection patterns
    for (const pattern of possibleInjectionPatterns) {
      if (pattern.test(contentToCheck)) {
        // Create an incident for possible injection attempt
        const type = pattern.toString().includes('SELECT') ? IncidentType.SQL_INJECTION : IncidentType.XSS_ATTEMPT;
        
        createSecurityIncident(
          type,
          AlertSeverity.HIGH,
          `Possible ${type === IncidentType.SQL_INJECTION ? 'SQL injection' : 'XSS'} attempt detected`,
          {
            path,
            method,
            pattern: pattern.toString(),
            matchedContent: contentToCheck.match(pattern)?.[0],
            statusCode
          },
          ip,
          user
        );
        
        break;
      }
    }
    
    // Call the original end
    return originalEnd.call(this, chunk, encoding as BufferEncoding, callback);
  };
  
  next();
}