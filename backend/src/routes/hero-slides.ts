import { Router, Request, Response } from 'express';
import { PrismaClient, Status } from '@prisma/client';
import { authenticate as authMiddleware } from '../middleware/authMiddleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// Configure multer for hero slide image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/hero-slides');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `hero-slide-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, webp)'));
    }
  }
});

// GET /api/hero-slides - Get all hero slides (public endpoint)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { includeInactive = 'false' } = req.query;
    
    const whereClause: any = {};
    
    // Only show active slides for public endpoint unless specifically requested
    if (includeInactive !== 'true') {
      whereClause.status = Status.ACTIVE;
      
      // Also filter by date if start/end dates are set
      const now = new Date();
      whereClause.OR = [
        { startDate: null },
        { startDate: { lte: now } }
      ];
      whereClause.AND = [
        {
          OR: [
            { endDate: null },
            { endDate: { gte: now } }
          ]
        }
      ];
    }

    const heroSlides = await prisma.heroSlide.findMany({
      where: whereClause,
      orderBy: {
        displayOrder: 'asc'
      }
    });

    res.json({
      success: true,
      data: heroSlides
    });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero slides'
    });
  }
});

// GET /api/hero-slides/admin - Get all hero slides for admin (protected)
router.get('/admin', authMiddleware, async (req: Request, res: Response) => {
  try {
    const heroSlides = await prisma.heroSlide.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      success: true,
      data: heroSlides,
      total: heroSlides.length
    });
  } catch (error) {
    console.error('Error fetching hero slides for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero slides'
    });
  }
});

// GET /api/hero-slides/:id - Get single hero slide
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const heroSlide = await prisma.heroSlide.findUnique({
      where: { id }
    });

    if (!heroSlide) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found'
      });
    }

    // Increment view count for analytics
    await prisma.heroSlide.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    res.json({
      success: true,
      data: heroSlide
    });
  } catch (error) {
    console.error('Error fetching hero slide:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero slide'
    });
  }
});

// POST /api/hero-slides - Create new hero slide (protected)
router.post('/', authMiddleware, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const {
      title,
      subtitle,
      description,
      imageUrl: providedImageUrl,
      imageAlt,
      primaryButtonText,
      primaryButtonUrl,
      secondaryButtonText,
      secondaryButtonUrl,
      status = Status.ACTIVE,
      displayOrder = 0,
      startDate,
      endDate,
      textAlign = 'left',
      textColor = '#ffffff',
      overlayOpacity = 0.4,
      seoTitle,
      seoDescription
    } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    // Image can be either uploaded file OR existing imageUrl (from media library)
    let imageUrl: string;
    
    if (req.file) {
      // New file upload
      imageUrl = `/uploads/hero-slides/${req.file.filename}`;
    } else if (providedImageUrl) {
      // Existing image from media library
      imageUrl = providedImageUrl;
    } else {
      // Neither file nor URL provided
      return res.status(400).json({
        success: false,
        message: 'Hero slide image is required (either upload a file or select from media library)'
      });
    }

    // Parse dates if provided
    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;

    // Validate date logic
    if (parsedStartDate && parsedEndDate && parsedStartDate >= parsedEndDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be before end date'
      });
    }

    const newHeroSlide = await prisma.heroSlide.create({
      data: {
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        description: description.trim(),
        imageUrl,
        imageAlt: imageAlt?.trim() || title.trim(),
        primaryButtonText: primaryButtonText?.trim() || null,
        primaryButtonUrl: primaryButtonUrl?.trim() || null,
        secondaryButtonText: secondaryButtonText?.trim() || null,
        secondaryButtonUrl: secondaryButtonUrl?.trim() || null,
        status,
        displayOrder: parseInt(displayOrder),
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        textAlign,
        textColor,
        overlayOpacity: parseFloat(overlayOpacity),
        seoTitle: seoTitle?.trim() || null,
        seoDescription: seoDescription?.trim() || null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Hero slide created successfully',
      data: newHeroSlide
    });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    
    // Clean up uploaded file if database operation failed
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create hero slide'
    });
  }
});

// PUT /api/hero-slides/:id - Update hero slide (protected)
router.put('/:id', authMiddleware, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      description,
      imageUrl: providedImageUrl,
      imageAlt,
      primaryButtonText,
      primaryButtonUrl,
      secondaryButtonText,
      secondaryButtonUrl,
      status,
      displayOrder,
      startDate,
      endDate,
      textAlign,
      textColor,
      overlayOpacity,
      seoTitle,
      seoDescription
    } = req.body;

    // Check if hero slide exists
    const existingSlide = await prisma.heroSlide.findUnique({
      where: { id }
    });

    if (!existingSlide) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found'
      });
    }

    // Prepare update data
    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title.trim();
    if (subtitle !== undefined) updateData.subtitle = subtitle?.trim() || null;
    if (description !== undefined) updateData.description = description.trim();
    if (imageAlt !== undefined) updateData.imageAlt = imageAlt?.trim() || null;
    if (primaryButtonText !== undefined) updateData.primaryButtonText = primaryButtonText?.trim() || null;
    if (primaryButtonUrl !== undefined) updateData.primaryButtonUrl = primaryButtonUrl?.trim() || null;
    if (secondaryButtonText !== undefined) updateData.secondaryButtonText = secondaryButtonText?.trim() || null;
    if (secondaryButtonUrl !== undefined) updateData.secondaryButtonUrl = secondaryButtonUrl?.trim() || null;
    if (status !== undefined) updateData.status = status;
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);
    if (textAlign !== undefined) updateData.textAlign = textAlign;
    if (textColor !== undefined) updateData.textColor = textColor;
    if (overlayOpacity !== undefined) updateData.overlayOpacity = parseFloat(overlayOpacity);
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle?.trim() || null;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription?.trim() || null;

    // Handle date updates
    if (startDate !== undefined) {
      updateData.startDate = startDate ? new Date(startDate) : null;
    }
    if (endDate !== undefined) {
      updateData.endDate = endDate ? new Date(endDate) : null;
    }

    // Handle image update - can be new file OR imageUrl from media library
    if (req.file) {
      // New file uploaded - delete old image file if it was a local upload
      if (existingSlide.imageUrl && existingSlide.imageUrl.startsWith('/uploads/hero-slides/')) {
        const oldImagePath = path.join(__dirname, '../../uploads/hero-slides', path.basename(existingSlide.imageUrl));
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      
      updateData.imageUrl = `/uploads/hero-slides/${req.file.filename}`;
    } else if (providedImageUrl !== undefined && providedImageUrl !== existingSlide.imageUrl) {
      // Image URL changed (from media library) - update it
      // Also delete old local file if it exists
      if (existingSlide.imageUrl && existingSlide.imageUrl.startsWith('/uploads/hero-slides/')) {
        const oldImagePath = path.join(__dirname, '../../uploads/hero-slides', path.basename(existingSlide.imageUrl));
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      
      updateData.imageUrl = providedImageUrl;
    }

    const updatedSlide = await prisma.heroSlide.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Hero slide updated successfully',
      data: updatedSlide
    });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    
    // Clean up uploaded file if database operation failed
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update hero slide'
    });
  }
});

// PUT /api/hero-slides/:id/reorder - Update display order (protected)
router.put('/:id/reorder', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { displayOrder } = req.body;

    if (displayOrder === undefined || isNaN(displayOrder)) {
      return res.status(400).json({
        success: false,
        message: 'Valid display order is required'
      });
    }

    const updatedSlide = await prisma.heroSlide.update({
      where: { id },
      data: { displayOrder: parseInt(displayOrder) }
    });

    res.json({
      success: true,
      message: 'Display order updated successfully',
      data: updatedSlide
    });
  } catch (error) {
    console.error('Error updating display order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update display order'
    });
  }
});

// PUT /api/hero-slides/:id/status - Toggle status (protected)
router.put('/:id/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !Object.values(Status).includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (ACTIVE or INACTIVE)'
      });
    }

    const updatedSlide = await prisma.heroSlide.update({
      where: { id },
      data: { status }
    });

    res.json({
      success: true,
      message: `Hero slide ${status.toLowerCase()} successfully`,
      data: updatedSlide
    });
  } catch (error) {
    console.error('Error updating hero slide status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hero slide status'
    });
  }
});

// DELETE /api/hero-slides/:id - Delete hero slide (protected)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get the slide to access the image path
    const slideToDelete = await prisma.heroSlide.findUnique({
      where: { id }
    });

    if (!slideToDelete) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found'
      });
    }

    // Delete the database record
    await prisma.heroSlide.delete({
      where: { id }
    });

    // Delete the image file
    if (slideToDelete.imageUrl) {
      const imagePath = path.join(__dirname, '../../uploads/hero-slides', path.basename(slideToDelete.imageUrl));
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }

    res.json({
      success: true,
      message: 'Hero slide deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete hero slide'
    });
  }
});

// POST /api/hero-slides/:id - Track slide view for analytics (public endpoint)
router.post('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if slide exists first
    const slide = await prisma.heroSlide.findUnique({
      where: { id }
    });

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found'
      });
    }

    await prisma.heroSlide.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    res.json({
      success: true,
      message: 'View tracked successfully'
    });
  } catch (error: any) {
    console.error('Error tracking view:', error);
    
    // Handle record not found error gracefully
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to track view'
    });
  }
});

// POST /api/hero-slides/:id/track-click - Track button clicks for analytics
router.post('/:id/track-click', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.heroSlide.update({
      where: { id },
      data: { clicks: { increment: 1 } }
    });

    res.json({
      success: true,
      message: 'Click tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track click'
    });
  }
});

// GET /api/hero-slides/analytics/summary - Get analytics summary (protected)
router.get('/analytics/summary', authMiddleware, async (req: Request, res: Response) => {
  try {
    const slides = await prisma.heroSlide.findMany({
      select: {
        id: true,
        title: true,
        views: true,
        clicks: true,
        status: true,
        createdAt: true
      },
      orderBy: { views: 'desc' }
    });

    const totalViews = slides.reduce((sum: number, slide: any) => sum + slide.views, 0);
    const totalClicks = slides.reduce((sum: number, slide: any) => sum + slide.clicks, 0);
    const activeSlides = slides.filter((slide: any) => slide.status === Status.ACTIVE).length;

    res.json({
      success: true,
      data: {
        totalSlides: slides.length,
        activeSlides,
        totalViews,
        totalClicks,
        averageClickRate: totalViews > 0 ? (totalClicks / totalViews * 100).toFixed(2) : '0.00',
        slides: slides.map((slide: any) => ({
          ...slide,
          clickRate: slide.views > 0 ? (slide.clicks / slide.views * 100).toFixed(2) : '0.00'
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics summary'
    });
  }
});

export default router;