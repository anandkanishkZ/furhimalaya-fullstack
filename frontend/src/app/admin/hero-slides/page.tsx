'use client';

import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import { API_CONFIG } from '@/config/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  MoveUp, 
  MoveDown, 
  Calendar,
  BarChart3,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import HeroSlideModal from '@/components/admin/HeroSlideModal';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { apiClient } from '@/utils/admin/apiClient';

interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
  displayOrder: number;
  startDate?: string;
  endDate?: string;
  textAlign: string;
  textColor: string;
  overlayOpacity: number;
  seoTitle?: string;
  seoDescription?: string;
  views: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

interface AnalyticsSummary {
  totalSlides: number;
  activeSlides: number;
  totalViews: number;
  totalClicks: number;
  averageClickRate: string;
}

export default function HeroSlidesManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [previewSlide, setPreviewSlide] = useState<HeroSlide | null>(null);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Helper function to construct proper image URLs
  const getImageUrl = (imageUrl: string): string => {
    return API_CONFIG.getImageUrl(imageUrl);
  };

  useEffect(() => {
    fetchSlides();
    fetchAnalytics();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getHeroSlides();
      
      if (response.success) {
        setSlides(response.data || []);
      } else {
        toast.error('Failed to fetch hero slides');
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast.error('Error loading hero slides');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await apiClient.getHeroSlidesAnalytics();
      
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleCreate = () => {
    setEditingSlide(null);
    setShowModal(true);
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setShowModal(true);
  };

  const handleDelete = async (slide: HeroSlide) => {
    if (!confirm(`Are you sure you want to delete "${slide.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await apiClient.deleteHeroSlide(slide.id);

      if (response.success) {
        toast.success('Hero slide deleted successfully');
        fetchSlides();
        fetchAnalytics();
      } else {
        toast.error('Failed to delete hero slide');
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Error deleting hero slide');
    }
  };

  const handleStatusToggle = async (slide: HeroSlide) => {
    try {
      const newStatus = slide.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const response = await apiClient.updateHeroSlideStatus(slide.id, newStatus);

      if (response.success) {
        toast.success(`Hero slide ${newStatus.toLowerCase()} successfully`);
        fetchSlides();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    }
  };

  const handleReorder = async (slide: HeroSlide, direction: 'up' | 'down') => {
    const currentIndex = slides.findIndex(s => s.id === slide.id);
    const newOrder = direction === 'up' ? slide.displayOrder - 1 : slide.displayOrder + 1;

    try {
      const response = await apiClient.reorderHeroSlide(slide.id, newOrder);

      if (response.success) {
        fetchSlides();
      } else {
        toast.error('Failed to reorder slide');
      }
    } catch (error) {
      console.error('Error reordering slide:', error);
      toast.error('Error reordering slide');
    }
  };

  const openPreview = (slide: HeroSlide) => {
    setPreviewSlide(slide);
    setCurrentPreviewIndex(slides.findIndex(s => s.id === slide.id));
  };

  const closePreview = () => {
    setPreviewSlide(null);
    setCurrentPreviewIndex(0);
  };

  const navigatePreview = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? Math.max(0, currentPreviewIndex - 1)
      : Math.min(slides.length - 1, currentPreviewIndex + 1);
    
    setCurrentPreviewIndex(newIndex);
    setPreviewSlide(slides[newIndex]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'ACTIVE' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-600 border-gray-200';
  };

  if (loading) {
    return (
      <AdminDashboardLayout title="Hero Slides">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading hero slides...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout title="Hero Slides">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hero Slides Manager</h1>
            <p className="text-gray-600">Manage your website's hero slider content</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              {showAnalytics ? 'Hide' : 'Show'} Analytics
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Hero Slide
            </button>
          </div>
        </div>

        {/* Analytics Panel */}
        {showAnalytics && analytics && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Total Slides</p>
                <p className="text-2xl font-bold text-blue-900">{analytics.totalSlides}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Active Slides</p>
                <p className="text-2xl font-bold text-green-900">{analytics.activeSlides}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Total Views</p>
                <p className="text-2xl font-bold text-purple-900">{analytics.totalViews.toLocaleString()}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-600 font-medium">Total Clicks</p>
                <p className="text-2xl font-bold text-orange-900">{analytics.totalClicks.toLocaleString()}</p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="text-sm text-teal-600 font-medium">Avg Click Rate</p>
                <p className="text-2xl font-bold text-teal-900">{analytics.averageClickRate}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Slides List */}
        <div className="bg-white rounded-lg border border-gray-200">
          {slides.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hero slides</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first hero slide.</p>
              <div className="mt-6">
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hero Slide
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Slide
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status & Schedule
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Analytics
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {slides.map((slide, index) => (
                      <tr key={slide.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-16 w-24 flex-shrink-0 relative rounded-lg overflow-hidden">
                              <Image
                                src={getImageUrl(slide.imageUrl)}
                                alt={slide.imageAlt || slide.title}
                                fill
                                className="object-cover"
                                unoptimized={true}
                                onError={(e) => {
                                  console.error('Failed to load slide image:', slide.imageUrl, 'processed:', getImageUrl(slide.imageUrl));
                                  // Hide broken image and show fallback
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const container = target.parentElement;
                                  if (container && !container.querySelector('.fallback-icon')) {
                                    const fallback = document.createElement('div');
                                    fallback.className = 'fallback-icon absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400';
                                    fallback.innerHTML = '🖼️';
                                    container.appendChild(fallback);
                                  }
                                }}
                                onLoad={() => {
                                  console.log('Successfully loaded admin slide image:', slide.imageUrl);
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{slide.title}</div>
                              {slide.subtitle && (
                                <div className="text-sm text-gray-500">{slide.subtitle}</div>
                              )}
                              <div className="text-sm text-gray-400 truncate max-w-xs">
                                {slide.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(slide.status)}`}>
                              {slide.status}
                            </span>
                            {slide.startDate && (
                              <div className="text-xs text-gray-500">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                Start: {formatDate(slide.startDate)}
                              </div>
                            )}
                            {slide.endDate && (
                              <div className="text-xs text-gray-500">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                End: {formatDate(slide.endDate)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="space-y-1">
                            <div>Views: {slide.views.toLocaleString()}</div>
                            <div>Clicks: {slide.clicks.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">
                              CTR: {slide.views > 0 ? ((slide.clicks / slide.views) * 100).toFixed(1) : '0.0'}%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{slide.displayOrder}</span>
                            <div className="flex flex-col space-y-1">
                              <button
                                onClick={() => handleReorder(slide, 'up')}
                                disabled={index === 0}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <MoveUp className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleReorder(slide, 'down')}
                                disabled={index === slides.length - 1}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <MoveDown className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openPreview(slide)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Preview"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(slide)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleStatusToggle(slide)}
                              className={`${slide.status === 'ACTIVE' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                              title={slide.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            >
                              {slide.status === 'ACTIVE' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => handleDelete(slide)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <HeroSlideModal
          slide={editingSlide}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchSlides();
            fetchAnalytics();
          }}
        />
      )}

      {/* Preview Modal */}
      {previewSlide && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closePreview}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Preview: {previewSlide.title}</h3>
                    <p className="text-sm text-gray-500">Slide {currentPreviewIndex + 1} of {slides.length}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigatePreview('prev')}
                      disabled={currentPreviewIndex === 0}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => navigatePreview('next')}
                      disabled={currentPreviewIndex === slides.length - 1}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <button
                      onClick={closePreview}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="relative h-[400px] bg-gray-900">
                  <Image
                    src={getImageUrl(previewSlide.imageUrl)}
                    alt={previewSlide.imageAlt || previewSlide.title}
                    fill
                    className="object-cover"
                    unoptimized={true}
                    onError={(e) => {
                      console.error('Failed to load preview image:', previewSlide.imageUrl);
                    }}
                  />
                  <div 
                    className="absolute inset-0 bg-black"
                    style={{ opacity: previewSlide.overlayOpacity }}
                  ></div>
                  
                  <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-6">
                      <div className={`max-w-4xl ${previewSlide.textAlign === 'center' ? 'mx-auto text-center' : previewSlide.textAlign === 'right' ? 'ml-auto text-right' : ''}`}>
                        <h1 
                          className="text-4xl font-bold mb-2"
                          style={{ color: previewSlide.textColor }}
                        >
                          {previewSlide.title}
                        </h1>
                        {previewSlide.subtitle && (
                          <h2 
                            className="text-3xl mb-4"
                            style={{ color: previewSlide.textColor }}
                          >
                            {previewSlide.subtitle}
                          </h2>
                        )}
                        <p 
                          className="text-lg mb-6 max-w-2xl"
                          style={{ color: previewSlide.textColor }}
                        >
                          {previewSlide.description}
                        </p>
                        <div className="flex flex-wrap gap-4">
                          {previewSlide.primaryButtonText && (
                            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              {previewSlide.primaryButtonText}
                            </button>
                          )}
                          {previewSlide.secondaryButtonText && (
                            <button className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors">
                              {previewSlide.secondaryButtonText}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slide Details */}
                <div className="px-6 py-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusBadge(previewSlide.status)}`}>
                        {previewSlide.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Views:</span>
                      <span className="ml-2 text-gray-900">{previewSlide.views.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Clicks:</span>
                      <span className="ml-2 text-gray-900">{previewSlide.clicks.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}