import csrf from 'csurf';
import { Request, Response, NextFunction } from 'express';

// Create CSRF protection middleware
// Note: csurf is deprecated but still functional. Consider migrating to alternative solutions in the future.
const csrfMiddleware = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// List of paths that should be exempt from CSRF protection
const csrfExemptPaths = [
  /^\/api\/hero-slides\/[^\/]+$/, // Hero slide view tracking POST endpoint
  /^\/api\/public-settings/, // Public settings endpoint
];

// Conditional CSRF protection - skip for GET requests and exempt paths
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Always apply CSRF middleware for token generation, but skip validation for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    // Apply middleware to generate token but don't validate
    return (csrfMiddleware as any)(req, res, (err: any) => {
      if (err && err.code !== 'EBADCSRFTOKEN') {
        return next(err);
      }
      next();
    });
  }

  // Check if path is exempt from CSRF
  const isExempt = csrfExemptPaths.some(pattern => pattern.test(req.path));
  if (isExempt) {
    return next();
  }

  // Apply CSRF protection for all other requests
  (csrfMiddleware as any)(req, res, next);
};

// CSRF error handler
export const csrfErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token',
      errors: ['Form submission validation failed. Please refresh and try again.']
    });
  }
  next(err);
};
