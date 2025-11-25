import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Import logger
import logger, { logInfo, logError } from './utils/logger';

// Route imports
import authRoutes from './routes/auth';
import serviceRoutes from './routes/services';
import projectRoutes from './routes/projects';
import blogRoutes from './routes/blog';
import teamRoutes from './routes/team';
import testimonialRoutes from './routes/testimonials';
import clientRoutes from './routes/clients';
import settingsRoutes from './routes/settings';
import publicSettingsRoutes from './routes/public-settings';
import contactRoutes from './routes/contact';
import uploadRoutes from './routes/upload';
import mediaRoutes from './routes/media';
import profileRoutes from './routes/profile';
import notificationRoutes from './routes/notifications';
import heroSlidesRoutes from './routes/hero-slides';
import systemRoutes from './routes/system';
import honeypotRoutes from './routes/honeypot';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { apiLimiter, systemLimiter, apiDiscoveryLimiter } from './middleware/rateLimiter';
import { csrfProtection, csrfErrorHandler } from './middleware/csrfProtection';
import requestLogger from './middleware/requestLogger';
import httpsMiddleware from './middleware/httpsEnforcement';

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy - MUST be set BEFORE any middleware that checks headers
app.set('trust proxy', 1);

// HTTPS enforcement (redirects HTTP to HTTPS in production)
app.use(httpsMiddleware);

// HTTP Request logging (must be early in middleware chain)
app.use(requestLogger);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'CSRF-Token']
}));

// Cookie parser middleware
app.use(cookieParser());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CSRF Protection - applied to all API routes except GET requests and specific endpoints
app.use('/api', csrfProtection);

// Apply general API rate limiting to all routes
app.use('/api', apiLimiter);

// Extra security for system routes
app.use('/api/system', systemLimiter);

// API discovery prevention for undefined routes
app.use('/api', apiDiscoveryLimiter);

// Static files - serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// CSRF token endpoint - must be before other routes
app.get('/api/csrf-token', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      csrfToken: req.csrfToken()
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/public/settings', publicSettingsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/hero-slides', heroSlidesRoutes);
app.use('/api/system', systemRoutes);

// Health check endpoint (must be before honeypot routes)
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Fur Himalaya API is running',
    timestamp: new Date().toISOString()
  });
});

// Security: Honeypot routes (must be last to catch undefined endpoints)
app.use('/', honeypotRoutes);

// Error handling middleware
app.use(csrfErrorHandler); // Handle CSRF errors first
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  logInfo(`🚀 Server running on port ${PORT}`);
  logInfo(`📊 Environment: ${process.env.NODE_ENV}`);
  logInfo(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
  logInfo(`📁 Upload path: ${process.env.UPLOAD_PATH}`);
  logInfo(`🔒 HTTPS enforcement: ${process.env.NODE_ENV === 'production' ? 'enabled' : 'disabled'}`);
  logInfo(`📝 Logging level: ${process.env.LOG_LEVEL || 'info'}`);

  // Log security features enabled
  logInfo('✅ Security features enabled:');
  logInfo('   - Rate limiting');
  logInfo('   - CSRF protection');
  logInfo('   - HttpOnly cookies');
  logInfo('   - Request logging');
  logInfo('   - Audit logging');
  if (process.env.NODE_ENV === 'production') {
    logInfo('   - HTTPS enforcement');
    logInfo('   - HSTS headers');
  }
});
