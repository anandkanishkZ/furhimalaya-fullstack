/**
 * Utility functions for handling media URLs and image operations
 */

// Get the base API URL
export const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

// Get the base backend URL (without /api)
export const getBackendBaseUrl = () => {
  const apiUrl = getApiBaseUrl();
  return apiUrl.replace('/api', '');
};

// Convert old static URLs to API URLs and construct full image URL
export const getImageUrl = (url: string) => {
  if (url.startsWith('http')) {
    // Check if it's an old static URL and convert it
    if (url.includes('/uploads/')) {
      const urlPath = url.split('/uploads/')[1]; // Get everything after /uploads/
      const pathParts = urlPath.split('/');
      
      // If there are multiple parts, the first part is the category
      if (pathParts.length > 1) {
        const category = pathParts[0];
        const filename = pathParts.slice(1).join('/'); // Join remaining parts in case of nested paths
        return `${getBackendBaseUrl()}/api/media/serve/${category}/${filename}`;
      } else {
        // If only filename, default to general category
        const filename = pathParts[0];
        return `${getBackendBaseUrl()}/api/media/serve/general/${filename}`;
      }
    }
    return url; // Already a full URL with API format
  }
  
  if (url.startsWith('/api/media/serve')) {
    return `${getBackendBaseUrl()}${url}`;
  }
  
  // Convert old relative /uploads URLs to API format
  if (url.startsWith('/uploads/')) {
    const pathParts = url.substring(9).split('/'); // Remove '/uploads/' and split
    
    if (pathParts.length > 1) {
      const category = pathParts[0];
      const filename = pathParts.slice(1).join('/');
      return `${getBackendBaseUrl()}/api/media/serve/${category}/${filename}`;
    } else {
      // If only filename, default to general category
      const filename = pathParts[0];
      return `${getBackendBaseUrl()}/api/media/serve/general/${filename}`;
    }
  }
  
  return url;
};

// Validate image URL and provide fallback
export const getValidImageUrl = (url: string, fallbackUrl?: string) => {
  try {
    const imageUrl = getImageUrl(url);
    return imageUrl;
  } catch (error) {
    console.warn('Invalid image URL:', url);
    return fallbackUrl || '/placeholder-image.png';
  }
};

// Check if URL is an image
export const isImageUrl = (url: string) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.includes(ext));
};

// Get file extension from URL
export const getFileExtension = (filename: string) => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Validate file type
export const isValidImageFile = (file: File) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  return validTypes.includes(file.type);
};

// Format file size
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validate file size
export const isValidFileSize = (file: File, maxSizeMB: number = 10) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Generate thumbnail URL from image URL
export const getThumbnailUrl = (imageUrl: string) => {
  if (!imageUrl.includes('/api/media/serve/')) {
    return imageUrl;
  }
  
  // For API URLs, add thumb parameter
  const url = new URL(imageUrl);
  url.searchParams.set('thumb', 'true');
  return url.toString();
};