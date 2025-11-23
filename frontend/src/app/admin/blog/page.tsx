'use client';

import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import MediaPicker from '@/components/admin/MediaPicker';
import RichTextEditor from '@/components/admin/RichTextEditor';
import apiClient from '@/utils/admin/apiClient';
import { BlogPost, MediaFile } from '@/types/admin';
import { getValidImageUrl } from '@/utils/media';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  X,
  Save,
  Calendar,
  User,
  FileText,
  Settings,
  Image,
  Tag,
  Clock
} from 'lucide-react';

export default function AdminBlog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    publishedAt: '',
    seoTitle: '',
    seoDescription: '',
    metaKeywords: '',
    featured: false
  });

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await apiClient.getBlogPosts();
      if (response.success) {
        setBlogPosts(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      imageUrl: post.imageUrl || '',
      status: post.status,
      publishedAt: post.publishedAt || '',
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      metaKeywords: post.metaKeywords || '',
      featured: post.featured || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await apiClient.deleteBlogPost(id);
      await fetchBlogPosts();
    } catch (error) {
      console.error('Failed to delete blog post:', error);
      alert('Failed to delete blog post');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const postData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        imageUrl: formData.imageUrl || undefined,
        status: formData.status,
        publishedAt: formData.status === 'PUBLISHED' && formData.publishedAt 
          ? formData.publishedAt 
          : undefined,
        seoTitle: formData.seoTitle || undefined,
        seoDescription: formData.seoDescription || undefined,
        featured: formData.featured,
        metaKeywords: formData.metaKeywords || undefined
      };

      if (editingPost) {
        await apiClient.updateBlogPost(editingPost.id, postData);
      } else {
        await apiClient.createBlogPost(postData);
      }

      setShowModal(false);
      resetForm();
      await fetchBlogPosts();
    } catch (error) {
      console.error('Failed to save blog post:', error);
      alert('Failed to save blog post');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      imageUrl: '',
      status: 'DRAFT',
      publishedAt: '',
      seoTitle: '',
      seoDescription: '',
      metaKeywords: '',
      featured: false
    });
  };

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminDashboardLayout title="Blog Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
            <p className="text-gray-600">Manage your blog content and articles</p>
          </div>
          <button
            onClick={() => {
              setEditingPost(null);
              resetForm();
              setShowModal(true);
            }}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Post
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Blog Posts List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading blog posts...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {post.imageUrl && (
                      <img
                        src={getValidImageUrl(post.imageUrl)}
                        alt={post.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(post.status)}`}>
                            {post.status}
                          </span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEdit(post)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{post.excerpt || post.content.substring(0, 150)}...</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {post.publishedAt && (
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </div>
                        )}
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          Created: {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modern Tabbed Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex overflow-hidden">
              {/* Left Sidebar - Tab Navigation */}
              <div className="w-64 bg-gradient-to-b from-slate-50 to-slate-100 border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {editingPost ? '✏️ Edit Post' : '📝 New Post'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {editingPost ? 'Update content' : 'Create new article'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex-1 p-4">
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab('basic')}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                        activeTab === 'basic'
                          ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                          : 'text-gray-700 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      <FileText className="h-5 w-5 mr-3" />
                      <div>
                        <div className="font-medium">Basic Info</div>
                        <div className="text-xs opacity-75">Title, content, excerpt</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('media')}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                        activeTab === 'media'
                          ? 'bg-green-500 text-white shadow-lg transform scale-105'
                          : 'text-gray-700 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      <Image className="h-5 w-5 mr-3" />
                      <div>
                        <div className="font-medium">Media & Image</div>
                        <div className="text-xs opacity-75">Featured image, gallery</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                        activeTab === 'settings'
                          ? 'bg-purple-500 text-white shadow-lg transform scale-105'
                          : 'text-gray-700 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      <div>
                        <div className="font-medium">Publishing</div>
                        <div className="text-xs opacity-75">Status, schedule, featured</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('seo')}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                        activeTab === 'seo'
                          ? 'bg-indigo-500 text-white shadow-lg transform scale-105'
                          : 'text-gray-700 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      <Tag className="h-5 w-5 mr-3" />
                      <div>
                        <div className="font-medium">SEO & Meta</div>
                        <div className="text-xs opacity-75">Search optimization</div>
                      </div>
                    </button>
                  </nav>
                </div>

                {/* Footer - Close Button */}
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full flex items-center justify-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Close
                  </button>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="flex-1 flex flex-col">
                {/* Top Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {activeTab === 'basic' && '📝 Basic Information'}
                      {activeTab === 'media' && '🖼️ Media & Images'}
                      {activeTab === 'settings' && '⚙️ Publishing Settings'}
                      {activeTab === 'seo' && '🔍 SEO Optimization'}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {activeTab === 'basic' && 'Enter the main content and details for your blog post'}
                      {activeTab === 'media' && 'Add featured images and media content'}
                      {activeTab === 'settings' && 'Configure publishing options and visibility'}
                      {activeTab === 'seo' && 'Optimize your post for search engines'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-8">
                    <form onSubmit={handleSubmit}>
                      {/* Basic Information Tab */}
                      {activeTab === 'basic' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                          {/* Title and Slug */}
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-3">
                                  <span className="flex items-center">
                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-2">Required</span>
                                    Post Title
                                  </span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={formData.title}
                                  onChange={(e) => {
                                    setFormData({ ...formData, title: e.target.value });
                                    if (!editingPost) {
                                      setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                                    }
                                  }}
                                  className="w-full px-4 py-4 text-lg border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                                  placeholder="Enter an engaging blog post title..."
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-3">
                                  <span className="flex items-center">
                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-2">Required</span>
                                    URL Slug
                                  </span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={formData.slug}
                                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                  className="w-full px-4 py-4 text-lg border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/70 backdrop-blur-sm font-mono"
                                  placeholder="url-friendly-slug"
                                />
                                <p className="text-xs text-blue-600 mt-2">
                                  Preview: /blog/{formData.slug || 'your-slug-here'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Excerpt */}
                          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200">
                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                              <span className="flex items-center">
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full mr-2">Optional</span>
                                Post Excerpt
                              </span>
                            </label>
                            <textarea
                              rows={4}
                              value={formData.excerpt}
                              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                              className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all duration-200 bg-white/70 backdrop-blur-sm resize-none"
                              placeholder="Write a compelling summary that will appear in blog listings and search results..."
                            />
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-xs text-slate-600">
                                A good excerpt is 150-160 characters long
                              </p>
                              <span className="text-xs text-slate-500">
                                {formData.excerpt.length} characters
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                              <span className="flex items-center">
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-2">Required</span>
                                Blog Post Content
                              </span>
                            </label>
                            <div className="bg-white rounded-xl p-2">
                              <RichTextEditor
                                value={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                                placeholder="Start writing your amazing blog post content here...

Use the toolbar above to format your content:
• Headings for structure
• Bold, italic, underline for emphasis
• Lists for organization
• Links for references
• Images and videos for visual content
• Code blocks for technical content

Write engaging, informative content that provides value to your readers!"
                                height="500px"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Media Tab */}
                      {activeTab === 'media' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200">
                            <div className="text-center mb-6">
                              <Image className="h-12 w-12 text-green-600 mx-auto mb-4" />
                              <h3 className="text-xl font-bold text-gray-800 mb-2">Featured Image</h3>
                              <p className="text-green-700">Choose from your media library or enter a custom URL</p>
                            </div>

                            <div className="space-y-6">
                              {/* Media Library Button */}
                              <div className="flex flex-col items-center">
                                <button
                                  type="button"
                                  onClick={() => setShowMediaPicker(true)}
                                  className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                  <Image className="h-5 w-5 mr-3" />
                                  Select from Media Library
                                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>
                                <p className="text-sm text-green-600 mt-2">
                                  Choose from uploaded images in your media library
                                </p>
                              </div>

                              {/* Divider */}
                              <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                  <div className="w-full border-t border-green-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                  <span className="px-4 bg-green-100 text-green-700 rounded-full font-medium">OR</span>
                                </div>
                              </div>

                              {/* Manual URL Input */}
                              <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-3">
                                  Custom Image URL
                                </label>
                                <input
                                  type="url"
                                  value={formData.imageUrl}
                                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                  className="w-full px-4 py-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                                  placeholder="https://example.com/your-featured-image.jpg"
                                />
                                <p className="text-xs text-green-600 mt-2">
                                  💡 Paste a direct link to an image hosted elsewhere
                                </p>
                              </div>

                              {/* Image Preview */}
                              {formData.imageUrl && (
                                <div className="mt-6">
                                  <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-semibold text-gray-800">Preview:</p>
                                    <button
                                      type="button"
                                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                      className="text-red-500 hover:text-red-700 text-xs flex items-center px-2 py-1 hover:bg-red-50 rounded transition-colors"
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      Remove
                                    </button>
                                  </div>
                                  <div className="relative rounded-xl overflow-hidden border-2 border-green-200 shadow-lg">
                                    <img
                                      src={formData.imageUrl}
                                      alt="Featured image preview"
                                      className="w-full h-64 object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = '/images/placeholder-image.png';
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                                      <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
                                        Featured Image
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-xs text-green-600 mt-2 text-center">
                                    ✅ This image will be displayed as the featured image for your blog post
                                  </p>
                                </div>
                              )}

                              {/* Tips */}
                              <div className="bg-green-100 border border-green-200 rounded-xl p-4">
                                <h4 className="text-sm font-semibold text-green-800 mb-2">📸 Image Tips:</h4>
                                <ul className="text-xs text-green-700 space-y-1">
                                  <li>• Recommended size: 1200×630 pixels for best display</li>
                                  <li>• Use high-quality images that relate to your content</li>
                                  <li>• Supported formats: JPG, PNG, GIF, WebP</li>
                                  <li>• Images from media library are automatically optimized</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Settings Tab */}
                      {activeTab === 'settings' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                          {/* Publishing Status */}
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                              <Settings className="h-5 w-5 mr-2 text-purple-600" />
                              Publishing Settings
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-3">
                                  Publication Status
                                </label>
                                <select
                                  value={formData.status}
                                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' })}
                                  className="w-full px-4 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                                >
                                  <option value="DRAFT">📝 Draft - Save for later</option>
                                  <option value="PUBLISHED">🚀 Published - Live on website</option>
                                  <option value="ARCHIVED">📦 Archived - Hidden from public</option>
                                </select>
                              </div>

                              {formData.status === 'PUBLISHED' && (
                                <div>
                                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                                    <Clock className="h-4 w-4 inline mr-1" />
                                    Publish Date & Time
                                  </label>
                                  <input
                                    type="datetime-local"
                                    value={formData.publishedAt}
                                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                                    className="w-full px-4 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                                  />
                                </div>
                              )}
                            </div>

                            <div className="mt-6">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="featured"
                                  checked={formData.featured}
                                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                  className="h-5 w-5 text-purple-600 border-2 border-purple-300 rounded focus:ring-purple-500"
                                />
                                <label htmlFor="featured" className="ml-3 text-sm font-medium text-gray-800">
                                  <span className="flex items-center">
                                    ⭐ Featured Post
                                    <span className="ml-2 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                                      Will appear prominently on homepage
                                    </span>
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SEO Tab */}
                      {activeTab === 'seo' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border border-indigo-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                              <Tag className="h-5 w-5 mr-2 text-indigo-600" />
                              Search Engine Optimization
                            </h3>

                            <div className="space-y-6">
                              <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-3">
                                  <span className="flex items-center justify-between">
                                    Meta Title
                                    <span className="text-xs text-indigo-600">
                                      {formData.seoTitle.length}/60 chars
                                    </span>
                                  </span>
                                </label>
                                <input
                                  type="text"
                                  value={formData.seoTitle}
                                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                                  className="w-full px-4 py-4 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                                  placeholder="SEO-optimized title for search engines (optional)"
                                  maxLength={60}
                                />
                                <p className="text-xs text-indigo-600 mt-2">
                                  💡 Keep it under 60 characters for optimal display in search results
                                </p>
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-3">
                                  <span className="flex items-center justify-between">
                                    Meta Description
                                    <span className="text-xs text-indigo-600">
                                      {formData.seoDescription.length}/160 chars
                                    </span>
                                  </span>
                                </label>
                                <textarea
                                  rows={4}
                                  value={formData.seoDescription}
                                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                                  className="w-full px-4 py-4 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-white/70 backdrop-blur-sm resize-none"
                                  placeholder="Compelling description that will appear in search results..."
                                  maxLength={160}
                                />
                                <p className="text-xs text-indigo-600 mt-2">
                                  💡 Write a compelling description under 160 characters to improve click-through rates
                                </p>
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-3">
                                  Meta Keywords
                                </label>
                                <input
                                  type="text"
                                  value={formData.metaKeywords}
                                  onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                                  className="w-full px-4 py-4 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                                  placeholder="engineering, construction, blog, technology, innovation"
                                />
                                <p className="text-xs text-indigo-600 mt-2">
                                  💡 Separate keywords with commas. Use relevant terms that users might search for
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        formData.title && formData.content ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      {formData.title && formData.content ? 'Ready to publish' : 'Fill required fields'}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingPost ? 'Update Post' : 'Create Post'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media Picker Modal */}
        <MediaPicker
          isOpen={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
          onSelect={(file: MediaFile | MediaFile[]) => {
            if (Array.isArray(file)) {
              // Handle multiple files (not needed for blog featured image)
              setFormData({ ...formData, imageUrl: file[0]?.url || '' });
            } else {
              // Handle single file
              setFormData({ ...formData, imageUrl: file.url });
            }
            setShowMediaPicker(false);
          }}
          multiple={false}
          acceptedTypes={['image']}
          title="Select Featured Image"
        />
      </div>
    </AdminDashboardLayout>
  );
}