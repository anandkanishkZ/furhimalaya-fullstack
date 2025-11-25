import { ApiResponse } from '@/types/admin';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseUrl: string;
  private requestQueue: Map<string, Promise<any>> = new Map();
  private csrfToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Fetch CSRF token from server
  private async fetchCsrfToken(): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/csrf-token`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        this.csrfToken = data.data?.csrfToken || null;
        return this.csrfToken;
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
    return null;
  }

  // Get CSRF token (fetch if not cached)
  private async getCsrfToken(): Promise<string | null> {
    if (!this.csrfToken) {
      await this.fetchCsrfToken();
    }
    return this.csrfToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const requestKey = `${options.method || 'GET'}-${endpoint}`;
    
    // Prevent duplicate requests for the same endpoint
    if (this.requestQueue.has(requestKey)) {
      return this.requestQueue.get(requestKey);
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Only set Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // Add CSRF token for state-changing requests (POST, PUT, DELETE, PATCH)
    const method = options.method?.toUpperCase() || 'GET';
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const csrfToken = await this.getCsrfToken();
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }
    }

    const requestPromise = (async (): Promise<ApiResponse<T>> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const response = await fetch(url, {
          ...options,
          headers,
          credentials: 'include', // Include cookies in requests
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle 403 - CSRF token might be invalid, refresh it
        if (response.status === 403) {
          const errorData = await response.json().catch(() => ({}));
          if (errorData.message?.includes('CSRF')) {
            // Refresh CSRF token and retry
            await this.fetchCsrfToken();
            const csrfToken = this.csrfToken;
            if (csrfToken) {
              headers['X-CSRF-Token'] = csrfToken;
              const retryResponse = await fetch(url, {
                ...options,
                headers,
                credentials: 'include',
              });
              
              if (retryResponse.ok) {
                const data = await retryResponse.json();
                return data;
              }
            }
          }
        }

        // Handle 401 - try to refresh token
        if (response.status === 401) {
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry the original request
            const retryResponse = await fetch(url, {
              ...options,
              headers,
              credentials: 'include',
            });
            
            if (!retryResponse.ok) {
              const errorData = await retryResponse.json().catch(() => ({}));
              const error = new Error(errorData.message || `HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
              (error as any).response = {
                status: retryResponse.status,
                data: errorData
              };
              throw error;
            }
            
            const data = await retryResponse.json();
            return data;
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
          // Attach the full error response for detailed error handling
          (error as any).response = {
            status: response.status,
            data: errorData
          };
          throw error;
        }

        const data = await response.json();
        return data;
      } catch (error: any) {
        console.error('API request failed:', error);
        
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        
        throw error;
      } finally {
        // Clean up the request from queue after completion
        setTimeout(() => {
          this.requestQueue.delete(requestKey);
        }, 100);
      }
    })();

    this.requestQueue.set(requestKey, requestPromise);
    return requestPromise;
  }

  // Refresh access token using refresh token
  private async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      
      return response.ok;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request<{ user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request<any>('/profile/me');
  }

  // Services
  async getServices(params?: { page?: number; limit?: number; search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    
    const query = searchParams.toString();
    return this.request<any[]>(`/services${query ? `?${query}` : ''}`);
  }

  async getService(id: string) {
    return this.request<any>(`/services/${id}`);
  }

  async createService(data: any) {
    return this.request<any>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: string, data: any) {
    return this.request<any>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: string) {
    return this.request<any>(`/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Projects
  async getProjects(params?: { page?: number; limit?: number; search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    
    const query = searchParams.toString();
    return this.request<any[]>(`/projects${query ? `?${query}` : ''}`);
  }

  async getProject(id: string) {
    return this.request<any>(`/projects/${id}`);
  }

  async createProject(data: any) {
    return this.request<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: any) {
    return this.request<any>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string) {
    return this.request<any>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // File Upload
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${this.baseUrl}/upload/image`, {
      method: 'POST',
      credentials: 'include', // Include cookies
      body: formData,
    });

    return response.json();
  }

  // Contact Submissions
  async getContactSubmissions() {
    return this.request<any[]>('/contact/submissions');
  }

  async submitContactForm(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) {
    return this.request<any>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async updateContactSubmissionStatus(id: string, status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED') {
    return this.request<any>(`/contact/submissions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async deleteContactSubmission(id: string) {
    return this.request<any>(`/contact/submissions/${id}`, {
      method: 'DELETE',
    });
  }

  // Blog Posts
  async getBlogPosts(params?: { page?: number; limit?: number; search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    
    const query = searchParams.toString();
    return this.request<any[]>(`/blog${query ? `?${query}` : ''}`);
  }

  async getBlogPost(id: string) {
    return this.request<any>(`/blog/${id}`);
  }

  async createBlogPost(data: any) {
    return this.request<any>('/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBlogPost(id: string, data: any) {
    return this.request<any>(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBlogPost(id: string) {
    return this.request<any>(`/blog/${id}`, {
      method: 'DELETE',
    });
  }

  // Team Members
  async getTeamMembers() {
    return this.request<any[]>('/team/admin');
  }

  async getTeamMember(id: string) {
    return this.request<any>(`/team/${id}`);
  }

  async createTeamMember(data: any) {
    return this.request<any>('/team', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTeamMember(id: string, data: any) {
    return this.request<any>(`/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTeamMember(id: string) {
    return this.request<any>(`/team/${id}`, {
      method: 'DELETE',
    });
  }

  // Testimonials Management
  async getTestimonials(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);

    return this.request<any[]>(`/testimonials/admin?${searchParams}`);
  }

  async getPublicTestimonials(params?: { 
    featured?: boolean; 
    limit?: number; 
  }) {
    const searchParams = new URLSearchParams();
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    return this.request<any[]>(`/testimonials?${searchParams}`);
  }

  async getTestimonial(id: string) {
    return this.request<any>(`/testimonials/${id}`);
  }

  async createTestimonial(data: any) {
    return this.request<any>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTestimonial(id: string, data: any) {
    return this.request<any>(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTestimonial(id: string) {
    return this.request<any>(`/testimonials/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleTestimonialStatus(id: string) {
    return this.request<any>(`/testimonials/${id}/toggle-status`, {
      method: 'PATCH',
    });
  }

  async toggleTestimonialFeatured(id: string) {
    return this.request<any>(`/testimonials/${id}/toggle-featured`, {
      method: 'PATCH',
    });
  }

  // Media Management
  async getMediaFiles(params?: { 
    category?: string; 
    type?: 'image' | 'document'; 
    page?: number; 
    limit?: number; 
  }) {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.type) searchParams.append('type', params.type);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const query = searchParams.toString();
    return this.request<any[]>(`/media${query ? `?${query}` : ''}`);
  }

  async uploadMedia(files: FileList, category: string = 'general') {
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('category', category);

    return this.request<any[]>('/media/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async deleteMedia(category: string, filename: string) {
    return this.request<any>(`/media/${category}/${filename}`, {
      method: 'DELETE',
    });
  }

  async getMediaCategories() {
    return this.request<string[]>('/media/categories');
  }

  // Settings
  async getSettings() {
    return this.request<any>('/settings');
  }

  async updateSettings(settings: any) {
    return this.request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings }),
    });
  }

  async getSetting(key: string) {
    return this.request<any>(`/settings/${key}`);
  }

  async deleteSetting(key: string) {
    return this.request<any>(`/settings/${key}`, {
      method: 'DELETE',
    });
  }

  async initializeDefaultSettings() {
    return this.request<any>('/settings/initialize', {
      method: 'POST',
    });
  }

  // Profile Management

  async updateProfile(data: { name: string; email: string; profilePhoto?: string }) {
    return this.request<any>('/profile/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: { currentPassword: string; newPassword: string; confirmPassword: string }) {
    return this.request<any>('/profile/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Notifications Management
  async getNotifications(params?: { page?: number; limit?: number; unread?: boolean }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.unread !== undefined) searchParams.append('unread', params.unread.toString());
    
    const query = searchParams.toString();
    return this.request<any[]>(`/notifications${query ? `?${query}` : ''}`);
  }

  async markNotificationAsRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request<any>('/notifications/mark-all-read', {
      method: 'PATCH',
    });
  }

  async deleteNotification(id: string) {
    return this.request<any>(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  async createNotification(data: { title: string; message: string; type?: string; actionUrl?: string; actionLabel?: string }) {
    return this.request<any>('/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Hero Slides methods
  async getHeroSlides() {
    return this.request<any[]>('/hero-slides/admin');
  }

  async getHeroSlidesAnalytics() {
    return this.request<any>('/hero-slides/analytics/summary');
  }

  async createHeroSlide(data: any) {
    return this.request<any>('/hero-slides', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateHeroSlide(id: string, data: any) {
    return this.request<any>(`/hero-slides/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateHeroSlideStatus(id: string, status: string) {
    return this.request<any>(`/hero-slides/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async reorderHeroSlide(id: string, displayOrder: number) {
    return this.request<any>(`/hero-slides/${id}/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ displayOrder }),
    });
  }

  async deleteHeroSlide(id: string) {
    return this.request<any>(`/hero-slides/${id}`, {
      method: 'DELETE',
    });
  }

  async updateHeroSlideOrder(data: { id: string; displayOrder: number }[]) {
    return this.request<any>('/hero-slides/order', {
      method: 'PUT',
      body: JSON.stringify({ slides: data }),
    });
  }

  async uploadHeroSlideImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    
    return this.request<any>('/hero-slides/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async createHeroSlideWithFormData(formData: FormData) {
    return this.request<any>('/hero-slides', {
      method: 'POST',
      body: formData,
    });
  }

  async updateHeroSlideWithFormData(id: string, formData: FormData) {
    return this.request<any>(`/hero-slides/${id}`, {
      method: 'PUT',
      body: formData,
    });
  }

  // System Information
  async getSystemInfo() {
    return this.request<any>('/system/info', {
      method: 'GET',
    });
  }

  // =================== CLIENT MANAGEMENT ===================

  // Get all clients (admin)
  async getClients(params?: {
    category?: string;
    featured?: boolean;
    status?: string;
    search?: string;
    limit?: number;
    skip?: number;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
  }) {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
    if (params?.orderDir) queryParams.append('orderDir', params.orderDir);

    return this.request<any>(`/clients/admin/all?${queryParams}`, {
      method: 'GET',
    });
  }

  // Get single client
  async getClient(id: string) {
    return this.request<any>(`/clients/${id}`, {
      method: 'GET',
    });
  }

  // Create new client
  async createClient(clientData: {
    name: string;
    description?: string;
    website?: string;
    logoUrl?: string;
    category?: string;
    contactEmail?: string;
    contactPhone?: string;
    featured?: boolean;
    displayOrder?: number;
    startDate?: string;
    endDate?: string;
  }) {
    return this.request<any>('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  // Update client
  async updateClient(id: string, clientData: {
    name?: string;
    description?: string;
    website?: string;
    logoUrl?: string;
    category?: string;
    contactEmail?: string;
    contactPhone?: string;
    featured?: boolean;
    displayOrder?: number;
    startDate?: string;
    endDate?: string;
    status?: 'ACTIVE' | 'INACTIVE';
  }) {
    return this.request<any>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  }

  // Delete client
  async deleteClient(id: string) {
    return this.request<any>(`/clients/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;