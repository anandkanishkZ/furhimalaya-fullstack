import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { body, param, query, validationResult } from 'express-validator';
import { ApiResponse } from '../types';
import { prisma } from '../utils/prisma';

const router = Router();

// Validation schemas
const createClientValidation = [
  body('name').notEmpty().trim().withMessage('Client name is required'),
  body('website').optional().custom((value) => {
    if (value && value.trim() !== '') {
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error('Website must be a valid URL');
      }
    }
    return true;
  }),
  body('logoUrl').optional().custom((value) => {
    if (value && value.trim() !== '') {
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error('Logo URL must be a valid URL');
      }
    }
    return true;
  }),
];

const updateClientValidation = [
  param('id').notEmpty().withMessage('Client ID is required'),
  ...createClientValidation,
];

// GET /api/clients - Get all clients (public route)
router.get('/', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { 
      status, 
      category, 
      featured, 
      limit, 
      skip,
      orderBy = 'displayOrder',
      orderDir = 'asc'
    } = req.query;

    const where: any = {};
    
    if (status) {
      where.status = status;
    } else {
      // Default to active clients for public route
      where.status = 'ACTIVE';
    }
    
    if (category) {
      where.category = category;
    }
    
    if (featured !== undefined) {
      where.featured = featured === 'true';
    }

    const orderByField = ['name', 'displayOrder', 'createdAt', 'startDate'].includes(orderBy as string) 
      ? orderBy as string 
      : 'displayOrder';
    
    const orderDirection = orderDir === 'desc' ? 'desc' : 'asc';

    const queryOptions: any = {
      where,
      orderBy: { [orderByField]: orderDirection },
    };

    if (limit) {
      queryOptions.take = parseInt(limit as string);
    }
    
    if (skip) {
      queryOptions.skip = parseInt(skip as string);
    }

    const clients = await prisma.client.findMany(queryOptions);
    const totalCount = await prisma.client.count({ where });

    res.json({
      success: true,
      message: 'Clients retrieved successfully',
      data: clients,
      pagination: {
        page: skip ? Math.floor(parseInt(skip as string) / (limit ? parseInt(limit as string) : 20)) + 1 : 1,
        limit: limit ? parseInt(limit as string) : totalCount,
        total: totalCount,
        totalPages: limit ? Math.ceil(totalCount / parseInt(limit as string)) : 1
      }
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch clients',
      errors: process.env.NODE_ENV === 'development' ? [(error as Error).message] : ['Internal server error']
    });
  }
});

// GET /api/clients/:id - Get single client (public route)
router.get('/:id', [
  param('id').notEmpty().withMessage('Client ID is required')
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

    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      message: 'Client retrieved successfully',
      data: client
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch client',
      errors: process.env.NODE_ENV === 'development' ? [(error as Error).message] : ['Internal server error']
    });
  }
});

// Protected routes (require authentication)
router.use(authenticate);

// POST /api/clients - Create new client (admin only)
router.post('/', createClientValidation, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg)
      });
    }

    const { name, website, logoUrl } = req.body;

    // Get the highest displayOrder for new clients
    const maxOrderClient = await prisma.client.findFirst({
      orderBy: { displayOrder: 'desc' }
    });

    const clientData = {
      name: name.trim(),
      website: website?.trim() || null,
      logoUrl: logoUrl?.trim() || null,
      featured: false,
      displayOrder: (maxOrderClient?.displayOrder || 0) + 1,
      status: 'ACTIVE' as const
    };

    const client = await prisma.client.create({
      data: clientData
    });

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create client',
      errors: process.env.NODE_ENV === 'development' ? [(error as Error).message] : ['Internal server error']
    });
  }
});

// PUT /api/clients/:id - Update client (admin only)
router.put('/:id', updateClientValidation, async (req: Request, res: Response<ApiResponse>) => {
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
    const { name, website, logoUrl } = req.body;

    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id }
    });

    if (!existingClient) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    const updateData = {
      name: name.trim(),
      website: website?.trim() || null,
      logoUrl: logoUrl?.trim() || null
    };

    const client = await prisma.client.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Client updated successfully',
      data: client
    });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update client',
      errors: process.env.NODE_ENV === 'development' ? [(error as Error).message] : ['Internal server error']
    });
  }
});

// DELETE /api/clients/:id - Delete client (admin only)
router.delete('/:id', [
  param('id').notEmpty().withMessage('Client ID is required')
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

    const { id } = req.params;

    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id }
    });

    if (!existingClient) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    await prisma.client.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete client',
      errors: process.env.NODE_ENV === 'development' ? [(error as Error).message] : ['Internal server error']
    });
  }
});

// GET /api/clients/admin/all - Get all clients for admin (including inactive)
router.get('/admin/all', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { 
      category, 
      featured, 
      status,
      limit, 
      skip,
      search,
      orderBy = 'displayOrder',
      orderDir = 'asc'
    } = req.query;

    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (category) {
      where.category = category;
    }
    
    if (featured !== undefined) {
      where.featured = featured === 'true';
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { category: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const orderByField = ['name', 'displayOrder', 'createdAt', 'startDate', 'category'].includes(orderBy as string) 
      ? orderBy as string 
      : 'displayOrder';
    
    const orderDirection = orderDir === 'desc' ? 'desc' : 'asc';

    const queryOptions: any = {
      where,
      orderBy: { [orderByField]: orderDirection },
    };

    if (limit) {
      queryOptions.take = parseInt(limit as string);
    }
    
    if (skip) {
      queryOptions.skip = parseInt(skip as string);
    }

    const clients = await prisma.client.findMany(queryOptions);
    const totalCount = await prisma.client.count({ where });

    // Get categories for filter options
    const categories = await prisma.client.findMany({
      select: { category: true },
      where: { category: { not: null } },
      distinct: ['category']
    });

    res.json({
      success: true,
      message: 'Admin clients retrieved successfully',
      data: {
        clients,
        categories: categories.map(c => c.category).filter(Boolean)
      },
      pagination: {
        page: skip ? Math.floor(parseInt(skip as string) / (limit ? parseInt(limit as string) : 20)) + 1 : 1,
        limit: limit ? parseInt(limit as string) : totalCount,
        total: totalCount,
        totalPages: limit ? Math.ceil(totalCount / parseInt(limit as string)) : 1
      }
    });
  } catch (error) {
    console.error('Error fetching admin clients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch clients',
      errors: process.env.NODE_ENV === 'development' ? [(error as Error).message] : ['Internal server error']
    });
  }
});

export default router;