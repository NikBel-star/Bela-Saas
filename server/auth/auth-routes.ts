import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { sanitizeUser } from './auth-middleware';
import { storage } from '../storage';
import { insertUserSchema } from '@shared/schema';
import { z } from 'zod';
const router = Router();
// Extended schema with password validation
const registerSchema = insertUserSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters")
});
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});
router.post('/register', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = await registerSchema.parseAsync(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email already in use',
        code: 'EMAIL_EXISTS'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);
    
    // Create user with hashed password
    const userData = {
      email: validatedData.email,
      password: hashedPassword,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      role: validatedData.role || 'customer'
    };
    
    const user = await storage.createUser(userData);
    
    // Log in the user automatically after registration
    req.logIn(user, (err) => {
      if (err) {
        return res.status(201).json(sanitizeUser(user));
      }
      res.status(201).json(sanitizeUser(user));
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    await loginSchema.parseAsync(req.body);
    
    // Handle authentication
    passport.authenticate('local', (err: Error, user: any, info: any) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({
          message: 'Internal server error',
          error: err.message
        });
      }
      
      if (!user) {
        console.log('Authentication failed:', info.message);
        return res.status(401).json({ 
          message: info.message || 'Invalid email or password',
          code: 'AUTH_FAILED'
        });
      }
      
      // Log in the user
      req.logIn(user, (err) => {
        if (err) {
          console.error('Session creation error:', err);
          return res.status(500).json({
            message: 'Error creating session',
            error: err.message
          });
        }
        
        console.log('User logged in successfully:', sanitizeUser(user));
        return res.json(sanitizeUser(user));
      });
    })(req, res, next);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      });
    }
    next(error);
  }
});

export default router;
