import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { ApiResponse, AuthRequest } from '../types';
import { authenticate } from '../middleware/authMiddleware';
import { passwordLimiter } from '../middleware/rateLimiter';

const router = Router();

// Get current user profile
router.get('/me', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        errors: ['Authentication required']
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        profilePhoto: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: ['User does not exist']
      });
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      errors: ['Database error occurred']
    });
  }
});

// Update user profile
router.put('/me', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const userId = req.user?.id;
    const { name, email, profilePhoto } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        errors: ['Authentication required']
      });
    }

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: ['Name and email are required']
      });
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: userId }
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already taken',
        errors: ['This email is already registered to another account']
      });
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, profilePhoto },
      select: {
        id: true,
        email: true,
        name: true,
        profilePhoto: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      errors: ['Database error occurred']
    });
  }
});

// Change password
router.put('/change-password', authenticate, passwordLimiter, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        errors: ['Authentication required']
      });
    }

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: ['All password fields are required']
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password confirmation failed',
        errors: ['New password and confirmation do not match']
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password too short',
        errors: ['Password must be at least 6 characters long']
      });
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: ['User does not exist']
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid current password',
        errors: ['The current password you entered is incorrect']
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    res.json({
      success: true,
      message: 'Password changed successfully',
      data: null
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      errors: ['Database error occurred']
    });
  }
});

export default router;