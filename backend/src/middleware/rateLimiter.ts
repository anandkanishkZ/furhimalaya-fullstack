import rateLimit from 'express-rate-limit';

/**
 * Rate Limiting Configuration
 * All values are configurable via environment variables
 */

// General API rate limiter - applied to all API routes
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    errors: ['Rate limit exceeded']
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health check endpoint
    return req.path === '/api/health';
  }
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes default
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_ATTEMPTS || '5'), // 5 attempts per window
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again later.',
    errors: ['Authentication rate limit exceeded. Please wait 15 minutes.']
  },
  standardHeaders: true,
  legacyHeaders: false,
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
});
