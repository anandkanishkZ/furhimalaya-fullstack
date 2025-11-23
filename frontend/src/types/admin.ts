// Admin API Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  category: string;
  url: string;
  size: number;
  type: 'image' | 'document';
  mimeType: string;
  dimensions?: {
    width: number;
    height: number;
  };
  createdAt: string;
  thumbnailUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon?: string;
  imageUrl?: string;
  price?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  shortDescription?: string;
  imageUrl?: string;
  galleryImages: string[];
  completionDate?: string;
  startDate?: string;
  clientName?: string;
  location?: string;
  budget?: number;
  projectArea?: number;
  projectType?: string;
  status: 'ACTIVE' | 'INACTIVE';
  featured: boolean;
  priority: number;
  
  // SEO Meta Fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  
  // Additional Details
  technologies: string[];
  teamMembers: string[];
  challenges: string[];
  achievements: string[];
  testimonial?: string;
  
  // Social Media
  socialImages: string[];
  
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  metaKeywords?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    email: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  imageUrl?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  status: 'ACTIVE' | 'INACTIVE';
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  position?: string;
  company?: string;
  content: string;
  imageUrl?: string;
  rating: number;
  status: 'ACTIVE' | 'INACTIVE';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  profilePhoto?: string;
  createdAt?: string;
  updatedAt?: string;
  loginCount?: number;
  lastLoginDays?: number;
  lastLoginAt?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}