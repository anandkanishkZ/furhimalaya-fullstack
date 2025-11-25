'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/admin/useAuth';
import {
  LayoutDashboard,
  Wrench,
  FolderOpen,
  Users,
  MessageSquare,
  Star,
  Settings,
  LogOut,
  X,
  ExternalLink,
  Mail,
  Image,
  Sliders,
  FileText,
  Bell,
  HelpCircle,
  Building
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  // Navigation structure
  const navigationSections: NavSection[] = [
    {
      title: 'Main',
      items: [
        {
          name: 'Dashboard',
          href: '/admin/dashboard',
          icon: LayoutDashboard,
        },
        {
          name: 'Notifications',
          href: '/admin/notifications',
          icon: Bell,
        },
      ]
    },
    {
      title: 'Content',
      items: [
        {
          name: 'Hero Slides',
          href: '/admin/hero-slides',
          icon: Sliders,
        },
        {
          name: 'Our Clients',
          href: '/admin/clients',
          icon: Building,
        },
        {
          name: 'Services',
          href: '/admin/services',
          icon: Wrench,
        },
        {
          name: 'Projects',
          href: '/admin/projects',
          icon: FolderOpen,
        },
        {
          name: 'Blog Posts',
          href: '/admin/blog',
          icon: FileText,
        },
      ]
    },
    {
      title: 'Engagement',
      items: [
        {
          name: 'Contact Messages',
          href: '/admin/contact',
          icon: Mail,
        },
        {
          name: 'Testimonials',
          href: '/admin/testimonials',
          icon: Star,
        },
        {
          name: 'Team Members',
          href: '/admin/team',
          icon: Users,
        },
      ]
    },
    {
      title: 'Resources',
      items: [
        {
          name: 'Media Gallery',
          href: '/admin/media',
          icon: Image,
        },
        {
          name: 'Settings',
          href: '/admin/settings',
          icon: Settings,
        },
        {
          name: 'Help & Support',
          href: '/admin/help',
          icon: HelpCircle,
        },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/admin';
  };

  // Get user initials
  const getUserInitials = () => {
    if (user?.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'AD';
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden transition-opacity"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}
        aria-label="Sidebar navigation"
      >
        {/* User Info Header */}
        <div className="h-auto px-4 py-4 border-b border-gray-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-shrink-0">
                <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                  <span className="text-base font-bold text-white">{getUserInitials()}</span>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 truncate font-medium capitalize">
                  {user?.role?.replace('_', ' ').toLowerCase() || 'Super Admin'}
                </p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors flex-shrink-0"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
          <div className="space-y-6">
            {navigationSections.map((section) => (
              <div key={section.title}>
                <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    // Check if current pathname matches or starts with the item href
                    // This handles both exact matches and nested routes
                    const isActive = pathname ? (pathname === item.href || pathname.startsWith(item.href + '/')) : false;
                    const Icon = item.icon;
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => window.innerWidth < 1024 && onToggle()}
                        className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all relative ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm border-l-4 border-blue-600 dark:border-blue-400'
                            : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white border-l-4 border-transparent'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`h-5 w-5 flex-shrink-0 transition-colors ${
                              isActive
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300'
                            }`}
                          />
                          <span className={isActive ? 'font-semibold' : ''}>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="ml-auto flex-shrink-0 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 dark:border-slate-800 p-3 flex-shrink-0 space-y-1">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 transition-all"
          >
            <ExternalLink className="h-5 w-5 text-gray-400 dark:text-slate-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
            <span>Visit Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition-all"
          >
            <LogOut className="h-5 w-5 text-gray-400 dark:text-slate-500 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}