/**
 * Sentinel 4.5 Enhanced File Guard System
 * 
 * This module provides a multi-stage validation process for all file uploads
 * including MIME type verification, virus scanning simulation, and content analysis.
 */

import { Request } from 'express';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { promisify } from 'util';
import { ALLOWED_FILE_EXTENSIONS, FILE_SIZE_LIMIT_MB } from './config';
import { logSecurityEvent } from './audit-log';
import { sendAlert, AlertSeverity, AlertType } from './alert-system';

// Convert callbacks to promises
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
const statAsync = promisify(fs.stat);
const unlinkAsync = promisify(fs.unlink);

// File size limit in bytes
const MAX_FILE_SIZE = FILE_SIZE_LIMIT_MB * 1024 * 1024;

// Safe storage directory for uploads
const UPLOAD_DIR = './uploads';

// Create uploads directory if it doesn't exist
(async function initUploadDir() {
  try {
    await statAsync(UPLOAD_DIR);
  } catch (err) {
    await mkdirAsync(UPLOAD_DIR, { recursive: true });
  }
})();

// Expanded MIME type mapping
const MIME_TYPES: Record<string, string[]> = {
  'txt': ['text/plain'],
  'pdf': ['application/pdf'],
  'png': ['image/png'],
  'jpg': ['image/jpeg'],
  'jpeg': ['image/jpeg'],
  'gif': ['image/gif'],
  'svg': ['image/svg+xml'],
  'doc': ['application/msword'],
  'docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  'ppt': ['application/vnd.ms-powerpoint'],
  'pptx': ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  'xls': ['application/vnd.ms-excel'],
  'xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  'csv': ['text/csv'],
  'json': ['application/json'],
  'xml': ['application/xml', 'text/xml'],
  'zip': ['application/zip'],
  'mp3': ['audio/mpeg'],
  'wav': ['audio/wav'],
  'mp4': ['video/mp4'],
  'webm': ['video/webm'],
  'ogg': ['audio/ogg', 'video/ogg'],
};

// Suspicious file content patterns
const SUSPICIOUS_PATTERNS = [
  // PHP code
  /<\?php/i,
  // JavaScript potentially malicious patterns
  /eval\s*\(/i,
  /document\.cookie/i,
  // Potential SQL injection in files
  /UNION\s+SELECT/i,
  // Shell commands
  /exec\s*\(/i,
  /system\s*\(/i,
  // IFrame injection
  /<iframe/i,
  // Script injection
  /<script/i,
  // Common exploit strings
  /\/etc\/passwd/i,
  /\.\.\/\.\.\//i, // Path traversal
];

// Additional binary file magic number checks
const MAGIC_NUMBERS: Record<string, Buffer[]> = {
  'jpg': [Buffer.from([0xFF, 0xD8, 0xFF])],
  'png': [Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])],
  'gif': [Buffer.from('GIF87a'), Buffer.from('GIF89a')],
  'pdf': [Buffer.from('%PDF')],
  'zip': [Buffer.from([0x50, 0x4B, 0x03, 0x04])],
  'docx': [Buffer.from([0x50, 0x4B, 0x03, 0x04])], // Same as ZIP
  'xlsx': [Buffer.from([0x50, 0x4B, 0x03, 0x04])], // Same as ZIP
  'pptx': [Buffer.from([0x50, 0x4B, 0x03, 0x04])], // Same as ZIP
};

/**
 * File validation stages
 */
interface ValidationStage {
  name: string;
  description: string;
  validate: (file: FileUpload) => Promise<ValidationResult>;
}

interface ValidationResult {
  passed: boolean;
  issues: string[];
}

interface FileUpload {
  originalFilename: string;
  mimetype: string;
  size: number;
  path: string;
  extension: string;
  buffer: Buffer;
}

/**
 * Different validation stages for file uploads
 */
const validationStages: ValidationStage[] = [
  {
    name: 'basic',
    description: 'Basic file validation (size, extension)',
    validate: async (file) => {
      const issues: string[] = [];
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        issues.push(`File size exceeds limit of ${FILE_SIZE_LIMIT_MB}MB`);
      }
      
      // Check file extension
      if (!ALLOWED_FILE_EXTENSIONS.has(file.extension)) {
        issues.push(`File type .${file.extension} is not allowed`);
      }
      
      return {
        passed: issues.length === 0,
        issues
      };
    }
  },
  {
    name: 'mime',
    description: 'MIME type verification',
    validate: async (file) => {
      const issues: string[] = [];
      
      // Check if MIME type matches extension
      const allowedMimeTypes = MIME_TYPES[file.extension] || [];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        issues.push(`MIME type ${file.mimetype} does not match extension .${file.extension}`);
      }
      
      return {
        passed: issues.length === 0,
        issues
      };
    }
  },
  {
    name: 'magic',
    description: 'File header (magic number) verification',
    validate: async (file) => {
      const issues: string[] = [];
      
      // Check magic numbers for binary files
      const magicNumbers = MAGIC_NUMBERS[file.extension];
      if (magicNumbers && file.buffer.length > 0) {
        const headerMatches = magicNumbers.some(magic => 
          file.buffer.slice(0, magic.length).equals(magic)
        );
        
        if (!headerMatches) {
          issues.push(`File header does not match expected format for .${file.extension}`);
        }
      }
      
      return {
        passed: issues.length === 0,
        issues
      };
    }
  },
  {
    name: 'content',
    description: 'File content analysis',
    validate: async (file) => {
      const issues: string[] = [];
      
      // Skip binary files
      const binaryExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'mp3', 'mp4', 'webm', 'ogg', 'wav'];
      if (binaryExtensions.includes(file.extension)) {
        return { passed: true, issues: [] };
      }
      
      // Check for suspicious patterns in text files
      try {
        const content = file.buffer.toString('utf8');
        
        for (const pattern of SUSPICIOUS_PATTERNS) {
          if (pattern.test(content)) {
            issues.push(`File contains potentially malicious pattern: ${pattern.toString()}`);
          }
        }
      } catch (err) {
        issues.push('Unable to analyze file content');
      }
      
      return {
        passed: issues.length === 0,
        issues
      };
    }
  },
  {
    name: 'virusCheck',
    description: 'Virus scan simulation',
    validate: async (file) => {
      // This is a simulation of a virus scan
      // In a real application, you would integrate with an antivirus API
      
      const issues: string[] = [];
      
      // Simulate virus scan with some heuristics
      const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
      
      // "Detect" virus if hash ends with specific pattern (simulation only)
      if (fileHash.endsWith('00') || fileHash.endsWith('ff')) {
        issues.push('File appears to contain malicious code (virus detected)');
      }
      
      // Simulate delayed scan
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return {
        passed: issues.length === 0,
        issues
      };
    }
  }
];

/**
 * Process and validate file upload
 */
export async function processFileUpload(
  req: Request,
  uploadedFile: any
): Promise<{ success: boolean; filename?: string; path?: string; error?: string; issues?: string[] }> {
  return new Promise(async (resolve) => {
    try {
      if (!uploadedFile) {
        return resolve({ success: false, error: 'No file provided' });
      }
      
      // Ensure upload directory exists
      try {
        await statAsync(UPLOAD_DIR);
      } catch (err) {
        await mkdirAsync(UPLOAD_DIR, { recursive: true });
      }
      
      // Get file information
      const originalFilename = uploadedFile.name;
      const fileExtension = path.extname(originalFilename).toLowerCase().substring(1);
      
      // Create a File object for validation
      const fileBuffer = await readFileAsync(uploadedFile.tempFilePath);
      const fileUpload: FileUpload = {
        originalFilename,
        mimetype: uploadedFile.mimetype,
        size: uploadedFile.size,
        path: uploadedFile.tempFilePath,
        extension: fileExtension,
        buffer: fileBuffer
      };
      
      // Run all validation stages
      const validationResults = await Promise.all(
        validationStages.map(stage => stage.validate(fileUpload))
      );
      
      // Collect all issues
      const allIssues = validationResults.flatMap(result => result.issues);
      
      // Check if any validation failed
      const securityCheck = {
        passed: validationResults.every(result => result.passed),
        issues: allIssues
      };
      
      if (!securityCheck.passed) {
        // Log security event for failed validation
        logSecurityEvent(
          (req as any).user?.username || 'anonymous',
          'File upload rejected due to security check',
          { 
            filename: uploadedFile.name, 
            issues: securityCheck.issues 
          },
          req.ip
        );
        
        // Send security alert
        sendAlert(
          AlertSeverity.HIGH,
          AlertType.FILE_UPLOAD,
          'Blocked upload of potentially malicious file',
          { 
            filename: uploadedFile.name, 
            issues: securityCheck.issues,
            user: (req as any).user?.username || 'anonymous'
          },
          (req as any).user?.username || 'anonymous',
          req.ip,
          req.headers['user-agent'] as string
        );
        
        // Clean up the temporary file
        try {
          await unlinkAsync(uploadedFile.tempFilePath);
        } catch (err) {
          console.error('Error deleting temporary file:', err);
        }
        
        return resolve({ 
          success: false, 
          error: 'File failed security scan',
          issues: securityCheck.issues
        });
      }
      
      // Generate a secure filename
      const timestamp = Date.now();
      const randomString = crypto.randomBytes(8).toString('hex');
      const secureFilename = `${timestamp}-${randomString}.${fileExtension}`;
      const filePath = path.join(UPLOAD_DIR, secureFilename);
      
      // Move file to permanent location
      await writeFileAsync(filePath, fileBuffer);
      
      // Clean up the temporary file
      try {
        await unlinkAsync(uploadedFile.tempFilePath);
      } catch (err) {
        console.error('Error deleting temporary file:', err);
      }
      
      // Log successful upload
      logSecurityEvent(
        (req as any).user?.username || 'anonymous',
        'File uploaded successfully',
        { 
          originalFilename: uploadedFile.name, 
          secureFilename,
          size: uploadedFile.size
        },
        req.ip
      );
      
      return resolve({ 
        success: true, 
        filename: secureFilename, 
        path: filePath 
      });
    } catch (error) {
      console.error('Error processing file upload:', error);
      
      // Clean up temporary file if it exists
      if (uploadedFile && uploadedFile.tempFilePath) {
        try {
          await unlinkAsync(uploadedFile.tempFilePath);
        } catch (err) {
          console.error('Error deleting temporary file:', err);
        }
      }
      
      return resolve({ 
        success: false, 
        error: 'Error processing file upload' 
      });
    }
  });
}