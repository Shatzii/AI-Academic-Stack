import { Response } from 'express';

/**
 * Standard API response formatter
 */
export const apiResponse = (
  res: Response, 
  statusCode: number, 
  success: boolean, 
  message: string, 
  data?: any
): Response => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

/**
 * Create a success response
 */
export const successResponse = (
  res: Response, 
  message: string = 'Success', 
  data?: any
): Response => {
  return apiResponse(res, 200, true, message, data);
};

/**
 * Create a created response for new resources
 */
export const createdResponse = (
  res: Response, 
  message: string = 'Resource created successfully', 
  data?: any
): Response => {
  return apiResponse(res, 201, true, message, data);
};

/**
 * Create a bad request response
 */
export const badRequestResponse = (
  res: Response, 
  message: string = 'Bad request'
): Response => {
  return apiResponse(res, 400, false, message);
};

/**
 * Create an unauthorized response
 */
export const unauthorizedResponse = (
  res: Response, 
  message: string = 'Unauthorized access'
): Response => {
  return apiResponse(res, 401, false, message);
};

/**
 * Create a forbidden response
 */
export const forbiddenResponse = (
  res: Response, 
  message: string = 'Access forbidden'
): Response => {
  return apiResponse(res, 403, false, message);
};

/**
 * Create a not found response
 */
export const notFoundResponse = (
  res: Response, 
  message: string = 'Resource not found'
): Response => {
  return apiResponse(res, 404, false, message);
};

/**
 * Create a conflict response
 */
export const conflictResponse = (
  res: Response, 
  message: string = 'Resource already exists'
): Response => {
  return apiResponse(res, 409, false, message);
};

/**
 * Create a server error response
 */
export const serverErrorResponse = (
  res: Response, 
  message: string = 'Internal server error'
): Response => {
  return apiResponse(res, 500, false, message);
};