/**
 * ShatziiOS Optimized Server
 * 
 * This is the optimized entry point for the ShatziiOS educational platform with improved
 * startup performance and reliability.
 * 
 * Key features:
 * - Phased loading of components to improve startup time
 * - Graceful error handling and recovery
 * - Proper resource cleanup on shutdown
 */

import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import compression from 'compression';
import { setupShutdownHandlers, getMemoryUsage } from './startup-utils.js';
// Import the routes bridge
import { registerRoutes } from './routes-bridge.js';

// Required for ES modules to get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting ShatziiOS Optimized Server...');

// Create Express application
const app = express();
const port = parseInt(process.env.PORT || '5000', 10);

// Print environment info
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Current memory usage: ${getMemoryUsage()}`);

// Basic middleware setup
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// Basic logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  // Skip logging static file requests
  if (!req.path.startsWith('/assets/') && !req.path.endsWith('.js') && !req.path.endsWith('.css')) {
    console.log(`${new Date().toISOString()} [${req.method}] ${req.path}`);
  }
  next();
});

// Basic error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Express error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

// Create HTTP server
const server = http.createServer(app);

// Register API routes
console.log('Registering API routes...');
registerRoutes(app);

// Start server if it hasn't been started yet by fast-start.js
if (!server.listening) {
  server.listen(port, '0.0.0.0', () => {
    console.log(`✅ ShatziiOS optimized server is running on port ${port}`);
    console.log(`Current memory usage: ${getMemoryUsage()}`);
  });
} else {
  console.log('Server already listening (started by fast-start.js)');
}

// Setup graceful shutdown
setupShutdownHandlers(server);

// Export the server instance for testing
export default server;