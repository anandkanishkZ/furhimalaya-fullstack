'use client';

import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import apiClient from '@/utils/admin/apiClient';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff,
  Star,
  ChevronUp,
  ChevronDown,
  Building
} from 'lucide-react';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import MediaPicker from '@/components/admin/MediaPicker';
import { MediaFile } from '@/types/admin';
import { toast } from 'react-toastify';

interface Client {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  status: 'ACTIVE' | 'INACTIVE';
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface ClientModalData {
  name: string;
  logoUrl: string;
  website: string;
}

// Utility function to format error messages for toast
const formatErrorMessage = (error: any, defaultMessage: string) => {
  if (error?.response?.data) {
    const apiError = error.response.data;
    
    if (apiError.errors && Array.isArray(apiError.errors) && apiError.errors.length > 0) {
      // Format validation errors nicely
      return `Validation Error: ${apiError.errors.join('; ')}`;
    } else if (apiError.message) {
      return apiError.message;
    }
  }
  
  return error?.message || defaultMessage;
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [sortField, setSortField] = useState<string>('displayOrder');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Form data state
  const [formData, setFormData] = useState<ClientModalData>({
    name: '',
    logoUrl: '',
    website: ''
  });

  // Fetch clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      const params: any = {
        orderBy: sortField,
        orderDir: sortDirection
      };

      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (featuredFilter !== 'all') params.featured = featuredFilter === 'true';

      const response = await apiClient.getClients(params);
      
      console.log('API Response:', response); // Debug log
      
      if (response.success && response.data) {
        // The API returns { clients: [...], categories: [...] }
        const clientsArray = response.data.clients || [];
        const categoriesArray = response.data.categories || [];
        
        setClients(clientsArray);
        setCategories(categoriesArray);
      } else {
        // If API call fails, ensure clients is still an empty array
        setClients([]);
        setCategories([]);
      }
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      toast.error(formatErrorMessage(error, 'Failed to fetch clients'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [searchTerm, statusFilter, categoryFilter, featuredFilter, sortField, sortDirection]);



  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const openModal = (client: Client | null = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name || '',
        logoUrl: client.logoUrl || '',
        website: client.website || ''
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        logoUrl: '',
        website: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData({
      name: '',
      logoUrl: '',
      website: ''
    });
  };

  const handleMediaSelect = (file: MediaFile | MediaFile[]) => {
    const selectedFile = Array.isArray(file) ? file[0] : file;
    if (selectedFile) {
      setFormData(prev => ({ ...prev, logoUrl: selectedFile.url }));
    }
    setIsMediaPickerOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        name: formData.name.trim(),
        logoUrl: formData.logoUrl.trim(),
        website: formData.website.trim()
      };

      let response;
      if (editingClient) {
        response = await apiClient.updateClient(editingClient.id, submitData);
      } else {
        response = await apiClient.createClient(submitData);
      }

      if (response.success) {
        toast.success(
          editingClient ? 'Client updated successfully' : 'Client created successfully'
        );
        closeModal();
        fetchClients();
      } else {
        throw new Error(response.message || 'Failed to save client');
      }
    } catch (error: any) {
      console.error('Error saving client:', error);
      toast.error(formatErrorMessage(error, 'Failed to save client'));
    }
  };

  const handleDelete = async (client: Client) => {
    if (!confirm(`Are you sure you want to delete "${client.name}"?`)) {
      return;
    }

    try {
      const response = await apiClient.deleteClient(client.id);
      if (response.success) {
        toast.success('Client deleted successfully');
        fetchClients();
      } else {
        throw new Error(response.message || 'Failed to delete client');
      }
    } catch (error: any) {
      console.error('Error deleting client:', error);
      toast.error(formatErrorMessage(error, 'Failed to delete client'));
    }
  };

  const toggleStatus = async (client: Client) => {
    try {
      const newStatus = client.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const response = await apiClient.updateClient(client.id, { status: newStatus });
      
      if (response.success) {
        toast.success(`Client ${newStatus.toLowerCase()} successfully`);
        fetchClients();
      } else {
        throw new Error(response.message || 'Failed to update client status');
      }
    } catch (error: any) {
      console.error('Error updating client status:', error);
      toast.error(formatErrorMessage(error, 'Failed to update client status'));
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <AdminDashboardLayout title="Client Management">
        <LoadingSpinner />
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout title="Client Management">
      <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Client Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your company's clients and partnerships
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Clients</option>
              <option value="true">Featured Only</option>
              <option value="false">Non-Featured</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Client
                    {getSortIcon('name')}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Website
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {Array.isArray(clients) && clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {client.logoUrl && (
                        <img
                          src={client.logoUrl}
                          alt={client.name}
                          className="w-10 h-10 rounded-lg object-contain bg-gray-100 border border-gray-200 dark:border-gray-600"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {client.name}
                          </p>
                          {client.featured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {client.website ? (
                      <a 
                        href={client.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                      >
                        {client.website}
                      </a>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleStatus(client)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        client.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {client.status === 'ACTIVE' ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                      {client.status}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(client)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        title="Edit client"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(client)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        title="Delete client"
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

        {(!Array.isArray(clients) || clients.length === 0) && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No clients</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by adding your first client.
            </p>
            <div className="mt-6">
              <button
                onClick={() => openModal()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SIMPLIFIED Client Modal - v2.0 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm" data-modal="simplified-v2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white" data-version="simplified">
                  {editingClient ? '✏️ Edit Client (Simple)' : '➕ Add New Client (Simple)'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {editingClient ? 'Update client information' : 'Add a new client to your portfolio'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-8">
                {/* Client Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-lg transition-all"
                    placeholder="Enter client name"
                  />
                </div>

                {/* Logo/Photo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Client Logo
                  </label>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      {formData.logoUrl ? (
                        <div className="relative group">
                          <img
                            src={formData.logoUrl}
                            alt="Client logo preview"
                            className="w-24 h-24 object-contain rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 shadow-sm"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, logoUrl: '' })}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                          <div className="text-gray-400 text-center">
                            <div className="text-xs">No Logo</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => setIsMediaPickerOpen(true)}
                        className="w-full px-6 py-3 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all font-medium"
                      >
                        {formData.logoUrl ? '📷 Change Logo' : '📁 Select Logo'}
                      </button>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Upload or select from media library
                      </p>
                    </div>
                  </div>
                </div>

                {/* Website URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-lg transition-all"
                    placeholder="https://example.com"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Optional - Link to client's website
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-4 pt-8 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-8 py-6 -mx-8 -mb-8 rounded-b-2xl">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl transition-all font-medium shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all font-medium shadow-lg transform hover:scale-105"
                >
                  {editingClient ? '💾 Update Client' : '🎉 Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MediaPicker
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        multiple={false}
        acceptedTypes={['image']}
        title="Select Client Logo"
      />
      </div>
    </AdminDashboardLayout>
  );
}