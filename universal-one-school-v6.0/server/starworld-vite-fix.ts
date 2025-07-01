import { createServer as createViteServer } from 'vite';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Fix for ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Safe environment variable loader for Vite
 */
export function loadSafeEnv() {
  const envFilePath = path.resolve(process.cwd(), '.env');
  
  if (fs.existsSync(envFilePath)) {
    console.log('🔧 Processing environment variables safely');
    
    // Read .env file and set environment variables manually
    const envContent = fs.readFileSync(envFilePath, 'utf-8');
    const envVars = envContent.split('\n');
    
    envVars.forEach(line => {
      const matches = line.match(/^([^=]+)=(.*)$/);
      if (matches) {
        const key = matches[1].trim();
        const value = matches[2].trim().replace(/^["'](.*)["']$/, '$1'); // Remove quotes if present
        if (key && value && !process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

/**
 * Setup Vite server with fixed environment handling
 */
export async function setupViteWithFix(app: express.Application) {
  // Fix environment variables before creating Vite server
  loadSafeEnv();
  
  // Now create the Vite server with explicit, safe options
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base: '/',
    optimizeDeps: {
      // Skip TensorFlow from optimization to prevent issues
      exclude: ['@tensorflow/tfjs', '@tensorflow-models/pose-detection', '@tensorflow/tfjs-backend-webgl']
    },
    // Explicitly prevent env variable substitution
    envPrefix: '_VITE_DISABLED_'
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    
    try {
      // 1. Read index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, '../client/index.html'),
        'utf-8'
      );

      // 2. Apply Vite HTML transforms
      template = await vite.transformIndexHtml(url, template);
      
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  return vite;
}