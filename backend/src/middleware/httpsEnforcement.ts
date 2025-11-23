import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Middleware to enforce HTTPS in production
 * Redirects HTTP requests to HTTPS
 */
export const enforceHTTPS = (req: Request, res: Response, next: NextFunction) => {
  // Only enforce in production
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  // Check if request is already secure
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    return next();
  }

  // Redirect to HTTPS
  const httpsUrl = `https://${req.hostname}${req.url}`;
  logger.warn(`Redirecting HTTP to HTTPS: ${req.url}`);
  
  return res.redirect(301, httpsUrl);
};

/**
 * Middleware to set secure headers
 * Implements security best practices for HTTPS
 */
export const secureHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Strict-Transport-Security (HSTS)
  // Force HTTPS for 1 year, including subdomains
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Upgrade insecure requests
  res.setHeader('Content-Security-Policy', "upgrade-insecure-requests");

  next();
};

/**
 * Combined HTTPS enforcement middleware
 * Use this in server.ts for complete HTTPS security
 */
export const httpsMiddleware = [enforceHTTPS, secureHeaders];

export default httpsMiddleware;
