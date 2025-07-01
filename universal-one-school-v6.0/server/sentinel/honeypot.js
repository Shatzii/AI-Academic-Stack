/**
 * Sentinel 4.5 Security System - Honeypot
 * 
 * This component creates honeypot endpoints and form fields to detect and track
 * automated scanning tools and potential attackers.
 */

const express = require('express');
const monitor = require('./monitor');
const firewall = require('./firewall');

class Honeypot {
  constructor() {
    this.trackedIps = new Map();
    this.suspiciousInteractions = [];
    
    console.log(`[Sentinel] Honeypot initialized`);
    monitor.logSecurityEvent('honeypot', 'Honeypot initialized');
  }
  
  // Create middleware for honeypot route injection
  getMiddleware() {
    const router = express.Router();
    
    // Hidden admin login page honeypot
    router.all(['/admin', '/administrator', '/wp-admin', '/login', '/admin.php'], (req, res) => {
      const ip = req.ip || req.connection.remoteAddress;
      
      this.trackInteraction(ip, {
        type: 'admin_url',
        path: req.path,
        method: req.method,
        userAgent: req.get('user-agent'),
        query: req.query,
        body: req.body
      });
      
      // Return a fake admin login page
      res.type('html').send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Admin Login</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .login-form { max-width: 300px; margin: 0 auto; }
            input { width: 100%; padding: 8px; margin: 10px 0; }
            button { padding: 10px; background: #007bff; color: white; border: none; cursor: pointer; }
          </style>
        </head>
        <body>
          <div class="login-form">
            <h2>Admin Login</h2>
            <form method="post" action="${req.path}">
              <input type="text" name="username" placeholder="Username" required>
              <input type="password" name="password" placeholder="Password" required>
              <input type="hidden" name="honey_token" value="admin_form">
              <button type="submit">Login</button>
            </form>
          </div>
        </body>
        </html>
      `);
    });
    
    // API endpoint honeypots
    router.all([
      '/api/v1/users',
      '/api/users/all',
      '/api/keys',
      '/api/token',
      '/api/config',
      '/api/settings'
    ], (req, res) => {
      const ip = req.ip || req.connection.remoteAddress;
      
      this.trackInteraction(ip, {
        type: 'api_endpoint',
        path: req.path,
        method: req.method,
        userAgent: req.get('user-agent'),
        query: req.query,
        body: req.body
      });
      
      // Return a fake API response
      res.status(401).json({
        error: 'Authentication required',
        timestamp: new Date().toISOString()
      });
    });
    
    // Common vulnerability probe endpoints
    router.all([
      '/.git/*',
      '/.env',
      '/wp-config.php',
      '/config.php',
      '/phpinfo.php',
      '/info.php',
      '/server-status',
      '/.htaccess',
      '/robots.txt'
    ], (req, res) => {
      const ip = req.ip || req.connection.remoteAddress;
      
      this.trackInteraction(ip, {
        type: 'vulnerability_probe',
        path: req.path,
        method: req.method,
        userAgent: req.get('user-agent')
      });
      
      // High severity - likely an active scanning tool
      monitor.logSecurityEvent('honeypot', 'Vulnerability probe detected', {
        ip,
        path: req.path,
        method: req.method,
        userAgent: req.get('user-agent'),
        priority: 'high'
      });
      
      // Automatically block the IP
      firewall.blockIp(ip);
      
      // Return a 404 Not Found
      res.status(404).send('Not Found');
    });
    
    return router;
  }
  
  // Function to add honeypot fields to forms
  injectHoneypotFields(html) {
    // Find closing form tags and inject a hidden honeypot field before them
    return html.replace(
      /<\/form>/gi,
      `<div style="display:none;visibility:hidden;height:0;width:0;position:absolute;left:-9999px;">
        <label for="website">Website</label>
        <input type="text" name="website" id="website" tabindex="-1" autocomplete="off">
      </div>
      </form>`
    );
  }
  
  // Check if a form submission has triggered the honeypot
  checkHoneypotField(req) {
    // If the honeypot field 'website' is filled, it's a bot
    if (req.body && req.body.website && req.body.website.length > 0) {
      const ip = req.ip || req.connection.remoteAddress;
      
      this.trackInteraction(ip, {
        type: 'honeypot_field',
        path: req.path,
        method: req.method,
        userAgent: req.get('user-agent')
      });
      
      monitor.logSecurityEvent('honeypot', 'Honeypot field triggered', {
        ip,
        path: req.path,
        method: req.method,
        priority: 'high'
      });
      
      // Automatically block the IP
      firewall.blockIp(ip);
      
      return true;
    }
    
    return false;
  }
  
  // Track interactions with honeypots
  trackInteraction(ip, details) {
    const timestamp = Date.now();
    const interaction = {
      timestamp,
      ip,
      ...details
    };
    
    // Add to suspicious interactions list
    this.suspiciousInteractions.push(interaction);
    
    // Trim list if it gets too large
    if (this.suspiciousInteractions.length > 1000) {
      this.suspiciousInteractions = this.suspiciousInteractions.slice(-1000);
    }
    
    // Track IP and its interaction count
    const ipData = this.trackedIps.get(ip) || { count: 0, firstSeen: timestamp, lastSeen: timestamp };
    ipData.count += 1;
    ipData.lastSeen = timestamp;
    this.trackedIps.set(ip, ipData);
    
    // Log the interaction
    monitor.logSecurityEvent('honeypot', `Honeypot interaction: ${details.type}`, {
      ip,
      details,
      priority: ipData.count > 3 ? 'high' : 'medium'
    });
    
    // If we see multiple interactions from the same IP, block it
    if (ipData.count >= 3) {
      firewall.blockIp(ip);
      monitor.logSecurityEvent('honeypot', 'IP automatically blocked due to multiple honeypot interactions', {
        ip,
        count: ipData.count,
        priority: 'high'
      });
    }
  }
  
  // Get honeypot stats
  getStats() {
    return {
      trackedIps: Array.from(this.trackedIps.entries()).map(([ip, data]) => ({
        ip,
        ...data
      })),
      recentInteractions: this.suspiciousInteractions.slice(-50),
      totalInteractions: this.suspiciousInteractions.length
    };
  }
}

// Create a honeypot instance
const honeypot = new Honeypot();

module.exports = honeypot;