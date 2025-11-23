import { Request, Response } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
}

export interface ServiceData {
  title: string;
  description: string;
  features: string[];
  icon?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface ProjectData {
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  completionDate?: string;
  clientName?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  featured?: boolean;
}

export interface BlogPostData {
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  categories?: string[];
}

export interface TeamMemberData {
  name: string;
  position: string;
  bio?: string;
  imageUrl?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  displayOrder?: number;
}

export interface TestimonialData {
  clientName: string;
  position?: string;
  company?: string;
  content: string;
  imageUrl?: string;
  rating?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  featured?: boolean;
}

export interface ContactSubmissionData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

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