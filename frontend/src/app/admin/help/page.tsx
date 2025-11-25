'use client';

import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import { useAuth } from '@/hooks/admin/useAuth';
import apiClient from '@/utils/admin/apiClient';
import { 
  HelpCircle, MessageSquare, Phone, Mail, ExternalLink, 
  Server, Database, Cpu, HardDrive, Clock, Activity, CheckCircle, Zap, Shield, 
  Bell, BarChart, Layout, Image, Settings, Globe, Lock, Smartphone, Search, 
  TrendingUp, Package, AlertCircle, Code, Layers, FileText, Users, Book
} from 'lucide-react';

interface SystemInfo {
  server: {
    platform: string;
    type: string;
    release: string;
    hostname: string;
    architecture: string;
    nodeVersion: string;
    uptime: {
      total: number;
      formatted: string;
      days: number;
      hours: number;
      minutes: number;
    };
  };
  cpu: {
    model: string;
    cores: number;
    speed: number;
    usage?: {
      user: string;
      system: string;
      idle: string;
      total: string;
      percent: number;
    };
    loadAverage?: number[];
  };
  memory: {
    total: number;
    free: number;
    used: number;
    totalGB: string;
    usedGB: string;
    freeGB: string;
    usagePercent: number;
    available: number;
    buffers: number;
    cached: number;
    status: 'healthy' | 'warning' | 'critical';
  };
  process?: {
    pid: number;
    uptime: number;
    uptimeFormatted: string;
    memory: {
      rss: string;
      heapTotal: string;
      heapUsed: string;
      external: string;
      heapUsagePercent: number;
    };
    nodeVersion: string;
    platform: string;
    arch: string;
  };
  disk?: {
    rootPartition?: {
      filesystem: string;
      total: string;
      used: string;
      free: string;
      usagePercent: number;
      mountPoint: string;
    };
    platform: string;
    available: boolean;
    uploads?: {
      size: string;
      sizeBytes: number;
      path: string;
    };
    logs?: {
      size: string;
      sizeBytes: number;
      path: string;
    };
    warningLevel?: 'normal' | 'warning' | 'critical';
  };
  application: {
    version: string;
    environment: string;
    port: string | number;
    databaseType: string;
    databaseVersion: string;
  };
  database: {
    totalProjects: number;
    totalServices: number;
    totalBlogPosts: number;
    totalTestimonials: number;
    totalTeamMembers: number;
    totalContacts: number;
    totalUsers: number;
    latestActivity: {
      project: string | null;
      blog: string | null;
      contact: string | null;
    };
  };
  databaseHealth?: {
    connected: boolean;
    responseTime: string;
    status: 'excellent' | 'good' | 'fair' | 'slow' | 'error';
    tables?: Array<{
      name: string;
      size: string;
      rowCount: number;
    }>;
    performanceRating: string;
  };
  security?: {
    failedLoginAttempts: number;
    successfulLogins: number;
    totalUsers: number;
    adminUsers: number;
    recentActivity?: Array<{
      action: string;
      timestamp: string;
      user: string;
    }>;
    securityStatus: 'secure' | 'warning' | 'alert';
    lastAuditCheck: string;
  };
  developer: {
    company: string;
    phone: string;
    email: string;
    website: string;
    supportEmail: string;
  };
  serverTime: string;
  timezone: string;
}

export default function AdminHelpPage() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSystemInfo();
    }
  }, [user]);

  const fetchSystemInfo = async () => {
    try {
      setLoading(true);
      setAuthError(false);

      console.log('🔑 Fetching system info with cookie-based auth...');

      const response = await apiClient.getSystemInfo();

      console.log('📡 Response status:', response.success);

      if (response.success && response.data) {
        setSystemInfo(response.data);
        console.log('✅ System info received successfully');
      } else {
        console.error('❌ API returned error:', response.message);
        setAuthError(true);
      }
    } catch (error) {
      console.error('❌ Error fetching system info:', error);
      setAuthError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const systemFeatures = [
    {
      category: 'Content Management',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      features: [
        { name: 'Dynamic Blog System', description: 'Create, edit, and publish blog posts with rich text editor', icon: FileText },
        { name: 'Project Portfolio', description: 'Showcase projects with galleries, details, and categorization', icon: Package },
        { name: 'Service Management', description: 'Manage service offerings with features and descriptions', icon: Layers },
        { name: 'Team Management', description: 'Add and manage team members with roles and social links', icon: Users },
        { name: 'Testimonials', description: 'Collect and display client testimonials and reviews', icon: MessageSquare },
        { name: 'Hero Slider', description: 'Dynamic homepage sliders with analytics tracking', icon: Image }
      ]
    },
    {
      category: 'Real-Time Notifications',
      icon: Bell,
      color: 'from-violet-500 to-violet-600',
      features: [
        { name: 'Contact Form Alerts', description: 'Instant notifications for new contact submissions', icon: Mail },
        { name: 'Content Updates', description: 'Alerts for new projects, services, and blog posts', icon: AlertCircle },
        { name: 'System Events', description: 'Track all important system activities in real-time', icon: Activity },
        { name: 'Welcome Messages', description: 'Automatic welcome notifications on first login', icon: CheckCircle },
        { name: 'Mark as Read', description: 'Individual and bulk notification management', icon: CheckCircle },
        { name: 'Action Links', description: 'Quick navigation to relevant sections from notifications', icon: ExternalLink }
      ]
    },
    {
      category: 'Analytics & Tracking',
      icon: BarChart,
      color: 'from-emerald-500 to-emerald-600',
      features: [
        { name: 'Hero Slide Analytics', description: 'Track views and clicks on homepage sliders', icon: TrendingUp },
        { name: 'Dashboard Statistics', description: 'Real-time overview of all content metrics', icon: BarChart },
        { name: 'Contact Tracking', description: 'Monitor and manage contact form submissions', icon: MessageSquare },
        { name: 'System Monitoring', description: 'Live server metrics (CPU, Memory, Uptime)', icon: Server },
        { name: 'Database Stats', description: 'Real-time count of all records in system', icon: Database },
        { name: 'Activity Timeline', description: 'Track latest activities across all modules', icon: Clock }
      ]
    },
    {
      category: 'Media & Assets',
      icon: Image,
      color: 'from-rose-500 to-rose-600',
      features: [
        { name: 'Media Gallery', description: 'Centralized media library for all images and files', icon: Image },
        { name: 'Image Upload', description: 'Easy drag-and-drop image upload functionality', icon: Zap },
        { name: 'Auto Thumbnails', description: 'Automatic thumbnail generation for uploads', icon: Image },
        { name: 'Multiple Formats', description: 'Support for various image and document formats', icon: FileText },
        { name: 'Gallery Management', description: 'Organize media into categories and albums', icon: Layout },
        { name: 'Optimized Storage', description: 'Efficient file storage and retrieval system', icon: HardDrive }
      ]
    },
    {
      category: 'Security & Authentication',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      features: [
        { name: 'JWT Authentication', description: 'Secure token-based authentication system', icon: Lock },
        { name: 'Role Management', description: 'Admin and Super Admin role permissions', icon: Shield },
        { name: 'Password Encryption', description: 'Industry-standard password hashing (bcrypt)', icon: Lock },
        { name: 'Session Management', description: 'Secure session handling and timeout', icon: Clock },
        { name: 'Protected Routes', description: 'Route-level authentication middleware', icon: Shield },
        { name: 'XSS Protection', description: 'Input sanitization and security measures', icon: Shield }
      ]
    },
    {
      category: 'User Experience',
      icon: Layout,
      color: 'from-indigo-500 to-indigo-600',
      features: [
        { name: 'Responsive Design', description: 'Mobile-first, fully responsive admin panel', icon: Smartphone },
        { name: 'Modern UI/UX', description: 'Clean, intuitive interface with Tailwind CSS', icon: Layout },
        { name: 'Dark Mode Ready', description: 'Optimized color schemes for accessibility', icon: Zap },
        { name: 'Fast Loading', description: 'Optimized performance with Next.js 14', icon: Zap },
        { name: 'Search Function', description: 'Quick search across all content types', icon: Search },
        { name: 'Breadcrumbs', description: 'Easy navigation with breadcrumb trails', icon: Layout }
      ]
    },
    {
      category: 'Settings & Configuration',
      icon: Settings,
      color: 'from-amber-500 to-amber-600',
      features: [
        { name: 'Company Settings', description: 'Configure company information and branding', icon: Settings },
        { name: 'Social Media Links', description: 'Manage social media profiles and links', icon: Globe },
        { name: 'Contact Information', description: 'Update contact details and addresses', icon: Phone },
        { name: 'SEO Settings', description: 'Meta tags, keywords, and SEO optimization', icon: Search },
        { name: 'Email Configuration', description: 'SMTP settings for email notifications', icon: Mail },
        { name: 'Backup & Restore', description: 'Automatic database backups and recovery', icon: Database }
      ]
    },
    {
      category: 'Developer Features',
      icon: Code,
      color: 'from-cyan-500 to-cyan-600',
      features: [
        { name: 'RESTful API', description: 'Complete API with comprehensive endpoints', icon: Code },
        { name: 'TypeScript', description: 'Full type safety throughout the application', icon: Code },
        { name: 'Prisma ORM', description: 'Type-safe database access and migrations', icon: Database },
        { name: 'PostgreSQL', description: 'Robust and scalable database system', icon: Database },
        { name: 'Next.js 14', description: 'Latest React framework with app router', icon: Code },
        { name: 'Documentation', description: 'Comprehensive code documentation and guides', icon: Book }
      ]
    }
  ];



  const contactOptions = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      action: 'Start Chat',
      color: 'bg-emerald-500 hover:bg-emerald-600',
      link: `mailto:${systemInfo?.developer.supportEmail || 'support@anayainfotech.com.np'}`
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: systemInfo?.developer.email || 'info@anayainfotech.com.np',
      action: 'Send Email',
      color: 'bg-blue-500 hover:bg-blue-600',
      link: `mailto:${systemInfo?.developer.email || 'info@anayainfotech.com.np'}`
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: systemInfo?.developer.phone || '+977 9825733821',
      action: 'Call Now',
      color: 'bg-violet-500 hover:bg-violet-600',
      link: `tel:${systemInfo?.developer.phone || '+977 9825733821'}`
    }
  ];

  return (
    <AdminDashboardLayout title="Help & Support">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <HelpCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support Center</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find answers to common questions, browse our documentation, or get in touch with our support team.
            </p>
          </div>
        </div>

        {/* Auth Error Message */}
        {authError && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-sm">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Authentication Error</h3>
                <p className="text-red-700 mb-4">
                  Your session has expired or the authentication token is invalid. System information cannot be loaded.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => window.location.href = '/admin'}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Re-login to Continue
                  </button>
                  <button
                    onClick={() => {
                      setAuthError(false);
                      fetchSystemInfo();
                    }}
                    className="bg-white hover:bg-gray-50 text-red-700 px-4 py-2 rounded-lg font-medium border border-red-300 transition-colors"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          {contactOptions.map((option) => (
            <div key={option.title} className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className={`w-12 h-12 rounded-lg ${option.color} flex items-center justify-center mx-auto mb-4`}>
                <option.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{option.description}</p>
              <a 
                href={option.link}
                className={`block w-full py-2 px-4 ${option.color} text-white rounded-lg font-medium transition-colors`}
              >
                {option.action}
              </a>
            </div>
          ))}
        </div>

        {/* System Features - Comprehensive List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Zap className="w-7 h-7 text-yellow-500 mr-3" />
                  System Features
                </h2>
                <p className="text-gray-600 mt-1">Complete feature list of Fur Himalaya Admin System</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {systemFeatures.reduce((acc, cat) => acc + cat.features.length, 0)}+ Features
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {systemFeatures.map((category, index) => (
              <div key={category.category} className="space-y-4">
                {/* Category Header */}
                <div className={`bg-gradient-to-r ${category.color} rounded-lg p-4 text-white shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2 mr-3">
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{category.category}</h3>
                        <p className="text-sm text-white text-opacity-90">{category.features.length} Features</p>
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold">
                      Module {index + 1}
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.features.map((feature, featureIndex) => {
                    // Static color mapping for icons - Tailwind doesn't support dynamic classes
                    const iconColorMap: Record<string, string> = {
                      'Content Management': 'text-blue-600',
                      'Real-Time Notifications': 'text-violet-600',
                      'Analytics & Tracking': 'text-emerald-600',
                      'Media & Assets': 'text-rose-600',
                      'Security & Authentication': 'text-red-600',
                      'User Experience': 'text-indigo-600',
                      'Settings & Configuration': 'text-amber-600',
                      'Developer Features': 'text-cyan-600'
                    };
                    const iconColor = iconColorMap[category.category] || 'text-blue-600';
                    
                    return (
                      <div 
                        key={featureIndex}
                        className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-lg p-4 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                      >
                        <div className="flex items-start">
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 mr-3 group-hover:scale-110 transition-transform">
                            <feature.icon className={`w-5 h-5 ${iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h4 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                                {feature.name}
                              </h4>
                              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 ml-2" />
                            </div>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Feature Summary */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-100">
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-blue-600">{systemFeatures.length}</div>
                <div className="text-sm text-gray-600 mt-1">Categories</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-purple-600">
                  {systemFeatures.reduce((acc, cat) => acc + cat.features.length, 0)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Features</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-600 mt-1">Functional</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-yellow-600">24/7</div>
                <div className="text-sm text-gray-600 mt-1">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Information */}
        {systemInfo && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Developed By</h2>
                <p className="text-3xl font-bold mb-1">{systemInfo.developer.company}</p>
                <p className="text-blue-100">Professional Web Development & IT Solutions</p>
              </div>
              <div className="text-right">
                <div className="space-y-2">
                  <div className="flex items-center justify-end gap-2">
                    <Phone className="w-5 h-5" />
                    <a href={`tel:${systemInfo.developer.phone}`} className="text-lg font-semibold hover:text-blue-200">
                      {systemInfo.developer.phone}
                    </a>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Mail className="w-5 h-5" />
                    <a href={`mailto:${systemInfo.developer.email}`} className="hover:text-blue-200">
                      {systemInfo.developer.email}
                    </a>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <ExternalLink className="w-5 h-5" />
                    <a href={`https://${systemInfo.developer.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-200">
                      {systemInfo.developer.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Information */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Server className="w-6 h-6 text-blue-600 mr-3" />
              System Information
            </h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading system information...</p>
            </div>
          ) : systemInfo ? (
            <div className="p-6 space-y-6">
              {/* Server Stats - Enhanced with CPU Usage */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Cpu className="w-8 h-8 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700 bg-blue-200 px-2 py-1 rounded">CPU</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Processor</h3>
                  <p className="text-lg font-bold text-gray-900">{systemInfo.cpu.cores} Cores</p>
                  <p className="text-xs text-gray-600 mt-1 truncate" title={systemInfo.cpu.model}>
                    {systemInfo.cpu.model}
                  </p>
                  {systemInfo.cpu.usage && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Usage</span>
                        <span className="font-bold text-blue-600">{systemInfo.cpu.usage.percent.toFixed(1)}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            systemInfo.cpu.usage.percent > 80 ? 'bg-red-600' :
                            systemInfo.cpu.usage.percent > 60 ? 'bg-yellow-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${systemInfo.cpu.usage.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <HardDrive className="w-8 h-8 text-green-600" />
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      systemInfo.memory.status === 'critical' ? 'bg-red-200 text-red-700' :
                      systemInfo.memory.status === 'warning' ? 'bg-yellow-200 text-yellow-700' :
                      'bg-green-200 text-green-700'
                    }`}>RAM</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Memory Usage</h3>
                  <p className="text-lg font-bold text-gray-900">{systemInfo.memory.usagePercent.toFixed(1)}%</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {systemInfo.memory.usedGB} / {systemInfo.memory.totalGB} GB
                  </p>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        systemInfo.memory.status === 'critical' ? 'bg-red-600' :
                        systemInfo.memory.status === 'warning' ? 'bg-yellow-600' : 'bg-green-600'
                      }`}
                      style={{ width: `${systemInfo.memory.usagePercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-8 h-8 text-purple-600" />
                    <span className="text-xs font-medium text-purple-700 bg-purple-200 px-2 py-1 rounded">Uptime</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Server Uptime</h3>
                  <p className="text-lg font-bold text-gray-900">{systemInfo.server.uptime.formatted}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Running continuously
                  </p>
                  {systemInfo.process && (
                    <p className="text-xs text-purple-600 mt-1 font-medium">
                      Process: {systemInfo.process.uptimeFormatted}
                    </p>
                  )}
                </div>

                {systemInfo.disk && systemInfo.disk.rootPartition && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <HardDrive className="w-8 h-8 text-orange-600" />
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        systemInfo.disk.warningLevel === 'critical' ? 'bg-red-200 text-red-700' :
                        systemInfo.disk.warningLevel === 'warning' ? 'bg-yellow-200 text-yellow-700' :
                        'bg-orange-200 text-orange-700'
                      }`}>Disk</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Storage</h3>
                    <p className="text-lg font-bold text-gray-900">{systemInfo.disk.rootPartition.usagePercent.toFixed(1)}%</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {systemInfo.disk.rootPartition.used} / {systemInfo.disk.rootPartition.total}
                    </p>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          systemInfo.disk.warningLevel === 'critical' ? 'bg-red-600' :
                          systemInfo.disk.warningLevel === 'warning' ? 'bg-yellow-600' : 'bg-orange-600'
                        }`}
                        style={{ width: `${systemInfo.disk.rootPartition.usagePercent}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Database Health & Security Metrics */}
              {(systemInfo.databaseHealth || systemInfo.security) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {systemInfo.databaseHealth && (
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 flex items-center">
                          <Database className="w-5 h-5 text-emerald-600 mr-2" />
                          Database Health
                        </h3>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          systemInfo.databaseHealth.status === 'excellent' ? 'bg-green-200 text-green-800' :
                          systemInfo.databaseHealth.status === 'good' ? 'bg-emerald-200 text-emerald-800' :
                          systemInfo.databaseHealth.status === 'fair' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-red-200 text-red-800'
                        }`}>
                          {systemInfo.databaseHealth.performanceRating}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between bg-white/50 rounded px-3 py-2">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium capitalize ${
                            systemInfo.databaseHealth.connected ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {systemInfo.databaseHealth.connected ? 'Connected ✓' : 'Disconnected ✗'}
                          </span>
                        </div>
                        <div className="flex justify-between bg-white/50 rounded px-3 py-2">
                          <span className="text-gray-600">Response Time:</span>
                          <span className="font-medium text-emerald-700">{systemInfo.databaseHealth.responseTime}</span>
                        </div>
                        <div className="flex justify-between bg-white/50 rounded px-3 py-2">
                          <span className="text-gray-600">Performance:</span>
                          <span className="font-medium capitalize text-emerald-700">{systemInfo.databaseHealth.status}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {systemInfo.security && (
                    <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 flex items-center">
                          <Shield className="w-5 h-5 text-rose-600 mr-2" />
                          Security Status
                        </h3>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          systemInfo.security.securityStatus === 'secure' ? 'bg-green-200 text-green-800' :
                          systemInfo.security.securityStatus === 'warning' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-red-200 text-red-800'
                        }`}>
                          {systemInfo.security.securityStatus.toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between bg-white/50 rounded px-3 py-2">
                          <span className="text-gray-600">Failed Logins:</span>
                          <span className={`font-bold ${
                            systemInfo.security.failedLoginAttempts > 10 ? 'text-red-600' :
                            systemInfo.security.failedLoginAttempts > 5 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {systemInfo.security.failedLoginAttempts}
                          </span>
                        </div>
                        <div className="flex justify-between bg-white/50 rounded px-3 py-2">
                          <span className="text-gray-600">Successful Logins:</span>
                          <span className="font-medium text-rose-700">{systemInfo.security.successfulLogins}</span>
                        </div>
                        <div className="flex justify-between bg-white/50 rounded px-3 py-2">
                          <span className="text-gray-600">Total Users:</span>
                          <span className="font-medium text-rose-700">{systemInfo.security.totalUsers}</span>
                        </div>
                        <div className="flex justify-between bg-white/50 rounded px-3 py-2">
                          <span className="text-gray-600">Admin Users:</span>
                          <span className="font-medium text-rose-700">{systemInfo.security.adminUsers}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Process Metrics & Disk Details */}
              {(systemInfo.process || systemInfo.disk) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {systemInfo.process && (
                    <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-5">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Activity className="w-5 h-5 text-cyan-600 mr-2" />
                        Process Metrics
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between bg-white/50 rounded px-3 py-2">
                          <span className="text-gray-600">Process ID:</span>
                          <span className="font-medium text-cyan-700">{systemInfo.process.pid}</span>
                        </div>
                        <div className="flex justify-between bg-white/50 rounded px-3 py-2">
                          <span className="text-gray-600">Heap Used:</span>
                          <span className="font-medium text-cyan-700">{systemInfo.process.memory.heapUsed}</span>
                        </div>
                        <div className="flex justify-between bg-white/50 rounded px-3 py-2">
                          <span className="text-gray-600">Heap Total:</span>
                          <span className="font-medium text-cyan-700">{systemInfo.process.memory.heapTotal}</span>
                        </div>
                        <div className="flex justify-between bg-white/50 rounded px-3 py-2">
                          <span className="text-gray-600">Heap Usage:</span>
                          <span className={`font-bold ${
                            (typeof systemInfo.process.memory.heapUsagePercent === 'number' ? systemInfo.process.memory.heapUsagePercent : parseFloat(systemInfo.process.memory.heapUsagePercent)) > 80 ? 'text-red-600' :
                            (typeof systemInfo.process.memory.heapUsagePercent === 'number' ? systemInfo.process.memory.heapUsagePercent : parseFloat(systemInfo.process.memory.heapUsagePercent)) > 60 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {typeof systemInfo.process.memory.heapUsagePercent === 'number' 
                              ? systemInfo.process.memory.heapUsagePercent.toFixed(1) 
                              : parseFloat(systemInfo.process.memory.heapUsagePercent).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between bg-white/50 rounded px-3 py-2">
                          <span className="text-gray-600">RSS Memory:</span>
                          <span className="font-medium text-cyan-700">{systemInfo.process.memory.rss}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {systemInfo.disk && (systemInfo.disk.uploads || systemInfo.disk.logs) && (
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-5">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <HardDrive className="w-5 h-5 text-amber-600 mr-2" />
                        Storage Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        {systemInfo.disk.rootPartition && (
                          <>
                            <div className="flex justify-between bg-white/50 rounded px-3 py-2">
                              <span className="text-gray-600">Filesystem:</span>
                              <span className="font-medium text-amber-700">{systemInfo.disk.rootPartition.filesystem}</span>
                            </div>
                            <div className="flex justify-between bg-white/50 rounded px-3 py-2">
                              <span className="text-gray-600">Available:</span>
                              <span className="font-medium text-amber-700">{systemInfo.disk.rootPartition.free}</span>
                            </div>
                          </>
                        )}
                        {systemInfo.disk.uploads && (
                          <div className="flex justify-between bg-white/50 rounded px-3 py-2">
                            <span className="text-gray-600">Uploads Folder:</span>
                            <span className="font-medium text-amber-700">{systemInfo.disk.uploads.size}</span>
                          </div>
                        )}
                        {systemInfo.disk.logs && (
                          <div className="flex justify-between bg-white/50 rounded px-3 py-2">
                            <span className="text-gray-600">Logs Folder:</span>
                            <span className="font-medium text-amber-700">{systemInfo.disk.logs.size}</span>
                          </div>
                        )}
                        {systemInfo.disk.warningLevel && systemInfo.disk.warningLevel !== 'normal' && (
                          <div className="mt-2 bg-yellow-100 border border-yellow-300 rounded px-3 py-2">
                            <p className="text-xs font-medium text-yellow-800 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {systemInfo.disk.warningLevel === 'critical' ? 
                                'Critical: Disk space low!' : 'Warning: Disk usage high'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Server Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Server className="w-5 h-5 text-blue-600 mr-2" />
                    Server Details
                  </h3>
                  <div className="space-y-2 text-sm bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform:</span>
                      <span className="font-medium capitalize">{systemInfo.server.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">OS Type:</span>
                      <span className="font-medium">{systemInfo.server.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Architecture:</span>
                      <span className="font-medium">{systemInfo.server.architecture}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Node.js:</span>
                      <span className="font-medium">{systemInfo.server.nodeVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hostname:</span>
                      <span className="font-medium">{systemInfo.server.hostname}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Database className="w-5 h-5 text-green-600 mr-2" />
                    Application Info
                  </h3>
                  <div className="space-y-2 text-sm bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Version:</span>
                      <span className="font-medium">{systemInfo.application.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Environment:</span>
                      <span className="font-medium capitalize">{systemInfo.application.environment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Database:</span>
                      <span className="font-medium">{systemInfo.application.databaseType} {systemInfo.application.databaseVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Port:</span>
                      <span className="font-medium">{systemInfo.application.port}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timezone:</span>
                      <span className="font-medium text-xs">{systemInfo.timezone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Database Statistics */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Activity className="w-5 h-5 text-indigo-600 mr-2" />
                  Database Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{systemInfo.database.totalProjects}</p>
                    <p className="text-xs text-gray-600 mt-1">Projects</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{systemInfo.database.totalServices}</p>
                    <p className="text-xs text-gray-600 mt-1">Services</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">{systemInfo.database.totalBlogPosts}</p>
                    <p className="text-xs text-gray-600 mt-1">Blog Posts</p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-pink-600">{systemInfo.database.totalTestimonials}</p>
                    <p className="text-xs text-gray-600 mt-1">Testimonials</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-600">{systemInfo.database.totalTeamMembers}</p>
                    <p className="text-xs text-gray-600 mt-1">Team Members</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">{systemInfo.database.totalContacts}</p>
                    <p className="text-xs text-gray-600 mt-1">Contacts</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-indigo-600">{systemInfo.database.totalUsers}</p>
                    <p className="text-xs text-gray-600 mt-1">Users</p>
                  </div>
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 text-center">
                    <Clock className="w-6 h-6 text-teal-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Last Activity</p>
                  </div>
                </div>

                {/* Latest Activity */}
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Latest Project:</span>
                      <span className="font-medium">{formatDate(systemInfo.database.latestActivity.project)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Latest Blog:</span>
                      <span className="font-medium">{formatDate(systemInfo.database.latestActivity.blog)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Latest Contact:</span>
                      <span className="font-medium">{formatDate(systemInfo.database.latestActivity.contact)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Server Time */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Server Time</p>
                    <p className="text-lg font-bold text-gray-900">{new Date(systemInfo.serverTime).toLocaleString()}</p>
                  </div>
                  <Clock className="w-10 h-10 text-gray-400" />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-600">Failed to load system information</p>
              <button 
                onClick={fetchSystemInfo}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}