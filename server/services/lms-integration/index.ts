/**
 * LMS Integration Service
 * 
 * This service provides a unified interface for interacting with various LMS providers.
 * It handles authentication, data retrieval, and transformation between LMS and ShatziiOS.
 */

import { PowerSchoolService, type PowerSchoolAuth } from './powerschool-service';
import { LmsProvider } from '@shared/schema';
import { db } from '../../db';
import { lmsConnections } from '@shared/schema';
import { eq } from 'drizzle-orm';

export class LmsIntegrationService {
  /**
   * Connect to PowerSchool LMS
   */
  async connectToPowerSchool(
    userId: number,
    providerUserId: string,
    auth: PowerSchoolAuth,
    accessToken?: string,
    refreshToken?: string
  ): Promise<boolean> {
    try {
      const psService = new PowerSchoolService(auth);
      
      // If tokens are not provided, authenticate
      let finalAccessToken = accessToken;
      let finalRefreshToken = refreshToken || '';
      
      if (!finalAccessToken) {
        finalAccessToken = await psService.authenticate();
      }
      
      // Sync user data from PowerSchool
      await psService.syncUserData(userId, providerUserId, finalAccessToken, finalRefreshToken);
      
      return true;
    } catch (error: any) {
      console.error('Failed to connect to PowerSchool:', error.message);
      return false;
    }
  }

  /**
   * Get LMS connections for a user
   */
  async getUserConnections(userId: number) {
    try {
      return await db.select().from(lmsConnections)
        .where(eq(lmsConnections.userId, userId));
    } catch (error: any) {
      console.error('Failed to get user LMS connections:', error.message);
      return [];
    }
  }

  /**
   * Sync data for all of a user's LMS connections
   */
  async syncAllUserConnections(userId: number): Promise<boolean> {
    try {
      const connections = await this.getUserConnections(userId);
      
      for (const connection of connections) {
        switch (connection.provider) {
          case LmsProvider.POWERSCHOOL:
            if (connection.providerUserId && connection.accessToken) {
              const auth: PowerSchoolAuth = {
                clientId: process.env.POWERSCHOOL_CLIENT_ID || '',
                clientSecret: process.env.POWERSCHOOL_CLIENT_SECRET || '',
                district: this.extractDistrictFromUrl(connection.instanceUrl || '')
              };
              
              await this.connectToPowerSchool(
                userId,
                connection.providerUserId,
                auth,
                connection.accessToken,
                connection.refreshToken || undefined
              );
            }
            break;
            
          // Add cases for other LMS providers as they are implemented
          
          default:
            console.warn(`Unsupported LMS provider: ${connection.provider}`);
        }
      }
      
      return true;
    } catch (error: any) {
      console.error('Failed to sync all user LMS connections:', error.message);
      return false;
    }
  }
  
  /**
   * Helper method to extract district name from PowerSchool URL
   */
  private extractDistrictFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const hostnameParts = urlObj.hostname.split('.');
      if (hostnameParts.length >= 3) {
        return hostnameParts[0];
      }
      return '';
    } catch (error) {
      return '';
    }
  }
}