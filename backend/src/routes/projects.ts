import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { ApiResponse, ProjectData, PaginationQuery, AuthRequest } from '../types';
import { body, validationResult } from 'express-validator';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { 
  notifyNewProject, 
  notifyProjectUpdated, 
  notifyProjectStatusChanged 
} from '../utils/notificationService';
import { auditCreate, auditUpdate, auditDelete } from '../middleware/auditLog';

const router = Router();

// Get all projects (public endpoint)
router.get('/', async (req: Request<{}, ApiResponse, {}, PaginationQuery>, res: Response<ApiResponse>) => {
  try {
    const { page = '1', limit = '10', search, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = {
      // Only show ACTIVE projects for public access
      status: 'ACTIVE'
    };
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Allow admin to override status filter if needed
    if (status && req.headers.authorization) {
      where.status = status;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.project.count({ where })
    ]);

    res.json({
      success: true,
      message: 'Projects retrieved successfully',
      data: projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve projects',
      errors: ['Internal server error']
    });
  }
});

// Get single project by ID
router.get('/:id', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        errors: ['Project with this ID does not exist']
      });
    }

    res.json({
      success: true,
      message: 'Project retrieved successfully',
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve project',
      errors: ['Internal server error']
    });
  }
});

// Create new project (admin only)
router.post('/', 
  authenticate,
  authorize(['ADMIN', 'SUPER_ADMIN']),
  auditCreate,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('slug').notEmpty().withMessage('Slug is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
    body('projectArea').optional().isFloat({ min: 0 }).withMessage('Project area must be a positive number'),
    body('priority').optional().isInt({ min: 0, max: 10 }).withMessage('Priority must be between 0 and 10'),
    body('technologies').optional().isArray().withMessage('Technologies must be an array'),
    body('teamMembers').optional().isArray().withMessage('Team members must be an array'),
    body('challenges').optional().isArray().withMessage('Challenges must be an array'),
    body('achievements').optional().isArray().withMessage('Achievements must be an array'),
    body('galleryImages').optional().isArray().withMessage('Gallery images must be an array'),
    body('socialImages').optional().isArray().withMessage('Social images must be an array')
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

    const {
      title,
      slug,
      category,
      description,
      shortDescription,
      clientName,
      location,
      completionDate,
      startDate,
      budget,
      projectArea,
      projectType,
      imageUrl,
      galleryImages = [],
      status = 'ACTIVE',
      featured = false,
      priority = 0,
      metaTitle,
      metaDescription,
      metaKeywords,
      technologies = [],
      teamMembers = [],
      challenges = [],
      achievements = [],
      testimonial,
      socialImages = []
    } = req.body;

    // Note: Slug uniqueness is enforced by database constraint
    
    // Create project data object with all fields
    const projectData: any = {
      title,
      slug,
      category,
      description,
      shortDescription,
      clientName,
      location,
      completionDate: completionDate ? new Date(completionDate) : null,
      startDate: startDate ? new Date(startDate) : null,
      budget: budget ? parseFloat(budget) : null,
      projectArea: projectArea ? parseFloat(projectArea) : null,
      projectType,
      imageUrl,
      galleryImages,
      status,
      featured,
      priority: parseInt(priority) || 0,
      metaTitle,
      metaDescription,
      metaKeywords,
      technologies,
      teamMembers,
      challenges,
      achievements,
      testimonial,
      socialImages
    };

    const project = await prisma.project.create({
      data: projectData
    });

    // Create notification for new project
    await notifyNewProject({
      title: project.title,
      id: project.id,
      createdById: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error: any) {
    console.error('Create project error:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Project with this slug already exists',
        errors: ['Slug must be unique']
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      errors: ['Internal server error']
    });
  }
});

// Update project (admin only)
router.put('/:id',
  authenticate,
  authorize(['ADMIN', 'SUPER_ADMIN']),
  auditUpdate,
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('category').optional().notEmpty().withMessage('Category cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty')
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
      const updateData: any = req.body;

      // Check if project exists
      const existingProject = await prisma.project.findUnique({
        where: { id }
      });

      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
          errors: ['Project with this ID does not exist']
        });
      }

      // Track status change for notification
      const statusChanged = updateData.status && updateData.status !== existingProject.status;
      const oldStatus = existingProject.status;

      const updatedProject = await prisma.project.update({
        where: { id },
        data: {
          ...updateData,
          completionDate: updateData.completionDate ? new Date(updateData.completionDate) : undefined,
          startDate: updateData.startDate ? new Date(updateData.startDate) : undefined
        }
      });

      // Create notifications based on changes
      if (statusChanged) {
        await notifyProjectStatusChanged({
          title: updatedProject.title,
          id: updatedProject.id,
          oldStatus,
          newStatus: updatedProject.status,
        });
      } else {
        // General update notification
        const changes = Object.keys(updateData).filter(key => key !== 'id');
        await notifyProjectUpdated({
          title: updatedProject.title,
          id: updatedProject.id,
          changes,
        });
      }

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: updatedProject
      });
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update project',
        errors: ['Internal server error']
      });
    }
  }
);

// Delete project (admin only)
router.delete('/:id',
  authenticate,
  authorize(['ADMIN', 'SUPER_ADMIN']),
  auditDelete,
  async (req: AuthRequest, res: Response<ApiResponse>) => {
    try {
      const { id } = req.params;

      // Check if project exists
      const existingProject = await prisma.project.findUnique({
        where: { id }
      });

      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
          errors: ['Project with this ID does not exist']
        });
      }

      await prisma.project.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete project',
        errors: ['Internal server error']
      });
    }
  }
);

export default router;