/**
 * Content Transformation Routes
 * 
 * API routes for transforming educational content for neurodivergent learners.
 */

import { Router } from 'express';
import { z } from 'zod';
import { ContentTransformerService } from '../services/content-transformation/transformer-service';
import { NeurodivergentType, transformationStatusEnum } from '@shared/schema';
import { db } from '../db';
import { transformedContent, learningProfiles } from '@shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import fileUpload from 'express-fileupload';
import fetch from 'node-fetch';

export const router = Router();
const transformer = new ContentTransformerService();

// Enable file uploads
router.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  abortOnLimit: true,
  createParentPath: true
}));

// Schema for content transformation requests
const transformContentSchema = z.object({
  userId: z.number(),
  assignmentId: z.number().optional(),
  sourceMaterialUrl: z.string().url().optional(),
  sourceContent: z.string().optional(),
  transformationType: z.enum([
    NeurodivergentType.DYSLEXIA, 
    NeurodivergentType.ADHD, 
    NeurodivergentType.AUTISM_SPECTRUM, 
    NeurodivergentType.COMBINED, 
    NeurodivergentType.OTHER
  ]).optional(),
});

// Transform content
router.post('/transform', async (req, res) => {
  try {
    const validatedData = transformContentSchema.parse(req.body);
    
    // Ensure at least one source is provided
    if (!validatedData.sourceContent && !validatedData.sourceMaterialUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Either sourceContent or sourceMaterialUrl must be provided' 
      });
    }
    
    const result = await transformer.transformContent(validatedData);
    
    if (result.success) {
      res.json({ 
        success: true, 
        transformedContentId: result.transformedContentId,
        data: result.data
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: result.error || 'Failed to transform content' 
      });
    }
  } catch (error: any) {
    console.error('Error transforming content:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Invalid request data'
    });
  }
});

// Transform content from URL
router.post('/transform/url', async (req, res) => {
  try {
    const { userId, url, transformationType } = req.body;
    
    if (!userId || !url) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and URL are required' 
      });
    }
    
    // Fetch content from URL
    const response = await fetch(url);
    const content = await response.text();
    
    // Transform the content
    const result = await transformer.transformContent({
      userId,
      sourceMaterialUrl: url,
      sourceContent: content,
      transformationType
    });
    
    if (result.success) {
      res.json({ 
        success: true, 
        transformedContentId: result.transformedContentId,
        data: result.data
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: result.error || 'Failed to transform content' 
      });
    }
  } catch (error: any) {
    console.error('Error transforming content from URL:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to transform content from URL'
    });
  }
});

// Transform content from file upload
router.post('/transform/file', async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No files were uploaded' 
      });
    }
    
    const userId = parseInt(req.body.userId);
    const transformationType = req.body.transformationType;
    
    if (isNaN(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid user ID is required' 
      });
    }
    
    // Get the uploaded file
    const uploadedFile = req.files.file as fileUpload.UploadedFile;
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Save the file
    const fileName = `${Date.now()}-${uploadedFile.name}`;
    const filePath = path.join(uploadsDir, fileName);
    await uploadedFile.mv(filePath);
    
    // Read the file content
    let content = '';
    if (uploadedFile.mimetype.includes('text') || uploadedFile.name.endsWith('.txt')) {
      content = fs.readFileSync(filePath, 'utf8');
    } else {
      // For non-text files, just use the file name as the content
      // In a real implementation, we would use OCR or other processing based on file type
      content = `File uploaded: ${uploadedFile.name}`;
    }
    
    // Transform the content
    const result = await transformer.transformContent({
      userId,
      sourceContent: content,
      sourceMaterialUrl: `/uploads/${fileName}`,
      transformationType
    });
    
    if (result.success) {
      res.json({ 
        success: true, 
        transformedContentId: result.transformedContentId,
        data: result.data
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: result.error || 'Failed to transform content' 
      });
    }
  } catch (error: any) {
    console.error('Error transforming content from file:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to transform content from file'
    });
  }
});

// Get transformed content by ID
router.get('/content/:transformedContentId', async (req, res) => {
  try {
    const transformedContentId = parseInt(req.params.transformedContentId);
    if (isNaN(transformedContentId)) {
      return res.status(400).json({ success: false, message: 'Invalid transformed content ID' });
    }
    
    const content = await db.select().from(transformedContent)
      .where(eq(transformedContent.id, transformedContentId));
    
    if (content.length === 0) {
      return res.status(404).json({ success: false, message: 'Transformed content not found' });
    }
    
    res.json({ success: true, content: content[0] });
  } catch (error: any) {
    console.error('Error fetching transformed content:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch transformed content'
    });
  }
});

// Get all transformed content for a user
router.get('/content/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    
    const content = await db.select().from(transformedContent)
      .where(eq(transformedContent.userId, userId));
    
    res.json({ success: true, content });
  } catch (error: any) {
    console.error('Error fetching user transformed content:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch user transformed content'
    });
  }
});

// Get transformed content for a specific assignment
router.get('/content/assignment/:assignmentId/user/:userId', async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.assignmentId);
    const userId = parseInt(req.params.userId);
    
    if (isNaN(assignmentId) || isNaN(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid assignment ID or user ID' 
      });
    }
    
    const content = await db.select().from(transformedContent)
      .where(eq(transformedContent.assignmentId, assignmentId))
      .where(eq(transformedContent.userId, userId));
    
    if (content.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transformed content not found for this assignment and user' 
      });
    }
    
    res.json({ success: true, content: content[0] });
  } catch (error: any) {
    console.error('Error fetching assignment transformed content:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch assignment transformed content'
    });
  }
});