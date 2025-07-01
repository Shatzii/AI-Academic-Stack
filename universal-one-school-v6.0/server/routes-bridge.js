/**
 * Routes Bridge
 * 
 * This module bridges between different routing approaches used in the application.
 * It allows both the original server and the optimized server to use their respective
 * router setup functions.
 */

import { setupRoutes } from './routes.js';

/**
 * Registers routes with the Express application
 * 
 * @param {import('express').Application} app - Express application
 * @returns {import('http').Server} HTTP server instance
 */
export function registerRoutes(app) {
  // Call the original setupRoutes function
  setupRoutes(app);
  
  // Return a dummy server object to satisfy the interface
  return { 
    // This fake server will be ignored since we use the server from optimized-index.ts
    listening: false 
  };
}