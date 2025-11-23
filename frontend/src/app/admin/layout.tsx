'use client';

import React from 'react';
import { AuthProvider } from '@/hooks/admin/useAuth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}