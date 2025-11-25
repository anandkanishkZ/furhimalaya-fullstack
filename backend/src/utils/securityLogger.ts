import winston from 'winston';
import path from 'path';

const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(process.env.LOG_DIR || './logs', 'security.log'),
      level: 'info'
    }),
    new winston.transports.File({
      filename: path.join(process.env.LOG_DIR || './logs', 'security-error.log'),
      level: 'error'
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
      level: process.env.NODE_ENV === 'production' ? 'error' : 'info'
    })
  ]
});

export interface SecurityEvent {
  type: 'FAILED_LOGIN' | 'ACCOUNT_LOCKED' | 'SUCCESSFUL_LOGIN' | 'RATE_LIMIT_EXCEEDED' | 'SUSPICIOUS_ACTIVITY' | 'FILE_UPLOAD_REJECTED' | 'UNAUTHORIZED_ACCESS';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ip: string;
  email?: string;
  userId?: string;
  details?: any;
}

export const logSecurityEvent = (event: SecurityEvent) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...event
  };

  if (event.severity === 'CRITICAL' || event.severity === 'HIGH') {
    securityLogger.error(logEntry);
  } else {
    securityLogger.info(logEntry);
  }
};

export default securityLogger;
