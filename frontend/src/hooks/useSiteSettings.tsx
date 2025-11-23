'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import publicApiClient from '@/utils/publicApiClient';

interface SiteSettings {
  company_name?: string;
  company_tagline?: string;
  company_description?: string;
  seo_meta_title?: string;
  seo_meta_description?: string;
  seo_keywords?: string;
  seo_og_image?: string;
  seo_google_image?: string;
  seo_twitter_card_image?: string;
  site_favicon?: string;
  site_logo?: string;
  site_logo_dark?: string;
  social_facebook?: string;
  social_twitter?: string;
  social_linkedin?: string;
  social_instagram?: string;
  social_youtube?: string;
  company_phone?: string;
  company_email?: string;
  company_address?: string;
  company_website?: string;
  business_hours?: any;
  site_maintenance_mode?: boolean;
  stats_projects_completed?: string;
  stats_years_experience?: string;
  stats_team_members?: string;
  stats_client_satisfaction?: string;
  stats_properties_valued?: string;
  stats_banking_partners?: string;
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  getSetting: (key: keyof SiteSettings) => any;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await publicApiClient.getPublicSettings();
      
      if (response.success) {
        setSettings(response.data || {});
      } else {
        setError(response.message || 'Failed to load settings');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key: keyof SiteSettings) => {
    return settings[key];
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const value: SiteSettingsContextType = {
    settings,
    loading,
    error,
    refreshSettings: fetchSettings,
    getSetting
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}

// Hook for getting specific setting with fallback
export function useSetting(key: keyof SiteSettings, fallback?: string) {
  const { getSetting } = useSiteSettings();
  const value = getSetting(key);
  return value !== undefined && value !== null && value !== '' ? value : fallback;
}