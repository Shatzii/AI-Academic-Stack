/**
 * Sentinel 4.5 Logger
 * 
 * A comprehensive logging system for the Sentinel security system that handles:
 * - Standard log levels (debug, info, warn, error)
 * - Security events
 * - Audit trails
 * - Alerts and notifications
 */

const fs = require('fs');
const path = require('path');
const { format } = require('util');

// Log levels
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  alert: 4
};

// Log colors (for console output)
const LOG_COLORS = {
  debug: '\x1b[36m', // Cyan
  info: '\x1b[32m',  // Green
  warn: '\x1b[33m',  // Yellow
  error: '\x1b[31m', // Red
  alert: '\x1b[35m', // Magenta
  reset: '\x1b[0m'   // Reset
};

/**
 * Sentinel Logger class
 */
class SentinelLogger {
  /**
   * Create a new logger instance
   * @param {Object} config - Logger configuration
   */
  constructor(config) {
    this.config = config;
    this.buffer = [];
    this.bufferSize = 100;
    this.flushInterval = 5000; // 5 seconds
    
    // Create log directories
    this.logFiles = {
      general: path.join(config.logPath, 'sentinel.log'),
      security: path.join(config.logPath, 'security.log'),
      audit: path.join(config.logPath, 'audit.log'),
      alerts: path.join(config.logPath, 'alerts.log')
    };
    
    // Ensure directories exist
    fs.mkdirSync(path.dirname(this.logFiles.general), { recursive: true });
    
    // Start periodic flush
    this.flushIntervalId = setInterval(() => this.flush(), this.flushInterval);
  }
  
  /**
   * Format a log entry
   * @param {Object} entry - Log entry
   * @returns {string} - Formatted log entry
   */
  formatEntry(entry) {
    if (this.config.format === 'json') {
      return JSON.stringify({
        ...entry,
        timestamp: entry.timestamp || new Date().toISOString()
      });
    } else {
      // Simple text format
      const timestamp = entry.timestamp || new Date().toISOString();
      const level = entry.level.toUpperCase();
      const message = typeof entry.message === 'object' 
        ? JSON.stringify(entry.message) 
        : entry.message;
      
      return `[${timestamp}] [${level}] ${message}`;
    }
  }
  
  /**
   * Write a log entry to the appropriate file
   * @param {Object} entry - Log entry
   */
  writeLog(entry) {
    // Add to buffer
    this.buffer.push(entry);
    
    // Flush buffer if it reaches the maximum size
    if (this.buffer.length >= this.bufferSize) {
      this.flush();
    }
    
    // Also log to console in development
    if (process.env.NODE_ENV !== 'production') {
      const color = LOG_COLORS[entry.level] || LOG_COLORS.reset;
      console.log(`${color}[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${LOG_COLORS.reset}`);
    }
  }
  
  /**
   * Flush log buffer to disk
   */
  flush() {
    if (this.buffer.length === 0) return;
    
    // Separate logs by type
    const generalLogs = [];
    const securityLogs = [];
    const auditLogs = [];
    const alertLogs = [];
    
    // Process each log entry
    this.buffer.forEach(entry => {
      const formattedEntry = this.formatEntry(entry) + '\n';
      
      // Add to general log
      generalLogs.push(formattedEntry);
      
      // Add to specific log based on type
      if (entry.type === 'security' || entry.level === 'alert') {
        securityLogs.push(formattedEntry);
      }
      
      if (entry.type === 'audit') {
        auditLogs.push(formattedEntry);
      }
      
      if (entry.level === 'alert') {
        alertLogs.push(formattedEntry);
      }
    });
    
    // Write logs to files
    try {
      if (generalLogs.length > 0) {
        fs.appendFileSync(this.logFiles.general, generalLogs.join(''));
      }
      
      if (securityLogs.length > 0 && this.config.securityEvents) {
        fs.appendFileSync(this.logFiles.security, securityLogs.join(''));
      }
      
      if (auditLogs.length > 0 && this.config.auditTrail) {
        fs.appendFileSync(this.logFiles.audit, auditLogs.join(''));
      }
      
      if (alertLogs.length > 0) {
        fs.appendFileSync(this.logFiles.alerts, alertLogs.join(''));
      }
      
      // Clear buffer
      this.buffer = [];
    } catch (err) {
      console.error('Error writing logs to disk:', err);
    }
  }
  
  /**
   * Log a message
   * @param {string} level - Log level
   * @param {Object|string} message - Message to log
   */
  log(level, message) {
    if (!this.config.enabled) return;
    
    const logLevel = LOG_LEVELS[level];
    const configLevel = LOG_LEVELS[this.config.level];
    
    // Only log if the level is high enough
    if (logLevel < configLevel) return;
    
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message: typeof message === 'string' ? message : message.message || '',
      ...((typeof message === 'object') ? message : {})
    };
    
    this.writeLog(entry);
  }
  
  /**
   * Log a debug message
   * @param {Object|string} message - Message to log
   */
  debug(message) {
    this.log('debug', message);
  }
  
  /**
   * Log an info message
   * @param {Object|string} message - Message to log
   */
  info(message) {
    this.log('info', message);
  }
  
  /**
   * Log a warning message
   * @param {Object|string} message - Message to log
   */
  warn(message) {
    this.log('warn', message);
  }
  
  /**
   * Log an error message
   * @param {Object|string} message - Message to log
   */
  error(message) {
    this.log('error', message);
  }
  
  /**
   * Log a security event
   * @param {Object} event - Security event data
   */
  securityEvent(event) {
    if (!this.config.securityEvents) return;
    
    this.log(event.level || 'info', {
      ...event,
      type: 'security',
      timestamp: event.timestamp || new Date().toISOString()
    });
  }
  
  /**
   * Log an audit event
   * @param {Object} event - Audit event data
   */
  audit(event) {
    if (!this.config.auditTrail) return;
    
    this.log(event.level || 'info', {
      ...event,
      type: 'audit',
      timestamp: event.timestamp || new Date().toISOString()
    });
  }
  
  /**
   * Log a security alert
   * @param {Object} alert - Alert data
   */
  alert(alert) {
    this.log('alert', {
      ...alert,
      type: 'security',
      timestamp: alert.timestamp || new Date().toISOString()
    });
  }
  
  /**
   * Get audit logs
   * @param {Object} options - Filter options
   * @returns {Array} - Audit logs
   */
  getAuditLogs(options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.config.auditTrail) {
        return resolve([]);
      }
      
      try {
        // Flush pending logs
        this.flush();
        
        // Read the audit log file
        fs.readFile(this.logFiles.audit, 'utf8', (err, data) => {
          if (err) {
            if (err.code === 'ENOENT') {
              // File doesn't exist yet
              return resolve([]);
            }
            return reject(err);
          }
          
          // Parse logs
          const logs = data
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
              try {
                return JSON.parse(line);
              } catch (e) {
                // If not JSON, parse simple format
                const match = line.match(/^\[(.*?)\] \[(.*?)\] (.*)$/);
                if (match) {
                  return {
                    timestamp: match[1],
                    level: match[2].toLowerCase(),
                    message: match[3]
                  };
                }
                return null;
              }
            })
            .filter(log => log !== null);
          
          // Apply filters
          let filteredLogs = logs;
          
          if (options.startDate) {
            const startDate = new Date(options.startDate).getTime();
            filteredLogs = filteredLogs.filter(log => 
              new Date(log.timestamp).getTime() >= startDate
            );
          }
          
          if (options.endDate) {
            const endDate = new Date(options.endDate).getTime();
            filteredLogs = filteredLogs.filter(log => 
              new Date(log.timestamp).getTime() <= endDate
            );
          }
          
          if (options.level) {
            filteredLogs = filteredLogs.filter(log => 
              log.level === options.level
            );
          }
          
          if (options.userId) {
            filteredLogs = filteredLogs.filter(log => 
              log.userId === options.userId
            );
          }
          
          if (options.actionType) {
            filteredLogs = filteredLogs.filter(log => 
              log.actionType === options.actionType
            );
          }
          
          // Sort by timestamp
          filteredLogs.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          
          // Limit results if specified
          if (options.limit) {
            filteredLogs = filteredLogs.slice(0, options.limit);
          }
          
          resolve(filteredLogs);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  
  /**
   * Destroy the logger
   */
  destroy() {
    // Clear flush interval
    clearInterval(this.flushIntervalId);
    
    // Flush any remaining logs
    this.flush();
  }
}

// Create logger factory
module.exports = {
  createLogger: (config) => new SentinelLogger(config)
};