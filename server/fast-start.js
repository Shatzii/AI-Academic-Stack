/**
 * ShatziiOS Fast Start Server
 * 
 * This is a lightweight Express server that starts immediately,
 * then dynamically loads the full application in the background.
 * This solves the Replit workflow timeout issue.
 */

import express from 'express';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { setupShutdownHandlers, getMemoryUsage } from './startup-utils.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Required for ES modules to get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('⚡ Starting ShatziiOS Fast Start Server...');

// Create minimal Express app that starts instantly
const app = express();
const port = parseInt(process.env.PORT || '5000');

// Print environment info
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Starting server on port ${port}`);

// Basic logging middleware
app.use((req, res, next) => {
  // Only log API requests to avoid flooding logs with static asset requests
  if (req.path.startsWith('/api')) {
    console.log(`${new Date().toISOString()} [${req.method}] ${req.path}`);
  }
  next();
});

// Enable JSON parsing
app.use(express.json());

// Open the port immediately
const server = http.createServer(app);
server.listen(port, '0.0.0.0', () => {
  console.log(`⚡ Fast server is running on port ${port}`);
  console.log(getMemoryUsage());
});

// Set up graceful shutdown
setupShutdownHandlers(server);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'starting',
    message: 'Server is starting up. Full functionality will be available soon.',
    timestamp: new Date().toISOString()
  });
});

// Load the full server in the background
setTimeout(() => {
  console.log('🔄 Loading full application...');
  
  try {
    // First try to load optimized-index.ts using the tsx loader
    import('tsx').then(tsx => {
      try {
        console.log('✅ TSX loader found, loading optimized-index.ts');
        // Use tsx to run TypeScript files
        const { register } = tsx;
        register();
        
        // Now we can import TypeScript files
        import('./optimized-index.ts')
          .then(() => {
            console.log('✅ Optimized application loaded successfully');
            
            // Update the health check
            app.get('/api/health', (req, res) => {
              res.status(200).json({
                status: 'ready',
                message: 'ShatziiOS optimized server is operational',
                timestamp: new Date().toISOString()
              });
            });
          })
          .catch(tsError => {
            console.warn('Unable to load optimized-index.ts, trying index.ts', tsError);
            
            // Try the main index.ts as fallback
            import('./index.ts')
              .then(() => {
                console.log('✅ Main application loaded successfully');
                
                app.get('/api/health', (req, res) => {
                  res.status(200).json({
                    status: 'ready',
                    message: 'ShatziiOS server is fully operational',
                    timestamp: new Date().toISOString()
                  });
                });
              })
              .catch(mainTsError => {
                console.error('Failed to load TypeScript files:', mainTsError);
                // Continue to the next fallback
              });
          });
      } catch (tsxError) {
        console.error('Error using TSX:', tsxError);
      }
    }).catch(tsxError => {
      console.warn('TSX not available, trying compiled JS versions', tsxError);
      
      // Try JS versions instead
      import('./optimized-index.js')
          .then(() => {
            console.log('✅ Optimized application loaded successfully');
            
            // Update the health check
            app.get('/api/health', (req, res) => {
              res.status(200).json({
                status: 'ready',
                message: 'ShatziiOS optimized server is operational',
                timestamp: new Date().toISOString()
              });
            });
          })
          .catch(secondError => {
            console.error('Failed to load optimized application:', secondError);
            
            // Update health check to show error
            app.get('/api/health', (req, res) => {
              res.status(500).json({
                status: 'error',
                message: 'Failed to load any application version',
                error: secondError.message,
                timestamp: new Date().toISOString()
              });
            });
          });
      });
  } catch (error) {
    console.error('Error in dynamic import:', error);
  }
}, 500); // Give the server 500ms to bind to the port