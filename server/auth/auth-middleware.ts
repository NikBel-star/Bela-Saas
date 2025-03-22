import { Request, Response, NextFunction } from 'express';
import { User } from '@shared/schema';

// Define our custom user type to avoid circular reference
type SafeUser = Omit<User, 'password'>;

// Extend Express Request to include user
declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      createdAt: Date;
    }
  }
}

// Check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({ message: 'Unauthorized' });
};

// Check if user has admin role
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user?.role === 'admin') {
    return next();
  }
  
  res.status(403).json({ message: 'Forbidden' });
};

// Sanitize user data by removing sensitive information
export const sanitizeUser = (user: any): SafeUser | null => {
  if (!user) return null;
  
  // Create a new object without the password field
  const { password, ...sanitizedUser } = user;
  return sanitizedUser as SafeUser;
};