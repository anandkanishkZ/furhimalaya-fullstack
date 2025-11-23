'use client';

import { useState, useEffect } from 'react';
import publicApiClient from '@/utils/publicApiClient';

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  shortDescription?: string;
  imageUrl?: string;
  galleryImages?: string[];
  completionDate?: string;
  startDate?: string;
  clientName?: string;
  location?: string;
  budget?: number;
  projectArea?: number;
  projectType?: string;
  status: 'ACTIVE' | 'INACTIVE';
  featured?: boolean;
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

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  categories: string[];
}

export const useProjects = (params?: { 
  page?: number; 
  limit?: number; 
  search?: string;
  category?: string;
  featured?: boolean;
  activeOnly?: boolean;
}): UseProjectsResult => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        ...params,
        status: params?.activeOnly ? 'ACTIVE' : undefined
      };
      
      const response = await publicApiClient.getProjects(queryParams);
      
      if (response.success && response.data) {
        setProjects(response.data);
        
        // Extract unique categories
        const categorySet = new Set(response.data.map(project => project.category));
        const uniqueCategories = Array.from(categorySet);
        setCategories(uniqueCategories);
      } else {
        throw new Error(response.message || 'Failed to fetch projects');
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to load projects');
      
      // Fallback projects for development
      const fallbackProjects: Project[] = [
        {
          id: 'fallback-1',
          title: 'Modern Office Complex',
          slug: 'modern-office-complex',
          category: 'Commercial',
          description: 'A state-of-the-art office complex featuring sustainable design elements and modern amenities.',
          shortDescription: 'Sustainable office complex with modern amenities',
          imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          galleryImages: [
            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
          ],
          clientName: 'ABC Corporation',
          location: 'Kathmandu, Nepal',
          projectType: 'Commercial Building',
          technologies: ['Steel Framework', 'Glass Facade', 'Smart Building Systems'],
          achievements: ['LEED Gold Certification', 'Energy Efficient Design'],
          status: 'ACTIVE',
          featured: true,
          priority: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'fallback-2',
          title: 'Luxury Residential Tower',
          slug: 'luxury-residential-tower',
          category: 'Residential',
          description: 'High-end residential tower with premium finishes and panoramic city views.',
          shortDescription: 'Premium residential tower with city views',
          imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          galleryImages: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
          ],
          clientName: 'XYZ Properties',
          location: 'Lalitpur, Nepal',
          projectType: 'Residential Tower',
          technologies: ['Reinforced Concrete', 'Premium Interiors', 'Smart Home Systems'],
          achievements: ['Fastest Construction Timeline', 'Premium Quality Materials'],
          status: 'ACTIVE',
          featured: true,
          priority: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'fallback-3',
          title: 'Infrastructure Development',
          slug: 'infrastructure-development',
          category: 'Infrastructure',
          description: 'Large-scale infrastructure project including roads, bridges, and utility systems.',
          shortDescription: 'Comprehensive infrastructure development project',
          imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          galleryImages: [
            'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
          ],
          clientName: 'Government of Nepal',
          location: 'Rautahat, Nepal',
          projectType: 'Infrastructure',
          technologies: ['Heavy Machinery', 'Concrete Technology', 'Survey Equipment'],
          achievements: ['On-time Delivery', 'Cost-effective Solution'],
          status: 'ACTIVE',
          featured: false,
          priority: 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      setProjects(fallbackProjects);
      setCategories(['Commercial', 'Residential', 'Infrastructure']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [params?.page, params?.limit, params?.search, params?.category, params?.featured, params?.activeOnly]);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    categories
  };
};