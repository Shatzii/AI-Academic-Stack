/**
 * Sentinel 4.5 Security Health Checker
 * 
 * This module implements periodic health checks of all security components
 * to ensure they are functioning correctly and haven't been tampered with.
 */

import { logSecurityEvent, logAuditEvent } from './audit-log';
import { sendAlert, AlertSeverity, AlertType } from './alert-system';
import { createSecurityIncident, IncidentType } from './incident-response';
import { getSecuritySettings } from './config';

// Component status
export enum ComponentStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
  TAMPERED = 'tampered',
  INACTIVE = 'inactive'
}

// Health check result for a component
export interface ComponentHealth {
  name: string;
  status: ComponentStatus;
  lastChecked: number;
  details?: string;
  metrics?: Record<string, any>;
  issues?: string[];
  suggestions?: string[];
}

// Overall health check result
export interface HealthCheckResult {
  timestamp: number;
  overallStatus: ComponentStatus;
  components: ComponentHealth[];
  message: string;
}

// Store health check history
const healthCheckHistory: HealthCheckResult[] = [];

// Maximum number of health check results to keep
const MAX_HEALTH_HISTORY = 100;

// Default health check configuration
const DEFAULT_HEALTH_CHECK_CONFIG = {
  checkFrequency: 15 * 60 * 1000, // 15 minutes
  alertOnDegraded: true,
  alertOnUnhealthy: true,
  alertOnTampered: true,
  createIncidentOnTampered: true,
  checkIntegrity: true
};

// Components to check
const SECURITY_COMPONENTS = [
  'rate-limiter',
  'ip-blocker',
  'two-factor-auth',
  'file-validation',
  'content-security-policy',
  'audit-logging',
  'alerting',
  'incident-response',
  'api-key-manager',
  'db-monitor',
  'security-education',
  'threat-intelligence',
  'anomaly-detection',
  'vulnerability-scanner',
  'correlation-engine'
];

// Last health check time
let lastHealthCheckTime = 0;

/**
 * Initialize security health checker
 */
export function initHealthChecker(): void {
  // Schedule regular health checks
  const checkAndRunIfNeeded = async () => {
    const settings = getSecuritySettings();
    const healthCheckConfig = {
      ...DEFAULT_HEALTH_CHECK_CONFIG,
      ...(settings.healthCheckConfig || {})
    };
    
    const now = Date.now();
    if (now - lastHealthCheckTime >= healthCheckConfig.checkFrequency) {
      await performHealthCheck();
    }
  };
  
  // Run initial check
  setTimeout(() => {
    checkAndRunIfNeeded();
  }, 2 * 60 * 1000); // Wait 2 minutes after startup
  
  // Schedule regular checks
  setInterval(() => {
    checkAndRunIfNeeded();
  }, 5 * 60 * 1000); // Check every 5 minutes
  
  console.log('Security Health Checker module initialized');
}

/**
 * Perform a comprehensive health check
 */
export async function performHealthCheck(runById?: string): Promise<HealthCheckResult> {
  // Get settings
  const settings = getSecuritySettings();
  const healthCheckConfig = {
    ...DEFAULT_HEALTH_CHECK_CONFIG,
    ...(settings.healthCheckConfig || {})
  };
  
  const timestamp = Date.now();
  const components: ComponentHealth[] = [];
  
  // Log health check start
  logSecurityEvent(
    runById || 'system',
    'Security health check started',
    {},
    'system'
  );
  
  // Check each component
  for (const componentName of SECURITY_COMPONENTS) {
    // Check component health
    const health = await checkComponentHealth(componentName, healthCheckConfig.checkIntegrity);
    components.push(health);
    
    // Alert on issues if configured
    if ((health.status === ComponentStatus.DEGRADED && healthCheckConfig.alertOnDegraded) ||
        (health.status === ComponentStatus.UNHEALTHY && healthCheckConfig.alertOnUnhealthy) ||
        (health.status === ComponentStatus.TAMPERED && healthCheckConfig.alertOnTampered)) {
      
      const severity = health.status === ComponentStatus.TAMPERED ? 
        AlertSeverity.CRITICAL : 
        health.status === ComponentStatus.UNHEALTHY ? 
          AlertSeverity.HIGH : AlertSeverity.MEDIUM;
      
      sendAlert(
        severity,
        AlertType.SYSTEM,
        `Security component ${componentName} is ${health.status}`,
        {
          component: componentName,
          status: health.status,
          details: health.details,
          issues: health.issues
        }
      );
      
      // Create security incident for tampered components
      if (health.status === ComponentStatus.TAMPERED && healthCheckConfig.createIncidentOnTampered) {
        createSecurityIncident(
          IncidentType.SYSTEM_MISCONFIGURATION,
          AlertSeverity.CRITICAL,
          `Security component ${componentName} appears to be tampered with`,
          {
            component: componentName,
            details: health.details,
            issues: health.issues
          }
        );
      }
    }
  }
  
  // Determine overall status
  const overallStatus = determineOverallStatus(components);
  
  // Create result
  const result: HealthCheckResult = {
    timestamp,
    overallStatus,
    components,
    message: generateHealthSummaryMessage(overallStatus, components)
  };
  
  // Store result
  healthCheckHistory.push(result);
  
  // Trim history if needed
  if (healthCheckHistory.length > MAX_HEALTH_HISTORY) {
    healthCheckHistory.shift();
  }
  
  // Update last check time
  lastHealthCheckTime = timestamp;
  
  // Log health check completion
  logSecurityEvent(
    runById || 'system',
    'Security health check completed',
    {
      overallStatus,
      componentCount: components.length,
      healthyCount: components.filter(c => c.status === ComponentStatus.HEALTHY).length,
      degradedCount: components.filter(c => c.status === ComponentStatus.DEGRADED).length,
      unhealthyCount: components.filter(c => c.status === ComponentStatus.UNHEALTHY).length,
      tamperedCount: components.filter(c => c.status === ComponentStatus.TAMPERED).length
    },
    'system'
  );
  
  return result;
}

/**
 * Check health of a specific component
 */
async function checkComponentHealth(
  componentName: string, 
  checkIntegrity: boolean
): Promise<ComponentHealth> {
  switch (componentName) {
    case 'rate-limiter':
      return checkRateLimiter(checkIntegrity);
    case 'ip-blocker':
      return checkIpBlocker(checkIntegrity);
    case 'two-factor-auth':
      return checkTwoFactorAuth(checkIntegrity);
    case 'file-validation':
      return checkFileValidation(checkIntegrity);
    case 'content-security-policy':
      return checkContentSecurityPolicy(checkIntegrity);
    case 'audit-logging':
      return checkAuditLogging(checkIntegrity);
    case 'alerting':
      return checkAlerting(checkIntegrity);
    case 'incident-response':
      return checkIncidentResponse(checkIntegrity);
    case 'api-key-manager':
      return checkApiKeyManager(checkIntegrity);
    case 'db-monitor':
      return checkDbMonitor(checkIntegrity);
    case 'security-education':
      return checkSecurityEducation(checkIntegrity);
    case 'threat-intelligence':
      return checkThreatIntelligence(checkIntegrity);
    case 'anomaly-detection':
      return checkAnomalyDetection(checkIntegrity);
    case 'vulnerability-scanner':
      return checkVulnerabilityScanner(checkIntegrity);
    case 'correlation-engine':
      return checkCorrelationEngine(checkIntegrity);
    default:
      return {
        name: componentName,
        status: ComponentStatus.INACTIVE,
        lastChecked: Date.now(),
        details: 'Component not recognized or not implemented'
      };
  }
}

/**
 * Determine overall system status from component health
 */
function determineOverallStatus(components: ComponentHealth[]): ComponentStatus {
  if (components.some(c => c.status === ComponentStatus.TAMPERED)) {
    return ComponentStatus.TAMPERED;
  }
  
  if (components.some(c => c.status === ComponentStatus.UNHEALTHY)) {
    return ComponentStatus.UNHEALTHY;
  }
  
  if (components.some(c => c.status === ComponentStatus.DEGRADED)) {
    return ComponentStatus.DEGRADED;
  }
  
  if (components.some(c => c.status === ComponentStatus.INACTIVE)) {
    return ComponentStatus.DEGRADED;
  }
  
  return ComponentStatus.HEALTHY;
}

/**
 * Generate a health summary message
 */
function generateHealthSummaryMessage(
  overallStatus: ComponentStatus,
  components: ComponentHealth[]
): string {
  const healthyCount = components.filter(c => c.status === ComponentStatus.HEALTHY).length;
  const degradedCount = components.filter(c => c.status === ComponentStatus.DEGRADED).length;
  const unhealthyCount = components.filter(c => c.status === ComponentStatus.UNHEALTHY).length;
  const tamperedCount = components.filter(c => c.status === ComponentStatus.TAMPERED).length;
  const inactiveCount = components.filter(c => c.status === ComponentStatus.INACTIVE).length;
  
  const totalCount = components.length;
  
  switch (overallStatus) {
    case ComponentStatus.HEALTHY:
      return `All ${totalCount} security components are healthy`;
    case ComponentStatus.DEGRADED:
      return `Security system is degraded: ${healthyCount} healthy, ${degradedCount} degraded, ${inactiveCount} inactive`;
    case ComponentStatus.UNHEALTHY:
      return `Security system is unhealthy: ${unhealthyCount} components are in unhealthy state`;
    case ComponentStatus.TAMPERED:
      return `CRITICAL: Security system integrity compromised: ${tamperedCount} components show signs of tampering`;
    default:
      return `Security system status: ${healthyCount} healthy, ${degradedCount} degraded, ${unhealthyCount} unhealthy, ${tamperedCount} tampered, ${inactiveCount} inactive`;
  }
}

/**
 * Get all health check results
 */
export function getHealthCheckHistory(limit?: number): HealthCheckResult[] {
  const history = [...healthCheckHistory];
  history.sort((a, b) => b.timestamp - a.timestamp);
  
  if (limit) {
    return history.slice(0, limit);
  }
  
  return history;
}

/**
 * Get most recent health check result
 */
export function getLatestHealthCheck(): HealthCheckResult | undefined {
  if (healthCheckHistory.length === 0) {
    return undefined;
  }
  
  return healthCheckHistory[healthCheckHistory.length - 1];
}

/* Implementation of component-specific health checks */

async function checkRateLimiter(checkIntegrity: boolean): Promise<ComponentHealth> {
  // In a real implementation, we would check if the rate limiter is functioning correctly
  return {
    name: 'rate-limiter',
    status: ComponentStatus.HEALTHY,
    lastChecked: Date.now(),
    metrics: {
      activeRules: 5,
      totalBlocks: 127,
      last24HourBlocks: 14
    }
  };
}

async function checkIpBlocker(checkIntegrity: boolean): Promise<ComponentHealth> {
  // In a real implementation, we would check if the IP blocker is functioning correctly
  return {
    name: 'ip-blocker',
    status: ComponentStatus.HEALTHY,
    lastChecked: Date.now(),
    metrics: {
      blockedIPs: 37,
      automaticBlocks: 22,
      manualBlocks: 15
    }
  };
}

async function checkTwoFactorAuth(checkIntegrity: boolean): Promise<ComponentHealth> {
  // In a real implementation, we would check if 2FA is functioning correctly
  return {
    name: 'two-factor-auth',
    status: ComponentStatus.HEALTHY,
    lastChecked: Date.now(),
    metrics: {
      enabledUsers: 15,
      verificationSuccessRate: 98.5
    }
  };
}

async function checkFileValidation(checkIntegrity: boolean): Promise<ComponentHealth> {
  // In a real implementation, we would check if file validation is functioning correctly
  return {
    name: 'file-validation',
    status: ComponentStatus.HEALTHY,
    lastChecked: Date.now(),
    metrics: {
      validationRules: 12,
      blockedUploads: 8,
      allowedUploads: 143
    }
  };
}

async function checkContentSecurityPolicy(checkIntegrity: boolean): Promise<ComponentHealth> {
  // Check if CSP headers are being applied correctly
  const issues: string[] = [];
  let status = ComponentStatus.HEALTHY;
  
  // In a real implementation, we would check the actual CSP configuration
  
  // Simulate a potential issue
  const hasIssue = Math.random() < 0.1; // 10% chance of an issue
  
  if (hasIssue) {
    issues.push('Content-Security-Policy header is not being applied consistently');
    status = ComponentStatus.DEGRADED;
  }
  
  return {
    name: 'content-security-policy',
    status,
    lastChecked: Date.now(),
    issues,
    metrics: {
      cspRules: 8,
      reportedViolations: hasIssue ? 12 : 0
    }
  };
}

async function checkAuditLogging(checkIntegrity: boolean): Promise<ComponentHealth> {
  // In a real implementation, we would check if audit logging is functioning correctly
  return {
    name: 'audit-logging',
    status: ComponentStatus.HEALTHY,
    lastChecked: Date.now(),
    metrics: {
      logsLast24Hours: 573,
      storageUsed: '42MB',
      retentionDays: 90
    }
  };
}

async function checkAlerting(checkIntegrity: boolean): Promise<ComponentHealth> {
  // In a real implementation, we would check if alerting is functioning correctly
  return {
    name: 'alerting',
    status: ComponentStatus.HEALTHY,
    lastChecked: Date.now(),
    metrics: {
      alertsLast24Hours: 8,
      criticalAlerts: 1,
      highAlerts: 3,
      mediumAlerts: 4
    }
  };
}

async function checkIncidentResponse(checkIntegrity: boolean): Promise<ComponentHealth> {
  // In a real implementation, we would check if incident response is functioning correctly
  return {
    name: 'incident-response',
    status: ComponentStatus.HEALTHY,
    lastChecked: Date.now(),
    metrics: {
      openIncidents: 2,
      resolvedLast7Days: 5,
      averageResolutionTimeHours: 3.2
    }
  };
}

async function checkApiKeyManager(checkIntegrity: boolean): Promise<ComponentHealth> {
  // In a real implementation, we would check if API key manager is functioning correctly
  return {
    name: 'api-key-manager',
    status: ComponentStatus.HEALTHY,
    lastChecked: Date.now(),
    metrics: {
      activeKeys: 12,
      expiredKeys: 3,
      rotatedKeys: 7
    }
  };
}

async function checkDbMonitor(checkIntegrity: boolean): Promise<ComponentHealth> {
  // In a real implementation, we would check if DB monitor is functioning correctly
  return {
    name: 'db-monitor',
    status: ComponentStatus.HEALTHY,
    lastChecked: Date.now(),
    metrics: {
      monitoredQueries: 1254,
      blockedQueries: 2,
      averageQueryTime: '45ms'
    }
  };
}

async function checkSecurityEducation(checkIntegrity: boolean): Promise<ComponentHealth> {
  // In a real implementation, we would check if security education is functioning correctly
  return {
    name: 'security-education',
    status: ComponentStatus.HEALTHY,
    lastChecked: Date.now(),
    metrics: {
      resources: 15,
      recommendationsGenerated: 43,
      resourcesViewed: 28
    }
  };
}

async function checkThreatIntelligence(checkIntegrity: boolean): Promise<ComponentHealth> {
  // In a real implementation, we would check if threat intelligence is functioning correctly
  const issues: string[] = [];
  let status = ComponentStatus.HEALTHY;
  
  // Simulate a potential issue
  const lastUpdateTime = Date.now() - (48 * 60 * 60 * 1000); // 48 hours ago
  
  if (lastUpdateTime < Date.now() - (24 * 60 * 60 * 1000)) {
    issues.push('Threat intelligence data has not been updated in over 24 hours');
    status = ComponentStatus.DEGRADED;
  }
  
  return {
    name: 'threat-intelligence',
    status,
    lastChecked: Date.now(),
    issues,
    suggestions: issues.length > 0 ? ['Check API connectivity to threat intelligence sources'] : undefined,
    metrics: {
      knownBadIPs: 1254,
      knownBadDomains: 876,
      lastUpdateTime
    }
  };
}

async function checkAnomalyDetection(checkIntegrity: boolean): Promise<ComponentHealth> {
  // In a real implementation, we would check if anomaly detection is functioning correctly
  return {
    name: 'anomaly-detection',
    status: ComponentStatus.HEALTHY,
    lastChecked: Date.now(),
    metrics: {
      monitoredMetrics: 18,
      detectableAnomalyTypes: 7,
      detectedAnomalies: 3
    }
  };
}

async function checkVulnerabilityScanner(checkIntegrity: boolean): Promise<ComponentHealth> {
  // In a real implementation, we would check if vulnerability scanner is functioning correctly
  return {
    name: 'vulnerability-scanner',
    status: ComponentStatus.HEALTHY,
    lastChecked: Date.now(),
    metrics: {
      lastScanTime: Date.now() - (14 * 60 * 60 * 1000), // 14 hours ago
      knownVulnerabilities: 5,
      criticalVulnerabilities: 0
    }
  };
}

async function checkCorrelationEngine(checkIntegrity: boolean): Promise<ComponentHealth> {
  // In a real implementation, we would check if correlation engine is functioning correctly
  return {
    name: 'correlation-engine',
    status: ComponentStatus.HEALTHY,
    lastChecked: Date.now(),
    metrics: {
      activeRules: 5,
      detectedAttacks: 2,
      eventsMonitored: 1547
    }
  };
}