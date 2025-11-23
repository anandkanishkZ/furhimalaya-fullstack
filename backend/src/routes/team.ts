import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';
import { authenticate } from '../middleware/authMiddleware';
import { prisma } from '../utils/prisma';
import { notifyNewTeamMember, notifyTeamMemberUpdated } from '../utils/notificationService';

const router = Router();

// Get all team members (public route)
router.get('/', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: { status: 'ACTIVE' },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({ 
      success: true, 
      message: 'Team members retrieved successfully', 
      data: teamMembers 
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch team members',
      errors: ['Database error occurred'] 
    });
  }
});

// Get all team members (admin route - includes inactive)
router.get('/admin', authenticate, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({ 
      success: true, 
      message: 'Team members retrieved successfully', 
      data: teamMembers 
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch team members',
      errors: ['Database error occurred'] 
    });
  }
});

// Get single team member
router.get('/:id', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    
    const teamMember = await prisma.teamMember.findUnique({
      where: { id }
    });

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
        errors: ['Team member with this ID does not exist']
      });
    }

    res.json({ 
      success: true, 
      message: 'Team member retrieved successfully', 
      data: teamMember 
    });
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch team member',
      errors: ['Database error occurred'] 
    });
  }
});

// Create new team member (admin only)
router.post('/', authenticate, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { 
      name, 
      position, 
      bio, 
      imageUrl, 
      email, 
      phone, 
      linkedin,
      facebook,
      twitter,
      instagram,
      tiktok,
      status = 'ACTIVE',
      displayOrder = 0
    } = req.body;

    // Validation
    if (!name || !position) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: ['Name and position are required']
      });
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        position,
        bio,
        imageUrl,
        email,
        phone,
        linkedin,
        facebook,
        twitter,
        instagram,
        tiktok,
        status,
        displayOrder
      }
    });

    // Create notification for new team member
    await notifyNewTeamMember({
      name: teamMember.name,
      id: teamMember.id,
      position: teamMember.position || undefined,
    });

    res.status(201).json({ 
      success: true, 
      message: 'Team member created successfully', 
      data: teamMember 
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create team member',
      errors: ['Database error occurred'] 
    });
  }
});

// Update team member (admin only)
router.put('/:id', authenticate, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      position, 
      bio, 
      imageUrl, 
      email, 
      phone, 
      linkedin,
      facebook,
      twitter,
      instagram,
      tiktok,
      status,
      displayOrder
    } = req.body;

    // Check if team member exists
    const existingMember = await prisma.teamMember.findUnique({
      where: { id }
    });

    if (!existingMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
        errors: ['Team member with this ID does not exist']
      });
    }

    // Validation
    if (!name || !position) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: ['Name and position are required']
      });
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        position,
        bio,
        imageUrl,
        email,
        phone,
        linkedin,
        facebook,
        twitter,
        instagram,
        tiktok,
        status,
        displayOrder
      }
    });

    // Create notification for team member update
    await notifyTeamMemberUpdated({
      name: updatedMember.name,
      id: updatedMember.id,
    });

    res.json({ 
      success: true, 
      message: 'Team member updated successfully', 
      data: updatedMember 
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update team member',
      errors: ['Database error occurred'] 
    });
  }
});

// Delete team member (admin only)
router.delete('/:id', authenticate, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    // Check if team member exists
    const existingMember = await prisma.teamMember.findUnique({
      where: { id }
    });

    if (!existingMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
        errors: ['Team member with this ID does not exist']
      });
    }

    await prisma.teamMember.delete({
      where: { id }
    });

    res.json({ 
      success: true, 
      message: 'Team member deleted successfully', 
      data: null 
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete team member',
      errors: ['Database error occurred'] 
    });
  }
});

export default router;