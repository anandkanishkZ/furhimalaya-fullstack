'use client';

import React from 'react';
import { useSetting } from '@/hooks/useSiteSettings';
import MaintenancePage from './MaintenancePage';

interface MaintenanceModeWrapperProps {
  children: React.ReactNode;
}

export default function MaintenanceModeWrapper({ children }: MaintenanceModeWrapperProps) {
  const maintenanceModeSetting = useSetting('site_maintenance_mode', 'false');
  const isMaintenanceMode = maintenanceModeSetting === 'true' || maintenanceModeSetting === true;

  // If maintenance mode is enabled, show maintenance page
  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  // Otherwise, show the normal content
  return <>{children}</>;
}