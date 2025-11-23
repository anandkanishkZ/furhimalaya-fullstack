'use client';

import React from 'react';
import { Settings, Clock, Mail, Phone } from 'lucide-react';
import { useSetting } from '@/hooks/useSiteSettings';
import Image from 'next/image';
import { API_CONFIG } from '@/config/api';

export default function MaintenancePage() {
  // Dynamic content from settings
  const companyName = useSetting('company_name', 'Forever Shine Engineering');
  const companyEmail = useSetting('company_email', 'info@forevershine.com.np');
  const companyPhone = useSetting('company_phone', '+977 9805996059');
  const siteLogo = useSetting('site_logo', '');
  const ogImage = useSetting('seo_og_image', '');
  
  // Use logo with fallback to OG image
  const logoUrl = siteLogo || ogImage;

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4 overflow-hidden">
      <div className="max-w-xl w-full">
        {/* Company Logo & Branding */}
        <div className="text-center mb-6">
          {logoUrl && (
            <div className="mb-3">
              <Image
                src={API_CONFIG.getImageUrl(logoUrl)}
                alt={`${companyName} Logo`}
                width={80}
                height={40}
                className="mx-auto object-contain"
                priority
              />
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            {companyName}
          </h1>
          <div className="w-16 h-0.5 bg-blue-600 mx-auto rounded"></div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 text-center">
          {/* Maintenance Icon & Title */}
          <div className="mb-4">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Settings className="w-6 h-6 text-blue-600 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              🚧 We're Under Maintenance
            </h2>
            <p className="text-gray-600 mb-4">
              Our website is currently undergoing scheduled maintenance. We'll be back online shortly!
            </p>
          </div>

          {/* Expected Return - Compact */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-blue-800 font-semibold text-sm">Expected Return</span>
            </div>
            <p className="text-blue-700 text-sm">
              We expect to be back online within the next few hours.
            </p>
          </div>

          {/* Contact Information - Inline */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">Need Immediate Assistance?</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center text-sm">
              <div className="flex items-center text-gray-600">
                <Phone className="w-3 h-3 mr-1" />
                <a href={`tel:${companyPhone}`} className="hover:text-blue-600 transition-colors">
                  {companyPhone}
                </a>
              </div>
              <div className="hidden sm:block text-gray-400 mx-2">•</div>
              <div className="flex items-center text-gray-600">
                <Mail className="w-3 h-3 mr-1" />
                <a href={`mailto:${companyEmail}`} className="hover:text-blue-600 transition-colors">
                  {companyEmail}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Compact */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Developed by <a href="https://zwickytechnology.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors">Zwicky Technology</a>
          </p>
        </div>
      </div>
    </div>
  );
}