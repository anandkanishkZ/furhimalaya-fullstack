import { Router, Request, Response } from 'express';
import { ApiResponse, AuthRequest } from '../types';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { prisma } from '../utils/prisma';
import { 
  notifyNewBlogPost, 
  notifyBlogPublished, 
  notifyBlogUpdated 
} from '../utils/notificationService';

const router = Router();

// Public Routes
// Get all published blog posts
router.get('/public', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() }
    };

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
        { excerpt: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: { id: true, email: true, name: true, profilePhoto: true }
          }
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.blogPost.count({ where })
    ]);

    res.json({
      success: true,
      message: 'Blog posts fetched successfully',
      data: posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog posts'
    });
  }
});

// Get single published blog post by slug
router.get('/public/:slug', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { slug } = req.params;

    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() }
      },
      include: {
        author: {
          select: { id: true, email: true, name: true, profilePhoto: true }
        }
      }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog post fetched successfully',
      data: post
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog post'
    });
  }
});

// Admin Routes (Protected)
// Get all blog posts (admin)
router.get('/', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: { id: true, email: true, name: true, profilePhoto: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.blogPost.count({ where })
    ]);

    res.json({
      success: true,
      message: 'Blog posts fetched successfully',
      data: posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog posts'
    });
  }
});

// Get single blog post (admin)
router.get('/:id', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, email: true, name: true, profilePhoto: true }
        }
      }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog post fetched successfully',
      data: post
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog post'
    });
  }
});

// Create blog post
router.post('/', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const {
      title,
      slug,
      content,
      excerpt,
      imageUrl,
      status,
      publishedAt,
      featured,
      seoTitle,
      seoDescription,
      metaKeywords
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    // Generate slug if not provided
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: finalSlug }
    });

    if (existingPost) {
      return res.status(400).json({
        success: false,
        message: 'A blog post with this slug already exists'
      });
    }

    const postData: any = {
      title,
      slug: finalSlug,
      content,
      excerpt,
      imageUrl,
      status: status || 'DRAFT',
      authorId: req.user!.id,
      featured: featured || false,
      seoTitle,
      seoDescription,
      metaKeywords
    };

    // Set publishedAt if status is PUBLISHED
    if (status === 'PUBLISHED') {
      postData.publishedAt = publishedAt ? new Date(publishedAt) : new Date();
    }

    const post = await prisma.blogPost.create({
      data: postData,
      include: {
        author: {
          select: { id: true, email: true, name: true, profilePhoto: true }
        }
      }
    });

    // Create notifications based on status
    if (post.status === 'PUBLISHED') {
      await notifyBlogPublished({
        title: post.title,
        id: post.id,
      });
    } else {
      await notifyNewBlogPost({
        title: post.title,
        id: post.id,
        authorId: post.authorId,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: post
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog post'
    });
  }
});

// Update blog post
router.put('/:id', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      content,
      excerpt,
      imageUrl,
      status,
      publishedAt,
      featured,
      seoTitle,
      seoDescription,
      metaKeywords
    } = req.body;

    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Check if slug already exists (excluding current post)
    if (slug && slug !== existingPost.slug) {
      const slugExists = await prisma.blogPost.findFirst({
        where: {
          slug,
          id: { not: id }
        }
      });

      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: 'A blog post with this slug already exists'
        });
      }
    }

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (status !== undefined) updateData.status = status;
    if (featured !== undefined) updateData.featured = featured;
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
    if (metaKeywords !== undefined) updateData.metaKeywords = metaKeywords;

    // Handle publishedAt
    if (status === 'PUBLISHED' && !existingPost.publishedAt) {
      updateData.publishedAt = publishedAt ? new Date(publishedAt) : new Date();
    } else if (publishedAt) {
      updateData.publishedAt = new Date(publishedAt);
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { id: true, email: true, name: true, profilePhoto: true }
        }
      }
    });

    // Create notifications based on status change
    const statusChanged = status !== undefined && status !== existingPost.status;
    
    if (statusChanged && post.status === 'PUBLISHED') {
      await notifyBlogPublished({
        title: post.title,
        id: post.id,
      });
    } else {
      await notifyBlogUpdated({
        title: post.title,
        id: post.id,
      });
    }

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: post
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog post'
    });
  }
});

// Delete blog post
router.delete('/:id', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    await prisma.blogPost.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog post'
    });
  }
});

export default router;