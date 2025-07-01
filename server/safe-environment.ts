/**
 * Safe Environment Handling for Vite
 * 
 * This module handles environment variables safely to avoid the
 * "value.replace is not a function" error in Vite.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Back up the original Symbol properties before we patch process.env
const originalSymbols = {};
Object.getOwnPropertySymbols(process.env).forEach(sym => {
  originalSymbols[sym] = process.env[sym];
});

// Safer implementation that doesn't use Proxy
export function patchViteLoadEnvFunction() {
  // Convert all environment variables to strings
  const envVars = {};
  
  // First, get all regular properties
  Object.keys(process.env).forEach(key => {
    const value = process.env[key];
    envVars[key] = (value === null || value === undefined) ? '' : String(value);
  });
  
  // Create a new object with sanitized values
  const safeEnv = { ...envVars };
  
  // Restore original Symbol properties
  Object.getOwnPropertySymbols(originalSymbols).forEach(sym => {
    safeEnv[sym] = originalSymbols[sym];
  });
  
  // Monkey patch the current process.env to use our sanitized values
  // We keep a reference to the original process.env but replace its content
  Object.keys(process.env).forEach(key => {
    delete process.env[key];
  });
  
  Object.keys(safeEnv).forEach(key => {
    process.env[key] = safeEnv[key];
  });
  
  // Make sure that any new values added to process.env are also sanitized
  const originalProcessEnvSet = process.env.__proto__.set;
  if (originalProcessEnvSet) {
    process.env.__proto__.set = function(key, value) {
      return originalProcessEnvSet.call(this, key, (value === null || value === undefined) ? '' : String(value));
    };
  }
  
  return true;
}

// Parse .env file and sanitize values
export function loadAndSanitizeEnv() {
  try {
    // Get the directory of the current module
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    
    // Load .env file
    const envPath = path.join(path.resolve(__dirname, '..'), '.env');
    
    if (fs.existsSync(envPath)) {
      console.log('📁 Loading environment variables from', envPath);
      const envConfig = dotenv.parse(fs.readFileSync(envPath, 'utf-8'));
      
      // Sanitize and apply environment variables
      Object.entries(envConfig).forEach(([key, value]) => {
        // Ensure all values are strings to avoid Vite's value.replace error
        if (value !== null && value !== undefined) {
          process.env[key] = String(value);
        } else {
          process.env[key] = '';
        }
      });
      
      console.log('✅ Environment variables loaded and sanitized successfully');
      
      // Apply the patch for Vite's loadEnv function
      patchViteLoadEnvFunction();
      
      return true;
    } else {
      console.log('⚠️ No .env file found at', envPath);
      return false;
    }
  } catch (error) {
    console.error('❌ Error loading environment variables:', error);
    return false;
  }
}

export default {
  loadAndSanitizeEnv,
  patchViteLoadEnvFunction
};