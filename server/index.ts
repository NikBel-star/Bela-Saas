import express from 'express';
import session, { SessionOptions } from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import passport from 'passport';
import { configurePassport } from './auth/passport-config';
import { setupVite } from './vite';
import authRoutes from './auth/auth-routes';
import productRoutes from './routes/product-routes';
import cartRoutes from './routes/cart-routes';
import { createServer } from 'http';

// Create Express application
const app = express();

// Create HTTP server
const server = createServer(app);

// JSON middleware
app.use(express.json());

// Configure session store
const PgSession = connectPgSimple(session);
const isUsingDatabase = process.env.DATABASE_URL !== undefined;

// Session configuration
const sessionOptions: SessionOptions = {
  secret: process.env.SESSION_SECRET || 'development-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
};

if (isUsingDatabase) {
  sessionOptions.store = new PgSession({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
  });
}

app.use(session(sessionOptions));

// Initialize Passport and restore authentication state from session
const passportInstance = configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Set up the database if needed
if (isUsingDatabase) {
  const { PrismaClient } = require('@prisma/client');
  const initializeDatabase = async () => {
    try {
      console.log('Connecting to PostgreSQL database with Prisma...');
      const prisma = new PrismaClient();
      await prisma.$connect();
      console.log('Successfully connected to PostgreSQL database with Prisma');
      await prisma.$disconnect();
    } catch (error) {
      console.error('Failed to connect to PostgreSQL database with Prisma:', error);
    }
  };
  
  initializeDatabase();
}

// Define the port
const port = process.env.PORT || 3000;

// Start server
const startServer = async () => {
  try {
    // Setup Vite in development mode
    await setupVite(app, server);
    
    // Serve static files from the public directory
    app.use(express.static('dist/public'));

    server.listen(port, () => {
      console.log(`[express] serving on port ${port}`);
    });
  } catch (err) {
    console.error('Error setting up Vite server:', err);
    process.exit(1);
  }
};

startServer();
