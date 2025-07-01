/**
 * Security routes for Sentinel 4.5 Security System
 */

import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { AUDIT_LOG_FILE, SECURITY_LOG_FILE, ERROR_LOG_FILE } from '../sentinel/config';
// Import from central security system
import { 
  AlertSeverity, 
  AlertType, 
  logSecurityEvent, 
  logAuditEvent,
  getSecurityStatus,
  getSecurityModules,
  runSecurityScan,
  remediateVulnerability
} from '../sentinel';

// Define interface for security metrics
interface SecurityMetrics {
  threatLevel: number;
  securityScore: number;
  activeThreats: number;
  mitigatedThreats: number;
  incidents: {
    open: number;
    mitigated: number;
    resolved: number;
    falsePositive: number;
  };
  alertsByType: {
    authentication: number;
    authorization: number;
    injection: number;
    rateLimit: number;
    fileUpload: number;
    apiAbuse: number;
    honeypot: number;
    system: number;
  };
  alertsBySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  recentEvents: Array<{
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    summary: string;
    timestamp: number;
    source?: string;
  }>;
  attackSources: Array<{
    country: string;
    count: number;
    latitude: number;
    longitude: number;
  }>;
  systemStatus: {
    uptime: number;
    cpuLoad: number;
    memoryUsage: number;
    databaseConnections: number;
    activeUsers: number;
  };
  anomalies: {
    total: number;
    acknowledged: number;
    falsePositive: number;
  };
  topAttackedEndpoints: Array<{
    endpoint: string;
    count: number;
  }>;
  securityChecks: Array<{
    name: string;
    status: 'passed' | 'failed' | 'warning';
    description: string;
  }>;
}

export interface SecurityAlert {
  id: string;           // Uniquely identify alerts
  severity: AlertSeverity;
  type: AlertType;
  message: string;
  details?: any;
  timestamp: string;
  user?: string;
  ip?: string;
  userAgent?: string;
  status?: 'active' | 'acknowledged' | 'resolved'; // Added to track alert status
  acknowledgedBy?: string;
  resolvedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

const router = Router();

// In-memory storage for recent alerts (would typically use a database in production)
const recentAlerts: SecurityAlert[] = [];

// Store alert in memory for dashboard display
export function storeAlert(alert: SecurityAlert) {
  // Ensure the alert has a status
  const alertWithStatus = {
    ...alert,
    status: alert.status || 'active' as const
  };
  
  recentAlerts.unshift(alertWithStatus); // Add to beginning of array
  if (recentAlerts.length > 100) {
    recentAlerts.pop(); // Remove oldest alert if we have too many
  }
  
  return alertWithStatus;
}

// Get system security status
router.get('/status', (req, res) => {
  // Use the enhanced security status from the sentinel system
  const status = getSecurityStatus();
  
  res.json(status);
});

// Get recent security alerts
router.get('/alerts', (req, res) => {
  res.json(recentAlerts);
});

// Acknowledge an alert
router.post('/alerts/:id/acknowledge', (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  
  const alertIndex = recentAlerts.findIndex(alert => alert.id === id);
  if (alertIndex === -1) {
    return res.status(404).json({ success: false, message: 'Alert not found' });
  }
  
  // Update the alert status
  recentAlerts[alertIndex] = {
    ...recentAlerts[alertIndex],
    status: 'acknowledged',
    acknowledgedBy: user || 'system',
    acknowledgedAt: new Date().toISOString()
  };
  
  // Log the action
  logAuditEvent(
    user || 'system',
    `Acknowledged security alert (${recentAlerts[alertIndex].severity} - ${recentAlerts[alertIndex].type})`,
    { alertId: id, alert: recentAlerts[alertIndex] }
  );
  
  res.json({ 
    success: true, 
    message: 'Alert acknowledged successfully',
    alert: recentAlerts[alertIndex]
  });
});

// Resolve an alert
router.post('/alerts/:id/resolve', (req, res) => {
  const { id } = req.params;
  const { user, resolution } = req.body;
  
  const alertIndex = recentAlerts.findIndex(alert => alert.id === id);
  if (alertIndex === -1) {
    return res.status(404).json({ success: false, message: 'Alert not found' });
  }
  
  // Update the alert status
  recentAlerts[alertIndex] = {
    ...recentAlerts[alertIndex],
    status: 'resolved',
    resolvedBy: user || 'system',
    resolvedAt: new Date().toISOString(),
    details: {
      ...recentAlerts[alertIndex].details,
      resolution
    }
  };
  
  // Log the action
  logAuditEvent(
    user || 'system',
    `Resolved security alert (${recentAlerts[alertIndex].severity} - ${recentAlerts[alertIndex].type})`,
    { alertId: id, alert: recentAlerts[alertIndex], resolution }
  );
  
  res.json({ 
    success: true, 
    message: 'Alert resolved successfully',
    alert: recentAlerts[alertIndex]
  });
});

// Helper function to read log files
function readLogFile(filePath: string, lines: number = 100): Promise<string[]> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return resolve([]);
    }
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return reject(err);
      
      const logEntries = data.split('\n')
        .filter(line => line.trim() !== '')
        .slice(-lines); // Get only the most recent entries
        
      resolve(logEntries);
    });
  });
}

// Get recent security logs
router.get('/logs/security', async (req, res) => {
  try {
    const logs = await readLogFile(SECURITY_LOG_FILE);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read security logs' });
  }
});

// Get recent audit logs
router.get('/logs/audit', async (req, res) => {
  try {
    const logs = await readLogFile(AUDIT_LOG_FILE);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read audit logs' });
  }
});

// Get recent error logs
router.get('/logs/error', async (req, res) => {
  try {
    const logs = await readLogFile(ERROR_LOG_FILE);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read error logs' });
  }
});

// Get detailed security metrics for enhanced dashboard
router.get('/metrics', (req, res) => {
  try {
    // Get security modules to get their metrics
    const securityModulesData = getSecurityModules();
    
    // Calculate metrics based on alerts
    const alertsByType = {
      authentication: 0,
      authorization: 0,
      injection: 0,
      rateLimit: 0,
      fileUpload: 0,
      apiAbuse: 0,
      honeypot: 0,
      system: 0
    };
    
    const alertsBySeverity = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };
    
    const incidents = {
      open: 0,
      mitigated: 0,
      resolved: 0,
      falsePositive: 0
    };
    
    // Count alerts by type and severity
    recentAlerts.forEach(alert => {
      // Count by type
      if (alert.type) {
        const type = String(alert.type).toLowerCase();
        if (alertsByType.hasOwnProperty(type)) {
          alertsByType[type as keyof typeof alertsByType]++;
        } else if (type === 'sql_injection' || type === 'xss') {
          alertsByType.injection++;
        } else if (type === 'api_key' || type === 'api_abuse') {
          alertsByType.apiAbuse++;
        } else {
          alertsByType.system++;
        }
      }
      
      // Count by severity
      if (alert.severity) {
        const severity = String(alert.severity).toLowerCase();
        if (alertsBySeverity.hasOwnProperty(severity)) {
          alertsBySeverity[severity as keyof typeof alertsBySeverity]++;
        }
      }
      
      // Count by status
      if (alert.status === 'active') {
        incidents.open++;
      } else if (alert.status === 'acknowledged') {
        incidents.mitigated++;
      } else if (alert.status === 'resolved') {
        incidents.resolved++;
        
        // Check if it was a false positive based on details
        if (alert.details && 
            (alert.details.falsePositive || 
             (alert.details.resolution && alert.details.resolution.includes('false positive')))) {
          incidents.falsePositive++;
        }
      }
    });
    
    // Generate recent events
    const recentEvents = recentAlerts.slice(0, 5).map(alert => ({
      id: alert.id || `evt-${Date.now()}`,
      type: String(alert.type),
      severity: String(alert.severity).toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
      summary: alert.message,
      timestamp: new Date(alert.timestamp).getTime(),
      source: alert.ip
    }));
    
    // Calculate security score using module data
    let securityScore = 85;
    // Decrease score for failed or inactive modules
    const failedModules = securityModulesData.filter(m => m.status === 'failed').length;
    const inactiveModules = securityModulesData.filter(m => m.status === 'inactive').length;
    securityScore -= (failedModules * 10 + inactiveModules * 5);
    
    // Count only active alerts by severity for score calculation
    const activeAlertsBySeverity = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };
    
    // Only count active alerts in the calculation
    recentAlerts.forEach(alert => {
      if (alert.status === 'active' || alert.status === undefined) {
        const severity = String(alert.severity).toLowerCase();
        if (activeAlertsBySeverity.hasOwnProperty(severity)) {
          activeAlertsBySeverity[severity as keyof typeof activeAlertsBySeverity]++;
        }
      }
    });
    
    // Adjust further based on alert severity (only active alerts)
    securityScore = Math.min(100, Math.max(0, securityScore - 
      (activeAlertsBySeverity.critical * 8) - 
      (activeAlertsBySeverity.high * 3) - 
      (activeAlertsBySeverity.medium * 1)));
    
    // Calculate threat level (0-100) based on alerts and module status
    // Use active alerts for threat level calculation
    const threatLevel = Math.min(100, Math.max(0, 
      (activeAlertsBySeverity.critical * 15) + 
      (activeAlertsBySeverity.high * 8) + 
      (activeAlertsBySeverity.medium * 3) + 
      (activeAlertsBySeverity.low * 1) +
      (failedModules * 20) +
      (inactiveModules * 10)
    ));
    
    // Generate attack sources (simulated data)
    const attackSources = [
      { country: 'United States', count: 125, latitude: 37.0902, longitude: -95.7129 },
      { country: 'China', count: 87, latitude: 35.8617, longitude: 104.1954 },
      { country: 'Russia', count: 63, latitude: 61.5240, longitude: 105.3188 },
      { country: 'Brazil', count: 42, latitude: -14.2350, longitude: -51.9253 },
      { country: 'India', count: 36, latitude: 20.5937, longitude: 78.9629 }
    ];
    
    // Generate top attacked endpoints
    const topAttackedEndpoints = [
      { endpoint: '/api/login', count: 78 },
      { endpoint: '/api/users', count: 43 },
      { endpoint: '/admin/panel', count: 35 },
      { endpoint: '/api/payments', count: 28 },
      { endpoint: '/api/uploads', count: 22 }
    ];
    
    // Generate security checks from module data
    const securityChecks = securityModulesData.map(module => {
      let status: 'passed' | 'warning' | 'failed' = 'passed';
      if (module.status === 'failed') {
        status = 'failed';
      } else if (module.status === 'inactive') {
        status = 'warning';
      }
      
      return {
        name: module.name,
        status,
        description: module.description
      };
    });
    
    // Extract anomaly data from modules
    const anomalyModule = securityModulesData.find(m => m.name === 'Anomaly Detection');
    const anomalies = {
      total: anomalyModule?.metrics?.anomaliesDetected as number || 4,
      acknowledged: 2,
      falsePositive: 1
    };
    
    // Get system metrics
    const systemStatus = {
      uptime: 15.3, // days (simulated)
      cpuLoad: 23,
      memoryUsage: 48,
      databaseConnections: 12,
      activeUsers: 57
    };
    
    // Compile complete metrics
    const securityMetrics: SecurityMetrics = {
      threatLevel,
      securityScore,
      activeThreats: incidents.open + incidents.mitigated,
      mitigatedThreats: incidents.resolved,
      incidents,
      alertsByType,
      alertsBySeverity,
      recentEvents,
      attackSources,
      systemStatus,
      anomalies,
      topAttackedEndpoints,
      securityChecks
    };
    
    res.json(securityMetrics);
  } catch (error) {
    console.error('Error generating security metrics:', error);
    res.status(500).json({ error: 'Failed to generate security metrics' });
  }
});

// Run a security scan
router.post('/scan', (req, res) => {
  const { user } = req.body;
  
  try {
    // Run the security scan
    const scanResults = runSecurityScan(user || 'system');
    
    // For any critical or high issues found, create security alerts
    if (scanResults.vulnerabilities && scanResults.vulnerabilities.length > 0) {
      // Filter for critical or high severity issues
      const highPriorityIssues = scanResults.vulnerabilities.filter(
        (vuln: any) => vuln.severity === 'critical' || vuln.severity === 'high'
      );
      
      // Create alerts for each high priority issue
      highPriorityIssues.forEach((vulnerability: any) => {
        const alertType = getAlertTypeForModule(vulnerability.moduleId);
        
        storeAlert({
          id: `vuln-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          severity: vulnerability.severity === 'critical' ? 
            AlertSeverity.CRITICAL : AlertSeverity.HIGH,
          type: alertType,
          message: `Security scan detected: ${vulnerability.description}`,
          details: {
            moduleId: vulnerability.moduleId,
            moduleName: vulnerability.moduleName,
            remediation: vulnerability.remediation,
            scanId: scanResults.scanId
          },
          timestamp: new Date().toISOString(),
          user: user || 'system'
        });
      });
    }
    
    res.json({
      success: true,
      scan: scanResults
    });
  } catch (error) {
    console.error('Error running security scan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to run security scan',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Helper function to map module IDs to alert types
 */
function getAlertTypeForModule(moduleId: string): AlertType {
  const moduleToAlertType: Record<string, AlertType> = {
    'auth-security': AlertType.AUTHENTICATION,
    'rate-limiter': AlertType.RATE_LIMIT,
    'file-guard': AlertType.FILE_UPLOAD,
    'content-security': AlertType.XSS,
    'honeypot': AlertType.HONEYPOT,
    'threat-intel': AlertType.THREAT_INTEL,
    'db-monitor': AlertType.SQL_INJECTION,
    'vulnerability-scanner': AlertType.VULNERABILITY,
    'ip-blocker': AlertType.SUSPICIOUS_ACTIVITY,
    'secure-session': AlertType.AUTHENTICATION,
    'security-scoring': AlertType.SYSTEM
  };
  
  return moduleToAlertType[moduleId] || AlertType.SYSTEM;
}

// Generate test security data
router.get('/generate-test-data', async (req, res) => {
  try {
    // Authentication alerts
    const authAlert = {
      id: `auth-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      severity: AlertSeverity.MEDIUM,
      type: AlertType.AUTHENTICATION,
      message: 'Failed login attempt for user ceoadmin',
      details: { attemptCount: 3 },
      timestamp: new Date().toISOString(),
      user: 'ceoadmin',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    storeAlert(authAlert);
    
    // Authorization alert
    const authzAlert = {
      id: `authz-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      severity: AlertSeverity.HIGH,
      type: AlertType.AUTHORIZATION,
      message: 'Unauthorized access attempt to admin section',
      details: { targetResource: '/api/admin/settings', requiredRole: 'admin' },
      timestamp: new Date().toISOString(),
      user: 'student1',
      ip: '10.0.0.25',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
    };
    storeAlert(authzAlert);
    
    // Rate limit alert
    const rateAlert = {
      id: `rate-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      severity: AlertSeverity.MEDIUM,
      type: AlertType.RATE_LIMIT,
      message: 'API rate limit exceeded',
      details: { endpoint: '/api/courses', requestsPerMinute: 120, limit: 60 },
      timestamp: new Date().toISOString(),
      user: 'teacher1',
      ip: '172.16.10.1',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
    };
    storeAlert(rateAlert);
    
    // File upload alert
    const fileAlert = {
      id: `file-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      severity: AlertSeverity.HIGH,
      type: AlertType.FILE_UPLOAD,
      message: 'Suspicious file upload detected',
      details: { fileName: 'assignment.js.exe', fileSize: '250KB', rejectionReason: 'executable file type' },
      timestamp: new Date().toISOString(),
      user: 'student1',
      ip: '8.8.8.8',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    };
    storeAlert(fileAlert);
    
    // Honeypot alert
    const honeypotAlert = {
      id: `honey-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      severity: AlertSeverity.MEDIUM,
      type: AlertType.HONEYPOT,
      message: 'Honeypot endpoint accessed',
      details: { endpoint: '/api/v1/admin/system-debug', method: 'GET', ipReputation: 'suspicious' },
      timestamp: new Date().toISOString(),
      user: 'unknown',
      ip: '82.223.21.90',
      userAgent: 'Mozilla/5.0 zgrab/0.x'
    };
    storeAlert(honeypotAlert);
    
    // System alert
    const systemAlert = {
      id: `sys-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      severity: AlertSeverity.LOW,
      type: AlertType.SYSTEM,
      message: 'Security configuration updated',
      details: { updatedBy: 'ceoadmin', changes: { rateLimitRequests: '100 -> 200', sessionTimeout: '60 -> 30' } },
      timestamp: new Date().toISOString(),
      user: 'ceoadmin',
      ip: '10.0.0.1',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
    };
    storeAlert(systemAlert);
    
    // Critical alert
    const criticalAlert = {
      id: `crit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      severity: AlertSeverity.CRITICAL,
      type: AlertType.AUTHORIZATION,
      message: 'Potential privilege escalation attempt detected',
      details: { originalRole: 'student', attemptedRole: 'ceo', method: 'modified JWT token' },
      timestamp: new Date().toISOString(),
      user: 'student1',
      ip: '10.0.0.30',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
    };
    storeAlert(criticalAlert);
    
    res.json({ success: true, message: 'Test security data generated successfully', alertCount: 7 });
  } catch (error) {
    console.error('Error generating test data:', error);
    res.status(500).json({ error: 'Failed to generate test security data' });
  }
});

/**
 * Remediate all security issues
 * This endpoint handles automated remediation of all detected security issues
 */
router.post('/remediate-all', (req, res) => {
  const { user } = req.body;
  try {
    // Get all recent alerts that are active (not yet resolved)
    const activeAlerts = recentAlerts.filter(alert => 
      alert.status === 'active' || alert.status === undefined);
    
    if (activeAlerts.length === 0) {
      return res.json({
        success: true,
        message: 'No active security issues to remediate',
        remediated: 0
      });
    }
    
    let remediatedCount = 0;
    const remediationDetails: Array<{
      alertId: string;
      type: AlertType; 
      severity: AlertSeverity;
      moduleId: string;
      action: string;
      result: string;
    }> = [];
    
    // Process each active alert
    activeAlerts.forEach(alert => {
      try {
        // Get module ID from alert details
        const moduleId = alert.details?.moduleId || 
          (alert.type === AlertType.AUTHENTICATION ? 'auth-security' :
          alert.type === AlertType.FILE_UPLOAD ? 'file-guard' :
          alert.type === AlertType.SQL_INJECTION ? 'db-monitor' :
          alert.type === AlertType.XSS ? 'content-security' :
          alert.type === AlertType.RATE_LIMIT ? 'rate-limiter' :
          alert.type === AlertType.HONEYPOT ? 'honeypot' :
          alert.type === AlertType.SUSPICIOUS_ACTIVITY ? 'ip-blocker' :
          'security-scoring');
        
        // Determine remediation action based on alert type
        const remediationAction = 
          alert.type === AlertType.AUTHENTICATION ? 'force_password_reset' :
          alert.type === AlertType.SUSPICIOUS_ACTIVITY ? 'block_ip' :
          alert.type === AlertType.RATE_LIMIT ? 'increase_monitoring' :
          'mark_resolved';
        
        // Apply remediation
        const result = remediateVulnerability(moduleId, remediationAction);
        
        if (result.success) {
          // Update alert status
          const alertIndex = recentAlerts.findIndex(a => a.id === alert.id);
          if (alertIndex !== -1) {
            recentAlerts[alertIndex] = {
              ...recentAlerts[alertIndex],
              status: 'resolved',
              resolvedBy: user || 'system',
              resolvedAt: new Date().toISOString(),
              details: {
                ...recentAlerts[alertIndex].details,
                resolution: `Automatically remediated: ${result.message}`
              }
            };
          }
          
          remediatedCount++;
          remediationDetails.push({
            alertId: alert.id || 'unknown-id',
            type: alert.type,
            severity: alert.severity,
            moduleId,
            action: remediationAction,
            result: result.message
          });
          
          // Log audit event
          logAuditEvent(
            user || 'system',
            `Auto-remediated security issue (${alert.severity} - ${alert.type})`,
            { 
              alertId: alert.id, 
              moduleId, 
              action: remediationAction 
            }
          );
        }
      } catch (error) {
        console.error(`Error remediating alert ${alert.id}:`, error);
      }
    });
    
    // Return remediation results
    res.json({
      success: true,
      message: `Successfully remediated ${remediatedCount} security ${remediatedCount === 1 ? 'issue' : 'issues'}`,
      remediated: remediatedCount,
      details: remediationDetails
    });
  } catch (error) {
    console.error('Error remediating all security issues:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remediate security issues',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;