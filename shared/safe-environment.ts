/**
 * Safe Environment Variables
 * 
 * This file provides environment variables that are guaranteed to be strings,
 * avoiding the "value.replace is not a function" error in Vite's environment
 * variable handling.
 */

export const safeEnv = {
  "VITE_APP_NAME": "ShotziOS",
  "VITE_MODE": "development",
  "VITE_API_URL": "http://localhost:5000/api",
  "VITE_FIREBASE_API_KEY": "AlzaSyALiXNK5Lcl4hfhYon1ARAV-R2gDSbzq4w",
  "VITE_FIREBASE_PROJECT_ID": "admob-app-id-4142168153",
  "VITE_FIREBASE_APP_ID": "4142168153"
};

/**
 * Get a safe environment variable
 * @param {string} key - The environment variable key
 * @param {string} defaultValue - Default value if not found
 * @returns {string} The environment variable value as a string
 */
export function getEnv(key: string, defaultValue: string = ''): string {
  return safeEnv[key] || defaultValue;
}
