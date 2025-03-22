import { z } from 'zod';
import type { User as PrismaUser, Product as PrismaProduct, Cart as PrismaCart, CartItem as PrismaCartItem, Order as PrismaOrder, OrderItem as PrismaOrderItem } from '@prisma/client';

// Type definitions
export type User = PrismaUser;
export type Product = PrismaProduct;
export type Cart = PrismaCart;
export type CartItem = PrismaCartItem;
export type Order = PrismaOrder;
export type OrderItem = PrismaOrderItem;

// Insert schemas
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  role: z.enum(['admin', 'customer']).optional()
});

export const insertProductSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10),
  price: z.string().refine((val) => parseFloat(val) > 0, { message: 'Price must be greater than 0' }),
  imageUrl: z.string().optional(),
  stock: z.number().int().min(0).optional()
});

export const insertCartSchema = z.object({
  userId: z.number().int()
});

export const insertCartItemSchema = z.object({
  cartId: z.number().int(),
  productId: z.number().int(),
  quantity: z.number().int().min(1).optional()
});

export const insertOrderSchema = z.object({
  userId: z.number().int(),
  total: z.string().refine((val) => parseFloat(val) >= 0, { message: 'Total must be non-negative' }),
  shippingAddress: z.string().min(5),
  billingAddress: z.string().min(5),
  paymentMethod: z.string().min(3),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  isPaid: z.boolean().optional()
});

export const insertOrderItemSchema = z.object({
  orderId: z.number().int(),
  productId: z.number().int(),
  name: z.string().min(3).max(100),
  price: z.string().refine((val) => parseFloat(val) > 0, { message: 'Price must be greater than 0' }),
  quantity: z.number().int().min(1)
});

// Insert type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertCart = z.infer<typeof insertCartSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;;