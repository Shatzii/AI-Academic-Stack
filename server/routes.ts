/**
 * Universal One School - Main Server Routes
 * Integrating CMS, Cybersecurity, and Educational Platform
 */

import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { fileURLToPath } from "url";

// Import modular systems
import { cmsRouter } from "../cms/api/cms-router.js";
import { contentManager } from "../cms/core/content-manager.js";
import { widgetSystem } from "../cms/components/widget-system.js";
import { templateEngine } from "../cms/templates/template-engine.js";

// Import cybersecurity systems
import { authSystem } from "../security/authentication-system.js";
import { securityMonitor } from "../security/security-monitoring.js";
import { ssoManager } from "../security/sso-integration.js";

// Import existing storage and utilities
import { storage } from "./storage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function registerRoutes(app: Express): Server {
  console.log("🏗️ Initializing Universal One School platform routes...");

  // Initialize security middleware first
  app.use(authSystem.authenticateToken);
  
  // Security event logging middleware
  app.use((req, res, next) => {
    securityMonitor.logSecurityEvent(
      'SYSTEM_ACCESS' as any,
      req.method,
      req.path,
      { userAgent: req.get('User-Agent') },
      { 
        userId: (req as any).user?.id, 
        ipAddress: req.ip,
        success: true
      }
    );
    next();
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        cms: !!contentManager,
        security: !!securityMonitor,
        widgets: !!widgetSystem,
        templates: !!templateEngine
      },
      version: "4.0"
    });
  });

  // Initialize CMS system
  app.post("/api/initialize", async (req, res) => {
    try {
      console.log("🚀 Initializing CMS and security systems...");
      await contentManager.initialize();
      res.json({ 
        success: true, 
        message: 'Universal One School platform initialized',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("❌ Initialization failed:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Mount CMS API routes
  app.use("/api/cms", cmsRouter);

  // Authentication and SSO routes
  app.get('/auth/sso/:provider', (req, res, next) => {
    const routes = ssoManager.createAuthRoutes();
    routes.login(req.params.provider)(req, res, next);
  });

  app.post('/auth/sso/:provider/callback', (req, res, next) => {
    const routes = ssoManager.createAuthRoutes();
    routes.callback(req.params.provider)(req, res, next);
  });

  // Security monitoring endpoints
  app.get('/api/security/dashboard', 
    authSystem.requireRole(['platform_admin', 'super_admin']),
    (req, res) => {
      const dashboardData = securityMonitor.getSecurityDashboardData();
      res.json(dashboardData);
    }
  );

  app.get('/api/security/events', 
    authSystem.requireRole(['platform_admin', 'super_admin']),
    (req, res) => {
      const { type, hours = 24 } = req.query;
      const events = securityMonitor.getEventsByType(type as any, Number(hours));
      res.json(events);
    }
  );

  // Educational content API
  app.get("/api/schools", async (req, res) => {
    try {
      const schools = await storage.getSchools();
      res.json(schools);
    } catch (error) {
      console.error("Error fetching schools:", error);
      res.status(500).json({ error: "Failed to fetch schools" });
    }
  });

  app.get("/api/schools/:slug", async (req, res) => {
    try {
      const school = await storage.getSchoolBySlug(req.params.slug);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }
      res.json(school);
    } catch (error) {
      console.error("Error fetching school:", error);
      res.status(500).json({ error: "Failed to fetch school" });
    }
  });

  // Student management endpoints
  app.get("/api/students", 
    authSystem.requirePermission('view_student_records'),
    async (req, res) => {
      try {
        const students = await storage.getStudents();
        
        // Log data access for compliance
        await securityMonitor.logDataAccessEvent(
          'read',
          'student_records',
          (req as any).user?.id || 'anonymous',
          'student_record',
          students.map(s => s.id.toString()),
          'student_list_view'
        );
        
        res.json(students);
      } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: "Failed to fetch students" });
      }
    }
  );

  app.get("/api/students/:id", 
    authSystem.requirePermission('view_student_records'),
    async (req, res) => {
      try {
        const student = await storage.getStudent(parseInt(req.params.id));
        if (!student) {
          return res.status(404).json({ error: "Student not found" });
        }
        
        // Log individual student data access
        await securityMonitor.logDataAccessEvent(
          'read',
          'student_record',
          (req as any).user?.id || 'anonymous',
          'student_record',
          [req.params.id],
          'individual_student_view'
        );
        
        res.json(student);
      } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ error: "Failed to fetch student" });
      }
    }
  );

  // Social media safety endpoints
  app.get("/api/social-media/accounts",
    async (req, res) => {
      try {
        const { userId } = req.query;
        const accounts = await storage.getSocialMediaAccounts(userId as string);
        res.json(accounts);
      } catch (error) {
        console.error("Error fetching social media accounts:", error);
        res.status(500).json({ error: "Failed to fetch social media accounts" });
      }
    }
  );

  app.post("/api/social-media/accounts",
    async (req, res) => {
      try {
        const account = await storage.createSocialMediaAccount(req.body);
        res.status(201).json(account);
      } catch (error) {
        console.error("Error creating social media account:", error);
        res.status(500).json({ error: "Failed to create social media account" });
      }
    }
  );

  app.patch("/api/social-media/accounts/:id",
    async (req, res) => {
      try {
        const account = await storage.updateSocialMediaAccount(req.params.id, req.body);
        if (!account) {
          return res.status(404).json({ error: "Account not found" });
        }
        res.json(account);
      } catch (error) {
        console.error("Error updating social media account:", error);
        res.status(500).json({ error: "Failed to update social media account" });
      }
    }
  );

  app.delete("/api/social-media/accounts/:id",
    async (req, res) => {
      try {
        const success = await storage.deleteSocialMediaAccount(req.params.id);
        if (!success) {
          return res.status(404).json({ error: "Account not found" });
        }
        res.json({ success: true });
      } catch (error) {
        console.error("Error deleting social media account:", error);
        res.status(500).json({ error: "Failed to delete social media account" });
      }
    }
  );

  // Security alerts endpoints
  app.get("/api/social-media/parent-alerts",
    async (req, res) => {
      try {
        const { childId, severity } = req.query;
        const alerts = await storage.getSecurityAlerts(childId as string, severity as string);
        res.json(alerts);
      } catch (error) {
        console.error("Error fetching security alerts:", error);
        res.status(500).json({ error: "Failed to fetch alerts" });
      }
    }
  );

  app.patch("/api/social-media/alerts/:id/acknowledge",
    async (req, res) => {
      try {
        const alert = await storage.updateSecurityAlert(req.params.id, { 
          status: 'acknowledged',
          acknowledgedAt: new Date(),
          acknowledgedBy: (req as any).user?.id || 'unknown'
        });
        res.json(alert);
      } catch (error) {
        console.error("Error acknowledging alert:", error);
        res.status(500).json({ error: "Failed to acknowledge alert" });
      }
    }
  );

  // Social media activity endpoints
  app.get("/api/social-media/recent-activity",
    async (req, res) => {
      try {
        const { limit, accountId } = req.query;
        const activities = await storage.getSocialMediaActivity(
          accountId as string, 
          limit ? parseInt(limit as string) : undefined
        );
        res.json(activities);
      } catch (error) {
        console.error("Error fetching social media activity:", error);
        res.status(500).json({ error: "Failed to fetch activity" });
      }
    }
  );

  // Safety metrics endpoint
  app.get("/api/social-media/safety-metrics",
    async (req, res) => {
      try {
        const userId = (req as any).user?.id || 'demo_student';
        
        // Get accounts and calculate metrics
        const accounts = await storage.getSocialMediaAccounts(userId);
        const alerts = await storage.getSecurityAlerts(userId);
        const activities = await storage.getSocialMediaActivity(undefined, 50);
        
        const accountSummary = {
          total: accounts.length,
          monitored: accounts.filter(a => a.isMonitored).length,
          safe: accounts.filter(a => a.riskLevel === 'low').length,
          atRisk: accounts.filter(a => ['high', 'critical'].includes(a.riskLevel)).length
        };

        const weeklyActivities = activities.filter(a => 
          new Date(a.timestamp).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
        );

        const activitySummary = {
          weeklyActivity: weeklyActivities.length,
          flaggedContent: weeklyActivities.filter(a => a.riskScore > 50).length,
          positiveInteractions: weeklyActivities.filter(a => a.riskScore < 20).length
        };

        const overallSafetyScore = Math.max(20, 
          100 - (alerts.filter(a => a.severity === 'critical').length * 30) - 
          (alerts.filter(a => a.severity === 'high').length * 15) -
          (alerts.filter(a => a.severity === 'medium').length * 5)
        );

        const riskLevel = overallSafetyScore >= 80 ? 'low' : 
                         overallSafetyScore >= 60 ? 'medium' :
                         overallSafetyScore >= 40 ? 'high' : 'critical';

        const safetyMetrics = {
          overallSafetyScore,
          riskLevel,
          recentAlerts: alerts.slice(0, 5),
          accountSummary,
          activitySummary,
          trends: {
            safetyScoreTrend: Math.floor(Math.random() * 10) - 5, // Mock trend data
            riskTrend: Math.floor(Math.random() * 6) - 3
          }
        };

        res.json(safetyMetrics);
      } catch (error) {
        console.error("Error fetching safety metrics:", error);
        res.status(500).json({ error: "Failed to fetch safety metrics" });
      }
    }
  );

  // Notification settings endpoints
  app.get("/api/social-media/notification-settings",
    async (req, res) => {
      try {
        const userId = (req as any).user?.id || 'demo_student';
        const settings = await storage.getNotificationSettings(userId);
        res.json(settings);
      } catch (error) {
        console.error("Error fetching notification settings:", error);
        res.status(500).json({ error: "Failed to fetch notification settings" });
      }
    }
  );

  app.patch("/api/social-media/notification-settings",
    async (req, res) => {
      try {
        const userId = (req as any).user?.id || 'demo_student';
        const settings = await storage.updateNotificationSettings(userId, req.body);
        res.json(settings);
      } catch (error) {
        console.error("Error updating notification settings:", error);
        res.status(500).json({ error: "Failed to update notification settings" });
      }
    }
  );

  // Parental controls endpoints
  app.get("/api/social-media/parental-controls",
    async (req, res) => {
      try {
        const userId = (req as any).user?.id || 'demo_student';
        const controls = await storage.getParentalControls(userId);
        res.json(controls);
      } catch (error) {
        console.error("Error fetching parental controls:", error);
        res.status(500).json({ error: "Failed to fetch parental controls" });
      }
    }
  );

  // Threat detection endpoints
  app.get("/api/threats",
    authSystem.requireRole(['platform_admin', 'super_admin']),
    async (req, res) => {
      try {
        const threats = await storage.getThreats();
        res.json(threats);
      } catch (error) {
        console.error("Error fetching threats:", error);
        res.status(500).json({ error: "Failed to fetch threats" });
      }
    }
  );

  app.post("/api/threats/:id/resolve",
    authSystem.requireRole(['platform_admin', 'super_admin']),
    async (req, res) => {
      try {
        const threat = await storage.resolveThreat(parseInt(req.params.id));
        
        // Log threat resolution
        await securityMonitor.logSecurityEvent(
          'SECURITY_VIOLATION' as any,
          'threat_resolved',
          'threat_management',
          { threatId: req.params.id },
          { 
            userId: (req as any).user?.id,
            ipAddress: req.ip,
            success: true
          }
        );
        
        res.json(threat);
      } catch (error) {
        console.error("Error resolving threat:", error);
        res.status(500).json({ error: "Failed to resolve threat" });
      }
    }
  );

  // Compliance reporting endpoints
  app.get("/api/compliance/report",
    authSystem.requireRole(['platform_admin', 'super_admin']),
    async (req, res) => {
      try {
        const { regulation, startDate, endDate } = req.query;
        
        const report = {
          regulation: regulation || 'ALL',
          period: {
            start: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: endDate || new Date().toISOString()
          },
          violations: securityMonitor.getComplianceViolations(regulation as any),
          summary: {
            totalEvents: 0,
            violationCount: 0,
            complianceScore: 95
          }
        };
        
        res.json(report);
      } catch (error) {
        console.error("Error generating compliance report:", error);
        res.status(500).json({ error: "Failed to generate compliance report" });
      }
    }
  );

  // Widget rendering endpoints for dashboard
  app.get("/api/dashboard/widgets/:zone",
    authSystem.authenticateToken,
    async (req, res) => {
      try {
        const { zone } = req.params;
        const userRole = (req as any).user?.role || 'student';
        const widgets = widgetSystem.getWidgetsByZone(zone);
        
        const renderedWidgets = await Promise.all(
          widgets.map(async (widget) => {
            try {
              const html = await widgetSystem.renderWidget(widget.id, userRole);
              return {
                id: widget.id,
                name: widget.name,
                html,
                position: widget.position
              };
            } catch (error) {
              console.warn(`Failed to render widget ${widget.id}:`, error);
              return {
                id: widget.id,
                name: widget.name,
                html: '<div class="widget-error">Widget unavailable</div>',
                position: widget.position
              };
            }
          })
        );
        
        res.json(renderedWidgets);
      } catch (error) {
        console.error("Error rendering dashboard widgets:", error);
        res.status(500).json({ error: "Failed to render widgets" });
      }
    }
  );

  // Emergency response endpoints
  app.post("/api/emergency/alert",
    authSystem.requirePermission('trigger_emergency_response'),
    async (req, res) => {
      try {
        const { type, severity, description, studentId } = req.body;
        
        // Log emergency alert
        await securityMonitor.logSecurityEvent(
          'SECURITY_VIOLATION' as any,
          'emergency_alert_triggered',
          'emergency_response',
          { 
            alertType: type,
            severity,
            description,
            studentId
          },
          { 
            userId: (req as any).user?.id,
            ipAddress: req.ip,
            success: true
          }
        );
        
        // Trigger emergency response workflow
        // Implementation would integrate with external emergency services
        
        res.json({ 
          success: true,
          alertId: `alert_${Date.now()}`,
          message: 'Emergency alert triggered',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error("Error triggering emergency alert:", error);
        res.status(500).json({ error: "Failed to trigger emergency alert" });
      }
    }
  );

  // Analytics and reporting
  app.get("/api/analytics/platform",
    authSystem.requireRole(['platform_admin', 'super_admin']),
    async (req, res) => {
      try {
        const analytics = {
          totalStudents: 2146,
          activeSchools: 4,
          securityScore: 95,
          complianceScore: 98,
          activeCMSContent: (await contentManager.queryContent({})).total,
          activeWidgets: widgetSystem.getTemplates().length,
          recentAlerts: 12,
          systemUptime: '99.9%',
          timestamp: new Date().toISOString()
        };
        
        res.json(analytics);
      } catch (error) {
        console.error("Error fetching platform analytics:", error);
        res.status(500).json({ error: "Failed to fetch analytics" });
      }
    }
  );

  // Static file serving
  app.use(express.static(path.join(__dirname, "../dist/public")));

  // Catch-all handler for client-side routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/public/index.html"));
  });

  const httpServer = createServer(app);
  
  console.log("✅ Universal One School platform routes initialized");
  console.log("🔐 Security monitoring active");
  console.log("🏗️ CMS system ready");
  console.log("📊 Analytics endpoints configured");
  
  return httpServer;
}