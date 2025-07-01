/**
 * Curriculum Transformer API
 * 
 * Backend implementation for transforming curriculum content for neurodivergent learners.
 * Provides endpoints for text and file transformation, with support for different
 * learning differences, grade levels, and languages.
 */

import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import * as aiEngineService from '../services/ai-engine-service.js';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'curriculum-' + uniqueSuffix + extension);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Accept PDF, DOC, DOCX, and TXT files
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Word, and text files are allowed.'), false);
    }
  }
});

/**
 * Set up the curriculum transformer routes
 * 
 * @param {Express} app - Express application
 */
export default function setupCurriculumTransformerRoutes(app) {
  // Route to check API status
  app.get('/api/curriculum-transformer/status', (req, res) => {
    res.json({
      status: 'online',
      version: '1.0.0',
      message: 'Curriculum transformer API is running'
    });
  });

  // Route to get supported options
  app.get('/api/curriculum-transformer/options', (req, res) => {
    res.json({
      learningDifferences: ['dyslexia', 'adhd', 'autism', 'all'],
      gradeLevels: ['elementary', 'middle', 'highschool', 'college'],
      visualStyles: ['superhero', 'modern', 'professional'],
      languages: ['en', 'de', 'es']
    });
  });

  // Route to transform text content
  app.post('/api/curriculum-transformer/transform-text', async (req, res) => {
    try {
      const { text, options } = req.body;
      
      if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'Text content is required' });
      }
      
      if (!options) {
        return res.status(400).json({ message: 'Transformation options are required' });
      }
      
      // Process the text based on learning difference
      const transformedContent = await transformCurriculumText(text, options);
      
      res.json(transformedContent);
    } catch (error) {
      console.error('Error transforming text:', error);
      res.status(500).json({ message: 'Error transforming curriculum text: ' + error.message });
    }
  });

  // Route to transform uploaded file
  app.post('/api/curriculum-transformer/transform-file', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'File is required' });
      }
      
      const filePath = req.file.path;
      let options;
      
      try {
        options = JSON.parse(req.body.options);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid options format' });
      }
      
      // Extract text from the file based on type
      const extractedText = await extractTextFromFile(filePath, req.file.mimetype);
      
      // Process the text based on learning difference
      const transformedContent = await transformCurriculumText(extractedText, options);
      
      // Add file metadata
      transformedContent.metadata = {
        ...transformedContent.metadata,
        originalFileName: req.file.originalname,
        fileSize: req.file.size
      };
      
      // Clean up the uploaded file
      try {
        await unlink(filePath);
      } catch (cleanupError) {
        console.error('Error cleaning up temporary file:', cleanupError);
      }
      
      res.json(transformedContent);
    } catch (error) {
      console.error('Error transforming file:', error);
      
      // Clean up the uploaded file in case of error
      if (req.file && req.file.path) {
        try {
          await unlink(req.file.path);
        } catch (cleanupError) {
          console.error('Error cleaning up temporary file:', cleanupError);
        }
      }
      
      res.status(500).json({ message: 'Error transforming file: ' + error.message });
    }
  });
}

/**
 * Transform curriculum text for neurodivergent learners
 * 
 * @param {string} text - The original text content
 * @param {Object} options - Transformation options
 * @returns {Promise<Object>} - Transformed content
 */
async function transformCurriculumText(text, options) {
  const { learningDifference, gradeLevel, visualStyle, outputLanguage } = options;
  
  try {
    // Prepare the prompt for the AI
    const systemPrompt = `You are an educational specialist for neurodivergent learners with expertise in transforming curriculum content. 
Transform the provided educational content to make it more accessible for students with ${learningDifference === 'all' ? 'various learning differences including dyslexia, ADHD, and autism spectrum' : learningDifference}. 
Target the transformation for ${gradeLevel} level students. 
Use a ${visualStyle} visual style for the presentation.
For dyslexia: Use shorter paragraphs, clearer font guidance, and simplified vocabulary where needed.
For ADHD: Create focused chunks with clear visual breaks, numbered lists, and summary points.
For autism spectrum: Use clear, direct language, explain metaphors, and provide structured content.
For all: Combine all techniques while maintaining the core educational content.

Output in ${outputLanguage === 'en' ? 'English' : outputLanguage === 'de' ? 'German' : 'Spanish'} language.

FORMAT YOUR RESPONSE AS VALID HTML CONTENT that can be directly embedded in the application.
Start with a title and include well-structured content with appropriate headings, paragraphs, lists, and visual guidance.`;

    // Extract a title from the original text (first line or first sentence)
    const title = extractTitle(text);

    // Process with AI service
    console.log('Sending transformation request to AI service');
    const transformedContent = await aiEngineService.generateText(systemPrompt, text);
    
    return {
      title,
      content: transformedContent,
      metadata: {
        originalLength: text.length,
        transformedLength: transformedContent.length,
        options
      }
    };
  } catch (error) {
    console.error('Error during text transformation:', error);
    
    // Fallback implementation if AI service fails
    return generateFallbackTransformation(text, options);
  }
}

/**
 * Extract text from uploaded file based on file type
 * 
 * @param {string} filePath - Path to the uploaded file
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<string>} - Extracted text content
 */
async function extractTextFromFile(filePath, mimeType) {
  // For this implementation, we'll handle only text files directly
  // For PDF and Word files, we'd typically use libraries like pdf-parse or mammoth
  
  if (mimeType === 'text/plain') {
    const buffer = await readFile(filePath);
    return buffer.toString('utf-8');
  }
  
  // For other file types, we'd need to implement extraction logic
  // For now, return a placeholder response
  return `This is extracted text from a file of type: ${mimeType}. 
In a production environment, we would use specialized libraries to extract
text from PDF and Word documents. For this demonstration, we'll work with
this placeholder text to show the transformation process.`;
}

/**
 * Extract a title from the original text
 * 
 * @param {string} text - Original text content
 * @returns {string} - Extracted title
 */
function extractTitle(text) {
  // Try to get the first line as title
  const firstLine = text.split('\n')[0].trim();
  
  if (firstLine && firstLine.length > 0 && firstLine.length < 100) {
    return firstLine;
  }
  
  // Try to get the first sentence
  const firstSentence = text.split(/[.!?][\s\\r\\n]/)[0];
  
  if (firstSentence && firstSentence.length > 0 && firstSentence.length < 100) {
    return firstSentence;
  }
  
  // Default title
  return 'Transformed Curriculum';
}

/**
 * Generate a fallback transformation when AI service is unavailable
 * 
 * @param {string} text - Original text content
 * @param {Object} options - Transformation options
 * @returns {Object} - Fallback transformed content
 */
function generateFallbackTransformation(text, options) {
  const { learningDifference, visualStyle } = options;
  
  // Generate a simple HTML structure with the text
  let content = '<div class="transformed-content">';
  
  // Add appropriate styling based on options
  switch (learningDifference) {
    case 'dyslexia':
      content += '<div class="dyslexia-friendly">';
      content += '<h3>Dyslexia-Friendly Version</h3>';
      content += '<p style="font-family: Arial; line-height: 1.8; letter-spacing: 0.5px; word-spacing: 3px;">';
      content += text.split('\n').join('</p><p style="font-family: Arial; line-height: 1.8; letter-spacing: 0.5px; word-spacing: 3px;">');
      content += '</p></div>';
      break;
      
    case 'adhd':
      content += '<div class="adhd-friendly">';
      content += '<h3>ADHD-Friendly Version</h3>';
      // Divide content into smaller chunks with visual breaks
      const adhdChunks = text.split('\n').filter(line => line.trim() !== '');
      adhdChunks.forEach(chunk => {
        content += `<div class="focus-block" style="margin-bottom: 20px; padding: 15px; border-left: 5px solid #3f51b5;">${chunk}</div>`;
      });
      content += '</div>';
      break;
      
    case 'autism':
      content += '<div class="autism-friendly">';
      content += '<h3>Autism-Friendly Version</h3>';
      content += '<p style="font-family: sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">';
      content += text.split('\n').join('</p><p style="font-family: sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">');
      content += '</p></div>';
      break;
      
    default: // 'all'
      content += '<div class="neurodivergent-friendly">';
      content += '<h3>Universally Accessible Version</h3>';
      
      // Combine features from all adaptations
      const allChunks = text.split('\n').filter(line => line.trim() !== '');
      allChunks.forEach(chunk => {
        content += `<div class="universal-block" style="margin-bottom: 20px; padding: 15px; border-left: 5px solid #4caf50; line-height: 1.8; letter-spacing: 0.5px; word-spacing: 3px; background-color: #f9f9f9; border-radius: 5px;">${chunk}</div>`;
      });
      content += '</div>';
  }
  
  // Add visual style based on options
  switch (visualStyle) {
    case 'superhero':
      content += '<div class="superhero-theme" style="margin-top: 30px;">';
      content += '<h4 style="color: #4caf50;">Superhero Learning Powers Activated! 💪</h4>';
      content += '<p>This content has super powers to help you learn better!</p>';
      content += '</div>';
      break;
      
    case 'modern':
      content += '<div class="modern-theme" style="margin-top: 30px;">';
      content += '<h4 style="color: #2196f3;">Modern Learning Format</h4>';
      content += '<p>Streamlined for your learning style.</p>';
      content += '</div>';
      break;
      
    case 'professional':
      content += '<div class="professional-theme" style="margin-top: 30px;">';
      content += '<h4 style="color: #3f51b5;">Professional Learning Edition</h4>';
      content += '<p>Optimized for advanced educational needs.</p>';
      content += '</div>';
      break;
  }
  
  content += '</div>';
  
  // Extract title from original text
  const title = extractTitle(text);
  
  return {
    title,
    content,
    metadata: {
      originalLength: text.length,
      transformedLength: content.length,
      options,
      generatedBy: 'fallback'
    }
  };
}