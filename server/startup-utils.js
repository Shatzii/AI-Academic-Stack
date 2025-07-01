/**
 * ShatziiOS Startup Utilities
 * 
 * This module provides utility functions for server startup
 * to improve performance and reliability.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Required for ES modules to get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Check if a TypeScript file has a corresponding JavaScript file
 * and return the most appropriate path to use
 * 
 * @param {string} tsPath - Path to TypeScript file
 * @returns {string} Path to use (either .ts or .js)
 */
export function getBestFilePath(tsPath) {
  // First check if TS file exists
  const fullTsPath = path.resolve(__dirname, tsPath);
  
  if (fs.existsSync(fullTsPath)) {
    return tsPath;
  }
  
  // Convert .ts to .js and check if that exists
  const jsPath = tsPath.replace(/\.ts$/, '.js');
  const fullJsPath = path.resolve(__dirname, jsPath);
  
  if (fs.existsSync(fullJsPath)) {
    return jsPath;
  }
  
  // Return original path as fallback
  return tsPath;
}

/**
 * Check if a module can be imported without causing errors
 * 
 * @param {string} modulePath - Path to the module to check
 * @returns {Promise<boolean>} Whether the module can be imported
 */
export async function canImportModule(modulePath) {
  try {
    await import(modulePath);
    return true;
  } catch (error) {
    console.warn(`Cannot import module ${modulePath}:`, error.message);
    return false;
  }
}

/**
 * Get server memory usage formatted as a string
 * 
 * @returns {string} Memory usage information
 */
export function getMemoryUsage() {
  const formatMemory = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB';
  const memoryUsage = process.memoryUsage();
  
  return `
Memory Usage:
  RSS: ${formatMemory(memoryUsage.rss)} (Resident Set Size)
  Heap: ${formatMemory(memoryUsage.heapTotal)} (Total) / ${formatMemory(memoryUsage.heapUsed)} (Used)
  External: ${formatMemory(memoryUsage.external)}
  ArrayBuffers: ${formatMemory(memoryUsage.arrayBuffers || 0)}
`.trim();
}

/**
 * Execute safe shutdown procedures
 * 
 * @param {object} server - HTTP server instance
 * @param {object} [db] - Database connection (optional)
 * @returns {Promise<void>}
 */
export async function performGracefulShutdown(server, db = null) {
  console.log('Shutting down server gracefully...');
  
  try {
    // Close database connections if provided
    if (db) {
      console.log('Closing database connections...');
      await db.end();
      console.log('Database connections closed.');
    }
    
    // Close the HTTP server
    if (server) {
      await new Promise((resolve) => {
        server.close(() => {
          console.log('HTTP server closed.');
          resolve();
        });
      });
    }
    
    console.log('Shutdown complete.');
  } catch (error) {
    console.error('Error during shutdown:', error);
  }
}

/**
 * Configure process signal handlers for graceful shutdown
 * 
 * @param {object} server - HTTP server instance 
 * @param {object} [db] - Database connection (optional)
 */
export function setupShutdownHandlers(server, db = null) {
  // Handle termination signals
  process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    performGracefulShutdown(server, db).then(() => process.exit(0));
  });
  
  process.on('SIGINT', () => {
    console.log('SIGINT received');
    performGracefulShutdown(server, db).then(() => process.exit(0));
  });
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    performGracefulShutdown(server, db).then(() => process.exit(1));
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled promise rejection:', reason);
    // Don't exit the process, just log the error
  });
}