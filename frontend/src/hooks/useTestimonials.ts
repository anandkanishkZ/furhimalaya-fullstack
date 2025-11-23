import { useState, useEffect, useCallback } from 'react';
import { Testimonial } from '@/types/admin';

interface UseTestimonialsOptions {
  featured?: boolean;
  limit?: number;
  autoFetch?: boolean;
}

interface UseTestimonialsReturn {
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTestimonials = (options: UseTestimonialsOptions = {}): UseTestimonialsReturn => {
  const { featured, limit, autoFetch = true } = options;
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (featured !== undefined) {
        params.append('featured', String(featured));
      }
      if (limit !== undefined) {
        params.append('limit', String(limit));
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setTestimonials(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch testimonials');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  }, [featured, limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchTestimonials();
    }
  }, [autoFetch, fetchTestimonials]);

  return {
    testimonials,
    loading,
    error,
    refetch: fetchTestimonials,
  };
};

// Hook for admin testimonials with pagination
interface UseAdminTestimonialsOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  autoFetch?: boolean;
}

interface UseAdminTestimonialsReturn extends UseTestimonialsReturn {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  createTestimonial: (data: Partial<Testimonial>) => Promise<boolean>;
  updateTestimonial: (id: string, data: Partial<Testimonial>) => Promise<boolean>;
  deleteTestimonial: (id: string) => Promise<boolean>;
  toggleStatus: (id: string) => Promise<boolean>;
  toggleFeatured: (id: string) => Promise<boolean>;
}

export const useAdminTestimonials = (options: UseAdminTestimonialsOptions = {}): UseAdminTestimonialsReturn => {
  const { page = 1, limit = 10, search, status, autoFetch = true } = options;
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem('admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      
      if (search) params.append('search', search);
      if (status) params.append('status', status);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/admin?${params}`, {
        headers: getAuthHeader(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setTestimonials(data.data || []);
        setPagination(data.pagination || null);
      } else {
        throw new Error(data.message || 'Failed to fetch testimonials');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error fetching admin testimonials:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status]);

  const createTestimonial = async (data: Partial<Testimonial>): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await fetchTestimonials(); // Refresh the list
        return true;
      } else {
        setError(result.message || 'Failed to create testimonial');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return false;
    }
  };

  const updateTestimonial = async (id: string, data: Partial<Testimonial>): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await fetchTestimonials(); // Refresh the list
        return true;
      } else {
        setError(result.message || 'Failed to update testimonial');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return false;
    }
  };

  const deleteTestimonial = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      const result = await response.json();

      if (result.success) {
        await fetchTestimonials(); // Refresh the list
        return true;
      } else {
        setError(result.message || 'Failed to delete testimonial');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return false;
    }
  };

  const toggleStatus = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}/toggle-status`, {
        method: 'PATCH',
        headers: getAuthHeader(),
      });

      const result = await response.json();

      if (result.success) {
        await fetchTestimonials(); // Refresh the list
        return true;
      } else {
        setError(result.message || 'Failed to toggle status');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return false;
    }
  };

  const toggleFeatured = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}/toggle-featured`, {
        method: 'PATCH',
        headers: getAuthHeader(),
      });

      const result = await response.json();

      if (result.success) {
        await fetchTestimonials(); // Refresh the list
        return true;
      } else {
        setError(result.message || 'Failed to toggle featured status');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return false;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchTestimonials();
    }
  }, [autoFetch, fetchTestimonials]);

  return {
    testimonials,
    loading,
    error,
    pagination,
    refetch: fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleStatus,
    toggleFeatured,
  };
};