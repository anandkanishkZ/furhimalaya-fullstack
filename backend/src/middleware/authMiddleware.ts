import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthRequest, ApiResponse } from '../types';

export const authenticate = (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    // Try to get token from cookies first (preferred method)
    let token = req.cookies?.accessToken;
    
    // Fallback to Authorization header for backwards compatibility
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        errors: ['No valid token provided']
      });
    }

    const decoded = verifyToken(token);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      errors: ['Authentication failed']
    });
  }
};

export const authorize = (roles: string[] = []) => {
  return (req: AuthRequest, res: Response<ApiResponse>, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        errors: ['No user found']
      });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        errors: ['Access denied']
      });
    }

    next();
  };
};

// Super Admin only middleware for sensitive system operations
export const requireSuperAdmin = (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    // Try to get token from cookies first (preferred method)
    let token = req.cookies?.accessToken;
    
    // Fallback to Authorization header for backwards compatibility
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied: Super admin authentication required'
      });
    }

    const decoded = verifyToken(token);
    
    // Only SUPER_ADMIN can access system info
    if (decoded.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Super admin privileges required'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Access denied: Invalid authentication'
    });
  }
};

// Security access logger for sensitive endpoints
export const securityAccessLogger = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`🚨 SECURITY ENDPOINT ACCESS: ${timestamp} | IP: ${ip} | Path: ${req.path} | User-Agent: ${userAgent}`);
  
  // Log to audit system if available
  // TODO: Implement proper security logging service
  
  next();
};