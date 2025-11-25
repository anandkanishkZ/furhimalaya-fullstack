import { Request, Response, NextFunction } from 'express';
import { logSecurityEvent } from '../utils/securityLogger';

interface LoginAttempt {
  count: number;
  lockUntil?: Date;
  lastAttempt: Date;
}

// In-memory store for login attempts (use Redis in production)
const loginAttempts = new Map<string, LoginAttempt>();

const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5');
const LOCK_TIME = parseInt(process.env.ACCOUNT_LOCK_TIME || '900000'); // 15 minutes
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes window

export const bruteForceProtection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  const attempts = loginAttempts.get(email);
  const now = new Date();

  // Check if account is locked
  if (attempts?.lockUntil && attempts.lockUntil > now) {
    const remainingTime = Math.ceil((attempts.lockUntil.getTime() - now.getTime()) / 1000 / 60);
    
    logSecurityEvent({
      type: 'ACCOUNT_LOCKED',
      severity: 'HIGH',
      ip: req.ip || 'unknown',
      email,
      details: { remainingMinutes: remainingTime }
    });
    
    return res.status(429).json({
      success: false,
      message: `Account temporarily locked due to multiple failed login attempts. Please try again in ${remainingTime} minutes.`,
      lockedUntil: attempts.lockUntil
    });
  }

  // Reset attempts if lock time has passed
  if (attempts?.lockUntil && attempts.lockUntil <= now) {
    loginAttempts.delete(email);
  }

  next();
};

export const recordFailedLogin = (email: string, ip?: string) => {
  const attempts = loginAttempts.get(email);
  const now = new Date();

  if (!attempts) {
    loginAttempts.set(email, {
      count: 1,
      lastAttempt: now
    });
    
    logSecurityEvent({
      type: 'FAILED_LOGIN',
      severity: 'LOW',
      ip: ip || 'unknown',
      email,
      details: { attempt: 1 }
    });
    return;
  }

  // Check if we're still within the attempt window
  const timeSinceLastAttempt = now.getTime() - attempts.lastAttempt.getTime();
  
  if (timeSinceLastAttempt > ATTEMPT_WINDOW) {
    // Reset if outside window
    loginAttempts.set(email, {
      count: 1,
      lastAttempt: now
    });
    return;
  }

  // Increment attempt count
  const newCount = attempts.count + 1;

  if (newCount >= MAX_LOGIN_ATTEMPTS) {
    // Lock the account
    loginAttempts.set(email, {
      count: newCount,
      lastAttempt: now,
      lockUntil: new Date(now.getTime() + LOCK_TIME)
    });
    
    logSecurityEvent({
      type: 'ACCOUNT_LOCKED',
      severity: 'HIGH',
      ip: ip || 'unknown',
      email,
      details: { attempts: newCount, lockDuration: LOCK_TIME }
    });
  } else {
    loginAttempts.set(email, {
      count: newCount,
      lastAttempt: now
    });
    
    logSecurityEvent({
      type: 'FAILED_LOGIN',
      severity: newCount > 3 ? 'MEDIUM' : 'LOW',
      ip: ip || 'unknown',
      email,
      details: { attempt: newCount }
    });
  }
};

export const recordSuccessfulLogin = (email: string, ip?: string) => {
  loginAttempts.delete(email);
  
  logSecurityEvent({
    type: 'SUCCESSFUL_LOGIN',
    severity: 'LOW',
    ip: ip || 'unknown',
    email
  });
};

export const getRemainingAttempts = (email: string): number => {
  const attempts = loginAttempts.get(email);
  if (!attempts) return MAX_LOGIN_ATTEMPTS;
  
  return Math.max(0, MAX_LOGIN_ATTEMPTS - attempts.count);
};

// Cleanup old entries every hour
setInterval(() => {
  const now = new Date();
  const entries = Array.from(loginAttempts.entries());
  
  for (const [email, attempt] of entries) {
    const timeSinceLastAttempt = now.getTime() - attempt.lastAttempt.getTime();
    
    // Remove entries older than 1 hour that aren't locked
    if (timeSinceLastAttempt > 60 * 60 * 1000 && !attempt.lockUntil) {
      loginAttempts.delete(email);
    }
    
    // Remove entries where lock has expired
    if (attempt.lockUntil && attempt.lockUntil <= now) {
      loginAttempts.delete(email);
    }
  }
}, 60 * 60 * 1000); // Run every hour
