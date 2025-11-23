'use client';

import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import MediaPicker from '@/components/admin/MediaPicker';
import apiClient from '@/utils/admin/apiClient';
import { Project, MediaFile } from '@/types/admin';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  X,
  Save,
  Star,
  StarOff,
  Calendar,
  User,
  MapPin,
  DollarSign,
  Ruler,
  Upload,
  Image,
  Target,
  Award,
  Users,
  AlertTriangle,
  Quote,
  Share2,
  Hash,
  FileText,
  Lightbulb,
  Building
} from 'lucide-react';

interface FormData {
  title: string;
  slug: string;
  category: string;
  description: string;
  shortDescription: string;
  clientName: string;
  location: string;
  completionDate: string;
  startDate: string;
  budget: string;
  projectArea: string;
  projectType: string;
  imageUrl: string;
  galleryImages: string[];
  status: 'ACTIVE' | 'INACTIVE';
  featured: boolean;
  priority: string;
  
  // SEO Fields
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  
  // Additional Details
  technologies: string[];
  teamMembers: string[];
  challenges: string[];
  achievements: string[];
  testimonial: string;
  
  // Social Media
  socialImages: string[];
}

export default function AdminProjectsAdvanced() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [showMainImagePicker, setShowMainImagePicker] = useState(false);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [selectedMainImage, setSelectedMainImage] = useState<MediaFile | null>(null);
  const [selectedGalleryImages, setSelectedGalleryImages] = useState<MediaFile[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    category: '',
    description: '',
    shortDescription: '',
    clientName: '',
    location: '',
    completionDate: '',
    startDate: '',
    budget: '',
    projectArea: '',
    projectType: '',
    imageUrl: '',
    galleryImages: [],
    status: 'ACTIVE',
    featured: false,
    priority: '0',
    
    // SEO Fields
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    
    // Additional Details
    technologies: [],
    teamMembers: [],
    challenges: [],
    achievements: [],
    testimonial: '',
    
    // Social Media
    socialImages: []
  });

  const categories = [
    'Residential Building',
    'Commercial Building',
    'Industrial Project',
    'Infrastructure',
    'Property Valuation',
    'Structural Design',
    'Other'
  ];

  const projectTypes = [
    'New Construction',
    'Renovation',
    'Extension',
    'Restoration',
    'Maintenance',
    'Consultation'
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProjects();
      if (response.success) {
        setProjects(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      metaTitle: title ? `${title} | Forever Shine Engineering` : ''
    }));
  };

  const addArrayItem = (field: keyof FormData, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
    }
  };

  const removeArrayItem = (field: keyof FormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  // Media handling functions
  const handleMainImageSelect = (file: MediaFile | MediaFile[]) => {
    const selectedFile = Array.isArray(file) ? file[0] : file;
    setSelectedMainImage(selectedFile);
    setFormData(prev => ({
      ...prev,
      imageUrl: selectedFile.url
    }));
    setShowMainImagePicker(false);
  };

  const handleGalleryImagesSelect = (files: MediaFile | MediaFile[]) => {
    const selectedFiles = Array.isArray(files) ? files : [files];
    setSelectedGalleryImages(selectedFiles);
    setFormData(prev => ({
      ...prev,
      galleryImages: selectedFiles.map(file => file.url)
    }));
    setShowGalleryPicker(false);
  };

  const removeMainImage = () => {
    setSelectedMainImage(null);
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
  };

  const removeGalleryImage = (index: number) => {
    const newImages = selectedGalleryImages.filter((_, i) => i !== index);
    setSelectedGalleryImages(newImages);
    setFormData(prev => ({
      ...prev,
      galleryImages: newImages.map(file => file.url)
    }));
  };

  // Convert URLs to MediaFile objects for display
  const urlToMediaFile = (url: string, index: number): MediaFile => ({
    id: `url-${index}`,
    filename: url.split('/').pop() || 'image',
    originalName: url.split('/').pop() || 'image',
    category: 'projects',
    url: url,
    size: 0,
    type: 'image',
    mimeType: 'image/jpeg',
    createdAt: new Date().toISOString()
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const projectData = {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        description: formData.description,
        shortDescription: formData.shortDescription || undefined,
        imageUrl: formData.imageUrl || undefined,
        galleryImages: formData.galleryImages,
        completionDate: formData.completionDate || undefined,
        startDate: formData.startDate || undefined,
        clientName: formData.clientName || undefined,
        location: formData.location || undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        projectArea: formData.projectArea ? parseFloat(formData.projectArea) : undefined,
        projectType: formData.projectType || undefined,
        status: formData.status,
        featured: formData.featured,
        priority: parseInt(formData.priority),
        
        // SEO Fields
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        metaKeywords: formData.metaKeywords || undefined,
        
        // Additional Details
        technologies: formData.technologies,
        teamMembers: formData.teamMembers,
        challenges: formData.challenges,
        achievements: formData.achievements,
        testimonial: formData.testimonial || undefined,
        
        // Social Media
        socialImages: formData.socialImages
      };

      if (editingProject) {
        await apiClient.updateProject(editingProject.id, projectData);
      } else {
        await apiClient.createProject(projectData);
      }

      setShowModal(false);
      setEditingProject(null);
      resetForm();
      await fetchProjects();
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      category: '',
      description: '',
      shortDescription: '',
      clientName: '',
      location: '',
      completionDate: '',
      startDate: '',
      budget: '',
      projectArea: '',
      projectType: '',
      imageUrl: '',
      galleryImages: [],
      status: 'ACTIVE',
      featured: false,
      priority: '0',
      
      // SEO Fields
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      
      // Additional Details
      technologies: [],
      teamMembers: [],
      challenges: [],
      achievements: [],
      testimonial: '',
      
      // Social Media
      socialImages: []
    });
    setActiveTab('basic');
    setSelectedMainImage(null);
    setSelectedGalleryImages([]);
  };

  const toggleProjectStatus = async (project: Project) => {
    try {
      const newStatus = project.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await apiClient.updateProject(project.id, { ...project, status: newStatus });
      await fetchProjects();
    } catch (error) {
      console.error('Failed to toggle project status:', error);
      alert('Failed to update project status');
    }
  };

  const deleteProject = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete the project "${project.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiClient.deleteProject(project.id);
      await fetchProjects();
      alert('Project deleted successfully');
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      category: project.category,
      description: project.description,
      shortDescription: project.shortDescription || '',
      clientName: project.clientName || '',
      location: project.location || '',
      completionDate: project.completionDate ? project.completionDate.split('T')[0] : '',
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      budget: project.budget?.toString() || '',
      projectArea: project.projectArea?.toString() || '',
      projectType: project.projectType || '',
      imageUrl: project.imageUrl || '',
      galleryImages: project.galleryImages || [],
      status: project.status,
      featured: project.featured,
      priority: project.priority.toString(),
      
      // SEO Fields
      metaTitle: project.metaTitle || '',
      metaDescription: project.metaDescription || '',
      metaKeywords: project.metaKeywords || '',
      
      // Additional Details
      technologies: project.technologies || [],
      teamMembers: project.teamMembers || [],
      challenges: project.challenges || [],
      achievements: project.achievements || [],
      testimonial: project.testimonial || '',
      
      // Social Media
      socialImages: project.socialImages || []
    });
    
    // Set media state for editing
    if (project.imageUrl) {
      setSelectedMainImage(urlToMediaFile(project.imageUrl, 0));
    } else {
      setSelectedMainImage(null);
    }
    
    if (project.galleryImages && project.galleryImages.length > 0) {
      setSelectedGalleryImages(project.galleryImages.map((url, index) => urlToMediaFile(url, index)));
    } else {
      setSelectedGalleryImages([]);
    }
    
    setShowModal(true);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const TabButton = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  const ArrayInput = ({ 
    label, 
    items, 
    field, 
    placeholder,
    icon: Icon 
  }: { 
    label: string; 
    items: string[]; 
    field: keyof FormData; 
    placeholder: string;
    icon: any;
  }) => {
    const [inputValue, setInputValue] = useState('');

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Icon className="w-4 h-4 inline mr-2" />
          {label}
        </label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addArrayItem(field, inputValue);
                  setInputValue('');
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                addArrayItem(field, inputValue);
                setInputValue('');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeArrayItem(field, index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminDashboardLayout title="Advanced Project Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Advanced Project Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage projects with comprehensive metadata and SEO optimization
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Project
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No projects found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {project.imageUrl ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={project.imageUrl}
                                alt={project.title}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Building className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                              {project.title}
                              {project.featured && (
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{project.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {project.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.clientName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-1 text-gray-400" />
                          {project.priority}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditModal(project)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleProjectStatus(project)}
                            className="text-gray-600 hover:text-gray-900"
                            title={project.status === 'ACTIVE' ? 'Deactivate project' : 'Activate project'}
                          >
                            {project.status === 'ACTIVE' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => deleteProject(project)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex overflow-hidden" style={{ height: 'calc(90vh - 80px)' }}>
              {/* Tab Navigation */}
              <div className="w-64 bg-gray-50 p-4 overflow-y-auto">
                <div className="space-y-2">
                  <TabButton id="basic" label="Basic Info" icon={FileText} />
                  <TabButton id="details" label="Details" icon={Building} />
                  <TabButton id="media" label="Media & Images" icon={Image} />
                  <TabButton id="seo" label="SEO & Meta" icon={Hash} />
                  <TabButton id="team" label="Team & Tech" icon={Users} />
                  <TabButton id="achievements" label="Achievements" icon={Award} />
                  <TabButton id="social" label="Social Media" icon={Share2} />
                </div>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Basic Info Tab */}
                  {activeTab === 'basic' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Title *
                          </label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL Slug *
                          </label>
                          <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Type
                          </label>
                          <select
                            value={formData.projectType}
                            onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Type</option>
                            {projectTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Description *
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Short Description
                        </label>
                        <textarea
                          value={formData.shortDescription}
                          onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Brief summary for cards and previews"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="featured"
                            checked={formData.featured}
                            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                            Featured Project
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Priority (0-10)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={formData.priority}
                            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Details Tab */}
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Project Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-2" />
                            Client Name
                          </label>
                          <input
                            type="text"
                            value={formData.clientName}
                            onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 inline mr-2" />
                            Location
                          </label>
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Completion Date
                          </label>
                          <input
                            type="date"
                            value={formData.completionDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, completionDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <DollarSign className="w-4 h-4 inline mr-2" />
                            Budget (NPR)
                          </label>
                          <input
                            type="number"
                            value={formData.budget}
                            onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Ruler className="w-4 h-4 inline mr-2" />
                            Project Area (sq ft)
                          </label>
                          <input
                            type="number"
                            value={formData.projectArea}
                            onChange={(e) => setFormData(prev => ({ ...prev, projectArea: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Quote className="w-4 h-4 inline mr-2" />
                          Client Testimonial
                        </label>
                        <textarea
                          value={formData.testimonial}
                          onChange={(e) => setFormData(prev => ({ ...prev, testimonial: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Client feedback or testimonial about the project"
                        />
                      </div>
                    </div>
                  )}

                  {/* Media Tab */}
                  {activeTab === 'media' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Media & Images</h3>
                      
                      {/* Main Project Image */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          <Image className="w-4 h-4 inline mr-2" />
                          Main Project Image (Single Image)
                        </label>
                        
                        {selectedMainImage ? (
                          <div className="relative inline-block">
                            <img
                              src={selectedMainImage.url}
                              alt={selectedMainImage.originalName}
                              className="w-32 h-32 object-cover border border-gray-300 rounded-lg shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={removeMainImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="mt-2 text-sm text-gray-600 max-w-32 truncate">
                              {selectedMainImage.originalName}
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 mb-3">No main image selected</p>
                            <button
                              type="button"
                              onClick={() => setShowMainImagePicker(true)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                            >
                              <Upload className="w-4 h-4" />
                              Select Main Image
                            </button>
                          </div>
                        )}
                        
                        {selectedMainImage && (
                          <button
                            type="button"
                            onClick={() => setShowMainImagePicker(true)}
                            className="mt-3 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Change Image
                          </button>
                        )}
                      </div>

                      {/* Gallery Images */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          <Image className="w-4 h-4 inline mr-2" />
                          Gallery Images (Multiple Images)
                        </label>
                        
                        {selectedGalleryImages.length > 0 ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {selectedGalleryImages.map((image, index) => (
                                <div key={image.id} className="relative group">
                                  <img
                                    src={image.url}
                                    alt={image.originalName}
                                    className="w-full h-24 object-cover border border-gray-300 rounded-lg shadow-sm"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeGalleryImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                  <div className="mt-1 text-xs text-gray-600 truncate">
                                    {image.originalName}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowGalleryPicker(true)}
                              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Add More Images
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 mb-3">No gallery images selected</p>
                            <button
                              type="button"
                              onClick={() => setShowGalleryPicker(true)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                            >
                              <Upload className="w-4 h-4" />
                              Select Gallery Images
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SEO Tab */}
                  {activeTab === 'seo' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">SEO & Meta Data</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Title
                        </label>
                        <input
                          type="text"
                          value={formData.metaTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="SEO optimized title for search engines"
                        />
                        <p className="text-xs text-gray-500 mt-1">{formData.metaTitle.length}/60 characters</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Description
                        </label>
                        <textarea
                          value={formData.metaDescription}
                          onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="SEO description for search results"
                        />
                        <p className="text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160 characters</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Keywords
                        </label>
                        <input
                          type="text"
                          value={formData.metaKeywords}
                          onChange={(e) => setFormData(prev => ({ ...prev, metaKeywords: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="keyword1, keyword2, keyword3"
                        />
                      </div>
                    </div>
                  )}

                  {/* Team & Tech Tab */}
                  {activeTab === 'team' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Team & Technology</h3>
                      
                      <ArrayInput
                        label="Technologies Used"
                        items={formData.technologies}
                        field="technologies"
                        placeholder="Add technology/material"
                        icon={Lightbulb}
                      />

                      <ArrayInput
                        label="Team Members"
                        items={formData.teamMembers}
                        field="teamMembers"
                        placeholder="Add team member name"
                        icon={Users}
                      />

                      <ArrayInput
                        label="Project Challenges"
                        items={formData.challenges}
                        field="challenges"
                        placeholder="Add challenge faced"
                        icon={AlertTriangle}
                      />
                    </div>
                  )}

                  {/* Achievements Tab */}
                  {activeTab === 'achievements' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Achievements & Awards</h3>
                      
                      <ArrayInput
                        label="Key Achievements"
                        items={formData.achievements}
                        field="achievements"
                        placeholder="Add achievement or award"
                        icon={Award}
                      />
                    </div>
                  )}

                  {/* Social Media Tab */}
                  {activeTab === 'social' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Social Media</h3>
                      
                      <ArrayInput
                        label="Social Media Images"
                        items={formData.socialImages}
                        field="socialImages"
                        placeholder="Add social media optimized image URL"
                        icon={Share2}
                      />
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {editingProject ? 'Update Project' : 'Create Project'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Image Picker Modal */}
      <MediaPicker
        isOpen={showMainImagePicker}
        onClose={() => setShowMainImagePicker(false)}
        onSelect={handleMainImageSelect}
        multiple={false}
        acceptedTypes={['image']}
        title="Select Main Project Image"
      />

      {/* Gallery Images Picker Modal */}
      <MediaPicker
        isOpen={showGalleryPicker}
        onClose={() => setShowGalleryPicker(false)}
        onSelect={handleGalleryImagesSelect}
        multiple={true}
        acceptedTypes={['image']}
        title="Select Gallery Images"
        selectedFiles={selectedGalleryImages}
      />
    </AdminDashboardLayout>
  );
}