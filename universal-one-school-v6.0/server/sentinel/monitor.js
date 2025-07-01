/**
 * Sentinel 4.5 Security System - Monitor
 * 
 * This is the main monitoring component of the Sentinel 4.5 security system.
 * It provides real-time monitoring of system activities, logs security events,
 * and manages the security dashboard.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Configuration
const PORT = process.env.SENTINEL_PORT || 3722;
const LOG_LEVEL = process.env.SENTINEL_LOG_LEVEL || 'info';
const LOG_DIR = path.join(process.cwd(), 'logs');
const SECURITY_LOG_FILE = path.join(LOG_DIR, 'security.log');
const ALERTS_LOG_FILE = path.join(LOG_DIR, 'alerts.log');
const AUDIT_LOG_FILE = path.join(LOG_DIR, 'audit.log');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Create express app for the security dashboard
const app = express();

// Serve static files for the dashboard
app.use(express.static(path.join(__dirname, 'dashboard')));
app.use(express.json());

// Initialize the security monitor
class SecurityMonitor {
  constructor() {
    this.stats = {
      startTime: Date.now(),
      eventsLogged: 0,
      alertsTriggered: 0,
      attacksBlocked: 0,
      lastScan: null,
      systemLoad: 0,
      memoryUsage: 0
    };
    
    this.updateSystemStats();
    
    // Update system stats every minute
    setInterval(() => this.updateSystemStats(), 60000);
    
    console.log(`[Sentinel] Security monitor initialized at ${new Date().toISOString()}`);
    this.logSecurityEvent('system', 'Sentinel security monitor started');
  }
  
  updateSystemStats() {
    const load = os.loadavg();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    
    this.stats.systemLoad = load[0];
    this.stats.memoryUsage = ((totalMem - freeMem) / totalMem) * 100;
    this.stats.lastScan = new Date().toISOString();
  }
  
  logSecurityEvent(category, message, details = {}) {
    const timestamp = new Date().toISOString();
    const event = {
      timestamp,
      category,
      message,
      details
    };
    
    this.stats.eventsLogged++;
    
    // Write to security log file
    fs.appendFileSync(
      SECURITY_LOG_FILE,
      JSON.stringify(event) + '\n',
      { flag: 'a+' }
    );
    
    // If this is a high-priority event, log it as an alert
    if (details.priority === 'high') {
      this.logAlert(category, message, details);
    }
    
    // Log to console if level is appropriate
    if (LOG_LEVEL === 'debug' || details.priority === 'high') {
      console.log(`[Sentinel] ${timestamp} - ${category}: ${message}`);
    }
  }
  
  logAlert(category, message, details = {}) {
    const timestamp = new Date().toISOString();
    const alert = {
      timestamp,
      category,
      message,
      details
    };
    
    this.stats.alertsTriggered++;
    
    // Write to alerts log file
    fs.appendFileSync(
      ALERTS_LOG_FILE,
      JSON.stringify(alert) + '\n',
      { flag: 'a+' }
    );
    
    console.log(`[Sentinel-ALERT] ${timestamp} - ${category}: ${message}`);
  }
  
  logAudit(userId, action, resource, details = {}) {
    const timestamp = new Date().toISOString();
    const audit = {
      timestamp,
      userId,
      action,
      resource,
      details
    };
    
    // Write to audit log file
    fs.appendFileSync(
      AUDIT_LOG_FILE,
      JSON.stringify(audit) + '\n',
      { flag: 'a+' }
    );
    
    if (LOG_LEVEL === 'debug') {
      console.log(`[Sentinel-AUDIT] ${timestamp} - User ${userId}: ${action} ${resource}`);
    }
  }
  
  getSecurityLogs(limit = 100) {
    try {
      if (!fs.existsSync(SECURITY_LOG_FILE)) {
        return [];
      }
      
      const logs = fs.readFileSync(SECURITY_LOG_FILE, 'utf8')
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => JSON.parse(line))
        .slice(-limit);
      
      return logs;
    } catch (error) {
      console.error('Error reading security logs:', error);
      return [];
    }
  }
  
  getAlertLogs(limit = 100) {
    try {
      if (!fs.existsSync(ALERTS_LOG_FILE)) {
        return [];
      }
      
      const logs = fs.readFileSync(ALERTS_LOG_FILE, 'utf8')
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => JSON.parse(line))
        .slice(-limit);
      
      return logs;
    } catch (error) {
      console.error('Error reading alert logs:', error);
      return [];
    }
  }
  
  getAuditLogs(limit = 100) {
    try {
      if (!fs.existsSync(AUDIT_LOG_FILE)) {
        return [];
      }
      
      const logs = fs.readFileSync(AUDIT_LOG_FILE, 'utf8')
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => JSON.parse(line))
        .slice(-limit);
      
      return logs;
    } catch (error) {
      console.error('Error reading audit logs:', error);
      return [];
    }
  }
  
  getStatus() {
    return {
      status: 'active',
      uptime: Math.floor((Date.now() - this.stats.startTime) / 1000),
      stats: this.stats
    };
  }
}

// Create security monitor instance
const monitor = new SecurityMonitor();

// API routes for the security dashboard
app.get('/api/status', (req, res) => {
  res.json(monitor.getStatus());
});

app.get('/api/logs/security', (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  res.json(monitor.getSecurityLogs(limit));
});

app.get('/api/logs/alerts', (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  res.json(monitor.getAlertLogs(limit));
});

app.get('/api/logs/audit', (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  res.json(monitor.getAuditLogs(limit));
});

// Log security event endpoint
app.post('/api/log/security', (req, res) => {
  const { category, message, details } = req.body;
  
  if (!category || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  monitor.logSecurityEvent(category, message, details || {});
  res.json({ success: true });
});

// Log audit event endpoint
app.post('/api/log/audit', (req, res) => {
  const { userId, action, resource, details } = req.body;
  
  if (!userId || !action || !resource) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  monitor.logAudit(userId, action, resource, details || {});
  res.json({ success: true });
});

// Serve the main dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`[Sentinel] Security dashboard running on port ${PORT}`);
  monitor.logSecurityEvent('system', `Security dashboard started on port ${PORT}`);
});

// Export the monitor for use in other components
module.exports = monitor;