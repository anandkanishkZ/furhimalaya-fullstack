'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown, Shield, UserCircle, Home, Bell, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/admin/useAuth';
import Image from 'next/image';

interface ProfileDropdownProps {
  className?: string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setIsOpen(false);
  };

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      href: '/admin/dashboard',
      description: 'Go to main dashboard'
    },
    {
      icon: UserCircle,
      label: 'My Profile',
      href: '/admin/settings?tab=profile',
      description: 'Manage your profile'
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/admin/settings',
      description: 'Website settings'
    },
    {
      icon: Bell,
      label: 'Notifications',
      href: '/admin/notifications',
      description: 'Manage notifications'
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      href: '/admin/help',
      description: 'Get help and support'
    }
  ];

  if (!user) {
    return null;
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 pl-3 border-l border-slate-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-300 pr-2 py-1 group"
      >
        <div className="relative">
          {user.profilePhoto ? (
            <Image
              src={user.profilePhoto}
              alt="Profile"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full ring-2 ring-blue-500 ring-offset-2 ring-offset-white group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center ring-2 ring-blue-500 ring-offset-2 ring-offset-white group-hover:scale-105 transition-transform duration-300">
              <User className="h-5 w-5 text-white" />
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
        </div>
        
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
            {user.name || 'Admin User'}
          </p>
          <p className="text-xs text-slate-500 flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            {user.role || 'Administrator'}
          </p>
        </div>
        
        <ChevronDown 
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {/* Profile Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="relative">
                {user.profilePhoto ? (
                  <Image
                    src={user.profilePhoto}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full ring-2 ring-blue-500"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center ring-2 ring-blue-500">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 block h-4 w-4 rounded-full bg-green-400 ring-2 ring-white"></span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.name || 'Admin User'}
                </h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="flex items-center mt-1">
                  <Shield className="w-3 h-3 text-blue-500 mr-1" />
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                    {user.role || 'Administrator'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" />
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100"></div>

          {/* Footer */}
          <div className="py-2">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors group"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <div className="flex-1 text-left">
                <div className="font-medium">Sign Out</div>
                <div className="text-xs text-red-500">End your session</div>
              </div>
            </button>
          </div>

          {/* User Stats */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {user.loginCount || 0}
                </div>
                <div className="text-xs text-gray-500">Total Logins</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {user.lastLoginDays || 0}d
                </div>
                <div className="text-xs text-gray-500">Last Login</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;