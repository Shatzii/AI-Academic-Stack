// Error handling utilities for Universal One School

export const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error occurred';
};

export const createErrorResponse = (error: unknown, statusCode = 500) => {
  return {
    status: 'error',
    error: formatError(error),
    timestamp: new Date().toISOString(),
    statusCode
  };
};

export const createSuccessResponse = <T>(data: T, metadata?: any) => {
  return {
    success: true,
    data,
    ...metadata,
    timestamp: new Date().toISOString()
  };
};