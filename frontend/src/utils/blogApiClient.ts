const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string;
  author: {
    id: string;
    email: string;
    name?: string;
    profilePhoto?: string;
  };
}

export interface BlogPostsResponse {
  success: boolean;
  message: string;
  data: BlogPost[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BlogPostResponse {
  success: boolean;
  message: string;
  data: BlogPost;
}

class BlogApiClient {
  private baseUrl = `${API_BASE_URL}/blog`;

  async getPublishedPosts(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<BlogPostsResponse> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.search) searchParams.append('search', params.search);

      const url = `${this.baseUrl}/public${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Ensure fresh data
        next: { revalidate: 0 } // Disable caching in Next.js
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching published posts:', error);
      // Return empty data instead of throwing during build
      return {
        success: false,
        message: 'Failed to fetch blog posts',
        data: []
      };
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPostResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/public/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Ensure fresh data
        next: { revalidate: 0 } // Disable caching in Next.js
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching blog post by slug:', error);
      // Return error response instead of throwing during build
      throw error; // Re-throw for proper error handling in components
    }
  }

  // Helper method to format date
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Helper method to get excerpt
  static getExcerpt(content: string, maxLength: number = 150): string {
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '');
    
    if (plainText.length <= maxLength) {
      return plainText;
    }
    
    return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
  }
}

export default BlogApiClient;