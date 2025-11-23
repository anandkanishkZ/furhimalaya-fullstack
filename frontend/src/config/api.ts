/**
 * Centralized API Configuration
 * All API URLs and endpoints are managed here to avoid hardcoding
 */

// Get base URLs from environment variables
const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

const getServerBaseUrl = (): string => {
  // Remove '/api' suffix if present to get server base URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  // Only replace /api at the end of the URL
  return apiUrl.replace(/\/api\/?$/, '');
};

export const API_CONFIG = {
  // Base URLs
  BASE_URL: getServerBaseUrl(),
  API_BASE: getApiBaseUrl(),
  
  // Timeout settings
  TIMEOUT: 15000,
  
  // Helper function to get full image URL
  getImageUrl: (imagePath: string): string => {
    if (!imagePath) return '';
    
    // If already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
    // For uploads, they should be served from the API domain
    // Backend returns paths like: /uploads/hero-slides/file.png
    // We need to serve from: https://api.forevershine.com.np/uploads/hero-slides/file.png
    if (cleanPath.startsWith('uploads/')) {
      const serverBase = getServerBaseUrl();
      return `${serverBase}/${cleanPath}`;
    }
    
    // If path starts with 'api/media/serve/', use server base URL
    if (cleanPath.startsWith('api/media/serve/')) {
      return `${getServerBaseUrl()}/${cleanPath}`;
    }
    
    // Default: assume it's a media serve path
    return `${getServerBaseUrl()}/api/media/serve/${cleanPath}`;
  },
  
  // API Endpoints
  endpoints: {
    // Authentication
    auth: {
      login: '/auth/login',
      me: '/auth/me',
    },
    
    // Services
    services: {
      list: '/services',
      create: '/services',
      update: (id: string) => `/services/${id}`,
      delete: (id: string) => `/services/${id}`,
    },
    
    // Projects
    projects: {
      list: '/projects',
      detail: (id: string) => `/projects/${id}`,
      create: '/projects',
      update: (id: string) => `/projects/${id}`,
      delete: (id: string) => `/projects/${id}`,
    },
    
    // Blog
    blog: {
      public: '/blog/public',
      detail: (slug: string) => `/blog/public/${slug}`,
      list: '/blog',
      create: '/blog',
      update: (id: string) => `/blog/${id}`,
      delete: (id: string) => `/blog/${id}`,
    },
    
    // Team
    team: {
      list: '/team',
      admin: '/team/admin',
      create: '/team',
      update: (id: string) => `/team/${id}`,
      delete: (id: string) => `/team/${id}`,
    },
    
    // Testimonials
    testimonials: {
      list: '/testimonials',
      admin: '/testimonials/admin',
      create: '/testimonials',
      update: (id: string) => `/testimonials/${id}`,
      delete: (id: string) => `/testimonials/${id}`,
    },
    
    // Contact
    contact: {
      submit: '/contact',
      submissions: '/contact/submissions',
      updateStatus: (id: string) => `/contact/submissions/${id}/status`,
    },
    
    // Hero Slides
    heroSlides: {
      list: '/hero-slides',
      admin: '/hero-slides/admin',
      detail: (id: string) => `/hero-slides/${id}`,
      create: '/hero-slides',
      update: (id: string) => `/hero-slides/${id}`,
      delete: (id: string) => `/hero-slides/${id}`,
      trackView: (id: string) => `/hero-slides/${id}/track-view`,
      trackClick: (id: string) => `/hero-slides/${id}/track-click`,
      analytics: '/hero-slides/analytics/summary',
    },
    
    // Media & Upload
    media: {
      serve: (path: string) => `/media/serve/${path}`,
      upload: '/upload/image',
    },
    
    // Settings
    settings: {
      get: '/settings',
      update: '/settings',
      public: '/public/settings',
    },
    
    // Profile
    profile: {
      me: '/profile/me',
      update: '/profile/me',
      changePassword: '/profile/change-password',
      uploadPhoto: '/profile/upload-photo',
    },
    
    // Notifications
    notifications: {
      list: '/notifications',
      markRead: (id: string) => `/notifications/${id}/read`,
      markAllRead: '/notifications/mark-all-read',
      unreadCount: '/notifications/unread-count',
    },
    
    // System
    system: {
      info: '/system/info',
      health: '/system/health',
    },
  },
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_CONFIG.API_BASE}${cleanEndpoint}`;
};

// Helper function for fetch with API base URL
export const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const url = buildApiUrl(endpoint);
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
};

export default API_CONFIG;
