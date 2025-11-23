import morgan, { StreamOptions } from 'morgan';
import { stream } from '../utils/logger';

// Custom token to include user ID in logs
morgan.token('user-id', (req: any) => {
  return req.user?.id || 'anonymous';
});

// Custom token for user role
morgan.token('user-role', (req: any) => {
  return req.user?.role || 'guest';
});

// Custom format that includes user information
const customFormat = ':remote-addr - :user-id [:user-role] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms';

// Create Morgan middleware with custom format
export const requestLogger = morgan(customFormat, { stream });

// Skip logging for health check endpoints
export const requestLoggerWithSkip = morgan(customFormat, {
  stream,
  skip: (req) => {
    // Skip health check and static file requests
    return req.url === '/health' || req.url?.startsWith('/uploads/') || false;
  },
});

// Morgan middleware for development (more verbose)
export const devLogger = morgan('dev', { stream });

// Export based on environment
const logger = process.env.NODE_ENV === 'production' 
  ? requestLoggerWithSkip 
  : devLogger;

export default logger;
