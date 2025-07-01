/**
 * Sentinel 4.5 Alert System
 * 
 * This module defines the core alert types and severity levels
 * for the security system
 */

// Severity levels for security alerts
export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Types of security alerts
export enum AlertType {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  INJECTION = 'injection',
  SQL_INJECTION = 'sql_injection',
  XSS = 'xss',
  CSRF = 'csrf',
  RATE_LIMIT = 'rateLimit',
  FILE_UPLOAD = 'fileUpload',
  HONEYPOT = 'honeypot',
  SYSTEM = 'system',
  API_ABUSE = 'api_abuse',
  API_KEY = 'api_key',
  CORRELATION = 'correlation',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  THREAT_INTEL = 'threat_intel',
  COMPLIANCE = 'compliance',
  VULNERABILITY = 'vulnerability'
}

// Determine alert severity based on context
export function determineSeverity(context: any): AlertSeverity {
  if (context.criticalAsset || 
      context.sensitiveData || 
      context.adminAction || 
      context.attemptCount > 5) {
    return AlertSeverity.CRITICAL;
  }
  
  if (context.repeatedFailure || 
      context.suspiciousPattern || 
      context.sensitiveAction) {
    return AlertSeverity.HIGH;
  }
  
  if (context.unusual || context.unexpected) {
    return AlertSeverity.MEDIUM;
  }
  
  return AlertSeverity.LOW;
}

// Format an alert with all required fields
export function formatAlert(type: AlertType, message: string, details: any = {}, user?: string, ip?: string) {
  return {
    severity: details.severity || determineSeverity(details),
    type,
    message,
    details,
    timestamp: new Date().toISOString(),
    user: user || 'system',
    ip,
    userAgent: details.userAgent
  };
}

// SecurityAlert interface
export interface SecurityAlert {
  severity: AlertSeverity;
  type: AlertType;
  message: string;
  details: any;
  timestamp: string;
  user: string;
  ip?: string;
  userAgent?: string;
}

// Send a security alert
export function sendAlert(
  severity: AlertSeverity,
  type: AlertType, 
  message: string, 
  details: any = {}, 
  user?: string, 
  ip?: string
): void {
  const alert = formatAlert(type, message, { ...details, severity }, user, ip);
  console.log(`[SECURITY ALERT] ${severity.toUpperCase()} - ${type}: ${message}`);
  
  // In a real implementation, this would send the alert to a monitoring system,
  // security team, or other notification channels
  // For now, just log it
}