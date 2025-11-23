import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { ApiResponse, AuthRequest } from '../types';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.body.category || 'general';
    const uploadPath = path.join(__dirname, '../../uploads', category);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'svg', 'pdf', 'doc', 'docx'];
    const fileExtension = path.extname(file.originalname).toLowerCase().slice(1);
    
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error(`File type .${fileExtension} is not allowed`));
    }
  }
});

// Base URL for media files
const getBaseUrl = () => process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

// Interface for media file info
interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  category: string;
  url: string;
  fullPath: string;
  size: number;
  type: string;
  mimeType: string;
  dimensions?: {
    width: number;
    height: number;
  };
  createdAt: Date;
  thumbnailUrl?: string;
}

// Helper function to get file info
const getFileInfo = async (filePath: string, category: string): Promise<MediaFile | null> => {
  try {
    const stats = fs.statSync(filePath);
    const filename = path.basename(filePath);
    const ext = path.extname(filename).toLowerCase();
    const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    
    const baseUrl = getBaseUrl();
    
    const fileInfo: MediaFile = {
      id: filename,
      filename,
      originalName: filename.split('-').slice(1).join('-') || filename,
      category,
      url: `${baseUrl}/api/media/serve/${category}/${filename}`,
      fullPath: filePath,
      size: stats.size,
      type: isImage ? 'image' : 'document',
      mimeType: getMimeType(ext),
      createdAt: stats.mtime
    };

    // Get image dimensions if it's an image
    if (isImage) {
      try {
        const metadata = await sharp(filePath).metadata();
        fileInfo.dimensions = {
          width: metadata.width || 0,
          height: metadata.height || 0
        };
        
        // Generate thumbnail for images
        const thumbFilename = filename.replace(/\.[^/.]+$/, '.jpg'); // Always save thumbnails as JPG
        const thumbPath = path.join(path.dirname(filePath), 'thumbs', thumbFilename);
        const thumbDir = path.dirname(thumbPath);
        
        if (!fs.existsSync(thumbDir)) {
          fs.mkdirSync(thumbDir, { recursive: true });
        }
        
        if (!fs.existsSync(thumbPath)) {
          await sharp(filePath)
            .resize(200, 200, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toFile(thumbPath);
        }
        
        fileInfo.thumbnailUrl = `${baseUrl}/api/media/serve/${category}/${thumbFilename}?thumb=true`;
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }

    return fileInfo;
  } catch (error) {
    console.error('Error getting file info:', error);
    return null;
  }
};

// Helper function to get MIME type
const getMimeType = (ext: string): string => {
  const mimeTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  return mimeTypes[ext] || 'application/octet-stream';
};

// Get available categories
router.get('/categories', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const uploadsDir = path.join(__dirname, '../../uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      return res.json({ 
        success: true, 
        message: 'Categories retrieved successfully',
        data: [] 
      });
    }
    
    const categories = fs.readdirSync(uploadsDir)
      .filter(item => {
        const itemPath = path.join(uploadsDir, item);
        return fs.statSync(itemPath).isDirectory() && 
               item !== 'thumbs' && 
               !item.startsWith('.');
      });
    
    res.json({ 
      success: true, 
      message: 'Categories retrieved successfully',
      data: categories 
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get categories',
      errors: ['Internal server error'] 
    });
  }
});

// Get all media files
router.get('/', authenticate, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { category, type, page = '1', limit = '20' } = req.query;
    const uploadsDir = path.join(__dirname, '../../uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      return res.json({
        success: true,
        message: 'Media files retrieved successfully',
        data: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }
      });
    }

    const categories = category ? [category as string] : fs.readdirSync(uploadsDir).filter(item => {
      const itemPath = path.join(uploadsDir, item);
      return fs.statSync(itemPath).isDirectory() && item !== 'thumbs';
    });

    const allFiles: MediaFile[] = [];

    for (const cat of categories) {
      const categoryPath = path.join(uploadsDir, cat);
      if (!fs.existsSync(categoryPath)) continue;

      const files = fs.readdirSync(categoryPath).filter(file => {
        const filePath = path.join(categoryPath, file);
        return fs.statSync(filePath).isFile() && 
               file !== '.gitkeep' && 
               !file.startsWith('.') &&
               path.dirname(filePath) !== path.join(categoryPath, 'thumbs');
      });

      for (const file of files) {
        const filePath = path.join(categoryPath, file);
        const fileInfo = await getFileInfo(filePath, cat);
        if (fileInfo) {
          // Filter by type if specified  
          if (!type || fileInfo.type === type) {
            allFiles.push(fileInfo);
          }
        }
      }
    }

    // Sort by creation date (newest first)
    allFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedFiles = allFiles.slice(startIndex, endIndex);

    res.json({
      success: true,
      message: 'Media files retrieved successfully',
      data: paginatedFiles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: allFiles.length,
        totalPages: Math.ceil(allFiles.length / limitNum)
      }
    });
  } catch (error) {
    console.error('Error retrieving media files:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve media files',
      errors: ['Internal server error']
    });
  }
});

// Upload media files
router.post('/upload', authenticate, upload.array('files', 10), async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const files = req.files as Express.Multer.File[];
    const category = req.body.category || 'general';
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
        errors: ['Please select files to upload']
      });
    }

    const uploadedFiles: MediaFile[] = [];

    for (const file of files) {
      const fileInfo = await getFileInfo(file.path, category);
      if (fileInfo) {
        uploadedFiles.push(fileInfo);
      }
    }

    res.json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      errors: ['Internal server error']
    });
  }
});

// Delete media file
router.delete('/:category/:filename', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { category, filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads', category, filename);
    const thumbPath = path.join(__dirname, '../../uploads', category, 'thumbs', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
        errors: ['The specified file does not exist']
      });
    }

    // Delete main file
    fs.unlinkSync(filePath);
    
    // Delete thumbnail if exists
    if (fs.existsSync(thumbPath)) {
      fs.unlinkSync(thumbPath);
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      errors: ['Internal server error']
    });
  }
});

// Get categories
router.get('/categories', authenticate, (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const uploadsDir = path.join(__dirname, '../../uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      return res.json({
        success: true,
        message: 'Categories retrieved successfully',
        data: ['general']
      });
    }

    const categories = fs.readdirSync(uploadsDir).filter(item => {
      const itemPath = path.join(uploadsDir, item);
      return fs.statSync(itemPath).isDirectory() && item !== 'thumbs';
    });

    // Add default categories if they don't exist
    const defaultCategories = ['general', 'projects', 'blog', 'services', 'team'];
    const allCategories = [...new Set([...categories, ...defaultCategories])];

    res.json({
      success: true,
      message: 'Categories retrieved successfully',
      data: allCategories
    });
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      errors: ['Internal server error']
    });
  }
});

// Serve image files through API with optional authentication
router.get('/serve/:category/:filename', async (req: Request, res: Response) => {
  try {
    const { category, filename } = req.params;
    const { thumb } = req.query;
    
    // Optional authentication check - allows both authenticated and unauthenticated access
    // This allows images to be displayed in browser img tags while still providing security options
    
    // Construct file path
    let filePath: string;
    if (thumb === 'true') {
      filePath = path.join(__dirname, '../../uploads', category, 'thumbs', filename);
    } else {
      filePath = path.join(__dirname, '../../uploads', category, filename);
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
        errors: ['The requested file does not exist']
      });
    }
    
    // Security: Prevent directory traversal
    const normalizedPath = path.normalize(filePath);
    const uploadsDir = path.normalize(path.join(__dirname, '../../uploads'));
    if (!normalizedPath.startsWith(uploadsDir)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        errors: ['Invalid file path']
      });
    }
    
    // Get file stats
    const stats = fs.statSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    const mimeType = getMimeType(ext);
    
    // Set appropriate headers
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.setHeader('ETag', `"${stats.mtime.getTime()}-${stats.size}"`);
    res.setHeader('X-Served-By', 'Media API'); // Custom header to identify API serving
    
    // Check if client has cached version
    const ifNoneMatch = req.headers['if-none-match'];
    const etag = `"${stats.mtime.getTime()}-${stats.size}"`;
    
    if (ifNoneMatch === etag) {
      return res.status(304).end();
    }
    
    // Create read stream and pipe to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error serving file',
          errors: ['Internal server error']
        });
      }
    });
    
  } catch (error) {
    console.error('Error serving media file:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to serve file',
        errors: ['Internal server error']
      });
    }
  }
});

export default router;