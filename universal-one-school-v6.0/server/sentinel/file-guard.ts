/**
 * Sentinel 4.5 File Guard System
 * 
 * This module provides secure file upload handling and protection against
 * malicious files.
 */

import { Request } from 'express';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { ALLOWED_FILE_EXTENSIONS, FILE_SIZE_LIMIT_MB } from './config';
import { logSecurityEvent } from './audit-log';
import { sendAlert, AlertSeverity, AlertType } from './alert-system';

// File size limit in bytes
const MAX_FILE_SIZE = FILE_SIZE_LIMIT_MB * 1024 * 1024;

// Suspicious file content patterns
const SUSPICIOUS_PATTERNS = [
  /<script>/i,
  /eval\(/i,
  /document\.cookie/i,
  /XMLHttpRequest/i,
  /execCommand/i,
  /system\(/i,
  /exec\(/i,
  /shell_exec/i,
  /passthru/i
];

/**
 * Check if a file type is allowed
 */
export function isAllowedFileType(filename: string): boolean {
  const extension = path.extname(filename).toLowerCase().substring(1);
  return ALLOWED_FILE_EXTENSIONS.has(extension);
}

/**
 * Sanitize a filename to prevent path traversal attacks
 */
export function sanitizeFilename(filename: string): string {
  // Remove any path information
  const baseName = path.basename(filename);
  
  // Replace special characters
  return baseName
    .replace(/[^a-zA-Z0-9_\-\.]/g, '_')
    .replace(/\.{2,}/g, '.'); // Prevent consecutive dots
}

/**
 * Generate a secure unique filename
 */
export function generateSecureFilename(originalFilename: string): string {
  const extension = path.extname(originalFilename).toLowerCase();
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  
  return `${timestamp}-${randomString}${extension}`;
}

/**
 * Check file content for suspicious patterns
 */
export function checkFileSecurity(filePath: string): { safe: boolean; issues: string[] } {
  try {
    // For text files, check content for suspicious patterns
    const extension = path.extname(filePath).toLowerCase();
    const textFileExtensions = ['.txt', '.html', '.js', '.php', '.xml', '.json', '.csv'];
    
    if (textFileExtensions.includes(extension)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const issues: string[] = [];
      
      SUSPICIOUS_PATTERNS.forEach((pattern, index) => {
        if (pattern.test(content)) {
          issues.push(`Suspicious pattern ${index + 1} detected`);
        }
      });
      
      return {
        safe: issues.length === 0,
        issues
      };
    }
    
    // For non-text files, we consider them safe (could add more checks for binary files)
    return { safe: true, issues: [] };
  } catch (error) {
    return {
      safe: false,
      issues: [`Error scanning file: ${error}`]
    };
  }
}

/**
 * Handle secure file upload
 */
export function handleSecureFileUpload(
  req: any, // Using any type for proper file upload handling with express-fileupload
  fieldName: string = 'file',
  uploadDir: string = './uploads'
): Promise<{ success: boolean; filename?: string; path?: string; error?: string }> {
  return new Promise((resolve) => {
    if (!req.files || !req.files[fieldName]) {
      return resolve({ success: false, error: 'No file uploaded' });
    }
    
    const file = req.files[fieldName];
    const uploadedFile = Array.isArray(file) ? file[0] : file;
    
    // Check file size
    if (uploadedFile.size > MAX_FILE_SIZE) {
      logSecurityEvent(
        (req as any).user?.username || 'anonymous',
        'File upload rejected - size limit exceeded',
        { filename: uploadedFile.name, size: uploadedFile.size, limit: MAX_FILE_SIZE },
        req.ip
      );
      
      return resolve({ 
        success: false, 
        error: `File size exceeds the ${FILE_SIZE_LIMIT_MB}MB limit`
      });
    }
    
    // Check file type
    if (!isAllowedFileType(uploadedFile.name)) {
      logSecurityEvent(
        (req as any).user?.username || 'anonymous',
        'File upload rejected - file type not allowed',
        { filename: uploadedFile.name, extension: path.extname(uploadedFile.name) },
        req.ip
      );
      
      sendAlert(
        AlertSeverity.MEDIUM,
        AlertType.FILE_UPLOAD,
        'Blocked upload of disallowed file type',
        { 
          filename: uploadedFile.name, 
          extension: path.extname(uploadedFile.name),
          user: (req as any).user?.username || 'anonymous'
        },
        (req as any).user?.username || 'anonymous',
        req.ip,
        req.headers['user-agent']
      );
      
      return resolve({ 
        success: false, 
        error: 'File type not allowed'
      });
    }
    
    // Create upload directory if it doesn't exist
    fs.mkdir(uploadDir, { recursive: true }, (mkdirErr) => {
      if (mkdirErr) {
        return resolve({ 
          success: false, 
          error: `Failed to create upload directory: ${mkdirErr.message}`
        });
      }
      
      // Generate secure filename
      const secureFilename = generateSecureFilename(uploadedFile.name);
      const filePath = path.join(uploadDir, secureFilename);
      
      // Save the file
      fs.writeFile(filePath, uploadedFile.data, (writeErr) => {
        if (writeErr) {
          return resolve({ 
            success: false, 
            error: `Failed to save file: ${writeErr.message}`
          });
        }
        
        // Check file content for suspicious patterns
        const securityCheck = checkFileSecurity(filePath);
        
        if (!securityCheck.safe) {
          // Delete the suspicious file
          fs.unlink(filePath, () => {
            logSecurityEvent(
              (req as any).user?.username || 'anonymous',
              'File upload rejected - security scan failed',
              { 
                filename: uploadedFile.name, 
                issues: securityCheck.issues 
              },
              req.ip
            );
            
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
              req.headers['user-agent']
            );
            
            return resolve({ 
              success: false, 
              error: 'File failed security scan' 
            });
          });
        } else {
          // File is safe
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
        }
      });
    });
  });
}