import { Router, Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { analyzeEducationalImage, analyzeStudentArtwork, createVisualAssessment } from '../services/anthropic-multimodal';

export const router = Router();

// Define uploads directory
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
(async () => {
  try {
    await fs.access(UPLOADS_DIR);
  } catch (error) {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
})();

/**
 * @route POST /api/multimodal-ai/analyze-educational-image
 * @desc Analyze an educational image using Anthropic's multimodal capabilities
 * @access Private
 */
router.post('/analyze-educational-image', async (req: Request, res: Response) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageFile = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;
    const { prompt, subject, gradeLevel } = req.body;

    if (!prompt || !subject || !gradeLevel) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['prompt', 'subject', 'gradeLevel'] 
      });
    }

    // Save uploaded file with unique name
    const fileExtension = path.extname(imageFile.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    
    // Use the mv() method to save the file
    await new Promise<void>((resolve, reject) => {
      imageFile.mv(filePath, (err: any) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Process the image with Anthropic
    const analysis = await analyzeEducationalImage(
      filePath,
      prompt,
      subject,
      gradeLevel
    );

    res.json({
      success: true,
      fileName,
      analysis
    });
  } catch (error) {
    console.error('Error analyzing educational image:', error);
    res.status(500).json({ error: 'Failed to analyze image', message: error.message });
  }
});

/**
 * @route POST /api/multimodal-ai/analyze-student-artwork
 * @desc Analyze a student's artwork and provide developmental feedback
 * @access Private
 */
router.post('/analyze-student-artwork', async (req: Request, res: Response) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageFile = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;
    const { studentAge, neurotype, artPrompt } = req.body;

    if (!studentAge || !artPrompt) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['studentAge', 'artPrompt'],
        optional: ['neurotype']
      });
    }

    // Parse numeric values
    const parsedAge = parseInt(studentAge, 10);
    if (isNaN(parsedAge)) {
      return res.status(400).json({ error: 'studentAge must be a number' });
    }

    // Save uploaded file with unique name
    const fileExtension = path.extname(imageFile.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    
    // Use the mv() method to save the file
    await new Promise<void>((resolve, reject) => {
      imageFile.mv(filePath, (err: any) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Process the image with Anthropic
    const feedback = await analyzeStudentArtwork(
      filePath,
      parsedAge,
      neurotype || null,
      artPrompt
    );

    res.json({
      success: true,
      fileName,
      feedback
    });
  } catch (error) {
    console.error('Error analyzing student artwork:', error);
    res.status(500).json({ error: 'Failed to analyze artwork', message: error.message });
  }
});

/**
 * @route POST /api/multimodal-ai/create-visual-assessment
 * @desc Create an assessment based on a visual diagram or chart
 * @access Private
 */
router.post('/create-visual-assessment', async (req: Request, res: Response) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageFile = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;
    const { subject, conceptName, gradeLevel } = req.body;

    if (!subject || !conceptName || !gradeLevel) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['subject', 'conceptName', 'gradeLevel'] 
      });
    }

    // Save uploaded file with unique name
    const fileExtension = path.extname(imageFile.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    
    // Use the mv() method to save the file
    await new Promise<void>((resolve, reject) => {
      imageFile.mv(filePath, (err: any) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Process the image with Anthropic
    const assessment = await createVisualAssessment(
      filePath,
      subject,
      conceptName,
      gradeLevel
    );

    res.json({
      success: true,
      fileName,
      assessment
    });
  } catch (error) {
    console.error('Error creating visual assessment:', error);
    res.status(500).json({ error: 'Failed to create assessment', message: error.message });
  }
});

export default router;