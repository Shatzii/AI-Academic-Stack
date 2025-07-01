/**
 * PowerSchool Integration Service
 * 
 * This service provides methods for connecting to and interacting with the PowerSchool API.
 * It handles authentication, data retrieval, and transformation between PowerSchool and ShatziiOS.
 */

import axios from 'axios';
import { LmsProvider, type InsertLmsConnection, type InsertLmsClass, type InsertLmsAssignment } from '@shared/schema';
import { db } from '../../db';
import { lmsConnections, lmsClasses, lmsAssignments } from '@shared/schema';
import { eq } from 'drizzle-orm';

export interface PowerSchoolAuth {
  clientId: string;
  clientSecret: string;
  district: string;
}

export class PowerSchoolService {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;

  constructor(auth: PowerSchoolAuth) {
    this.baseUrl = `https://${auth.district}.powerschool.com`;
    this.clientId = auth.clientId;
    this.clientSecret = auth.clientSecret;
  }

  /**
   * Authenticate with PowerSchool API and get access token
   */
  async authenticate(): Promise<string> {
    try {
      const authString = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(
        `${this.baseUrl}/oauth/access_token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          }
        }
      );

      return response.data.access_token;
    } catch (error: any) {
      console.error('PowerSchool authentication failed:', error.message);
      throw new Error(`Failed to authenticate with PowerSchool: ${error.message}`);
    }
  }

  /**
   * Get student information from PowerSchool
   */
  async getStudentInfo(accessToken: string, studentId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/ws/v1/student/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        }
      );

      return response.data.student;
    } catch (error: any) {
      console.error('Failed to get student info:', error.message);
      throw new Error(`Failed to get student info: ${error.message}`);
    }
  }

  /**
   * Get student's classes from PowerSchool
   */
  async getStudentClasses(accessToken: string, studentId: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/ws/v1/student/${studentId}/section`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        }
      );

      return response.data.sections.section || [];
    } catch (error: any) {
      console.error('Failed to get student classes:', error.message);
      throw new Error(`Failed to get student classes: ${error.message}`);
    }
  }

  /**
   * Get assignments for a specific class from PowerSchool
   */
  async getClassAssignments(accessToken: string, studentId: string, sectionId: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/ws/v1/student/${studentId}/section/${sectionId}/assignment`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        }
      );

      return response.data.assignments.assignment || [];
    } catch (error: any) {
      console.error('Failed to get class assignments:', error.message);
      throw new Error(`Failed to get class assignments: ${error.message}`);
    }
  }

  /**
   * Store PowerSchool connection in the database
   */
  async storeConnection(userId: number, accessToken: string, refreshToken: string, providerUserId: string): Promise<number> {
    try {
      const connectionData: InsertLmsConnection = {
        userId,
        provider: LmsProvider.POWERSCHOOL,
        accessToken,
        refreshToken,
        tokenExpiry: new Date(Date.now() + 3600 * 1000), // Assumes 1 hour token lifetime
        instanceUrl: this.baseUrl,
        providerUserId,
        providerUsername: '', // Will be filled after getting user info
        isActive: true,
        additionalInfo: {}
      };

      const [connection] = await db.insert(lmsConnections).values(connectionData).returning();
      return connection.id;
    } catch (error: any) {
      console.error('Failed to store PowerSchool connection:', error.message);
      throw new Error(`Failed to store PowerSchool connection: ${error.message}`);
    }
  }

  /**
   * Sync student's PowerSchool classes to the database
   */
  async syncClasses(connectionId: number, classes: any[]): Promise<void> {
    try {
      for (const psClass of classes) {
        const classData: InsertLmsClass = {
          connectionId,
          providerClassId: psClass.id.toString(),
          name: psClass.course_title || 'Unnamed Class',
          description: psClass.course_description || '',
          section: psClass.section_number || '',
          grade: psClass.grade_level || '',
          subject: psClass.course_number || '',
          teacherIds: [psClass.teacher_id?.toString() || ''],
          isActive: true,
          additionalInfo: psClass
        };

        // Check if the class already exists, if not, create it
        const existingClasses = await db.select().from(lmsClasses).where(
          eq(lmsClasses.providerClassId, psClass.id.toString())
        );

        if (existingClasses.length === 0) {
          await db.insert(lmsClasses).values(classData);
        }
      }
    } catch (error: any) {
      console.error('Failed to sync PowerSchool classes:', error.message);
      throw new Error(`Failed to sync PowerSchool classes: ${error.message}`);
    }
  }

  /**
   * Sync assignments for a class to the database
   */
  async syncAssignments(classId: number, assignments: any[]): Promise<void> {
    try {
      for (const psAssignment of assignments) {
        const assignmentData: InsertLmsAssignment = {
          classId,
          providerAssignmentId: psAssignment.id.toString(),
          title: psAssignment.name || 'Unnamed Assignment',
          description: psAssignment.description || '',
          contentType: this.mapAssignmentType(psAssignment.type || ''),
          dueDate: psAssignment.due_date ? new Date(psAssignment.due_date) : undefined,
          pointsPossible: psAssignment.total_points ? parseInt(psAssignment.total_points) : undefined,
          materials: {},
          attachmentUrls: [],
          isActive: true,
          additionalInfo: psAssignment
        };

        // Check if the assignment already exists, if not, create it
        const existingAssignments = await db.select().from(lmsAssignments).where(
          eq(lmsAssignments.providerAssignmentId, psAssignment.id.toString())
        );

        if (existingAssignments.length === 0) {
          await db.insert(lmsAssignments).values(assignmentData);
        }
      }
    } catch (error: any) {
      console.error('Failed to sync PowerSchool assignments:', error.message);
      throw new Error(`Failed to sync PowerSchool assignments: ${error.message}`);
    }
  }

  /**
   * Map PowerSchool assignment types to our system's content types
   */
  private mapAssignmentType(psType: string): string {
    const typeMap: Record<string, string> = {
      'Assignment': 'assignment',
      'Quiz': 'quiz',
      'Test': 'test',
      'Project': 'project',
      'Homework': 'assignment',
      'Essay': 'assignment',
      'Final': 'test',
      'Lab': 'assignment'
    };

    return typeMap[psType] || 'other';
  }

  /**
   * Run a complete sync for a user
   */
  async syncUserData(userId: number, providerUserId: string, accessToken: string, refreshToken: string): Promise<void> {
    try {
      // Store the connection
      const connectionId = await this.storeConnection(userId, accessToken, refreshToken, providerUserId);
      
      // Get student info
      const studentInfo = await this.getStudentInfo(accessToken, providerUserId);
      
      // Update connection with username
      await db.update(lmsConnections)
        .set({ 
          providerUsername: `${studentInfo.name.first_name} ${studentInfo.name.last_name}`,
          lastSynced: new Date()
        })
        .where(eq(lmsConnections.id, connectionId));
      
      // Get and sync classes
      const classes = await this.getStudentClasses(accessToken, providerUserId);
      await this.syncClasses(connectionId, classes);
      
      // For each class, sync assignments
      for (const psClass of classes) {
        const dbClass = await db.select().from(lmsClasses)
          .where(eq(lmsClasses.providerClassId, psClass.id.toString()));
        
        if (dbClass.length > 0) {
          const assignments = await this.getClassAssignments(accessToken, providerUserId, psClass.id);
          await this.syncAssignments(dbClass[0].id, assignments);
        }
      }
    } catch (error: any) {
      console.error('Failed to sync PowerSchool user data:', error.message);
      throw new Error(`Failed to sync PowerSchool user data: ${error.message}`);
    }
  }
}