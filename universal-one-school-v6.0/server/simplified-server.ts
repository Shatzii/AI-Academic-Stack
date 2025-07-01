import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import { createServer } from "http";
import { fileURLToPath } from "url";

// Handle ES modules vs CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure environment
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === "production";

async function setupServer() {
  try {
    // Create Express application
    const app = express();
    
    // Create a simplified AI service mock
    const aiService = {
      initialize: async () => true,
      generateText: async (systemPrompt: string, userInput: string) => 
        "This is a placeholder response from the AI Engine.",
      analyzeContent: async (content: string, analysisType: string) => ({ 
        status: "success",
        message: "Content analyzed successfully",
        metadata: { wordCount: content.split(/\s+/).length },
      }),
      transformCurriculum: async (content: string, learningDifference: string, gradeLevel: number) => ({
        title: 'Transformed Curriculum',
        original: content,
        transformed: `This is a transformed version of the curriculum for ${learningDifference} students in grade ${gradeLevel}.`,
        adaptations: ['Simplified language', 'Visual supports', 'Chunked content'],
        learningDifference,
        gradeLevel,
      }),
      generateEducationalMaterial: async (topic: string, materialType: string) => ({
        topic,
        materialType,
        content: `Educational material about ${topic} in the form of ${materialType}.`,
      }),
      generateFallbackResponse: async (prompt: string, context: string, type: string) => 
        type === 'json' 
          ? { status: 'success', message: 'Response generated' }
          : "This is a placeholder response."
    };
    
    // Make AI service available to routes
    app.locals.aiService = aiService;
    console.log('✅ Simplified AI Engine Service initialized');
    
    // Security middlewares
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
    
    // Configure middleware
    app.use(bodyParser.json());
    app.use(cors({
      origin: isProd ? ['https://shatzii.com'] : true,
      credentials: true,
    }));
    
    // API routes
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok", timestamp: new Date() });
    });
    
    // Curriculum transformer endpoints
    app.post('/api/curriculum/transform', async (req, res) => {
      try {
        const { content, learningDifference, gradeLevel } = req.body;
        
        if (!content) {
          return res.status(400).json({ error: 'Content is required' });
        }
        
        // Use the AI service to transform the curriculum
        const result = await aiService.transformCurriculum(
          content, 
          learningDifference || 'dyslexia', 
          gradeLevel || 5
        );
        
        res.json(result);
      } catch (error) {
        console.error('Error transforming curriculum:', error);
        res.status(500).json({ 
          error: 'Failed to transform curriculum',
          message: error.message
        });
      }
    });
    
    // API to get adaptation types
    app.get('/api/curriculum/adaptation-types', (req, res) => {
      res.json([
        { id: 'dyslexia', name: 'Dyslexia', description: 'Adaptations for students with reading difficulties' },
        { id: 'adhd', name: 'ADHD', description: 'Adaptations for students with attention difficulties' },
        { id: 'autism_spectrum', name: 'Autism Spectrum', description: 'Adaptations for students on the autism spectrum' },
        { id: 'combined', name: 'Combined Adaptations', description: 'Multiple adaptations for students with various needs' }
      ]);
    });
    
    // API to get grade levels
    app.get('/api/curriculum/grade-levels', (req, res) => {
      const gradeLevels = [];
      // K-6
      for (let i = 0; i <= 6; i++) {
        gradeLevels.push({
          id: i,
          name: i === 0 ? 'Kindergarten' : `Grade ${i}`,
          category: 'primary'
        });
      }
      // 7-12
      for (let i = 7; i <= 12; i++) {
        gradeLevels.push({
          id: i,
          name: `Grade ${i}`,
          category: 'secondary'
        });
      }
      res.json(gradeLevels);
    });
    
    // API endpoint for educational material generation
    app.post('/api/educational-material/generate', async (req, res) => {
      try {
        const { topic, materialType } = req.body;
        
        if (!topic || !materialType) {
          return res.status(400).json({ error: 'Topic and material type are required' });
        }
        
        const result = await aiService.generateEducationalMaterial(topic, materialType);
        res.json(result);
      } catch (error) {
        console.error('Error generating educational material:', error);
        res.status(500).json({ 
          error: 'Failed to generate educational material',
          message: error.message
        });
      }
    });
    
    // Serve files from the public directory
    app.use(express.static(path.join(__dirname, '../public')));
    
    // Serve the standalone curriculum transformer page
    app.get('/curriculum-transformer', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/curriculum-transformer.html'));
    });
    
    // Serve landing page for root path
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
    
    // Default route for any unhandled paths
    app.use((req, res) => {
      if (req.path.startsWith("/api")) {
        return res.status(404).json({ error: "API endpoint not found" });
      }
      res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
    });
    
    // Create HTTP server
    const httpServer = createServer(app);
    
    // Start the server
    httpServer.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`🚀 Simplified Server running at http://0.0.0.0:${PORT}`);
      console.log(`📝 API available at http://0.0.0.0:${PORT}/api/`);
      console.log(`🔄 Curriculum Transformer UI available at http://0.0.0.0:${PORT}/curriculum-transformer`);
    });
    
    // Handle graceful shutdown
    const shutdown = async () => {
      console.log("Shutting down server...");
      
      httpServer.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
      });
    };
    
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
    
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
setupServer().catch(error => {
  console.error("Unhandled error during server setup:", error);
  process.exit(1);
});