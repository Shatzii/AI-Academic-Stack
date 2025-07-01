/**
 * Environment Variable Handler for ShotziOS
 * 
 * This module provides a robust way to handle environment variables
 * by loading them directly from .env file and properly processing them
 * before Vite or other tools try to access them, which can cause issues
 * with the "value.replace is not a function" error in Vite.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

/**
 * Process .env file and set environment variables
 */
export function setupEnvironment() {
  console.log('🔧 Setting up environment variables...');
  
  try {
    // Path to .env file
    const envPath = path.join(rootDir, '.env');
    
    // Check if .env file exists
    if (fs.existsSync(envPath)) {
      console.log(`🔧 Loading environment variables from ${envPath}`);
      
      // Read .env file
      const envContent = fs.readFileSync(envPath, 'utf8');
      
      // Parse .env content
      const envVars = parseEnvFile(envContent);
      
      // Set environment variables
      for (const [key, value] of Object.entries(envVars)) {
        if (typeof value === 'string') {
          process.env[key] = value;
        } else {
          console.warn(`⚠️ Skipping non-string environment variable: ${key}`);
        }
      }
      
      console.log(`✅ Environment variables loaded successfully`);
    } else {
      console.log('⚠️ No .env file found. Using existing environment variables.');
    }
    
    // Verify critical environment variables
    validateEnvironmentVariables();
    
  } catch (error) {
    console.error('❌ Error setting up environment variables:', error);
  }
}

/**
 * Parse .env file content into key-value pairs
 * @param {string} envContent - Content of .env file
 * @returns {Object} - Key-value pairs of environment variables
 */
function parseEnvFile(envContent) {
  const result = {};
  
  // Split into lines and process each line
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    // Skip comments and empty lines
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }
    
    // Extract key and value
    const equalSignIndex = trimmedLine.indexOf('=');
    if (equalSignIndex > 0) {
      const key = trimmedLine.slice(0, equalSignIndex).trim();
      let value = trimmedLine.slice(equalSignIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Validate that required environment variables are set
 */
function validateEnvironmentVariables() {
  // List of variables to validate
  const criticalVariables = [
    'ANTHROPIC_API_KEY'
  ];
  
  const missing = [];
  
  for (const variable of criticalVariables) {
    if (!process.env[variable]) {
      missing.push(variable);
    }
  }
  
  if (missing.length > 0) {
    console.warn(`⚠️ Missing critical environment variables: ${missing.join(', ')}`);
    console.warn('⚠️ Some functionality may not work correctly.');
  } else {
    console.log('✅ All critical environment variables are set');
  }
}

// If this file is run directly, setup the environment
if (import.meta.url === `file://${process.argv[1]}`) {
  setupEnvironment();
}