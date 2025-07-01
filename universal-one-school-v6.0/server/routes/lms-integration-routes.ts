/**
 * LMS Integration Routes
 * 
 * API routes for connecting to and syncing with Learning Management Systems (LMS).
 */

import { Router } from 'express';
import { z } from 'zod';
import { LmsIntegrationService } from '../services/lms-integration';
import { LmsProvider } from '@shared/schema';
import { db } from '../db';
import { lmsConnections, lmsClasses, lmsAssignments, studentClasses } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

export const router = Router();
const lmsService = new LmsIntegrationService();

// Schema for PowerSchool connection
const powerSchoolConnectionSchema = z.object({
  userId: z.number(),
  providerUserId: z.string(),
  district: z.string(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
});

// Connect to PowerSchool
router.post('/connect/powerschool', async (req, res) => {
  try {
    const { userId, providerUserId, district, clientId, clientSecret, accessToken, refreshToken } 
      = powerSchoolConnectionSchema.parse(req.body);
    
    // Use environment variables if not provided in request
    const finalClientId = clientId || process.env.POWERSCHOOL_CLIENT_ID;
    const finalClientSecret = clientSecret || process.env.POWERSCHOOL_CLIENT_SECRET;
    
    if (!finalClientId || !finalClientSecret) {
      return res.status(400).json({ 
        success: false, 
        message: 'PowerSchool API credentials are required' 
      });
    }
    
    const success = await lmsService.connectToPowerSchool(
      userId, 
      providerUserId,
      {
        clientId: finalClientId,
        clientSecret: finalClientSecret,
        district
      },
      accessToken,
      refreshToken
    );
    
    if (success) {
      res.json({ 
        success: true, 
        message: 'Successfully connected to PowerSchool' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to connect to PowerSchool' 
      });
    }
  } catch (error: any) {
    console.error('Error connecting to PowerSchool:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Invalid request data'
    });
  }
});

// Get user's LMS connections
router.get('/connections/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    
    const connections = await lmsService.getUserConnections(userId);
    
    // Remove sensitive information
    const safeConnections = connections.map(conn => {
      const { accessToken, refreshToken, ...safeConn } = conn;
      return safeConn;
    });
    
    res.json({ success: true, connections: safeConnections });
  } catch (error: any) {
    console.error('Error fetching LMS connections:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch LMS connections'
    });
  }
});

// Sync all LMS data for a user
router.post('/sync/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    
    const success = await lmsService.syncAllUserConnections(userId);
    
    if (success) {
      res.json({ 
        success: true, 
        message: 'Successfully synced LMS data' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to sync LMS data' 
      });
    }
  } catch (error: any) {
    console.error('Error syncing LMS data:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to sync LMS data'
    });
  }
});

// Get classes for a user
router.get('/classes/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    
    // Get the user's connections
    const connections = await db.select().from(lmsConnections)
      .where(eq(lmsConnections.userId, userId));
    
    const allClasses = [];
    
    // For each connection, get the classes
    for (const connection of connections) {
      const classes = await db.select().from(lmsClasses)
        .where(eq(lmsClasses.connectionId, connection.id));
      
      // Add provider info to each class
      const classesWithProvider = classes.map(cls => ({
        ...cls,
        provider: connection.provider,
        providerName: connection.providerUsername || connection.provider
      }));
      
      allClasses.push(...classesWithProvider);
    }
    
    // Also get classes where the user is enrolled as a student
    const enrollments = await db.select({
      class: lmsClasses
    }).from(studentClasses)
      .innerJoin(lmsClasses, eq(studentClasses.classId, lmsClasses.id))
      .where(eq(studentClasses.studentId, userId));
    
    const enrolledClasses = enrollments.map(e => e.class);
    
    // Combine and deduplicate
    const combinedClasses = [...allClasses];
    for (const cls of enrolledClasses) {
      if (!combinedClasses.some(c => c.id === cls.id)) {
        combinedClasses.push(cls);
      }
    }
    
    res.json({ success: true, classes: combinedClasses });
  } catch (error: any) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch classes'
    });
  }
});

// Get assignments for a class
router.get('/assignments/:classId', async (req, res) => {
  try {
    const classId = parseInt(req.params.classId);
    if (isNaN(classId)) {
      return res.status(400).json({ success: false, message: 'Invalid class ID' });
    }
    
    const assignments = await db.select().from(lmsAssignments)
      .where(eq(lmsAssignments.classId, classId));
    
    res.json({ success: true, assignments });
  } catch (error: any) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch assignments'
    });
  }
});

// Disconnect from an LMS
router.delete('/connections/:connectionId', async (req, res) => {
  try {
    const connectionId = parseInt(req.params.connectionId);
    if (isNaN(connectionId)) {
      return res.status(400).json({ success: false, message: 'Invalid connection ID' });
    }
    
    // Soft delete by setting isActive to false
    await db.update(lmsConnections)
      .set({ isActive: false })
      .where(eq(lmsConnections.id, connectionId));
    
    res.json({ 
      success: true, 
      message: 'Successfully disconnected from LMS' 
    });
  } catch (error: any) {
    console.error('Error disconnecting from LMS:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to disconnect from LMS'
    });
  }
});