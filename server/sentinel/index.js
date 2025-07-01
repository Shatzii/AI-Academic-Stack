/**
 * Sentinel 4.5 Security System
 * 
 * A comprehensive security system for the ShatziiOS Education Platform.
 * Provides protection for all aspects of the platform, including:
 * - Authentication and authorization
 * - Rate limiting and DDoS protection
 * - Input validation and sanitization
 * - Content security policy
 * - XSS and CSRF protection
 * - File upload security
 * - SQL injection prevention
 * - Logging and monitoring
 * - Alerting and notification
 * 
 * Version: 4.5.0
 */

const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

// Import Sentinel services
const authGuard = require('./services/auth-guard');
const threatDetector = require('./services/threat-detector');
const contentFilter = require('./services/content-filter');
const fileScanner = require('./services/file-scanner');
const honeypot = require('./services/honeypot');
const logger = require('./services/logger');
const monitor = require('./services/monitor');
const analyzer = require('./services/analyzer');

// Default configuration
const defaultConfig = {
  // General settings
  enabled: true,
  environment: process.env.NODE_ENV || 'development',
  
  // Authentication protection
  auth: {
    enabled: true,
    bruteForceProtection: true,
    maxFailedAttempts: 5,
    lockoutTime: 15 * 60 * 1000, // 15 minutes
    passwordPolicy: {
      minLength: 10,
      requireUppercase: true,
      requireLowercase: true,
      requireDigits: true,
      requireSymbols: true
    }
  },
  
  // Rate limiting
  rateLimit: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later'
  },
  
  // Content security
  content: {
    enabled: true,
    xssProtection: true,
    contentTypeOptions: true,
    frameguard: true,
    hsts: true,
    referrerPolicy: true,
    validateOutput: true,
    sanitizeInput: true
  },
  
  // File uploads
  fileUploads: {
    enabled: true,
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg', 
      'image/png', 
      'image/gif', 
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ],
    scanForViruses: true,
    validateContent: true
  },
  
  // Honeypot
  honeypot: {
    enabled: true,
    paths: [
      '/admin.php', 
      '/wp-login.php', 
      '/wp-admin.php',
      '/.env',
      '/config.php'
    ]
  },
  
  // Logging
  logging: {
    enabled: true,
    level: 'info', // debug, info, warn, error
    format: 'json',
    httpLogger: true,
    securityEvents: true,
    auditTrail: true,
    logPath: path.join(__dirname, '../../logs/sentinel')
  },
  
  // Monitoring
  monitoring: {
    enabled: true,
    requestStats: true,
    errorTracking: true,
    performanceMetrics: true,
    anomalyDetection: true,
    alertThresholds: {
      highCpu: 80, // percentage
      highMemory: 80, // percentage
      responseTime: 2000, // ms
      errorRate: 5 // percentage
    }
  },
  
  // Analysis
  analysis: {
    enabled: true,
    realTimeAnalysis: true,
    periodicAnalysis: true,
    analysisInterval: 3600 * 1000, // 1 hour
    retentionPeriod: 30 * 24 * 3600 * 1000 // 30 days
  }
};

/**
 * Sentinel Security System
 */
class Sentinel {
  /**
   * Create a new Sentinel instance
   * @param {object} config - Configuration options
   */
  constructor(config = {}) {
    // Merge default config with user config
    this.config = {
      ...defaultConfig,
      ...config,
      auth: { ...defaultConfig.auth, ...(config.auth || {}) },
      rateLimit: { ...defaultConfig.rateLimit, ...(config.rateLimit || {}) },
      content: { ...defaultConfig.content, ...(config.content || {}) },
      fileUploads: { ...defaultConfig.fileUploads, ...(config.fileUploads || {}) },
      honeypot: { ...defaultConfig.honeypot, ...(config.honeypot || {}) },
      logging: { ...defaultConfig.logging, ...(config.logging || {}) },
      monitoring: { ...defaultConfig.monitoring, ...(config.monitoring || {}) },
      analysis: { ...defaultConfig.analysis, ...(config.analysis || {}) }
    };
    
    // Create instance identifier
    this.instanceId = uuidv4();
    
    // Initialize logging directory
    if (this.config.logging.enabled) {
      fs.mkdirSync(this.config.logging.logPath, { recursive: true });
    }
    
    // Initialize services
    this.initializeServices();
    
    // Log startup
    this.logger.info({
      message: 'Sentinel security system initialized',
      version: '4.5.0',
      instanceId: this.instanceId,
      environment: this.config.environment
    });
  }
  
  /**
   * Initialize Sentinel services
   */
  initializeServices() {
    // Initialize logger first
    this.logger = logger.createLogger(this.config.logging);
    
    // Initialize other services
    this.authGuard = authGuard.create(this.config.auth, this.logger);
    this.threatDetector = threatDetector.create(this.logger);
    this.contentFilter = contentFilter.create(this.config.content, this.logger);
    this.fileScanner = fileScanner.create(this.config.fileUploads, this.logger);
    this.honeypot = honeypot.create(this.config.honeypot, this.logger);
    this.monitor = monitor.create(this.config.monitoring, this.logger);
    this.analyzer = analyzer.create(this.config.analysis, this.logger);
    
    // Initialize periodic tasks
    this.initializePeriodicTasks();
  }
  
  /**
   * Initialize periodic tasks
   */
  initializePeriodicTasks() {
    if (this.config.monitoring.enabled) {
      // Start monitoring at irregular intervals to avoid predictable patterns
      const randomInterval = () => 55000 + Math.random() * 10000;
      setInterval(() => this.monitor.collectMetrics(), randomInterval());
    }
    
    if (this.config.analysis.enabled && this.config.analysis.periodicAnalysis) {
      setInterval(() => this.analyzer.runAnalysis(), this.config.analysis.analysisInterval);
    }
  }
  
  /**
   * Create Express middleware for Sentinel security
   * @returns {Function} - Express middleware
   */
  createMiddleware() {
    // Return a noop middleware if Sentinel is disabled
    if (!this.config.enabled) {
      return (req, res, next) => next();
    }
    
    const router = express.Router();
    
    // Add general security headers
    router.use(helmet({
      contentSecurityPolicy: this.config.content.enabled,
      xssFilter: this.config.content.xssProtection,
      noSniff: this.config.content.contentTypeOptions,
      frameguard: this.config.content.frameguard ? { action: 'deny' } : false,
      hsts: this.config.content.hsts ? {
        maxAge: 15552000, // 180 days
        includeSubDomains: true
      } : false,
      referrerPolicy: this.config.content.referrerPolicy ? { policy: 'strict-origin-when-cross-origin' } : false
    }));
    
    // Add request ID to every request
    router.use((req, res, next) => {
      req.id = uuidv4();
      res.setHeader('X-Request-ID', req.id);
      next();
    });
    
    // Setup rate limiting
    if (this.config.rateLimit.enabled) {
      router.use(rateLimit({
        windowMs: this.config.rateLimit.windowMs,
        max: this.config.rateLimit.max,
        standardHeaders: this.config.rateLimit.standardHeaders,
        legacyHeaders: this.config.rateLimit.legacyHeaders,
        message: this.config.rateLimit.message,
        handler: (req, res, next, options) => {
          this.logger.warn({
            message: 'Rate limit exceeded',
            requestId: req.id,
            ip: req.ip,
            path: req.path,
            method: req.method
          });
          res.status(429).send(options.message);
        }
      }));
    }
    
    // Setup honeypot
    if (this.config.honeypot.enabled) {
      router.use(this.honeypot.middleware());
    }
    
    // HTTP logging
    if (this.config.logging.httpLogger) {
      router.use((req, res, next) => {
        const startTime = Date.now();
        
        // Log request
        this.logger.info({
          type: 'request',
          requestId: req.id,
          method: req.method,
          path: req.path,
          ip: req.ip,
          userAgent: req.headers['user-agent']
        });
        
        // Record response
        const originalSend = res.send;
        res.send = function(body) {
          const duration = Date.now() - startTime;
          
          // Log response
          this.logger.info({
            type: 'response',
            requestId: req.id,
            statusCode: res.statusCode,
            duration,
            path: req.path,
            method: req.method
          });
          
          // Monitor performance
          if (this.config.monitoring.performanceMetrics) {
            this.monitor.recordResponseTime(req.path, duration);
          }
          
          return originalSend.call(this, body);
        }.bind(this);
        
        next();
      });
    }
    
    // Threat detection
    router.use((req, res, next) => {
      this.threatDetector.scanRequest(req)
        .then(threats => {
          if (threats.length > 0) {
            this.logger.warn({
              message: 'Potential security threats detected',
              requestId: req.id,
              threats
            });
            
            // Block the request if any critical threats are found
            const criticalThreats = threats.filter(t => t.severity === 'critical');
            if (criticalThreats.length > 0) {
              return res.status(403).json({
                error: 'Request blocked due to security concerns'
              });
            }
          }
          next();
        })
        .catch(err => {
          this.logger.error({
            message: 'Error in threat detection',
            requestId: req.id,
            error: err.message
          });
          next();
        });
    });
    
    return router;
  }
  
  /**
   * Create middleware for authentication and authorization
   * @param {Object} options - Authentication options
   * @returns {Function} - Express middleware
   */
  createAuthMiddleware(options = {}) {
    return this.authGuard.middleware(options);
  }
  
  /**
   * Create middleware for file upload security
   * @param {Object} options - File upload options
   * @returns {Function} - Express middleware
   */
  createFileUploadMiddleware(options = {}) {
    return this.fileScanner.middleware(options);
  }
  
  /**
   * Get security report
   * @returns {Object} - Security report
   */
  async getSecurityReport() {
    return this.analyzer.generateReport();
  }
  
  /**
   * Get security alerts
   * @param {Object} options - Filter options
   * @returns {Array} - Security alerts
   */
  async getSecurityAlerts(options = {}) {
    return this.analyzer.getAlerts(options);
  }
  
  /**
   * Get audit logs
   * @param {Object} options - Filter options
   * @returns {Array} - Audit logs
   */
  async getAuditLogs(options = {}) {
    return this.logger.getAuditLogs(options);
  }
  
  /**
   * Get security status
   * @returns {Object} - Security status
   */
  getStatus() {
    return {
      instanceId: this.instanceId,
      version: '4.5.0',
      enabled: this.config.enabled,
      environment: this.config.environment,
      services: {
        authGuard: this.authGuard.getStatus(),
        threatDetector: this.threatDetector.getStatus(),
        contentFilter: this.contentFilter.getStatus(),
        fileScanner: this.fileScanner.getStatus(),
        honeypot: this.honeypot.getStatus(),
        monitor: this.monitor.getStatus(),
        analyzer: this.analyzer.getStatus()
      },
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Sanitize user input
   * @param {string|object} input - Input to sanitize
   * @returns {string|object} - Sanitized input
   */
  sanitizeInput(input) {
    return this.contentFilter.sanitize(input);
  }
  
  /**
   * Validate output data
   * @param {string|object} output - Output to validate
   * @returns {string|object} - Validated output
   */
  validateOutput(output) {
    return this.contentFilter.validate(output);
  }
  
  /**
   * Register a security alert manually
   * @param {Object} alert - Alert data
   */
  registerAlert(alert) {
    this.logger.alert({
      ...alert,
      timestamp: new Date().toISOString(),
      source: alert.source || 'manual'
    });
  }
  
  /**
   * Register a security event manually
   * @param {Object} event - Event data
   */
  registerEvent(event) {
    this.logger.securityEvent({
      ...event,
      timestamp: new Date().toISOString(),
      source: event.source || 'manual'
    });
  }
  
  /**
   * Shutdown Sentinel gracefully
   */
  shutdown() {
    this.logger.info({
      message: 'Sentinel security system shutting down',
      instanceId: this.instanceId
    });
    
    // Shut down services
    this.monitor.shutdown();
    this.analyzer.shutdown();
    
    // Final log flush
    this.logger.flush();
  }
}

// Export singleton instance
const sentinel = new Sentinel();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  sentinel.shutdown();
});

process.on('SIGINT', () => {
  sentinel.shutdown();
});

module.exports = {
  sentinel,
  Sentinel
};