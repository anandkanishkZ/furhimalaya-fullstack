import { Request, Response, NextFunction } from 'express';
import { logAudit } from '../utils/logger';

/**
 * Middleware to audit log all admin actions
 * Logs Create, Update, Delete operations
 */
export const auditLog = (action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to capture response
    res.json = function (body: any) {
      // Only log successful operations (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const user = (req as any).user;
        
        logAudit(action, user?.id || 'unknown', {
          method: req.method,
          path: req.path,
          params: req.params,
          query: req.query,
          body: sanitizeBody(req.body),
          ip: req.ip,
          userAgent: req.get('user-agent'),
          statusCode: res.statusCode,
        });
      }

      // Call original json method
      return originalJson(body);
    };

    next();
  };
};

/**
 * Sanitize request body to remove sensitive information
 * Remove passwords, tokens, etc. from audit logs
 */
const sanitizeBody = (body: any): any => {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'refreshToken'];

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
};

/**
 * Helper to create audit logs for specific actions
 */
export const auditCreate = auditLog('CREATE');
export const auditUpdate = auditLog('UPDATE');
export const auditDelete = auditLog('DELETE');

export default auditLog;
