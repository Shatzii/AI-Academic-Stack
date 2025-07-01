/**
 * Sentinel 4.5 Security System - Firewall
 * 
 * This component provides application-level firewall protection for ShatziiOS.
 * It includes rate limiting, IP blacklisting, request filtering, and more.
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const monitor = require('./monitor');

// Default configuration
const DEFAULT_CONFIG = {
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  },
  blacklist: {
    ips: [],
    userAgents: [
      'sqlmap',
      'nikto',
      'nmap',
      'masscan',
      'zgrab',
      'gobuster',
      'datadog',
      'python-requests',
      'aiohttp',
      'w3af',
      'burpsuite'
    ]
  },
  requestSizeLimit: '2mb',
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
      mediaSrc: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: []
    }
  }
};

class Firewall {
  constructor(config = {}) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    };
    
    // Internal blacklist
    this.ipBlacklist = new Set(this.config.blacklist.ips);
    this.userAgentBlacklist = new Set(this.config.blacklist.userAgents);
    
    // Track suspicious activities
    this.suspiciousActivities = new Map();
    
    console.log(`[Sentinel] Firewall initialized with ${this.ipBlacklist.size} blocked IPs`);
    monitor.logSecurityEvent('firewall', 'Firewall initialized');
  }
  
  // Middleware to apply before routes
  getMiddleware() {
    return [
      // IP blacklist checking
      (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress;
        
        if (this.ipBlacklist.has(ip)) {
          monitor.logSecurityEvent('firewall', 'Blocked request from blacklisted IP', {
            ip,
            path: req.path,
            method: req.method,
            priority: 'high'
          });
          
          return res.status(403).json({
            error: 'Access denied'
          });
        }
        
        next();
      },
      
      // User-Agent blacklist checking
      (req, res, next) => {
        const userAgent = req.get('user-agent') || '';
        
        // Check if user agent contains any blacklisted term
        const isBlacklisted = Array.from(this.userAgentBlacklist).some(term => 
          userAgent.toLowerCase().includes(term.toLowerCase())
        );
        
        if (isBlacklisted) {
          monitor.logSecurityEvent('firewall', 'Blocked request with suspicious user agent', {
            userAgent,
            ip: req.ip,
            path: req.path,
            method: req.method,
            priority: 'high'
          });
          
          return res.status(403).json({
            error: 'Access denied'
          });
        }
        
        next();
      },
      
      // Rate limiting
      rateLimit({
        ...this.config.rateLimit,
        handler: (req, res, next, options) => {
          monitor.logSecurityEvent('firewall', 'Rate limit exceeded', {
            ip: req.ip,
            path: req.path,
            method: req.method,
            priority: 'medium'
          });
          
          res.status(options.statusCode).json({
            error: options.message
          });
        }
      }),
      
      // Request body size limit
      express.json({ limit: this.config.requestSizeLimit }),
      
      // Malicious pattern detection in request parameters
      (req, res, next) => {
        const suspiciousPatterns = [
          /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, // SQL Injection
          /((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/i, // XSS
          /\.\.\//i, // Path Traversal
          /\/(etc|usr|var|root)\//i, // Path Traversal
          /\/(passwd|shadow|hosts)/i // Sensitive File Access
        ];
        
        // Check URL parameters
        const url = req.originalUrl || req.url;
        const hasSuspiciousUrl = suspiciousPatterns.some(pattern => pattern.test(url));
        
        if (hasSuspiciousUrl) {
          monitor.logSecurityEvent('firewall', 'Blocked request with suspicious URL pattern', {
            ip: req.ip,
            url,
            method: req.method,
            priority: 'high'
          });
          
          return res.status(403).json({
            error: 'Access denied'
          });
        }
        
        // Check request body if present
        if (req.body && typeof req.body === 'object') {
          const bodyStr = JSON.stringify(req.body);
          const hasSuspiciousBody = suspiciousPatterns.some(pattern => pattern.test(bodyStr));
          
          if (hasSuspiciousBody) {
            monitor.logSecurityEvent('firewall', 'Blocked request with suspicious payload', {
              ip: req.ip,
              url,
              method: req.method,
              priority: 'high'
            });
            
            return res.status(403).json({
              error: 'Access denied'
            });
          }
        }
        
        next();
      },
      
      // Detect and track multiple consecutive failed login attempts
      (req, res, next) => {
        // Only apply to login endpoint
        if (req.path === '/api/login' && req.method === 'POST') {
          const ip = req.ip || req.connection.remoteAddress;
          
          // Store the original end function
          const originalEnd = res.end;
          
          // Override the end function
          res.end = function(chunk, encoding) {
            // Restore the original end function
            res.end = originalEnd;
            
            // Check if the response is a 401 Unauthorized
            if (res.statusCode === 401) {
              const activity = this.suspiciousActivities.get(ip) || { count: 0, lastAttempt: 0 };
              const now = Date.now();
              
              // If last attempt was within 10 minutes, increment the counter
              if (now - activity.lastAttempt < 10 * 60 * 1000) {
                activity.count++;
              } else {
                activity.count = 1;
              }
              
              activity.lastAttempt = now;
              this.suspiciousActivities.set(ip, activity);
              
              // If too many attempts, add to blacklist temporarily
              if (activity.count >= 5) {
                this.ipBlacklist.add(ip);
                
                // Remove from blacklist after 1 hour
                setTimeout(() => {
                  this.ipBlacklist.delete(ip);
                  this.suspiciousActivities.delete(ip);
                  monitor.logSecurityEvent('firewall', 'IP removed from temporary blacklist', {
                    ip,
                    priority: 'low'
                  });
                }, 60 * 60 * 1000);
                
                monitor.logSecurityEvent('firewall', 'IP temporarily blacklisted due to failed login attempts', {
                  ip,
                  attempts: activity.count,
                  priority: 'high'
                });
              }
            }
            
            // Call the original end function
            return originalEnd.call(this, chunk, encoding);
          }.bind(this);
        }
        
        next();
      }
    ];
  }
  
  // Add an IP to the blacklist
  blockIp(ip) {
    this.ipBlacklist.add(ip);
    monitor.logSecurityEvent('firewall', 'IP added to blacklist', {
      ip,
      priority: 'medium'
    });
  }
  
  // Remove an IP from the blacklist
  unblockIp(ip) {
    if (this.ipBlacklist.has(ip)) {
      this.ipBlacklist.delete(ip);
      monitor.logSecurityEvent('firewall', 'IP removed from blacklist', {
        ip,
        priority: 'low'
      });
      return true;
    }
    return false;
  }
  
  // Get the current firewall status
  getStatus() {
    return {
      blockedIps: Array.from(this.ipBlacklist),
      blockedUserAgents: Array.from(this.userAgentBlacklist),
      suspiciousActivities: Object.fromEntries(this.suspiciousActivities),
      rateLimit: this.config.rateLimit
    };
  }
}

// Create a firewall instance
const firewall = new Firewall();

module.exports = firewall;