import { Response } from 'express';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { serverErrorResponse, badRequestResponse } from './response';

/**
 * Handle API errors consistently
 * @param res Express response object
 * @param error Error object
 * @returns Express response
 */
export const handleApiError = (res: Response, error: unknown): Response => {
  console.error('API Error:', error);
  
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const validationError = fromZodError(error);
    return badRequestResponse(res, validationError.message);
  }
  
  // Handle custom status code errors
  if (error instanceof Error && 'statusCode' in error) {
    const statusCodeError = error as Error & { statusCode: number };
    return res.status(statusCodeError.statusCode).json({
      success: false,
      message: statusCodeError.message
    });
  }
  
  // Handle generic errors
  return serverErrorResponse(
    res, 
    error instanceof Error ? error.message : 'An unexpected error occurred'
  );
};

/**
 * Create an error object with a specific status code
 * @param message Error message
 * @param statusCode HTTP status code
 * @returns Error object with statusCode property
 */
export const createError = (message: string, statusCode: number): Error & { statusCode: number } => {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  return error;
};

/**
 * Create a not found error
 * @param message Error message
 * @returns Error object with 404 status code
 */
export const createNotFoundError = (message: string = 'Resource not found'): Error & { statusCode: number } => {
  return createError(message, 404);
};

/**
 * Create an unauthorized error
 * @param message Error message
 * @returns Error object with 401 status code
 */
export const createUnauthorizedError = (message: string = 'Unauthorized access'): Error & { statusCode: number } => {
  return createError(message, 401);
};

/**
 * Create a forbidden error
 * @param message Error message
 * @returns Error object with 403 status code
 */
export const createForbiddenError = (message: string = 'Access forbidden'): Error & { statusCode: number } => {
  return createError(message, 403);
};

/**
 * Create a validation error
 * @param message Error message
 * @returns Error object with 400 status code
 */
export const createValidationError = (message: string = 'Validation error'): Error & { statusCode: number } => {
  return createError(message, 400);
};

/**
 * Log error details
 * @param error Error object
 * @param context Additional context information
 */
export const logError = (error: unknown, context: string): void => {
  console.error(`Error in ${context}:`, error);
  
  if (error instanceof Error) {
    console.error(`  Message: ${error.message}`);
    console.error(`  Stack: ${error.stack}`);
  }
};