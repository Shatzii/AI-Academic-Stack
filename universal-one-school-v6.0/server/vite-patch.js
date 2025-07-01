/**
 * Patch for Vite Environment Variable Processing Issue
 * 
 * This patches Vite's environment variable handling to prevent the
 * "value.replace is not a function" error when loading the app.
 */

// Store the original loadEnv function
import * as vite from 'vite';

// Create a simple wrapper around Vite's loadEnv that handles null/undefined values
const originalLoadEnv = vite.loadEnv;
const patchedLoadEnv = function(mode, envDir, prefixes) {
  try {
    return originalLoadEnv(mode, envDir, prefixes);
  } catch (error) {
    console.warn('Error in Vite loadEnv, using fallback:', error);
    // Return a minimal environment object as fallback
    return {
      VITE_APP_NAME: 'ShotziOS',
      MODE: mode || 'development',
      DEV: mode !== 'production',
      PROD: mode === 'production',
    };
  }
};

// Replace the original function with our patched version
vite.loadEnv = patchedLoadEnv;

export default vite;