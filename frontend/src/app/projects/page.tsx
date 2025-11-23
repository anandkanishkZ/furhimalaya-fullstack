'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';
import publicApiClient, { Project } from '@/utils/publicApiClient';
import { useSetting } from '@/hooks/useSiteSettings';
import { 
  Search, 
  Star, 
  Calendar, 
  Building, 
  User, 
  Loader2, 
  Filter,
  MapPin,
  Award,
  ChevronDown,
  ExternalLink
} from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Dynamic statistics from settings
  const projectsCompleted = useSetting('stats_projects_completed', '100');
  const yearsExperience = useSetting('stats_years_experience', '15');
  const teamMembers = useSetting('stats_team_members', '50');
  const clientSatisfaction = useSetting('stats_client_satisfaction', '98');

  // Available categories with icons
  const categories = [
    { id: 'all', name: 'All Projects', icon: Building },
    { id: 'Residential Building', name: 'Residential', icon: Building },
    { id: 'Commercial Building', name: 'Commercial', icon: Building },
    { id: 'Industrial Project', name: 'Industrial', icon: Building },
    { id: 'Infrastructure', name: 'Infrastructure', icon: MapPin },
    { id: 'Property Valuation', name: 'Valuation', icon: Award },
    { id: 'Structural Design', name: 'Structural', icon: Building },
    { id: 'Other', name: 'Other', icon: Building }
  ];

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory, searchTerm, showFeaturedOnly]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {
        limit: 50,
      };

      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (showFeaturedOnly) {
        params.featured = true;
      }

      const response = await publicApiClient.getProjects(params);

      if (response.success) {
        setProjects(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch projects');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Ongoing';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setShowFeaturedOnly(false);
    setShowFilters(false);
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || showFeaturedOnly;

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Skeleton loading component for grid view
  const SkeletonProjectCard = () => (
    <div className="block bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="p-6">
        {/* Category Badge */}
        <div className="mb-3">
          <div className="h-6 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
        </div>
        
        {/* Title */}
        <div className="mb-3 space-y-2">
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
          <div className="h-6 w-3/4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-4 space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
          <div className="h-4 w-2/3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="space-y-2">
          <div className="h-4 w-40 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
          <div className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Skeleton loading component for list view
  const SkeletonProjectListItem = () => (
    <div className="block bg-white rounded-xl shadow-lg p-6 flex gap-6 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-32 h-32 flex-shrink-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="flex-1">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-5 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
        </div>
        
        {/* Title */}
        <div className="mb-2">
          <div className="h-5 w-3/4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-3 space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
          <div className="h-4 w-5/6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="flex items-center gap-4">
          <div className="h-4 w-28 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
          <div className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 bg-blue-700">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Engineering Projects"
            className="w-full h-full object-cover"
            width={2000}
            height={1333}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Projects</h1>
            <p className="text-xl text-blue-100 mb-8">
              Explore our portfolio of successful engineering projects that demonstrate 
              our commitment to excellence, innovation, and sustainable construction practices.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">{projectsCompleted}+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">{yearsExperience}+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">{teamMembers}+</div>
              <div className="text-gray-600">Expert Engineers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">{clientSatisfaction}%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section id="projects-section" className="py-12 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search projects by name, category, or client..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-6 py-4"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </Button>
                  <Button type="submit" className="px-8 py-4">
                    Search
                  </Button>
                </div>
              </form>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Categories */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(({ id, name, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setSelectedCategory(id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedCategory === id
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Filters */}
                  <div className="lg:w-64">
                    <h3 className="font-semibold text-gray-900 mb-3">Options</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                          showFeaturedOnly
                            ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Star className={`w-4 h-4 ${showFeaturedOnly ? 'fill-current' : ''}`} />
                          Featured Only
                        </div>
                        <div className={`w-4 h-4 rounded border ${showFeaturedOnly ? 'bg-yellow-500 border-yellow-500' : 'border-gray-300'}`}>
                          {showFeaturedOnly && <div className="w-2 h-2 bg-white rounded-sm m-1"></div>}
                        </div>
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`flex-1 p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                          Grid
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`flex-1 p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                          List
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{projects.length}</span> project{projects.length !== 1 ? 's' : ''}
                  {selectedCategory !== 'all' && (
                    <> in <span className="font-semibold text-blue-600">{categories.find(c => c.id === selectedCategory)?.name}</span></>
                  )}
                  {showFeaturedOnly && <span className="text-yellow-600"> (Featured)</span>}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {loading || error ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
              : "space-y-6"
            }>
              {viewMode === 'grid' ? (
                // Grid skeleton - show 6 cards
                [1, 2, 3, 4, 5, 6].map((i) => <SkeletonProjectCard key={i} />)
              ) : (
                // List skeleton - show 6 items
                [1, 2, 3, 4, 5, 6].map((i) => <SkeletonProjectListItem key={i} />)
              )}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 max-w-lg mx-auto">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Projects Found</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {hasActiveFilters
                    ? 'No projects match your current search criteria. Try adjusting your filters or search terms.'
                    : 'We\'re currently updating our project portfolio. Please check back soon!'}
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
              : "space-y-6"
            }>
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${generateSlug(project.title)}`}
                  className={`group transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? "block bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2" 
                      : "block bg-white rounded-xl shadow-lg hover:shadow-xl p-6 flex gap-6"
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="relative h-64 overflow-hidden rounded-t-xl">
                        {project.imageUrl ? (
                          <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                            <Building className="w-16 h-16 text-blue-400" />
                          </div>
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Featured Badge */}
                        {project.featured && (
                          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                            <Star className="w-3 h-3 fill-current" />
                            Featured
                          </div>
                        )}

                        {/* View Details Button */}
                        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg text-center font-medium flex items-center justify-center transition-colors">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Project Details
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            {project.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>
                        <div className="space-y-2 text-sm text-gray-500">
                          {project.clientName && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-blue-400" />
                              <span>{project.clientName}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span>Completed {formatDate(project.completionDate)}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-32 h-32 flex-shrink-0">
                        {project.imageUrl ? (
                          <Image
                            src={project.imageUrl}
                            alt={project.title}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                            <Building className="w-8 h-8 text-blue-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                            {project.category}
                          </span>
                          {project.featured && (
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {project.clientName && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{project.clientName}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(project.completionDate)}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-700">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Next Project?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Let's discuss how we can bring your vision to life with our expertise and dedication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold px-8 py-3">
                Get Free Consultation
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 px-8 py-3">
                View All Services
              </Button>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Projects;