import { Router, Request, Response } from 'express';
import { ApiResponse, AuthRequest } from '../types';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { prisma } from '../utils/prisma';
import { SettingType } from '@prisma/client';

const router = Router();

// Get all settings
router.get('/', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const settings = await prisma.companySetting.findMany({
      orderBy: { key: 'asc' }
    });

    // Convert to key-value pairs for easier frontend consumption
    const settingsMap = settings.reduce((acc, setting) => {
      let value: any = setting.value;
      
      // Parse JSON and BOOLEAN types
      if (setting.type === 'JSON') {
        try {
          value = JSON.parse(setting.value);
        } catch {
          value = setting.value;
        }
      } else if (setting.type === 'BOOLEAN') {
        value = setting.value === 'true';
      } else if (setting.type === 'NUMBER') {
        value = parseFloat(setting.value) || 0;
      }
      
      acc[setting.key] = {
        id: setting.id,
        value,
        type: setting.type,
        description: setting.description
      };
      return acc;
    }, {} as any);

    res.json({
      success: true,
      message: 'Settings retrieved successfully',
      data: settingsMap
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
});

// Update multiple settings
router.put('/', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { settings } = req.body;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Settings object is required'
      });
    }

    const updatePromises = Object.entries(settings).map(async ([key, settingData]: [string, any]) => {
      let value = settingData.value;
      
      // Stringify JSON and convert boolean/number to string for storage
      if (settingData.type === 'JSON') {
        value = JSON.stringify(value);
      } else if (settingData.type === 'BOOLEAN') {
        value = value ? 'true' : 'false';
      } else if (settingData.type === 'NUMBER') {
        value = value.toString();
      }

      return prisma.companySetting.upsert({
        where: { key },
        update: { 
          value,
          type: settingData.type || SettingType.TEXT,
          description: settingData.description
        },
        create: {
          key,
          value,
          type: settingData.type || SettingType.TEXT,
          description: settingData.description
        }
      });
    });

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
});

// Get specific setting by key
router.get('/:key', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { key } = req.params;
    
    const setting = await prisma.companySetting.findUnique({
      where: { key }
    });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    let value: any = setting.value;
    
    // Parse value based on type
    if (setting.type === 'JSON') {
      try {
        value = JSON.parse(setting.value);
      } catch {
        value = setting.value;
      }
    } else if (setting.type === 'BOOLEAN') {
      value = setting.value === 'true';
    } else if (setting.type === 'NUMBER') {
      value = parseFloat(setting.value) || 0;
    }

    res.json({
      success: true,
      message: 'Setting retrieved successfully',
      data: {
        id: setting.id,
        key: setting.key,
        value,
        type: setting.type,
        description: setting.description
      }
    });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch setting'
    });
  }
});

// Delete setting
router.delete('/:key', authenticate, authorize(['SUPER_ADMIN']), async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { key } = req.params;
    
    await prisma.companySetting.delete({
      where: { key }
    });

    res.json({
      success: true,
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting setting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete setting'
    });
  }
});

// Initialize default settings (can be called during setup)
router.post('/initialize', authenticate, authorize(['SUPER_ADMIN']), async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const defaultSettings = [
      // Company Information
      { key: 'company_name', value: 'Forever Shine', type: SettingType.TEXT, description: 'Company name displayed across the website' },
      { key: 'company_tagline', value: 'Building Tomorrow Today', type: SettingType.TEXT, description: 'Company tagline or slogan' },
      { key: 'company_description', value: 'Leading engineering solutions provider', type: SettingType.TEXT, description: 'Brief company description' },
      { key: 'company_address', value: '', type: SettingType.TEXT, description: 'Physical business address' },
      { key: 'company_phone', value: '', type: SettingType.TEXT, description: 'Primary contact phone number' },
      { key: 'company_email', value: '', type: SettingType.TEXT, description: 'Primary business email' },
      { key: 'company_website', value: '', type: SettingType.TEXT, description: 'Company website URL' },
      
      // Social Media
      { key: 'social_facebook', value: '', type: SettingType.TEXT, description: 'Facebook page URL' },
      { key: 'social_twitter', value: '', type: SettingType.TEXT, description: 'Twitter profile URL' },
      { key: 'social_linkedin', value: '', type: SettingType.TEXT, description: 'LinkedIn company page URL' },
      { key: 'social_instagram', value: '', type: SettingType.TEXT, description: 'Instagram profile URL' },
      { key: 'social_youtube', value: '', type: SettingType.TEXT, description: 'YouTube channel URL' },
      
      // SEO Settings
      { key: 'seo_meta_title', value: 'Forever Shine - Engineering Excellence', type: SettingType.TEXT, description: 'Default meta title for pages' },
      { key: 'seo_meta_description', value: 'Professional engineering services and solutions', type: SettingType.TEXT, description: 'Default meta description' },
      { key: 'seo_keywords', value: 'engineering, construction, architecture, design', type: SettingType.TEXT, description: 'Default SEO keywords' },
      { key: 'seo_og_image', value: '', type: SettingType.TEXT, description: 'Default Open Graph image URL' },
      
      // Site Features
      { key: 'site_maintenance_mode', value: 'false', type: SettingType.BOOLEAN, description: 'Enable maintenance mode for the website' },
      { key: 'site_allow_registrations', value: 'false', type: SettingType.BOOLEAN, description: 'Allow new user registrations' },
      { key: 'blog_enable_comments', value: 'true', type: SettingType.BOOLEAN, description: 'Enable comments on blog posts' },
      { key: 'contact_form_email', value: '', type: SettingType.TEXT, description: 'Email address to receive contact form submissions' },
      
      // Business Hours
      { key: 'business_hours', value: JSON.stringify({
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '09:00', close: '14:00', closed: false },
        sunday: { open: '10:00', close: '16:00', closed: true }
      }), type: SettingType.JSON, description: 'Business operating hours' },
      
      // Email Settings
      { key: 'email_notifications', value: 'true', type: SettingType.BOOLEAN, description: 'Enable email notifications' },
      { key: 'email_contact_notifications', value: 'true', type: SettingType.BOOLEAN, description: 'Send email when contact form is submitted' },
      
      // Analytics & Tracking
      { key: 'google_analytics_id', value: '', type: SettingType.TEXT, description: 'Google Analytics tracking ID' },
      { key: 'google_tag_manager_id', value: '', type: SettingType.TEXT, description: 'Google Tag Manager container ID' },
      { key: 'facebook_pixel_id', value: '', type: SettingType.TEXT, description: 'Facebook Pixel ID' },
      
      // Enhanced SEO & Branding
      { key: 'site_favicon', value: '/favicon.ico', type: SettingType.TEXT, description: 'Site favicon URL or path' },
      { key: 'seo_google_image', value: '', type: SettingType.TEXT, description: 'Google Search appearance image URL' },
      { key: 'seo_twitter_card_image', value: '', type: SettingType.TEXT, description: 'Twitter Card image URL' },
      { key: 'site_logo', value: '', type: SettingType.TEXT, description: 'Main site logo URL' },
      { key: 'site_logo_dark', value: '', type: SettingType.TEXT, description: 'Dark mode site logo URL' },
      
      // Statistics & Achievements
      { key: 'stats_projects_completed', value: '100', type: SettingType.NUMBER, description: 'Total number of completed projects' },
      { key: 'stats_years_experience', value: '15', type: SettingType.NUMBER, description: 'Years of experience in the industry' },
      { key: 'stats_team_members', value: '50', type: SettingType.NUMBER, description: 'Number of expert team members/engineers' },
      { key: 'stats_client_satisfaction', value: '98', type: SettingType.NUMBER, description: 'Client satisfaction percentage' },
      { key: 'stats_properties_valued', value: '100', type: SettingType.NUMBER, description: 'Total properties valued for banks' },
      { key: 'stats_banking_partners', value: '3', type: SettingType.NUMBER, description: 'Number of banking partners' },
    ];

    const upsertPromises = defaultSettings.map(setting =>
      prisma.companySetting.upsert({
        where: { key: setting.key },
        update: {}, // Don't overwrite existing settings
        create: setting
      })
    );

    await Promise.all(upsertPromises);

    res.json({
      success: true,
      message: 'Default settings initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize settings'
    });
  }
});

export default router;