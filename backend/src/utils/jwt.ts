import jwt from 'jsonwebtoken';

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

// Access token - short lived (1 day)
export const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  return jwt.sign(payload, secret, { expiresIn } as any);
};

// Refresh token - longer lived (7 days)
export const generateRefreshToken = (payload: JWTPayload): string => {
  const secret = (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET) as string;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn } as any);
};

export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET as string;
  return jwt.verify(token, secret) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  const secret = (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET) as string;
  return jwt.verify(token, secret) as JWTPayload;
};