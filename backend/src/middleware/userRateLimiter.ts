import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { logSecurityEvent } from '../utils/securityLogger';

// Store for user-specific rate limiting
const userRequestStore = new Map<string, { count: number; resetTime: number }>();

// Cleanup old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of userRequestStore.entries()) {
    if (value.resetTime < now) {
      userRequestStore.delete(key);
    }
  }
}, 3600000);

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
}

// User-based rate limiting configurations
export const rateLimitConfigs = {
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Too many requests from this user, please try again later.'
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts per window
    message: 'Too many login attempts, please try again later.'
  },
  admin: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Higher limit for admin operations
    message: 'Too many admin requests, please try again later.'
  },
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 uploads per hour
    message: 'Upload limit exceeded, please try again later.'
  }
};

// Custom key generator that uses user ID if authenticated, otherwise IP
const getUserKey = (req: Request): string => {
  const user = (req as any).user;
  if (user && user.id) {
    return `user:${user.id}`;
  }
  return `ip:${req.ip || req.socket.remoteAddress || 'unknown'}`;
};

// Create user-based rate limiter
export const createUserRateLimiter = (config: RateLimitConfig) => {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    message: { error: config.message },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: getUserKey,
    handler: (req: Request, res: Response) => {
      const userKey = getUserKey(req);
      const user = (req as any).user;
      
      logSecurityEvent({
        type: 'RATE_LIMIT_EXCEEDED',
        severity: 'MEDIUM',
        ip: req.ip || 'unknown',
        email: user?.email,
        userId: user?.id,
        details: {
          endpoint: req.originalUrl,
          method: req.method,
          userKey
        }
      });

      res.status(429).json({ error: config.message });
    },
    skip: (req: Request) => {
      // Skip rate limiting for whitelisted IPs (optional)
      const whitelistedIPs = process.env.RATE_LIMIT_WHITELIST?.split(',') || [];
      const clientIP = req.ip || req.socket.remoteAddress || '';
      return whitelistedIPs.includes(clientIP);
    }
  });
};

// Pre-configured rate limiters
export const generalRateLimiter = createUserRateLimiter(rateLimitConfigs.general);
export const authRateLimiter = createUserRateLimiter(rateLimitConfigs.auth);
export const adminRateLimiter = createUserRateLimiter(rateLimitConfigs.admin);
export const uploadRateLimiter = createUserRateLimiter(rateLimitConfigs.upload);

// Manual rate limit check for custom logic
export const checkUserRateLimit = (userKey: string, maxRequests: number, windowMs: number): boolean => {
  const now = Date.now();
  const userRecord = userRequestStore.get(userKey);

  if (!userRecord || userRecord.resetTime < now) {
    // Create new record or reset expired one
    userRequestStore.set(userKey, {
      count: 1,
      resetTime: now + windowMs
    });
    return true; // Allow request
  }

  if (userRecord.count >= maxRequests) {
    return false; // Block request
  }

  // Increment count
  userRecord.count++;
  userRequestStore.set(userKey, userRecord);
  return true; // Allow request
};

// Get remaining requests for a user
export const getRemainingRequests = (userKey: string, maxRequests: number): number => {
  const userRecord = userRequestStore.get(userKey);
  if (!userRecord || userRecord.resetTime < Date.now()) {
    return maxRequests;
  }
  return Math.max(0, maxRequests - userRecord.count);
};
