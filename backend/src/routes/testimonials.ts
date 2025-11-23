import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse, AuthRequest, PaginationQuery, TestimonialData } from '../types';
import { authenticate } from '../middleware/authMiddleware';
import { body, query, validationResult } from 'express-validator';
import { 
  notifyNewTestimonial, 
  notifyTestimonialStatusChanged 
} from '../utils/notificationService';

const router = Router();
const prisma = new PrismaClient();

// Validation rules
const createTestimonialValidation = [
  body('clientName').trim().isLength({ min: 2, max: 100 }).withMessage('Client name must be between 2 and 100 characters'),
  body('content').trim().isLength({ min: 10, max: 1000 }).withMessage('Content must be between 10 and 1000 characters'),
  body('position').optional().trim().isLength({ max: 100 }).withMessage('Position must be maximum 100 characters'),
  body('company').optional().trim().isLength({ max: 100 }).withMessage('Company must be maximum 100 characters'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
];

const updateTestimonialValidation = [
  body('clientName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Client name must be between 2 and 100 characters'),
  body('content').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Content must be between 10 and 1000 characters'),
  body('position').optional().trim().isLength({ max: 100 }).withMessage('Position must be maximum 100 characters'),
  body('company').optional().trim().isLength({ max: 100 }).withMessage('Company must be maximum 100 characters'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE']).withMessage('Status must be ACTIVE or INACTIVE'),
];

// Get all testimonials (public route - only active testimonials)
router.get('/', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { featured, limit } = req.query as { featured?: string; limit?: string };
    
    const whereClause: any = { status: 'ACTIVE' };
    
    if (featured === 'true') {
      whereClause.featured = true;
    }
    
    const testimonials = await prisma.testimonial.findMany({
      where: whereClause,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit ? parseInt(limit) : undefined,
    });

    res.json({
      success: true,
      message: 'Testimonials retrieved successfully',
      data: testimonials,
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve testimonials',
    });
  }
});

// Get testimonials for admin (with pagination)
router.get('/admin', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { page = '1', limit = '10', search, status } = req.query as PaginationQuery;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { clientName: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.testimonial.count({ where: whereClause }),
    ]);

    res.json({
      success: true,
      message: 'Testimonials retrieved successfully',
      data: testimonials,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching testimonials for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve testimonials',
    });
  }
});

// Get single testimonial
router.get('/:id', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    res.json({
      success: true,
      message: 'Testimonial retrieved successfully',
      data: testimonial,
    });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve testimonial',
    });
  }
});

// Create new testimonial (admin only)
router.post('/', authenticate, createTestimonialValidation, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(error => error.msg),
      });
    }

    const testimonialData: TestimonialData = req.body;
    
    const testimonial = await prisma.testimonial.create({
      data: {
        clientName: testimonialData.clientName,
        position: testimonialData.position || null,
        company: testimonialData.company || null,
        content: testimonialData.content,
        imageUrl: testimonialData.imageUrl || null,
        rating: testimonialData.rating || 5,
        featured: testimonialData.featured || false,
        status: testimonialData.status || 'ACTIVE',
      },
    });

    // Create notification for new testimonial
    await notifyNewTestimonial({
      clientName: testimonial.clientName,
      id: testimonial.id,
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial,
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create testimonial',
    });
  }
});

// Update testimonial (admin only)
router.put('/:id', authenticate, updateTestimonialValidation, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(error => error.msg),
      });
    }

    const { id } = req.params;
    const testimonialData: Partial<TestimonialData> = req.body;
    
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!existingTestimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(testimonialData.clientName && { clientName: testimonialData.clientName }),
        ...(testimonialData.position !== undefined && { position: testimonialData.position }),
        ...(testimonialData.company !== undefined && { company: testimonialData.company }),
        ...(testimonialData.content && { content: testimonialData.content }),
        ...(testimonialData.imageUrl !== undefined && { imageUrl: testimonialData.imageUrl }),
        ...(testimonialData.rating !== undefined && { rating: testimonialData.rating }),
        ...(testimonialData.featured !== undefined && { featured: testimonialData.featured }),
        ...(testimonialData.status && { status: testimonialData.status }),
      },
    });

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial,
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update testimonial',
    });
  }
});

// Delete testimonial (admin only)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!existingTestimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial',
    });
  }
});

// Toggle testimonial status (admin only)
router.patch('/:id/toggle-status', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!existingTestimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        status: existingTestimonial.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      },
    });

    // Create notification for status change
    await notifyTestimonialStatusChanged({
      clientName: testimonial.clientName,
      id: testimonial.id,
      newStatus: testimonial.status,
    });

    res.json({
      success: true,
      message: `Testimonial ${testimonial.status === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`,
      data: testimonial,
    });
  } catch (error) {
    console.error('Error toggling testimonial status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle testimonial status',
    });
  }
});

// Toggle featured status (admin only)
router.patch('/:id/toggle-featured', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!existingTestimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        featured: !existingTestimonial.featured,
      },
    });

    res.json({
      success: true,
      message: `Testimonial ${testimonial.featured ? 'marked as featured' : 'removed from featured'} successfully`,
      data: testimonial,
    });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle featured status',
    });
  }
});

export default router;