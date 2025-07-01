/**
 * Quick-start version of server/index.ts
 * 
 * This file provides a fast-starting version of the server that prioritizes
 * opening the port quickly, then initializes other services afterward.
 */

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";
import path from "path";
import helmet from "helmet";

// Import database tools
import { db, pool } from "./db";

// Configure environment
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === "production";

async function setupServer() {
  try {
    // Create Express application
    const app = express();
    
    // Basic middlewares (minimal set for quick startup)
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "blob:"],
          connectSrc: ["'self'", "ws:", "wss:"],
        },
      },
    }));
    app.use(bodyParser.json());
    app.use(cors({
      origin: isProd ? ['https://shatzii.com'] : true,
      credentials: true,
    }));
    
    // Create HTTP server
    const httpServer = createServer(app);
    
    // Initial API health endpoint (to show server is responsive)
    app.get("/api/health", (req, res) => {
      res.json({ 
        status: "initializing", 
        timestamp: new Date(),
        message: "Server is starting up. Some features may not be available yet."
      });
    });
    
    // Static file serving
    const __filename = new URL(import.meta.url).pathname;
    const __dirname = path.dirname(__filename);
    const staticPath = path.resolve(__dirname, "../dist");
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(express.static(staticPath));
    
    // Serve landing page for root path
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
    
    // Start the server immediately to meet the timeout constraint
    httpServer.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
      
      // Now that the server is running, initialize the rest of the services
      // This happens after the port is open, so won't block startup
      initializeRemainingServices(app, httpServer).catch(error => {
        console.error("Error initializing remaining services:", error);
      });
    });
    
    // Handle graceful shutdown
    const shutdown = async () => {
      console.log("Shutting down server...");
      
      try {
        await pool.end();
        console.log("Database connections closed");
        
        httpServer.close(() => {
          console.log("HTTP server closed");
          process.exit(0);
        });
      } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
      }
    };
    
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
    
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

/**
 * Initialize the remaining services after the server has started
 */
async function initializeRemainingServices(app: express.Express, httpServer: any) {
  console.log("Initializing remaining services...");
  
  try {
    // Set up authentication
    const { setupAuth } = await import("./auth");
    await setupAuth(app);
    console.log("✅ Authentication initialized");
    
    // Update the health endpoint to show full initialization
    app.get("/api/health", (req, res) => {
      res.json({ 
        status: "ok", 
        timestamp: new Date(),
        servicesInitialized: true
      });
    });
    
    // Initialize AI Engine Service
    try {
      // Use require to avoid TypeScript errors with dynamic imports
      const aiEngineModule = require('./services/ai-engine-service.js');
      const aiService = aiEngineModule.createAIEngineService();
      
      // Initialize the service in the background
      aiService.initialize().then((success: boolean) => {
        if (success) {
          console.log('✅ AI Engine Service initialized successfully');
        } else {
          console.warn('⚠️ AI Engine Service initialization failed, using fallback mode');
        }
      });
      
      // Make AI service available to routes
      app.locals.aiService = aiService;
    } catch (error) {
      console.error('❌ Error initializing AI Engine Service:', error);
      // Create a mock AI service with the same interface
      app.locals.aiService = createFallbackAIService();
    }
    
    // Register additional routes
    try {
      const lawSchoolRoutes = (await import("./routes/law-school-routes")).default;
      const translationRoutes = (await import("./routes/translation-routes")).default;
      
      // Register routes
      app.use('/api/law-school', lawSchoolRoutes);
      app.use('/api/translation', translationRoutes);
      
      // Import and register other routes as needed
      
      console.log("✅ API routes initialized");
    } catch (error) {
      console.error('❌ Error initializing API routes:', error);
    }
    
    // Set up catch-all route for SPA routing (must be last)
    app.get("*", (req, res) => {
      if (req.path.startsWith("/api")) {
        return res.status(404).json({ error: "API endpoint not found" });
      }
      res.sendFile(path.join(path.dirname(new URL(import.meta.url).pathname), "../dist/index.html"));
    });
    
    console.log("✅ All services initialized");
  } catch (error) {
    console.error("Failed to initialize services:", error);
  }
}

/**
 * Create a fallback AI service for when the real one can't be initialized
 */
function createFallbackAIService() {
  return {
    initialize: async () => false,
    generateText: async (systemPrompt: string, userInput: string) => 
      "AI Engine is currently unavailable. Please try again later.",
    analyzeContent: async (content: string, analysisType: string) => ({ 
      status: "error",
      message: "AI Engine unavailable",
      metadata: { wordCount: content.split(/\s+/).length },
      fallback: true
    }),
    transformCurriculum: async (content: string, learningDifference: string, gradeLevel: string) => ({
      title: 'AI Engine Unavailable',
      original: content,
      transformed: content,
      adaptations: [],
      learningDifference: learningDifference,
      gradeLevel: gradeLevel,
      fallback: true
    }),
    generateEducationalMaterial: async (topic: string, materialType: string) => ({
      topic: topic,
      materialType: materialType,
      content: "AI Engine is currently unavailable. Please try again later.",
      fallback: true
    }),
    generateFallbackResponse: async (prompt: string, context: string, type: string) => 
      type === 'json' 
        ? { status: 'error', message: 'AI Engine unavailable' }
        : "AI Engine is currently unavailable. Please try again later."
  };
}

// Start the server
setupServer().catch(error => {
  console.error("Unhandled error during server setup:", error);
  process.exit(1);
});