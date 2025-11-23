import { Router, Response } from 'express';
import { ApiResponse, AuthRequest } from '../types';
import { authenticate, authorize, requireSuperAdmin, securityAccessLogger } from '../middleware/authMiddleware';
import { systemLimiter } from '../middleware/rateLimiter';
import os from 'os';
import { prisma } from '../utils/prisma';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const router = Router();
const execPromise = promisify(exec);

// Helper function to get folder size recursively
async function getFolderSize(folderPath: string): Promise<number> {
  let totalSize = 0;
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(folderPath, file.name);
      try {
        if (file.isDirectory()) {
          totalSize += await getFolderSize(filePath);
        } else {
          const stats = await fs.stat(filePath);
          totalSize += stats.size;
        }
      } catch (err) {
        // Skip files/folders with permission issues
        continue;
      }
    }
  } catch (error) {
    // Folder doesn't exist or no permission
  }
  return totalSize;
}

// Helper function to get disk info
async function getDiskInfo(): Promise<any> {
  try {
    const platform = os.platform();
    
    if (platform === 'linux' || platform === 'darwin') {
      // Linux/Mac: Use df command
      const { stdout } = await execPromise('df -h / | tail -1');
      const parts = stdout.trim().split(/\s+/);
      
      return {
        rootPartition: {
          filesystem: parts[0],
          total: parts[1],
          used: parts[2],
          free: parts[3],
          usagePercent: parseInt(parts[4]) || 0,
        },
        platform,
        available: true,
      };
    } else if (platform === 'win32') {
      // Windows: Use wmic command
      try {
        const { stdout } = await execPromise('wmic logicaldisk get size,freespace,caption');
        const lines = stdout.trim().split('\n').filter(line => line.trim());
        if (lines.length > 1) {
          const data = lines[1].trim().split(/\s+/);
          const total = parseInt(data[2]) || 0;
          const free = parseInt(data[1]) || 0;
          const used = total - free;
          
          return {
            rootPartition: {
              filesystem: data[0],
              total: (total / 1024 / 1024 / 1024).toFixed(2) + 'GB',
              used: (used / 1024 / 1024 / 1024).toFixed(2) + 'GB',
              free: (free / 1024 / 1024 / 1024).toFixed(2) + 'GB',
              usagePercent: total > 0 ? Math.round((used / total) * 100) : 0,
            },
            platform,
            available: true,
          };
        }
      } catch (err) {
        // Fallback for Windows
      }
    }
    
    return {
      available: false,
      message: 'Disk info not available for this platform',
      platform,
    };
  } catch (error) {
    return {
      available: false,
      error: 'Unable to fetch disk info',
      platform: os.platform(),
    };
  }
}

// Helper function to get CPU usage
function getCPUUsage(): Promise<{ user: number; system: number; idle: number; total: number; usagePercent: number }> {
  return new Promise((resolve) => {
    const startUsage = process.cpuUsage();
    const startTime = process.hrtime.bigint();
    
    setTimeout(() => {
      const endUsage = process.cpuUsage(startUsage);
      const endTime = process.hrtime.bigint();
      const elapsedTime = Number(endTime - startTime) / 1000; // Convert to microseconds
      
      const userPercent = (endUsage.user / elapsedTime) * 100;
      const systemPercent = (endUsage.system / elapsedTime) * 100;
      const totalPercent = userPercent + systemPercent;
      
      resolve({
        user: Math.min(userPercent, 100),
        system: Math.min(systemPercent, 100),
        idle: Math.max(0, 100 - totalPercent),
        total: Math.min(totalPercent, 100),
        usagePercent: Math.min(totalPercent, 100),
      });
    }, 100);
  });
}

// Helper function to get process metrics
function getProcessMetrics() {
  const memoryUsage = process.memoryUsage();
  
  return {
    pid: process.pid,
    uptime: process.uptime(),
    uptimeFormatted: `${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m`,
    memory: {
      rss: (memoryUsage.rss / 1024 / 1024).toFixed(2) + ' MB',
      heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
      heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
      external: (memoryUsage.external / 1024 / 1024).toFixed(2) + ' MB',
      heapUsagePercent: parseFloat(((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100).toFixed(2)),
    },
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
  };
}

// Helper function to get database health
async function getDatabaseHealth() {
  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const queryTime = Date.now() - startTime;
    
    // Get table counts and sizes (PostgreSQL specific)
    let tableSizes: any[] = [];
    try {
      tableSizes = await prisma.$queryRaw`
        SELECT 
          relname as table_name,
          n_live_tup as row_count,
          pg_size_pretty(pg_total_relation_size(relid)) as total_size,
          pg_size_pretty(pg_relation_size(relid)) as table_size
        FROM pg_stat_user_tables
        ORDER BY pg_total_relation_size(relid) DESC
        LIMIT 10
      ` as any[];
    } catch (err) {
      // Table size query might fail on some PostgreSQL versions
    }
    
    return {
      connected: true,
      responseTime: queryTime + 'ms',
      status: queryTime < 100 ? 'excellent' : queryTime < 500 ? 'good' : 'slow',
      tables: tableSizes.map((t: any) => ({
        name: t.table_name,
        rows: parseInt(t.row_count) || 0,
        size: t.total_size || 'N/A',
      })),
      performanceRating: queryTime < 50 ? 'A+' : queryTime < 100 ? 'A' : queryTime < 200 ? 'B' : 'C',
    };
  } catch (error) {
    return {
      connected: false,
      status: 'disconnected',
      error: 'Database connection failed',
    };
  }
}

// Helper function to get security metrics
async function getSecurityMetrics() {
  try {
    // Get failed login attempts (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Get audit logs if they exist
    let failedLogins = 0;
    let successfulLogins = 0;
    let recentActivity: any[] = [];
    
    try {
      // Check if AuditLog table exists
      const auditLogs = await prisma.$queryRaw`
        SELECT action, created_at, metadata
        FROM "AuditLog"
        WHERE created_at > ${oneDayAgo}
        ORDER BY created_at DESC
        LIMIT 100
      ` as any[];
      
      failedLogins = auditLogs.filter((log: any) => 
        log.action?.includes('LOGIN_FAILED') || log.action?.includes('UNAUTHORIZED')
      ).length;
      
      successfulLogins = auditLogs.filter((log: any) => 
        log.action?.includes('LOGIN') && !log.action?.includes('FAILED')
      ).length;
      
      recentActivity = auditLogs.slice(0, 5).map((log: any) => ({
        action: log.action,
        timestamp: log.created_at,
        details: log.metadata,
      }));
    } catch (err) {
      // AuditLog table might not exist
    }
    
    // Get active users count
    const totalUsers = await prisma.user.count();
    const adminUsers = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
    
    return {
      failedLoginAttempts: failedLogins,
      successfulLogins: successfulLogins,
      totalUsers,
      adminUsers,
      recentActivity,
      securityStatus: failedLogins > 10 ? 'warning' : 'secure',
      lastAuditCheck: new Date().toISOString(),
    };
  } catch (error) {
    return {
      available: false,
      error: 'Security metrics unavailable',
    };
  }
}

/**
 * Get system information
 * RESTRICTED: Super Admin only with comprehensive logging
 */
router.get('/info', systemLimiter, securityAccessLogger, requireSuperAdmin, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    // Get system stats
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsage = ((usedMemory / totalMemory) * 100).toFixed(2);

    const cpus = os.cpus();
    const uptime = os.uptime();
    
    // Calculate uptime in days, hours, minutes
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    // Get CPU usage (takes 100ms)
    const cpuUsage = await getCPUUsage();

    // Get database stats
    const [
      totalProjects,
      totalServices,
      totalBlogPosts,
      totalTestimonials,
      totalTeamMembers,
      totalContacts,
      totalUsers,
      latestProject,
      latestBlog,
      latestContact,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.service.count(),
      prisma.blogPost.count(),
      prisma.testimonial.count(),
      prisma.teamMember.count(),
      prisma.contactSubmission.count(),
      prisma.user.count(),
      prisma.project.findFirst({ orderBy: { createdAt: 'desc' } }),
      prisma.blogPost.findFirst({ orderBy: { createdAt: 'desc' } }),
      prisma.contactSubmission.findFirst({ orderBy: { createdAt: 'desc' } }),
    ]);

    // Get additional monitoring data
    const [diskInfo, databaseHealth, securityMetrics, uploadsSize, logsSize] = await Promise.all([
      getDiskInfo(),
      getDatabaseHealth(),
      getSecurityMetrics(),
      getFolderSize(path.join(process.cwd(), 'uploads')).catch(() => 0),
      getFolderSize(path.join(process.cwd(), 'logs')).catch(() => 0),
    ]);

    const processMetrics = getProcessMetrics();

    const systemInfo = {
      // Server Information
      server: {
        platform: os.platform(),
        type: os.type(),
        release: os.release(),
        hostname: os.hostname(),
        architecture: os.arch(),
        nodeVersion: process.version,
        uptime: {
          total: uptime,
          formatted: `${days}d ${hours}h ${minutes}m`,
          days,
          hours,
          minutes,
        },
      },

      // CPU Information - Enhanced
      cpu: {
        model: cpus[0]?.model || 'Unknown',
        cores: cpus.length,
        speed: cpus[0]?.speed || 0,
        usage: {
          user: cpuUsage.user.toFixed(2) + '%',
          system: cpuUsage.system.toFixed(2) + '%',
          idle: cpuUsage.idle.toFixed(2) + '%',
          total: cpuUsage.usagePercent.toFixed(2) + '%',
          percent: parseFloat(cpuUsage.usagePercent.toFixed(2)),
        },
        loadAverage: os.loadavg().map(load => load.toFixed(2)),
      },

      // Memory Information - Enhanced
      memory: {
        total: totalMemory,
        free: freeMemory,
        used: usedMemory,
        totalGB: (totalMemory / 1024 / 1024 / 1024).toFixed(2),
        freeGB: (freeMemory / 1024 / 1024 / 1024).toFixed(2),
        usedGB: (usedMemory / 1024 / 1024 / 1024).toFixed(2),
        usagePercent: parseFloat(memoryUsage),
        available: freeMemory,
        buffers: 0,
        cached: 0,
        status: parseFloat(memoryUsage) > 90 ? 'critical' : parseFloat(memoryUsage) > 75 ? 'warning' : 'healthy',
      },

      // Process Metrics - New
      process: processMetrics,

      // Disk & Storage - New
      disk: {
        ...diskInfo,
        uploads: {
          size: (uploadsSize / 1024 / 1024).toFixed(2) + ' MB',
          sizeBytes: uploadsSize,
          path: path.join(process.cwd(), 'uploads'),
        },
        logs: {
          size: (logsSize / 1024 / 1024).toFixed(2) + ' MB',
          sizeBytes: logsSize,
          path: path.join(process.cwd(), 'logs'),
        },
        warningLevel: diskInfo.rootPartition?.usagePercent > 90 ? 'critical' : 
                      diskInfo.rootPartition?.usagePercent > 80 ? 'warning' : 'normal',
      },

      // Application Information
      application: {
        version: '2.1.0',
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 5000,
        databaseType: 'PostgreSQL',
        databaseVersion: '14+',
      },

      // Database Statistics
      database: {
        totalProjects,
        totalServices,
        totalBlogPosts,
        totalTestimonials,
        totalTeamMembers,
        totalContacts,
        totalUsers,
        latestActivity: {
          project: latestProject?.createdAt || null,
          blog: latestBlog?.createdAt || null,
          contact: latestContact?.createdAt || null,
        },
      },

      // Database Health - New
      databaseHealth,

      // Security Metrics - New
      security: securityMetrics,

      // Developer Information
      developer: {
        company: 'Zwicky Technology',
        phone: '+977 9825733821',
        email: 'info@zwickytechnology.com',
        website: 'www.zwickytechnology.com',
        supportEmail: 'support@zwickytechnology.com',
      },

      // Timestamps
      serverTime: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    res.json({
      success: true,
      message: 'System information retrieved successfully',
      data: systemInfo,
    });
  } catch (error) {
    console.error('Get system info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve system information',
      errors: ['Internal server error'],
    });
  }
});

/**
 * Get system health status - Sanitized public endpoint
 */
router.get('/health', async (req, res: Response<ApiResponse>) => {
  try {
    // Basic database connection check - NO sensitive data exposed
    await prisma.$queryRaw`SELECT 1`;
    
    // Return minimal health information
    res.json({
      success: true,
      message: 'Service is operational',
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: process.env.SERVICE_NAME || 'Forever Shine API'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Service temporarily unavailable'
    });
  }
});

/**
 * Get detailed system health - Super Admin only
 */
router.get('/health/detailed', systemLimiter, securityAccessLogger, requireSuperAdmin, async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: uptime,
      uptimeFormatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
      memory: {
        heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
        heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
        rss: (memoryUsage.rss / 1024 / 1024).toFixed(2) + ' MB',
      },
      database: {
        connected: true,
        type: 'PostgreSQL',
      },
    };

    res.json({
      success: true,
      message: 'System is healthy',
      data: health,
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      success: false,
      message: 'System health check failed',
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
        },
      },
    });
  }
});

export default router;
