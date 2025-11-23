import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  // Log full error details server-side for debugging
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
    body: req.body,
    params: req.params,
    query: req.query
  });

  const isDevelopment = process.env.NODE_ENV === 'development';

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: isDevelopment ? [err.message] : ['Invalid data provided']
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      errors: ['Authentication failed']
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      errors: ['Please login again']
    });
  }

  // Prisma/Database errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      success: false,
      message: isDevelopment ? 'Database Error' : 'An error occurred',
      errors: isDevelopment ? [err.message] : ['Unable to process request']
    });
  }

  // Default error - sanitize in production
  res.status(500).json({
    success: false,
    message: isDevelopment ? 'Internal Server Error' : 'An error occurred',
    errors: isDevelopment 
      ? [err.message, err.stack || 'No stack trace'] 
      : ['Something went wrong. Please try again later.']
  });
};