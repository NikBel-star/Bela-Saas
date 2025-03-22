import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { storage } from '../storage';

// Define the User type for passport
interface UserType {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
}

// Configure passport to use local strategy
export function configurePassport() {
  // Use email as the username field
  passport.use(new LocalStrategy({ 
    usernameField: 'email',
    passwordField: 'password' 
  }, async (email, password, done) => {
    try {
      // Find user by email
      const user = await storage.getUserByEmail(email);
      
      // User not found
      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password' });
      }
      
      // Success - return user
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
  
  // Serialize user to session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || undefined);
    } catch (error) {
      done(error);
    }
  });
  
  return passport;
}