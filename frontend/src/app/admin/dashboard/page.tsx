'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import apiClient from '@/utils/admin/apiClient';
import {
  Wrench,
  FolderOpen,
  Users,
  ArrowRight,
  Image,
  Sliders,
  FileText,
  Star,
  Mail
} from 'lucide-react';

interface DashboardStats {
  services: number;
  projects: number;
  teamMembers: number;
  testimonials: number;
  contactMessages: number;
  blogPosts: number;
  heroSlides: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    services: 0,
    projects: 0,
    teamMembers: 0,
    testimonials: 0,
    contactMessages: 0,
    blogPosts: 0,
    heroSlides: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [servicesRes, projectsRes, contactRes, teamRes, testimonialsRes, blogRes, heroRes] = await Promise.all([
          apiClient.getServices(),
          apiClient.getProjects(),
          apiClient.getContactSubmissions(),
          apiClient.getTeamMembers(),
          apiClient.getTestimonials(),
          apiClient.getBlogPosts(),
          apiClient.getHeroSlides()
        ]);

        setStats({
          services: servicesRes.data?.length || 0,
          projects: projectsRes.data?.length || 0,
          teamMembers: teamRes.data?.length || 0,
          testimonials: testimonialsRes.data?.length || 0,
          contactMessages: contactRes.data?.length || 0,
          blogPosts: blogRes.data?.length || 0,
          heroSlides: heroRes.data?.length || 0
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    { name: 'Total', subtitle: 'Services', value: stats.services, icon: Wrench, color: 'from-blue-500 to-blue-600', badge: 'Active', badgeColor: 'bg-blue-100 text-blue-800', href: '/admin/services' },
    { name: 'Active', subtitle: 'Projects', value: stats.projects, icon: FolderOpen, color: 'from-green-500 to-green-600', badge: 'Live', badgeColor: 'bg-green-100 text-green-800', href: '/admin/projects' },
    { name: 'Team', subtitle: 'Members', value: stats.teamMembers, icon: Users, color: 'from-purple-500 to-purple-600', badge: 'Team', badgeColor: 'bg-purple-100 text-purple-800', href: '/admin/team' },
    { name: 'Contact', subtitle: 'Messages', value: stats.contactMessages, icon: Mail, color: 'from-indigo-500 to-indigo-600', badge: 'Inbox', badgeColor: 'bg-orange-100 text-orange-800', href: '/admin/contact' },
  ];

  const quickActions = [
    { name: 'Add Service', description: 'Create new service', icon: Wrench, color: 'from-blue-500 to-blue-600', hoverColor: 'hover:border-blue-300 hover:bg-blue-50', onClick: () => router.push('/admin/services') },
    { name: 'New Project', description: 'Add portfolio item', icon: FolderOpen, color: 'from-green-500 to-green-600', hoverColor: 'hover:border-green-300 hover:bg-green-50', onClick: () => router.push('/admin/projects') },
    { name: 'Write Blog', description: 'Create article', icon: FileText, color: 'from-purple-500 to-purple-600', hoverColor: 'hover:border-purple-300 hover:bg-purple-50', onClick: () => router.push('/admin/blog') },
    { name: 'Add Member', description: 'Invite team member', icon: Users, color: 'from-orange-500 to-orange-600', hoverColor: 'hover:border-orange-300 hover:bg-orange-50', onClick: () => router.push('/admin/team') },
    { name: 'Hero Slide', description: 'Add homepage slide', icon: Sliders, color: 'from-pink-500 to-pink-600', hoverColor: 'hover:border-pink-300 hover:bg-pink-50', onClick: () => router.push('/admin/hero-slides') },
    { name: 'Media Upload', description: 'Add images/files', icon: Image, color: 'from-teal-500 to-teal-600', hoverColor: 'hover:border-teal-300 hover:bg-teal-50', onClick: () => router.push('/admin/media') },
  ];

  const contentOverview = [
    { name: 'Hero Slides', count: stats.heroSlides, icon: Sliders, color: 'from-pink-500 to-pink-600', href: '/admin/hero-slides' },
    { name: 'Blog Posts', count: stats.blogPosts, icon: FileText, color: 'from-purple-500 to-purple-600', href: '/admin/blog' },
    { name: 'Testimonials', count: stats.testimonials, icon: Star, color: 'from-yellow-500 to-yellow-600', href: '/admin/testimonials' },
  ];

  return (
    <AdminDashboardLayout title="Dashboard">
      <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
        <div className="bg-blue-600 rounded-lg shadow-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
          <p className="text-blue-100 text-lg">Manage your website content efficiently from one place</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          )) : statsCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <button key={idx} onClick={() => router.push(stat.href)} className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-300 hover:-translate-y-1 group text-left">
                <div className="flex items-center justify-between mb-4">
                  <div className={'p-3 rounded-lg bg-gradient-to-r ' + stat.color}><Icon className="h-6 w-6 text-white" /></div>
                  <span className={'text-xs font-semibold px-2.5 py-0.5 rounded-full ' + stat.badgeColor}>{stat.badge}</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium text-gray-700">{stat.name}</p><p className="text-xs text-gray-500">{stat.subtitle}</p></div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            );
          })}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-gray-900">Content Overview</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contentOverview.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button key={idx} onClick={() => router.push(item.href)} className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group">
                  <div className="flex items-center space-x-3">
                    <div className={'p-2 rounded-lg bg-gradient-to-r ' + item.color}><Icon className="h-5 w-5 text-white" /></div>
                    <div className="text-left"><p className="text-sm font-medium text-gray-700">{item.name}</p><p className="text-lg font-bold text-gray-900">{item.count}</p></div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-600">Jump directly to common tasks</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button key={idx} onClick={action.onClick} className={'group flex flex-col items-center p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border-2 border-gray-200 ' + action.hoverColor + ' transition-all duration-200 hover:shadow-lg hover:-translate-y-1'}>
                  <div className={'p-3 rounded-lg bg-gradient-to-r ' + action.color + ' mb-3 transform group-hover:scale-110 transition-transform'}><Icon className="h-6 w-6 text-white" /></div>
                  <span className="text-sm font-semibold text-gray-800 text-center">{action.name}</span>
                  <span className="text-xs text-gray-600 mt-1 text-center">{action.description}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
