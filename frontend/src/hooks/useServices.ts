'use client';

import { useState, useEffect } from 'react';
import publicApiClient from '@/utils/publicApiClient';

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

interface UseServicesResult {
  services: Service[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useServices = (params?: { 
  page?: number; 
  limit?: number; 
  search?: string;
  activeOnly?: boolean;
}): UseServicesResult => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        ...params,
        status: params?.activeOnly ? 'ACTIVE' : undefined
      };
      
      const response = await publicApiClient.getServices(queryParams);
      
      if (response.success && response.data) {
        setServices(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch services');
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setError(err instanceof Error ? err.message : 'Failed to load services');
      
      // Fallback services for development
      const fallbackServices: Service[] = [
        {
          id: 'fallback-1',
          title: 'Municipality Drawing & Design',
          description: 'Professional architectural drawings and designs that comply with local municipality regulations and standards.',
          features: [
            'Building permit drawings',
            'Construction documentation', 
            'Regulatory compliance',
            'Architectural plans'
          ],
          icon: 'ruler',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'fallback-2',
          title: 'Property Valuation',
          description: 'Expert property valuation services for banking institutions, including hotel, residential, and commercial property assessments.',
          features: [
            'Bank-grade property valuations',
            'Luxury hotel assessments',
            'Commercial property appraisals',
            'Investment analysis'
          ],
          icon: 'home',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'fallback-3',
          title: 'Site Supervision & Verification',
          description: 'Professional construction monitoring and running bill verification services for institutional lenders.',
          features: [
            'Running bill verification',
            'Construction monitoring',
            'Quality control assessment',
            'Safety protocol monitoring'
          ],
          icon: 'hardhat',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      setServices(fallbackServices);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [params?.page, params?.limit, params?.search, params?.activeOnly]);

  return {
    services,
    loading,
    error,
    refetch: fetchServices
  };
};