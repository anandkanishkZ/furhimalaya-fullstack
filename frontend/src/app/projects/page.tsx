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
  Scissors, 
  Palette, 
  Loader2, 
  Filter,
  Mountain,
  Award,
  ChevronDown,
  ExternalLink,
  Heart,
  Sparkles,
  Building2,
  User
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

  // Dynamic statistics from settings - Furhimalaya brand stats
  const pashminasCrafted = useSetting('stats_pashminas_crafted', '500');
  const masterArtisans = useSetting('stats_master_artisans', '25');
  const yearsHeritage = useSetting('stats_years_heritage', '30');
  const globalClients = useSetting('stats_global_clients', '200');

  // Available categories with luxury fashion icons
  const categories = [
    { id: 'all', name: 'All Collections', icon: Sparkles },
    { id: 'Premium Pashmina', name: 'Premium Pashmina', icon: Scissors },
    { id: 'Luxury Shawls', name: 'Luxury Shawls', icon: Palette },
    { id: 'Heritage Collection', name: 'Heritage Collection', icon: Mountain },
    { id: 'Bridal Collection', name: 'Bridal Collection', icon: Heart },
    { id: 'Limited Edition', name: 'Limited Edition', icon: Award },
    { id: 'Handwoven Scarves', name: 'Handwoven Scarves', icon: Scissors },
    { id: 'Other', name: 'Other', icon: Sparkles }
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
      <section className="relative py-32 bg-gradient-to-br from-brand-primary-800 to-brand-primary-900 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center"
            alt="Furhimalaya Heritage Crafts"
            className="w-full h-full object-cover"
            width={2000}
            height={1333}
          />
        </div>
        
        {/* Elegant overlay pattern */}
        <div className="absolute inset-0 z-5 opacity-20">
          <div className="absolute top-20 left-10 w-40 h-40 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 border border-white/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-white/10 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <Mountain className="w-5 h-5 text-brand-primary-300" />
              <span className="text-brand-primary-200 font-medium">Himalayan Heritage</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Our <span className="text-brand-primary-300">Masterpieces</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-light leading-relaxed max-w-3xl mx-auto">
              Discover our exquisite collection of handcrafted Pashmina creations. Each piece tells a story 
              of centuries-old tradition, master craftsmanship, and timeless Himalayan heritage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                href="#collections" 
                variant="primary" 
                className="bg-brand-primary text-white hover:bg-brand-primary-dark px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl"
              >
                <Sparkles className="w-5 h-5 mr-2 text-white" />
                <span className="text-white">Explore Collections</span>
              </Button>
              <Button 
                href="/contact" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-medium"
              >
                Visit Our Atelier
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Statistics Section */}
      <section className="py-20 bg-gradient-to-b from-white to-brand-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Crafting Excellence for <span className="text-brand-primary">Generations</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our heritage speaks through numbers that reflect decades of dedication to authentic Himalayan craftsmanship.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className="w-12 h-12 bg-brand-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Scissors className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-2">{pashminasCrafted}+</div>
                  <div className="text-gray-600 font-medium">Pashminas Crafted</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className="w-12 h-12 bg-brand-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-2">{masterArtisans}+</div>
                  <div className="text-gray-600 font-medium">Master Artisans</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className="w-12 h-12 bg-brand-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mountain className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-2">{yearsHeritage}+</div>
                  <div className="text-gray-600 font-medium">Years of Heritage</div>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className="w-12 h-12 bg-brand-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-2">{globalClients}+</div>
                  <div className="text-gray-600 font-medium">Global Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section id="collections" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-brand-primary-50 rounded-full px-6 py-3 mb-6">
                <Sparkles className="w-5 h-5 text-brand-primary-600" />
                <span className="text-brand-primary-700 font-medium">Luxury Collections</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Browse Our <span className="text-brand-primary">Exquisite</span> Gallery
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Each masterpiece is meticulously handcrafted by our skilled artisans using traditional techniques 
                passed down through generations in the Himalayan valleys.
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-gradient-to-r from-brand-primary-50 to-white rounded-2xl shadow-lg p-6 mb-8 border border-brand-primary-100">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-primary-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search our collections by name, style, or material..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-brand-primary-200 rounded-xl focus:ring-2 focus:ring-brand-primary-300 focus:border-brand-primary-300 text-lg bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-6 py-4 border-brand-primary-200 text-brand-primary hover:bg-brand-primary-50"
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
                              ? 'bg-brand-primary text-white shadow-lg'
                              : 'bg-brand-primary-50 text-brand-primary-700 hover:bg-brand-primary-100'
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
                            ? 'bg-brand-primary-50 border-brand-primary-300 text-brand-primary-700'
                            : 'bg-white border-brand-primary-200 text-gray-700 hover:bg-brand-primary-50'
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
                          className={`flex-1 p-2 rounded ${viewMode === 'grid' ? 'bg-brand-primary-100 text-brand-primary-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                          Grid
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`flex-1 p-2 rounded ${viewMode === 'list' ? 'bg-brand-primary-100 text-brand-primary-700' : 'bg-gray-100 text-gray-600'}`}
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
                  Showing <span className="font-semibold text-gray-900">{projects.length}</span> masterpiece{projects.length !== 1 ? 's' : ''}
                  {selectedCategory !== 'all' && (
                    <> in <span className="font-semibold text-brand-primary">{categories.find(c => c.id === selectedCategory)?.name}</span></>
                  )}
                  {showFeaturedOnly && <span className="text-brand-primary-600"> (Featured)</span>}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Masterpieces Gallery Section */}
      <section className="py-20 bg-gradient-to-b from-white to-brand-primary-50">
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
              <div className="bg-gradient-to-br from-brand-primary-50 to-white border border-brand-primary-200 rounded-2xl p-12 max-w-lg mx-auto shadow-lg">
                <Sparkles className="w-16 h-16 text-brand-primary-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Masterpieces Found</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {hasActiveFilters
                    ? 'No collections match your current search criteria. Try adjusting your filters or search terms.'
                    : 'We\'re currently updating our luxury collection. Please check back soon for new masterpieces!'}
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
                  className={`group transition-all duration-500 ${
                    viewMode === 'grid' 
                      ? "block bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-3 border border-brand-primary-100 hover:border-brand-primary-200" 
                      : "block bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 flex gap-6 border border-brand-primary-100"
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
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary-100 to-brand-primary-200">
                            <Scissors className="w-16 h-16 text-brand-primary-400" />
                          </div>
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Featured Badge */}
                        {project.featured && (
                          <div className="absolute top-4 right-4 bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                            <Star className="w-3 h-3 fill-current" />
                            Premium
                          </div>
                        )}

                        {/* View Details Button */}
                        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="bg-white/95 backdrop-blur-sm text-brand-primary hover:bg-brand-primary hover:text-white px-4 py-2 rounded-xl text-center font-medium flex items-center justify-center transition-all duration-300 shadow-lg">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Masterpiece
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-brand-primary-100 text-brand-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                            {project.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>
                        <div className="space-y-2 text-sm text-gray-500">
                          {project.clientName && (
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-brand-primary-400" />
                              <span>Crafted for {project.clientName}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-brand-primary-400" />
                            <span>Created {formatDate(project.completionDate)}</span>
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
                            <Building2 className="w-8 h-8 text-blue-400" />
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

      {/* Luxury CTA Section */}
      <section className="py-24 bg-gradient-to-br from-brand-primary-800 to-brand-primary-900 relative overflow-hidden">
        {/* Elegant background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 border border-white/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-white/10 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <Scissors className="w-5 h-5 text-brand-primary-300" />
              <span className="text-brand-primary-200 font-medium">Bespoke Luxury</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Commission Your Own <br/>
              <span className="text-brand-primary-300">Himalayan Masterpiece</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 font-light leading-relaxed max-w-3xl mx-auto">
              Experience the ultimate in luxury with a custom-crafted Pashmina creation. 
              Our master artisans will weave your vision into an heirloom of extraordinary beauty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                href="/contact"
                className="bg-brand-primary text-white hover:bg-brand-primary-dark font-semibold px-10 py-4 text-lg shadow-lg hover:shadow-xl"
              >
                <Heart className="w-5 h-5 mr-2 text-white" />
                <span className="text-white">Commission Custom Piece</span>
              </Button>
              <Button 
                href="/services"
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 px-10 py-4 text-lg font-medium"
              >
                <Mountain className="w-5 h-5 mr-2" />
                Visit Our Heritage Atelier
              </Button>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Projects;