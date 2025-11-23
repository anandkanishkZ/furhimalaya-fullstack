import { Router, Request, Response } from 'express';
import { apiDiscoveryLimiter } from '../middleware/rateLimiter';

const router = Router();

// Security event logger for honeypot endpoints
const logHoneypotActivity = (req: Request, endpoint: string, type: string) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  const referer = req.get('Referer') || 'Direct';
  
  console.log(`🍯 HONEYPOT TRIGGERED: ${timestamp}`);
  console.log(`   Type: ${type}`);
  console.log(`   Endpoint: ${endpoint}`);
  console.log(`   IP: ${ip}`);
  console.log(`   User-Agent: ${userAgent}`);
  console.log(`   Referer: ${referer}`);
  console.log(`   Method: ${req.method}`);
  console.log(`   Full Path: ${req.originalUrl}`);
  
  // TODO: Send to security monitoring service
  // Example: Send to Slack, email alert, or security dashboard
};

// Fake admin endpoints - logs all access attempts
router.all('/admin*', apiDiscoveryLimiter, (req: Request, res: Response) => {
  logHoneypotActivity(req, '/admin', 'ADMIN_PROBE');
  
  // Return convincing fake admin login page
  res.status(200).type('html').send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Forever Shine - Admin Login</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; }
            .login-container { max-width: 400px; margin: 100px auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .logo { text-align: center; margin-bottom: 30px; }
            .form-group { margin-bottom: 20px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
            button { width: 100%; padding: 12px; background: #007cba; color: white; border: none; border-radius: 4px; cursor: pointer; }
            button:hover { background: #005a85; }
        </style>
    </head>
    <body>
        <div class="login-container">
            <div class="logo">
                <h2>Forever Shine Engineering</h2>
                <p>Admin Panel Access</p>
            </div>
            <form>
                <div class="form-group">
                    <label>Username:</label>
                    <input type="text" name="username" placeholder="Enter username" required>
                </div>
                <div class="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" placeholder="Enter password" required>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    </body>
    </html>
  `);
});

// Fake API documentation endpoint
router.all('/docs*', apiDiscoveryLimiter, (req: Request, res: Response) => {
  logHoneypotActivity(req, '/docs', 'API_DOCS_PROBE');
  
  res.status(200).json({
    name: 'Forever Shine Engineering API',
    version: '1.0.0',
    description: 'Professional Engineering Services API',
    documentation: 'Contact administrator for API access',
    endpoints: {
      '/auth/login': 'Authentication endpoint',
      '/projects': 'Project listings',
      '/services': 'Service offerings',
      '/contact': 'Contact form submission'
    },
    note: 'This API requires authentication for all endpoints'
  });
});

// Common hacker probe endpoints
const hackerProbes = [
  '/wp-admin*',
  '/wp-login*',
  '/wordpress*',
  '/phpmyadmin*',
  '/phpMyAdmin*',
  '/mysql*',
  '/database*',
  '/backup*',
  '/config*',
  '/.env*',
  '/server-status*',
  '/server-info*'
];

hackerProbes.forEach(probe => {
  router.all(probe, (req: Request, res: Response) => {
    logHoneypotActivity(req, probe, 'HACKER_PROBE');
    
    // Return 404 to not reveal this is a honeypot
    res.status(404).json({
      error: 'Not Found',
      message: 'The requested resource was not found on this server'
    });
  });
});

// Generic API probe catcher for undefined endpoints
router.all('*', apiDiscoveryLimiter, (req: Request, res: Response) => {
  logHoneypotActivity(req, req.path, 'UNDEFINED_ENDPOINT');
  
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    suggestion: 'Please refer to API documentation for available endpoints'
  });
});

export default router;