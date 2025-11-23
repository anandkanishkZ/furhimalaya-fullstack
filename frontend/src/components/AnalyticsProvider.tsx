'use client';

import Analytics from './Analytics';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function AnalyticsProvider() {
  const { googleAnalyticsId, googleTagManagerId, facebookPixelId } = useAnalytics();

  return (
    <Analytics
      googleAnalyticsId={googleAnalyticsId || undefined}
      googleTagManagerId={googleTagManagerId || undefined}
      facebookPixelId={facebookPixelId || undefined}
    />
  );
}
