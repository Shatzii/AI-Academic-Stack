/**
 * Curriculum Transformer Service
 * 
 * This service is responsible for transforming traditional curriculum 
 * materials into formats optimized for neurodivergent learners.
 * It leverages worker threads for CPU-intensive processing and
 * integrates with the AI engine for content adaptation.
 */

import { transformCurriculumWithWorker } from '../production-server.js';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { createHash } from 'crypto';

// Supported learning differences
export const LEARNING_DIFFERENCES = {
  DYSLEXIA: 'dyslexia',
  ADHD: 'adhd',
  AUTISM: 'autism'
};

// Supported content types
export const CONTENT_TYPES = {
  TEXT: 'text',
  HTML: 'html',
  MARKDOWN: 'markdown',
  DOCX: 'docx',
  PDF: 'pdf'
};

// Import methods (multiple ways to ingest content)
export const IMPORT_METHODS = {
  TEXT_INPUT: 'text_input',
  FILE_UPLOAD: 'file_upload',
  URL: 'url'
};

// Processing queue for batch operations
const processingQueue = [];
let isProcessing = false;

/**
 * Process the curriculum transformation queue
 */
async function processQueue() {
  if (isProcessing || processingQueue.length === 0) {
    return;
  }
  
  isProcessing = true;
  
  try {
    const task = processingQueue.shift();
    const { content, learningDifference, gradeLevel, options, resolve, reject } = task;
    
    try {
      const result = await transformCurriculum(content, learningDifference, gradeLevel, options);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  } finally {
    isProcessing = false;
    
    // Process the next item if there are any
    if (processingQueue.length > 0) {
      setTimeout(processQueue, 0);
    }
  }
}

/**
 * Add a transformation task to the queue
 */
export function queueTransformation(content, learningDifference, gradeLevel, options = {}) {
  return new Promise((resolve, reject) => {
    processingQueue.push({
      content,
      learningDifference,
      gradeLevel,
      options,
      resolve,
      reject
    });
    
    // Start processing if not already in progress
    if (!isProcessing) {
      processQueue();
    }
  });
}

/**
 * Transform curriculum content for a specific learning difference
 */
export async function transformCurriculum(content, learningDifference, gradeLevel, options = {}) {
  // Validate input parameters
  if (!content || content.trim().length === 0) {
    throw new Error('Content cannot be empty');
  }
  
  if (!Object.values(LEARNING_DIFFERENCES).includes(learningDifference)) {
    throw new Error(`Invalid learning difference: ${learningDifference}`);
  }
  
  if (!gradeLevel || isNaN(parseInt(gradeLevel))) {
    throw new Error('Grade level must be a valid number');
  }
  
  try {
    // Use worker pool for CPU-intensive transformations
    return await transformCurriculumWithWorker(
      content, 
      learningDifference, 
      gradeLevel, 
      options
    );
  } catch (error) {
    console.error('Error transforming curriculum:', error);
    
    // Fallback to a basic transformation if the worker fails
    return await performBasicTransformation(content, learningDifference, gradeLevel, options);
  }
}

/**
 * Basic transformation fallback that doesn't rely on the worker pool
 */
async function performBasicTransformation(content, learningDifference, gradeLevel, options = {}) {
  // Simple fallback transformations based on learning difference
  let transformed = content;
  const adaptations = [];
  
  if (learningDifference === LEARNING_DIFFERENCES.DYSLEXIA) {
    // Basic dyslexia adaptations
    transformed = transformed.replace(/([a-z]{7,})/gi, '<strong>$1</strong>');
    adaptations.push('Highlighted longer words for easier reading');
    
    // Add line spacing
    if (options.format === 'html') {
      transformed = `<div style="line-height: 1.5; letter-spacing: 0.12em;">${transformed}</div>`;
      adaptations.push('Increased line spacing and letter spacing');
    }
  } 
  else if (learningDifference === LEARNING_DIFFERENCES.ADHD) {
    // Basic ADHD adaptations
    transformed = transformed.replace(/\n\n/g, '\n\n<hr />\n\n');
    adaptations.push('Added visual breaks between paragraphs');
    
    // Break longer paragraphs
    const paragraphs = transformed.split('\n\n');
    transformed = paragraphs.map(p => {
      if (p.length > 300) {
        return p.slice(0, 300) + '\n\n' + p.slice(300);
      }
      return p;
    }).join('\n\n');
    adaptations.push('Split longer paragraphs into smaller chunks');
  }
  else if (learningDifference === LEARNING_DIFFERENCES.AUTISM) {
    // Basic autism adaptations
    transformed = transformed.replace(/([!?])/g, '$1\n');
    adaptations.push('Added line breaks after exclamatory sentences');
    
    // Simplify figures of speech
    transformed = transformed.replace(/([Ii]n a nutshell|[Bb]y and large|[Aa] piece of cake)/g, 
      '<span title="This is a figure of speech">$1</span>');
    adaptations.push('Identified figures of speech');
  }
  
  return {
    title: options.title || `Transformed Curriculum (${learningDifference})`,
    original: content,
    transformed: transformed,
    adaptations: adaptations,
    learningDifference: learningDifference,
    gradeLevel: gradeLevel,
    fallback: true
  };
}

/**
 * Transform curriculum from a file upload
 */
export async function transformCurriculumFromFile(file, learningDifference, gradeLevel, options = {}) {
  try {
    let content;
    let fileType = file.mimetype || '';
    
    // Extract content based on file type
    if (fileType.includes('text/plain')) {
      content = file.buffer.toString('utf-8');
      options.format = 'text';
    }
    else if (fileType.includes('text/html')) {
      content = file.buffer.toString('utf-8');
      options.format = 'html';
    }
    else if (fileType.includes('text/markdown')) {
      content = file.buffer.toString('utf-8');
      options.format = 'markdown';
    }
    else if (fileType.includes('application/pdf')) {
      // For PDF we would need a PDF parser library
      // For now, we'll use a basic approach
      content = `[PDF content extraction not implemented yet: ${file.originalname}]`;
      options.format = 'text';
    }
    else if (fileType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      // For DOCX we would need a DOCX parser library
      // For now, we'll use a basic approach
      content = `[DOCX content extraction not implemented yet: ${file.originalname}]`;
      options.format = 'text';
    }
    else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
    
    // Set title from filename if not provided
    if (!options.title) {
      options.title = path.basename(file.originalname, path.extname(file.originalname));
    }
    
    // Transform the extracted content
    return await transformCurriculum(content, learningDifference, gradeLevel, options);
  } catch (error) {
    console.error('Error transforming curriculum from file:', error);
    throw error;
  }
}

/**
 * Save a transformed curriculum to the file system
 */
export async function saveTransformedCurriculum(transformed, options = {}) {
  try {
    const timestamp = Date.now();
    const hash = createHash('md5')
      .update(transformed.original.substring(0, 100))
      .digest('hex')
      .substring(0, 8);
    
    const filename = options.filename || 
      `transform_${transformed.learningDifference}_${hash}_${timestamp}.html`;
    
    const outputDir = options.outputDir || path.join(os.tmpdir(), 'shatzii-transforms');
    await fs.mkdir(outputDir, { recursive: true });
    
    const filePath = path.join(outputDir, filename);
    
    // Create an HTML document with the transformed content
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${transformed.title || 'Transformed Curriculum'}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .adaptations {
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .transformed-content {
      ${transformed.learningDifference === 'dyslexia' ? 
        'line-height: 1.8; letter-spacing: 0.12em; word-spacing: 0.16em;' : ''}
      ${transformed.learningDifference === 'adhd' ? 
        'max-width: 600px; margin: 0 auto;' : ''}
      ${transformed.learningDifference === 'autism' ? 
        'background-color: #f9f9f9; padding: 15px; border-radius: 5px;' : ''}
    }
  </style>
</head>
<body>
  <h1>${transformed.title || 'Transformed Curriculum'}</h1>
  
  <div class="adaptations">
    <h3>Adaptations for ${transformed.learningDifference}</h3>
    <ul>
      ${transformed.adaptations.map(adaptation => `<li>${adaptation}</li>`).join('')}
    </ul>
  </div>
  
  <div class="transformed-content">
    ${transformed.transformed}
  </div>
</body>
</html>`;
    
    await fs.writeFile(filePath, htmlContent, 'utf-8');
    
    return {
      success: true,
      filePath,
      url: `/downloads/${filename}`,
      filename
    };
  } catch (error) {
    console.error('Error saving transformed curriculum:', error);
    throw error;
  }
}