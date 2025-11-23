import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { ApiResponse, ServiceData, PaginationQuery, AuthRequest } from '../types';
import { body, validationResult } from 'express-validator';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { notifyNewService, notifyServiceUpdated } from '../utils/notificationService';

const router = Router();

// Get all services (public endpoint)
router.get('/', async (req: Request<{}, ApiResponse, {}, PaginationQuery>, res: Response<ApiResponse>) => {
  try {
    const { page = '1', limit = '10', search, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status) {
      where.status = status;
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.service.count({ where })
    ]);

    res.json({
      success: true,
      message: 'Services retrieved successfully',
      data: services,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve services',
      errors: ['Internal server error']
    });
  }
});

// Get single service by ID
router.get('/:id', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    
    const service = await prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
        errors: ['Service with this ID does not exist']
      });
    }

    res.json({
      success: true,
      message: 'Service retrieved successfully',
      data: service
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve service',
      errors: ['Internal server error']
    });
  }
});

// Create new service (admin only)
router.post('/', 
  authenticate,
  authorize(['ADMIN', 'SUPER_ADMIN']),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('features').isArray().withMessage('Features must be an array')
  ], 
  async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg)
      });
    }

    const serviceData: ServiceData = req.body;
    
    const service = await prisma.service.create({
      data: serviceData
    });

    // Create notification for new service
    await notifyNewService({
      title: service.title,
      id: service.id,
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service',
      errors: ['Internal server error']
    });
  }
});

// Update service (admin only)
router.put('/:id', 
  authenticate,
  authorize(['ADMIN', 'SUPER_ADMIN']),
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('features').optional().isArray().withMessage('Features must be an array')
  ], 
  async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg)
      });
    }

    const { id } = req.params;
    const updateData: Partial<ServiceData> = req.body;

    const service = await prisma.service.update({
      where: { id },
      data: updateData
    });

    // Create notification for service update
    await notifyServiceUpdated({
      title: service.title,
      id: service.id,
    });

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
        errors: ['Service with this ID does not exist']
      });
    }
    
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      errors: ['Internal server error']
    });
  }
});

// Delete service (admin only)
router.delete('/:id', 
  authenticate,
  authorize(['ADMIN', 'SUPER_ADMIN']),
  async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    await prisma.service.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
        errors: ['Service with this ID does not exist']
      });
    }
    
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      errors: ['Internal server error']
    });
  }
});

export default router;