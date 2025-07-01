/**
 * Remote Server Service
 * 
 * This service provides methods for connecting to and interacting with
 * the remote ShatziiOS server at 5.161.99.81.
 */

import fetch from 'node-fetch';
import { SERVER_CONFIG, getApiUrl } from '../config/server-config';

export class RemoteServerService {
  /**
   * Make a request to the remote server
   * @param endpoint - API endpoint
   * @param method - HTTP method
   * @param data - Request data (for POST, PUT, PATCH)
   * @returns Response data
   */
  async makeRequest<T = any>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET', 
    data?: any
  ): Promise<T> {
    const url = getApiUrl(endpoint);
    const options: any = {
      method,
      headers: SERVER_CONFIG.DEFAULT_HEADERS,
      // Signal for timeout (fetch doesn't directly support timeout option)
      signal: AbortSignal.timeout(SERVER_CONFIG.CONNECTION_TIMEOUT)
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Remote server error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json() as T;
    } catch (error: any) {
      console.error(`Error connecting to remote server at ${url}:`, error);
      throw new Error(`Failed to connect to remote server: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Check connection to the remote server
   * @returns True if connection is successful
   */
  async checkConnection(): Promise<boolean> {
    try {
      await fetch(SERVER_CONFIG.REMOTE_SERVER_URL, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // Short timeout for status check
      });
      return true;
    } catch (error: any) {
      console.error(`Failed to connect to remote server at ${SERVER_CONFIG.REMOTE_SERVER_URL}:`, error);
      return false;
    }
  }

  /**
   * Forward a request to the remote server
   * @param endpoint - API endpoint
   * @param req - Express request object
   * @returns Remote server response
   */
  async forwardRequest(endpoint: string, req: any): Promise<any> {
    const method = req.method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    return await this.makeRequest(endpoint, method, req.body);
  }
}