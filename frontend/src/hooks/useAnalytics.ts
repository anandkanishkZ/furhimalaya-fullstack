'use client';

import { useState, useEffect } from 'react';

interface AnalyticsConfig {
  googleAnalyticsId: string | null;
  googleTagManagerId: string | null;
  facebookPixelId: string | null;
  isConfigured: boolean;
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsConfig>({
    googleAnalyticsId: null,
    googleTagManagerId: null,
    facebookPixelId: null,
    isConfigured: false,
  });

  useEffect(() => {
    // Get analytics IDs from environment variables (priority)
    const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
    const gtmId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
    const fbPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

    const isConfigured = !!(gaId || gtmId || fbPixelId);

    setAnalytics({
      googleAnalyticsId: gaId || null,
      googleTagManagerId: gtmId || null,
      facebookPixelId: fbPixelId || null,
      isConfigured,
    });
  }, []);

  return analytics;
}

