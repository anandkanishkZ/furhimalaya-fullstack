'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Eye, Calendar, Palette, Settings, Image as ImageIcon, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { apiClient } from '@/utils/admin/apiClient';
import MediaPicker from '@/components/admin/MediaPicker';
import { MediaFile } from '@/types/admin';
import { API_CONFIG } from '@/config/api';

// Debug mode - only active in development
const DEBUG = process.env.NODE_ENV === 'development';
const debugLog = (...args: any[]) => {
  if (DEBUG) console.log('[HeroSlideModal]', ...args);
};

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

interface HeroSlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  slide?: HeroSlide | null;
}

const HeroSlideModal: React.FC<HeroSlideModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  slide
}) => {
  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    imageAlt: '',
    primaryButtonText: '',
    primaryButtonUrl: '',
    secondaryButtonText: '',
    secondaryButtonUrl: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    displayOrder: 0,
    startDate: '',
    endDate: '',
    textAlign: 'left',
    textColor: '#ffffff',
    overlayOpacity: 0.4,
    seoTitle: '',
    seoDescription: ''
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // MediaPicker state
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  
  // Sidebar navigation state
  const [activeSection, setActiveSection] = useState('basic');

  // Helper function to construct proper image URLs
  const getImageUrl = (imageUrl: string): string => {
    return API_CONFIG.getImageUrl(imageUrl);
  };

  // Define sections for the sidebar
  const sections = [
    { id: 'basic', name: 'Basic Info', icon: Settings },
    { id: 'media', name: 'Media', icon: ImageIcon },
    { id: 'buttons', name: 'Call-to-Action', icon: ExternalLink },
    { id: 'display', name: 'Display Settings', icon: Calendar },
    { id: 'style', name: 'Style & Animation', icon: Palette },
    { id: 'seo', name: 'SEO', icon: Settings }
  ];

  useEffect(() => {
    if (slide) {
      setFormData({
        title: slide.title || '',
        subtitle: slide.subtitle || '',
        description: slide.description || '',
        imageUrl: slide.imageUrl || '',
        imageAlt: slide.imageAlt || '',
        primaryButtonText: slide.primaryButtonText || '',
        primaryButtonUrl: slide.primaryButtonUrl || '',
        secondaryButtonText: slide.secondaryButtonText || '',
        secondaryButtonUrl: slide.secondaryButtonUrl || '',
        status: slide.status || 'ACTIVE',
        displayOrder: slide.displayOrder || 0,
        startDate: slide.startDate ? slide.startDate.split('T')[0] : '',
        endDate: slide.endDate ? slide.endDate.split('T')[0] : '',
        textAlign: slide.textAlign || 'left',
        textColor: slide.textColor || '#ffffff',
        overlayOpacity: slide.overlayOpacity || 0.4,
        seoTitle: slide.seoTitle || '',
        seoDescription: slide.seoDescription || ''
      });
      
      // Handle image preview for existing slides
      if (slide.imageUrl) {
        debugLog('Setting existing slide image preview for:', slide.imageUrl);
        
        const processedImageUrl = getImageUrl(slide.imageUrl);
        debugLog('Processed image URL:', processedImageUrl);
        
        setImagePreview(processedImageUrl);
        
        // If it's from media library or uploads, create a MediaFile object for consistency
        if (slide.imageUrl.startsWith('http') || slide.imageUrl.startsWith('/uploads/') || slide.imageUrl.startsWith('uploads/')) {
          setSelectedMedia({
            id: 'existing',
            filename: slide.imageUrl.split('/').pop() || 'image',
            originalName: slide.imageUrl.split('/').pop() || 'image',
            category: 'general',
            url: slide.imageUrl,
            size: 0,
            type: 'image' as const,
            mimeType: 'image/jpeg',
            createdAt: slide.createdAt
          });
        }
      }
    } else {
      // Reset form for new slide
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        imageUrl: '',
        imageAlt: '',
        primaryButtonText: '',
        primaryButtonUrl: '',
        secondaryButtonText: '',
        secondaryButtonUrl: '',
        status: 'ACTIVE',
        displayOrder: 0,
        startDate: '',
        endDate: '',
        textAlign: 'left',
        textColor: '#ffffff',
        overlayOpacity: 0.4,
        seoTitle: '',
        seoDescription: ''
      });
      setImagePreview('');
      setImageFile(null);
      setSelectedMedia(null);
    }
  }, [slide]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'overlayOpacity' ? parseFloat(value) : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  // Handle media picker selection
  const handleMediaSelect = (file: MediaFile | MediaFile[]) => {
    const selectedFile = Array.isArray(file) ? file[0] : file;
    
    debugLog('Media selected:', selectedFile);
    
    setSelectedMedia(selectedFile);
    
    // Construct proper image URL for preview using helper function
    const processedImageUrl = getImageUrl(selectedFile.url);
    
    debugLog('Setting image preview to:', processedImageUrl);
    
    setImagePreview(processedImageUrl);
    setFormData(prev => ({
      ...prev,
      imageUrl: selectedFile.url // Keep original URL in form data
    }));
    setShowMediaPicker(false);
    
    // Clear any existing file upload since we're using media library
    setImageFile(null);
    
    // Clear any image validation errors
    if (errors.image) {
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // For new slides, require either a file upload, media selection, or existing imageUrl
    if (!slide && !imageFile && !selectedMedia && !formData.imageUrl) {
      newErrors.image = 'Image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formDataToSend.append(key, value.toString());
        }
      });

      // Append image if a new file is selected for upload
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (selectedMedia) {
        // If media is selected from MediaPicker, ensure the imageUrl is included
        formDataToSend.set('imageUrl', selectedMedia.url);
      }

      const response = slide 
        ? await apiClient.updateHeroSlideWithFormData(slide.id, formDataToSend)
        : await apiClient.createHeroSlideWithFormData(formDataToSend);

      if (response.success) {
        onSuccess();
      } else {
        alert(response.message || 'Failed to save hero slide');
      }
    } catch (error) {
      console.error('Error saving slide:', error);
      alert('Error saving hero slide');
    } finally {
      setLoading(false);
    }
  };

  // Render different sections based on activeSection
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'basic':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 border-b pb-2">Basic Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.title ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter slide title"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter slide subtitle (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter slide description"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Alt Text
              </label>
              <input
                type="text"
                name="imageAlt"
                value={formData.imageAlt}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descriptive text for accessibility"
              />
            </div>
          </div>
        );

      case 'media':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 border-b pb-2">Hero Image</h4>
            
            <div className="space-y-4">
              {/* Current Image Preview */}
              {imagePreview && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Current Image</label>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setSelectedMedia(null);
                        setImageFile(null);
                        setFormData(prev => ({ ...prev, imageUrl: '' }));
                      }}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                  <div className="relative w-full h-48 border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt={formData.imageAlt || formData.title || "Hero slide image"}
                        fill
                        className="object-cover"
                        unoptimized={true}
                        onError={(e) => {
                          console.error('Image failed to load:', imagePreview);
                          // Create fallback display
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          
                          // Show fallback text
                          const container = target.parentElement;
                          if (container && !container.querySelector('.fallback-text')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'fallback-text absolute inset-0 flex items-center justify-center text-gray-500 text-sm';
                            fallback.innerHTML = `
                              <div class="text-center">
                                <div class="text-4xl mb-2">🖼️</div>
                                <div>Image failed to load</div>
                                <div class="text-xs mt-1 break-all">${imagePreview}</div>
                              </div>
                            `;
                            container.appendChild(fallback);
                          }
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', imagePreview);
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📸</div>
                          <div>No image selected</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedMedia ? `Selected from media library: ${selectedMedia.filename}` : 
                     imageFile ? `New file selected: ${imageFile.name}` : 
                     `Image URL: ${imagePreview}`}
                  </p>
                </div>
              )}

              {/* Media Picker Button */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(true)}
                  className="w-full flex flex-col items-center justify-center px-6 py-8 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
                  <span className="text-sm font-medium text-gray-600">
                    {imagePreview ? 'Change Image from Media Library' : 'Select Image from Media Library'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Browse and select from uploaded media
                  </span>
                </button>
              </div>

              {/* OR Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload New Image
                </label>
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </div>
                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
              </div>
            </div>
          </div>
        );

      case 'buttons':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 border-b pb-2">Call-to-Action Buttons</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  name="primaryButtonText"
                  value={formData.primaryButtonText}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Our Services"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Button URL
                </label>
                <input
                  type="url"
                  name="primaryButtonUrl"
                  value={formData.primaryButtonUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/services"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  name="secondaryButtonText"
                  value={formData.secondaryButtonText}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Get a Quote"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Button URL
                </label>
                <input
                  type="url"
                  name="secondaryButtonUrl"
                  value={formData.secondaryButtonUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/contact"
                />
              </div>
            </div>
          </div>
        );

      case 'display':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Display Settings & Scheduling
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date (Optional)
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 'style':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 border-b pb-2 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Style & Animation
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Alignment
              </label>
              <select
                name="textAlign"
                value={formData.textAlign}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  name="textColor"
                  value={formData.textColor}
                  onChange={handleInputChange}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  name="textColor"
                  value={formData.textColor}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Overlay Opacity: {Math.round(formData.overlayOpacity * 100)}%
              </label>
              <input
                type="range"
                name="overlayOpacity"
                value={formData.overlayOpacity}
                onChange={handleInputChange}
                min="0"
                max="1"
                step="0.1"
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0% (Transparent)</span>
                <span>100% (Opaque)</span>
              </div>
            </div>
          </div>
        );

      case 'seo':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 border-b pb-2">SEO (Optional)</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO Title
              </label>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="SEO optimized title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO Description
              </label>
              <textarea
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="SEO meta description (150-160 characters recommended)"
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.seoDescription.length}/160 characters
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
          
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {slide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                  </h3>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                      {showPreview ? 'Hide' : 'Show'} Preview
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex h-[600px]">
                {/* Left Sidebar Navigation */}
                <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                  <nav className="space-y-1">
                    {sections.map((section) => {
                      const IconComponent = section.icon;
                      return (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            activeSection === section.id
                              ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                          {section.name}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex">
                  {/* Form Content */}
                  <div className={`${showPreview ? 'w-1/2' : 'w-full'} p-6 overflow-y-auto`}>
                    {renderSectionContent()}
                  </div>

                  {/* Live Preview */}
                  {showPreview && (
                    <div className="w-1/2 border-l border-gray-200">
                      <div className="p-4 bg-gray-50 border-b">
                        <h4 className="font-medium text-gray-900">Live Preview</h4>
                      </div>
                      <div className="relative h-64 bg-gray-900">
                        {imagePreview && (
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        )}
                        <div 
                          className="absolute inset-0 bg-black"
                          style={{ opacity: formData.overlayOpacity }}
                        ></div>
                        
                        <div className="absolute inset-0 flex items-center p-6">
                          <div className={`max-w-md ${formData.textAlign === 'center' ? 'mx-auto text-center' : formData.textAlign === 'right' ? 'ml-auto text-right' : ''}`}>
                            {formData.title && (
                              <h1 
                                className="text-2xl font-bold mb-2"
                                style={{ color: formData.textColor }}
                              >
                                {formData.title}
                              </h1>
                            )}
                            {formData.subtitle && (
                              <h2 
                                className="text-xl mb-2"
                                style={{ color: formData.textColor }}
                              >
                                {formData.subtitle}
                              </h2>
                            )}
                            {formData.description && (
                              <p 
                                className="mb-4"
                                style={{ color: formData.textColor }}
                              >
                                {formData.description}
                              </p>
                            )}
                            <div className="flex gap-3">
                              {formData.primaryButtonText && (
                                <button
                                  type="button"
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                                >
                                  {formData.primaryButtonText}
                                </button>
                              )}
                              {formData.secondaryButtonText && (
                                <button
                                  type="button"
                                  className="px-4 py-2 border border-white text-white rounded-lg text-sm font-medium"
                                >
                                  {formData.secondaryButtonText}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : slide ? 'Update Slide' : 'Create Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* MediaPicker Modal */}
      <MediaPicker
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelect}
        multiple={false}
        acceptedTypes={['image']}
        title="Select Hero Slide Image"
      />
    </>
  );
};

export default HeroSlideModal;