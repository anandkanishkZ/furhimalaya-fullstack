import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';
import { prisma } from '../utils/prisma';

const router = Router();

// Public settings endpoint - no authentication required
// Only returns publicly accessible settings
router.get('/', async (req: Request, res: Response<ApiResponse>) => {
  try {
    // Define which settings can be publicly accessed
    const publicSettingKeys = [
      'company_name',
      'company_tagline',
      'company_description',
      'company_phone',
      'company_email',
      'company_website',
      'company_address',
      'social_facebook',
      'social_twitter',
      'social_linkedin',
      'social_instagram',
      'social_youtube',
      'seo_meta_title',
      'seo_meta_description',
      'seo_keywords',
      'seo_og_image',
      'seo_google_image',
      'seo_twitter_card_image',
      'site_favicon',
      'site_logo',
      'site_logo_dark',
      'business_hours',
      'site_maintenance_mode',
      // Statistics
      'stats_projects_completed',
      'stats_years_experience',
      'stats_team_members',
      'stats_client_satisfaction',
      'stats_properties_valued',
      'stats_banking_partners'
    ];

    const settings = await prisma.companySetting.findMany({
      where: {
        key: {
          in: publicSettingKeys
        }
      }
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
      
      acc[setting.key] = value;
      return acc;
    }, {} as any);

    res.json({
      success: true,
      message: 'Public settings retrieved successfully',
      data: settingsMap
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
});

// Get specific public setting by key
router.get('/:key', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { key } = req.params;
    
    // Define which settings can be publicly accessed
    const publicSettingKeys = [
      'company_name',
      'company_tagline',
      'company_description',
      'company_phone',
      'company_email',
      'company_website',
      'company_address',
      'social_facebook',
      'social_twitter',
      'social_linkedin',
      'social_instagram',
      'social_youtube',
      'seo_meta_title',
      'seo_meta_description',
      'seo_keywords',
      'seo_og_image',
      'seo_google_image',
      'seo_twitter_card_image',
      'site_favicon',
      'site_logo',
      'site_logo_dark',
      'business_hours',
      'site_maintenance_mode',
      // Statistics
      'stats_projects_completed',
      'stats_years_experience',
      'stats_team_members',
      'stats_client_satisfaction',
      'stats_properties_valued',
      'stats_banking_partners'
    ];

    if (!publicSettingKeys.includes(key)) {
      return res.status(403).json({
        success: false,
        message: 'Access to this setting is not allowed'
      });
    }
    
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
        key: setting.key,
        value
      }
    });
  } catch (error) {
    console.error('Error fetching public setting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch setting'
    });
  }
});

export default router;