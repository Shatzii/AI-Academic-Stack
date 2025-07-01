/**
 * Environment Variables Utility
 * 
 * This utility provides a safer way to access environment variables
 * without running into the Vite "value.replace is not a function" error.
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
function loadEnvFile() {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const envPath = path.join(path.resolve(__dirname, '..'), '.env');
    
    if (fs.existsSync(envPath)) {
      console.log('📁 Loading environment variables from', envPath);
      return dotenv.parse(fs.readFileSync(envPath, 'utf-8'));
    }
  } catch (error) {
    console.error('❌ Error loading environment variables:', error);
  }
  
  return {};
}

// Apply environment variables safely
export function initializeEnv() {
  const envVars = loadEnvFile();
  
  // Set environment variables as strings
  Object.entries(envVars).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      process.env[key] = String(value);
    } else {
      process.env[key] = '';
    }
  });
  
  console.log('✅ Environment variables loaded and sanitized successfully');
  return true;
}

// Get environment variable with fallback
export function getEnv(key: string, defaultValue = ''): string {
  const value = process.env[key];
  return value !== undefined && value !== null ? String(value) : defaultValue;
}

// Get all environment variables as a safe object with string values only
export function getAllEnv(): Record<string, string> {
  const safeEnv: Record<string, string> = {};
  
  Object.keys(process.env).forEach(key => {
    const value = process.env[key];
    safeEnv[key] = value !== null && value !== undefined ? String(value) : '';
  });
  
  return safeEnv;
}

export default {
  initializeEnv,
  getEnv,
  getAllEnv,
};