import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { generateToken, generateRefreshToken } from '../utils/jwt';
import { ApiResponse } from '../types';
import { body, validationResult } from 'express-validator';
import { notifyWelcome, getUserNotifications } from '../utils/notificationService';
import { authLimiter } from '../middleware/rateLimiter';
import { bruteForceProtection, recordFailedLogin, recordSuccessfulLogin } from '../middleware/bruteForce';
import { authRateLimiter } from '../middleware/userRateLimiter';
import { logSecurityEvent } from '../utils/securityLogger';

const router = Router();

// Login endpoint with brute force protection and rate limiting
router.post('/login', authRateLimiter, bruteForceProtection, [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req: Request, res: Response<ApiResponse>) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg)
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Record failed login attempt
      await recordFailedLogin(email, req.ip || 'unknown');
      
      logSecurityEvent({
        type: 'FAILED_LOGIN',
        severity: 'MEDIUM',
        ip: req.ip || 'unknown',
        email,
        details: { reason: 'User not found' }
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: ['Email or password is incorrect']
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      // Record failed login attempt
      await recordFailedLogin(email, req.ip || 'unknown');
      
      logSecurityEvent({
        type: 'FAILED_LOGIN',
        severity: 'MEDIUM',
        ip: req.ip || 'unknown',
        email,
        userId: user.id,
        details: { reason: 'Invalid password' }
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: ['Email or password is incorrect']
      });
    }

    // Record successful login
    await recordSuccessfulLogin(email);
    
    logSecurityEvent({
      type: 'SUCCESSFUL_LOGIN',
      severity: 'LOW',
      ip: req.ip || 'unknown',
      email,
      userId: user.id,
      details: { loginTime: new Date().toISOString() }
    });

    // Check if user has any notifications (first login check)
    const existingNotifications = await getUserNotifications(user.id, { limit: 1 });
    
    // If no notifications exist, this might be first login - create welcome notification
    if (existingNotifications.length === 0) {
      await notifyWelcome(user.id, user.name || undefined);
    }

    // Generate tokens
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Set httpOnly cookies for security
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: isProduction, // Only use secure in production (HTTPS)
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          profilePhoto: user.profilePhoto
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      errors: ['Login failed']
    });
  }
});

// Logout endpoint - clear cookies
router.post('/logout', (req: Request, res: Response<ApiResponse>) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Refresh token endpoint
router.post('/refresh', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not found',
        errors: ['Authentication required']
      });
    }

    // Verify refresh token
    const { verifyRefreshToken } = await import('../utils/jwt');
    const decoded = verifyRefreshToken(refreshToken);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        errors: ['Please login again']
      });
    }

    // Generate new access token
    const newAccessToken = generateToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    });

    // Set new access token cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({
      success: true,
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Token refresh failed',
      errors: ['Please login again']
    });
  }
});

// Get current user profile
router.get('/me', async (req: Request, res: Response<ApiResponse>) => {
  try {
    // This would typically use the auth middleware
    // For now, just return a placeholder
    res.json({
      success: true,
      message: 'User profile retrieved',
      data: { message: 'Auth middleware needed' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      errors: ['Failed to get user profile']
    });
  }
});

export default router;