import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import { UserRole } from '../models/User';

interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

const isTokenPayload = (value: jwt.JwtPayload | string): value is TokenPayload => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const id = 'id' in value && typeof value.id === 'string';
  const email = 'email' in value && typeof value.email === 'string';
  const role = 'role' in value && (value.role === 'user' || value.role === 'admin');
  //console.log('Token Payload Check:', { id, email, role });
  return id && email && role;
};

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    next(new AppError('Unauthorized', 401));
    return;
  }
  const token = header.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    next(new AppError('JWT_SECRET is required', 500));
    return;
  }
  try {
    const decoded = jwt.verify(token, secret);
    if (!isTokenPayload(decoded)) {
      next(new AppError('Invalid token payload', 401));
      return;
    }
    req.user = decoded;
    next();
  } catch {
    next(new AppError('Invalid token', 401));
  }
};

const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    //console.log(hit auth admin);
    next(new AppError('Forbidden', 403));
    return;
  }
  next();
};

export { authenticate, authorizeAdmin, TokenPayload };
