/**
 * Patched Server Starter
 * 
 * This script sets environment variables and applies necessary patches
 * before starting the main server to work around the Vite environment variable issue.
 */

// Set a default NODE_ENV
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Set a basic VITE_APP_NAME to avoid undefined errors
process.env.VITE_APP_NAME = 'ShotziOS';

// Apply a monkey patch for the Vite loadEnv function
// This is applied before Vite is loaded anywhere to ensure it takes effect
const originalRequire = require;
require = function(id) {
  if (id === 'vite') {
    const vite = originalRequire(id);
    const originalLoadEnv = vite.loadEnv;
    
    // Replace the loadEnv function with a safe version
    vite.loadEnv = function(mode, envDir, prefixes) {
      try {
        return originalLoadEnv(mode, envDir, prefixes);
      } catch (error) {
        console.warn('Error in Vite loadEnv, using fallback environment');
        return {
          MODE: mode || 'development',
          DEV: mode !== 'production',
          PROD: mode === 'production',
          BASE_URL: '/',
          VITE_APP_NAME: 'ShotziOS'
        };
      }
    };
    return vite;
  }
  return originalRequire(id);
};

// Start the server
console.log('🔧 Starting patched server...');
require('tsx')('server/index.ts');