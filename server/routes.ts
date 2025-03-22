import { Express } from 'express';
import { createServer, type Server } from "http";
import authRoutes from './auth/auth-routes';
import productRoutes from './routes/product-routes';
import cartRoutes from './routes/cart-routes';
export function registerRoutes(app: Express): Server {
  // Prefix all routes with /api
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  const httpServer = createServer(app);
  return httpServer;
}