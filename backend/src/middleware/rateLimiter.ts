import rateLimit from 'express-rate-limit';

/**
 * Rate Limiting Configuration
 * All values are configurable via environment variables
 */

// General API rate limiter - applied to all API routes
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || (process.env.NODE_ENV === 'development' ? '60000' : '900000')), // 1 minute in dev, 15 minutes in prod
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || (process.env.NODE_ENV === 'development' ? '10000' : '100')), // 10000 requests per window in dev, 100 in prod
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    errors: ['Rate limit exceeded']
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health check endpoint or in development
    return req.path === '/api/health' || process.env.NODE_ENV === 'development';
  }
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || (process.env.NODE_ENV === 'development' ? '60000' : '900000')), // 1 minute in dev, 15 minutes in prod
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_ATTEMPTS || (process.env.NODE_ENV === 'development' ? '1000' : '5')), // 1000 attempts per window in dev, 5 in prod
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again later.',
    errors: ['Authentication rate limit exceeded. Please wait 15 minutes.']
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in development
    return process.env.NODE_ENV === 'development';
  }
});

// Rate limiter for contact form to prevent spam
export const contactLimiter = rateLimit({
  windowMs: parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || '3600000'), // 1 hour default
  max: parseInt(process.env.CONTACT_RATE_LIMIT_MAX_SUBMISSIONS || '3'), // 3 submissions per hour
  message: {
    success: false,
    message: 'Too many contact form submissions. Please try again later.',
    errors: ['You can only submit 3 contact forms per hour.']
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in development
    return process.env.NODE_ENV === 'development';
  }
});

// Extremely restrictive rate limiter for system endpoints
export const systemLimiter = rateLimit({
  windowMs: parseInt(process.env.SYSTEM_RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes default
  max: parseInt(process.env.SYSTEM_RATE_LIMIT_MAX_REQUESTS || '3'), // Only 3 requests per window
  message: {
    success: false,
    message: 'System endpoint access limited. Contact administrator if needed.',
    errors: ['System access rate limit exceeded']
  },
  standardHeaders: false, // Don't reveal rate limit info for security
  legacyHeaders: false,
  skipFailedRequests: false, // Count all requests
  skip: (req) => {
    // Skip rate limiting in development
    return process.env.NODE_ENV === 'development';
  }
});

// API discovery prevention rate limiter
export const apiDiscoveryLimiter = rateLimit({
  windowMs: parseInt(process.env.API_DISCOVERY_RATE_LIMIT_WINDOW_MS || '300000'), // 5 minutes default
  max: parseInt(process.env.API_DISCOVERY_RATE_LIMIT_MAX_REQUESTS || '10'), // 10 requests per window
  message: {
    success: false,
    message: 'Too many API requests. Please refer to documentation.',
    errors: ['API rate limit exceeded']
  },
  standardHeaders: false,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in development
    return process.env.NODE_ENV === 'development';
  }
});

// Rate limiter for file uploads
export const uploadLimiter = rateLimit({
  windowMs: parseInt(process.env.UPLOAD_RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes default
  max: parseInt(process.env.UPLOAD_RATE_LIMIT_MAX_UPLOADS || '20'), // 20 uploads per window
  message: {
    success: false,
    message: 'Too many file uploads. Please try again later.',
    errors: ['Upload rate limit exceeded.']
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in development
    return process.env.NODE_ENV === 'development';
  }
});

// Rate limiter for password reset/change operations
export const passwordLimiter = rateLimit({
  windowMs: parseInt(process.env.PASSWORD_RATE_LIMIT_WINDOW_MS || '3600000'), // 1 hour default
  max: parseInt(process.env.PASSWORD_RATE_LIMIT_MAX_ATTEMPTS || '3'), // 3 attempts per hour
  message: {
    success: false,
    message: 'Too many password change attempts. Please try again later.',
    errors: ['Password operation rate limit exceeded.']
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in development
    return process.env.NODE_ENV === 'development';
  }
});

// Rate limiter for public read endpoints (less strict)
export const publicLimiter = rateLimit({
  windowMs: parseInt(process.env.PUBLIC_RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute default
  max: parseInt(process.env.PUBLIC_RATE_LIMIT_MAX_REQUESTS || '30'), // 30 requests per minute
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
    errors: ['Rate limit exceeded.']
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in development
    return process.env.NODE_ENV === 'development';
  }
});
