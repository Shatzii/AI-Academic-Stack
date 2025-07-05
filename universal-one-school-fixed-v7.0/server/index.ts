import express from 'express';
import next from 'next';
import { selfHostedAIRoutes } from './routes/ai-routes';
import { authRoutes } from './routes/auth-routes';
import { schoolRoutes } from './routes/school-routes';
import { enrollmentRoutes } from './routes/enrollment-routes';
import path from 'path';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();
const PORT = process.env.PORT || 3000;

// Middleware
server.use(express.json({ limit: '10mb' }));
server.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS for development
if (dev) {
  server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
}

// Health check endpoint
server.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    platform: 'Universal One School',
    version: '7.0.0',
    aiEngine: 'self-hosted',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
server.use('/api/ai', selfHostedAIRoutes);
server.use('/api/auth', authRoutes);
server.use('/api/schools', schoolRoutes);
server.use('/api/enrollment', enrollmentRoutes);

// Static files for assets
server.use('/assets', express.static(path.join(__dirname, '../public/assets')));

// Handle all other routes with Next.js
server.all('*', (req, res) => {
  return handle(req, res);
});

app.prepare().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Universal One School v7.0 running on port ${PORT}`);
    console.log(`📚 Platform: ${process.env.PLATFORM_NAME || 'Universal One School'}`);
    console.log(`🤖 AI Engine: ${process.env.USE_SELF_HOSTED_AI === 'true' ? 'Self-Hosted' : 'Cloud'}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/health`);
    console.log(`🧠 AI Health: http://localhost:${PORT}/api/ai/self-hosted/health`);
  });
}).catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});