/**
 * Server Configuration
 * 
 * This file contains configuration settings for connecting to the main ShatziiOS server.
 */

export const SERVER_CONFIG = {
  // Remote server URL
  REMOTE_SERVER_URL: 'http://5.161.99.81',
  
  // Default API version
  API_VERSION: 'v1',
  
  // Connection timeout in milliseconds
  CONNECTION_TIMEOUT: 30000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

/**
 * Get the full API URL for a specific endpoint
 * @param endpoint - API endpoint path
 * @returns Full API URL
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${SERVER_CONFIG.REMOTE_SERVER_URL}/api/${SERVER_CONFIG.API_VERSION}/${cleanEndpoint}`;
}