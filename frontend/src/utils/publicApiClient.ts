// Public API Client for frontend (no authentication required)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  shortDescription?: string;
  clientName?: string;
  location?: string;
  completionDate?: string;
  startDate?: string;
  budget?: number;
  projectArea?: number;
  projectType?: string;
  imageUrl?: string;
  galleryImages?: string[];
  status: 'ACTIVE' | 'INACTIVE';
  featured: boolean;
  priority?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  technologies?: string[];
  teamMembers?: string[];
  challenges?: string[];
  achievements?: string[];
  testimonial?: string;
  socialImages?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
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
  facebook?: string;
  twitter?: string;
  instagram?: string;
  tiktok?: string;
  status: 'ACTIVE' | 'INACTIVE';
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  category?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: 'ACTIVE' | 'INACTIVE';
  featured: boolean;
  displayOrder: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
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

class PublicApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Projects
  async getProjects(params?: { 
    page?: number; 
    limit?: number; 
    search?: string;
    category?: string;
    featured?: boolean;
  }): Promise<ApiResponse<Project[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    
    const url = `${this.baseURL}/projects${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    }
  }

  // Services
  async getServices(params?: { 
    page?: number; 
    limit?: number; 
    search?: string;
  }): Promise<ApiResponse<Service[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const url = `${this.baseURL}/services${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch services:', error);
      throw error;
    }
  }

  // Get public settings
  async getPublicSettings(): Promise<ApiResponse<Record<string, any>>> {
    try {
      const response = await fetch(`${this.baseURL}/public/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour to prevent rate limiting
      });
      
      if (!response.ok) {
        // If rate limited (429), return cached fallback
        if (response.status === 429) {
          console.warn('Rate limited, using fallback settings');
          return {
            success: true,
            message: 'Using fallback settings due to rate limiting',
            data: {
              company_name: 'Fur Himalaya',
              company_tagline: 'Luxury Pashmina Heritage',
              seo_meta_title: 'Fur Himalaya - Luxury Pashmina Heritage',
              seo_meta_description: 'Experience the finest authentic Himalayan Pashmina crafted with timeless artistry.',
              seo_keywords: 'pashmina, luxury scarves, himalayan crafts, premium shawls'
            }
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch public settings:', error);
      throw error;
    }
  }

  // Get specific public setting
  async getPublicSetting(key: string): Promise<ApiResponse<{key: string, value: any}>> {
    try {
      const response = await fetch(`${this.baseURL}/public/settings/${key}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch public setting:', error);
      throw error;
    }
  }

  // Get team members (public route)
  async getTeamMembers(): Promise<ApiResponse<TeamMember[]>> {
    try {
      const response = await fetch(`${this.baseURL}/team`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      throw error;
    }
  }

  // Get all clients (public endpoint)
  async getClients(params?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    skip?: number;
  }): Promise<ApiResponse<Client[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.skip) queryParams.append('skip', params.skip.toString());

      const response = await fetch(`${this.baseURL}/clients?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      throw error;
    }
  }

  // Get single client by ID (public endpoint)
  async getClient(id: string): Promise<ApiResponse<Client>> {
    try {
      const response = await fetch(`${this.baseURL}/clients/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch client:', error);
      throw error;
    }
  }
}

const publicApiClient = new PublicApiClient();
export default publicApiClient;