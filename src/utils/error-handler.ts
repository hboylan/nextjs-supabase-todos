/**
 * Error handling utilities for server actions
 */

// Define error types
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  DATABASE = 'DATABASE',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  RATE_LIMIT = 'RATE_LIMIT',
  UNKNOWN = 'UNKNOWN'
}

interface ErrorDetails {
  type: ErrorType;
  message: string;
  code?: string;
  context?: Record<string, unknown>;
  originalError?: Error;
}

export class AppError extends Error {
  type: ErrorType;
  code?: string;
  context?: Record<string, unknown>;
  originalError?: Error;

  constructor({ type, message, code, context, originalError }: ErrorDetails) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.code = code;
    this.context = context;
    this.originalError = originalError;
  }
}

/**
 * Format error response to be returned to the client
 * Sanitizes sensitive information and provides user-friendly messages
 */
export function formatErrorResponse(error: Error | AppError | unknown): { error: string } {
  // If it's our AppError, we can handle it specifically
  if (error instanceof AppError) {
    // Log the full error for debugging
    logError(error);
    
    // For validation errors, we want to pass the message as-is
    if (error.type === ErrorType.VALIDATION) {
      return { error: error.message };
    }
    
    // For other error types, use user-friendly messages
    const userMessages = {
      [ErrorType.AUTHENTICATION]: 'Authentication failed. Please sign in again.',
      [ErrorType.AUTHORIZATION]: 'You don\'t have permission to perform this action.',
      [ErrorType.DATABASE]: 'A database error occurred. Please try again later.',
      [ErrorType.EXTERNAL_SERVICE]: 'Unable to connect to an external service. Please try again later.',
      [ErrorType.RATE_LIMIT]: 'Too many requests. Please try again later.',
      [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again later.'
    };
    
    return { error: userMessages[error.type] };
  }
  
  // Regular Error object
  if (error instanceof Error) {
    logError(error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
  
  // Unknown error type
  console.error('Unknown error type:', error);
  return { error: 'An unexpected error occurred. Please try again later.' };
}

/**
 * Log authentication errors with appropriate context
 */
export function logAuthError(error: Error | AppError | unknown, context: Record<string, unknown> = {}) {
  // Add auth-specific context
  const authContext = {
    ...context,
    authAction: context.action || 'unknown',
    timestamp: new Date().toISOString()
  };

  // If it's our AppError, add the context
  if (error instanceof AppError) {
    error.context = { ...error.context, ...authContext };
    logError(error);
    return;
  }
  
  // Otherwise, create a new AppError
  const appError = new AppError({
    type: ErrorType.AUTHENTICATION,
    message: error instanceof Error ? error.message : 'Authentication error',
    context: authContext,
    originalError: error instanceof Error ? error : undefined
  });
  
  logError(appError);
}

/**
 * Log errors to console or external service
 * In production, this would send errors to a monitoring service
 */
function logError(error: Error | AppError) {
  if (error instanceof AppError) {
    console.error(`[${error.type}]${error.code ? ` (${error.code})` : ''}: ${error.message}`, {
      context: error.context,
      originalError: error.originalError
    });
    // In production, send to error monitoring service like Sentry
    // if (process.env.NODE_ENV === 'production') {
    //   captureException(error);
    // }
  } else {
    console.error(`[UNHANDLED]: ${error.message}`, error);
    // In production, send to error monitoring service
  }
}

/**
 * Safely parse JSON from string
 */
export function safeJsonParse(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
} 