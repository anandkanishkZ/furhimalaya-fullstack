import { Router, Response } from 'express';
import { ApiResponse, AuthRequest } from '../types';
import { authenticate } from '../middleware/authMiddleware';
import {
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../utils/notificationService';

const router = Router();

// Get all notifications
router.get('/', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const userId = req.user!.id;
    const { page = '1', limit = '20', unread } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    
    // Get notifications from database
    const notifications = await getUserNotifications(userId, {
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
      unreadOnly: unread === 'true',
    });
    
    // Get total count for pagination
    const totalCount = unread === 'true' 
      ? await getUnreadNotificationCount(userId)
      : await getUserNotifications(userId).then(n => n.length);
    
    res.json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: notifications,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum)
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notifications',
      errors: ['Internal server error']
    });
  }
});

// Mark notification as read
router.patch('/:id/read', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    
    // Verify notification belongs to user
    const notification = await getUserNotifications(userId);
    const userNotification = notification.find(n => n.id === id);
    
    if (!userNotification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
        errors: ['Notification does not exist']
      });
    }
    
    // Mark as read in database
    const updatedNotification = await markNotificationAsRead(id);
    
    res.json({
      success: true,
      message: 'Notification marked as read',
      data: updatedNotification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      errors: ['Internal server error']
    });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const userId = req.user!.id;
    
    // Mark all as read in database
    const result = await markAllNotificationsAsRead(userId);
    
    res.json({
      success: true,
      message: 'All notifications marked as read',
      data: { updatedCount: result.count }
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      errors: ['Internal server error']
    });
  }
});

// Delete notification
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    
    // Verify notification belongs to user
    const notification = await getUserNotifications(userId);
    const userNotification = notification.find(n => n.id === id);
    
    if (!userNotification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
        errors: ['Notification does not exist']
      });
    }
    
    // Delete from database
    const deletedNotification = await deleteNotification(id);
    
    res.json({
      success: true,
      message: 'Notification deleted successfully',
      data: deletedNotification
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      errors: ['Internal server error']
    });
  }
});

// Get unread count
router.get('/count/unread', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const userId = req.user!.id;
    
    const unreadCount = await getUnreadNotificationCount(userId);
    
    res.json({
      success: true,
      message: 'Unread count retrieved successfully',
      data: { count: unreadCount }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      errors: ['Internal server error']
    });
  }
});

export default router;