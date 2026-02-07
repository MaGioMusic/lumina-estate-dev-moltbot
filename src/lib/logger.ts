/**
 * Secure logging utility for development vs production
 * 
 * SECURITY: In production, error details are sanitized to prevent
 * information leakage. Use proper error monitoring service (Sentry, etc.)
 * for production error tracking.
 */

type LogArguments = unknown[];

export const logger = {
  log: (...args: LogArguments) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  
  warn: (...args: LogArguments) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(...args);
    }
  },
  
  error: (...args: LogArguments) => {
    // Always log errors, but sanitize in production
    if (process.env.NODE_ENV === 'development') {
      console.error(...args);
    } else {
      // In production, log only generic error messages
      console.error('An error occurred');
    }
  },
  
  debug: (...args: LogArguments) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[DEBUG]', ...args);
    }
  }
};

/**
 * Utility to sanitize sensitive data for logging
 * Recursively redacts sensitive fields from objects
 */
export const sanitizeForLogging = (data: unknown): unknown => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  const sensitiveKeys = ['email', 'password', 'token', 'key', 'secret'];
  const sanitized = { ...data as Record<string, unknown> };
  
  for (const key in sanitized) {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    }
  }
  
  return sanitized;
}; 