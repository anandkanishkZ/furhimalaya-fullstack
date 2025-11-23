'use client';

import React from 'react';
import { Menu, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';

interface AdminHeaderProps {
  onMenuToggle: () => void;
  title: string;
}

export default function AdminHeader({ onMenuToggle, title }: AdminHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-40 flex-shrink-0">
      <div className="flex items-center justify-between h-16 px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:scale-105"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-4 lg:ml-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-1"></div>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Visit Site Button */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <ExternalLink className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            <span className="hidden sm:inline">Visit Site</span>
          </Link>

          {/* Notifications */}
          <NotificationDropdown />

          {/* Profile */}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}