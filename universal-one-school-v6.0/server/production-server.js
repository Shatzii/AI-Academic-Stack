/**
 * ShatziiOS Educational Platform - Production Server
 * 
 * Optimized for deployment on 4-core/16GB RAM hardware at 188.245.209.124
 * This server implements:
 * - Fast startup with deferred initialization
 * - Worker thread pools for CPU-intensive operations
 * - Connection pooling for database efficiency
 * - Memory usage monitoring and optimization
 * - Graceful degradation for high-load scenarios
 */

import express from 'express';
import { createServer } from 'http';
import helmet from 'helmet';
import compression from 'compression';
import { cpus } from 'os';
import { Worker } from 'worker_threads';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { db, pool } from './db.js';
import bodyParser from 'body-parser';
import cors from 'cors';

// Configuration
const PORT = process.env.PORT || 3721;
const CPU_COUNT = cpus().length;
const WORKER_COUNT = Math.max(1, CPU_COUNT - 1); // Leave one CPU for the main thread
const MAX_MEMORY_PERCENT = 80; // Trigger memory optimization at 80% usage
const __dirname = dirname(fileURLToPath(import.meta.url));

// Global worker pool
const workers = [];
let nextWorker = 0;

// Memory monitoring
let memoryMonitorInterval;
let lastMemoryUsage = 0;

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Basic middlewares that should be applied immediately
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
app.use(compression()); // Compress all responses
app.use(bodyParser.json({ limit: '5mb' }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ['https://shatzii.com'] : true,
  credentials: true,
}));

// Prioritize port binding to meet container startup requirements
httpServer.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
  
  // Now that the port is open, continue with other initializations
  await completeServerInitialization();
});

// Initialize everything else after the port is bound
async function completeServerInitialization() {
  try {
    // Initialize worker threads for CPU-intensive operations
    console.log(`Initializing ${WORKER_COUNT} worker threads...`);
    for (let i = 0; i < WORKER_COUNT; i++) {
      try {
        const worker = new Worker(join(__dirname, 'workers/curriculum-worker.js'));
        workers.push(worker);
        console.log(`Worker ${i+1}/${WORKER_COUNT} initialized`);
      } catch (error) {
        console.error(`Error initializing worker ${i+1}:`, error);
      }
    }

    // Set up authentication
    try {
      const { setupAuth } = await import('./auth.js');
      await setupAuth(app);
      console.log('✅ Authentication initialized');
    } catch (error) {
      console.error('❌ Error initializing authentication:', error);
    }

    // Initialize AI Engine Service
    try {
      const aiEngineModule = await import('./services/ai-engine-service.js');
      const aiService = aiEngineModule.createAIEngineService();
      
      // Initialize the service in the background
      aiService.initialize().then(success => {
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
      app.locals.aiService = createFallbackAIService();
    }

    // Register routes
    try {
      // Core routes
      const lawSchoolRoutes = (await import('./routes/law-school-routes.js')).default;
      const translationRoutes = (await import('./routes/translation-routes.js')).default;
      
      // Register routes
      app.use('/api/law-school', lawSchoolRoutes);
      app.use('/api/translation', translationRoutes);
      
      console.log('✅ API routes initialized');
    } catch (error) {
      console.error('❌ Error initializing API routes:', error);
    }

    // Static file serving
    const staticPath = join(__dirname, '../dist');
    app.use(express.static(join(__dirname, '../public')));
    app.use(express.static(staticPath));
    
    // Landing page and SPA catch-all route
    app.get('/', (req, res) => {
      res.sendFile(join(__dirname, '../public/index.html'));
    });
    
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      res.sendFile(join(staticPath, 'index.html'));
    });

    // Start memory monitoring
    startMemoryMonitoring();

    console.log('✨ Server initialization complete');
  } catch (error) {
    console.error('Server initialization error:', error);
  }
}

// Worker pool management
export function getNextWorker() {
  const worker = workers[nextWorker];
  nextWorker = (nextWorker + 1) % workers.length;
  return worker;
}

// Curriculum transformation using worker pool
export async function transformCurriculumWithWorker(content, learningDifference, gradeLevel, options = {}) {
  if (workers.length === 0) {
    // Fallback if no workers are available
    console.warn('No workers available, using fallback curriculum transformation');
    return {
      title: options.title || 'Transformed Curriculum',
      original: content,
      transformed: content,
      adaptations: ['No adaptations applied - worker unavailable'],
      learningDifference,
      gradeLevel,
      fallback: true
    };
  }

  return new Promise((resolve, reject) => {
    const worker = getNextWorker();
    const messageId = Date.now() + Math.random().toString(36).substring(2);
    
    // Handler for worker responses
    const messageHandler = (message) => {
      if (message.messageId === messageId) {
        worker.removeListener('message', messageHandler);
        if (message.error) {
          reject(new Error(message.error));
        } else {
          resolve(message.result);
        }
      }
    };
    
    worker.on('message', messageHandler);
    
    // Send the work to the worker
    worker.postMessage({
      messageId,
      action: 'transformCurriculum',
      content,
      learningDifference,
      gradeLevel,
      options
    });
    
    // Timeout safety
    setTimeout(() => {
      worker.removeListener('message', messageHandler);
      reject(new Error('Curriculum transformation timed out'));
    }, 30000); // 30 second timeout
  });
}

// Memory monitoring and optimization
function startMemoryMonitoring() {
  memoryMonitorInterval = setInterval(() => {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    const percentUsed = Math.round((heapUsedMB / heapTotalMB) * 100);
    
    // Log significant changes
    if (Math.abs(heapUsedMB - lastMemoryUsage) > 10) {
      console.log(`Memory usage: ${heapUsedMB}MB / ${heapTotalMB}MB (${percentUsed}%)`);
      lastMemoryUsage = heapUsedMB;
    }
    
    // Trigger garbage collection at high memory usage
    if (percentUsed > MAX_MEMORY_PERCENT) {
      console.warn(`High memory usage detected: ${percentUsed}%. Attempting optimization.`);
      
      // Force a garbage collection cycle if possible
      if (global.gc) {
        console.log('Running garbage collection');
        global.gc();
      }
    }
  }, 60000); // Check every minute
}

// AI Engine fallback service
function createFallbackAIService() {
  return {
    initialize: async () => false,
    generateText: async (systemPrompt, userInput) => 
      "AI Engine is currently unavailable. Please try again later.",
    analyzeContent: async (content, analysisType) => ({ 
      status: "error",
      message: "AI Engine unavailable",
      metadata: { wordCount: content.split(/\\s+/).length },
      fallback: true
    }),
    transformCurriculum: async (content, learningDifference, gradeLevel) => ({
      title: 'AI Engine Unavailable',
      original: content,
      transformed: content,
      adaptations: [],
      learningDifference,
      gradeLevel,
      fallback: true
    }),
    generateEducationalMaterial: async (topic, materialType) => ({
      topic,
      materialType,
      content: "AI Engine is currently unavailable. Please try again later.",
      fallback: true
    }),
    generateFallbackResponse: async (prompt, context, type) => 
      type === 'json' 
        ? { status: 'error', message: 'AI Engine unavailable' }
        : "AI Engine is currently unavailable. Please try again later."
  };
}

// Handle graceful shutdown
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

async function gracefulShutdown() {
  console.log('🛑 Shutting down server gracefully...');
  
  // Clear monitoring interval
  if (memoryMonitorInterval) {
    clearInterval(memoryMonitorInterval);
  }
  
  // Terminate worker threads
  for (const worker of workers) {
    worker.terminate();
  }
  
  // Close database connections
  try {
    await pool.end();
    console.log('Database connections closed');
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
  
  // Close server
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
  
  // Force exit after timeout
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000); // Give 10 seconds for graceful shutdown
}