import { Router, Request, Response } from 'express';
import { isAuthenticated } from '../auth/auth-middleware';
import { storage } from '../storage';
import { insertCartItemSchema } from '@shared/schema';
import { z } from 'zod';

const router = Router();

// Get user's cart (authenticated only)
router.get('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    let cart = await storage.getCart(userId);
    
    // Create cart if it doesn't exist
    if (!cart) {
      cart = await storage.createCart({ userId });
    }
    
    // Get cart items
    const cartItems = await storage.getCartItems(cart.id);
    
    res.json({
      cart,
      items: cartItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

// Add item to cart (authenticated only)
router.post('/items', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    let cart = await storage.getCart(userId);
    
    // Create cart if it doesn't exist
    if (!cart) {
      cart = await storage.createCart({ userId });
    }
    
    // Parse and validate request body
    const validatedData = insertCartItemSchema.parse({
      ...req.body,
      cartId: cart.id
    });
    
    // Check if product exists
    const product = await storage.getProduct(validatedData.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if item already exists in cart
    const existingCartItems = await storage.getCartItems(cart.id);
    const existingItem = existingCartItems.find(item => item.productId === validatedData.productId);
    
    // Update quantity if item exists
    if (existingItem) {
      const updatedItem = await storage.updateCartItem(
        existingItem.id, 
        existingItem.quantity + validatedData.quantity
      );
      return res.json(updatedItem);
    }
    
    // Add new item to cart
    const cartItem = await storage.addCartItem(validatedData);
    res.status(201).json(cartItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: 'Error adding item to cart' });
  }
});

// Update cart item quantity (authenticated only)
router.put('/items/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const cart = await storage.getCart(userId);
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemId = parseInt(req.params.id);
    const { quantity } = req.body;
    
    if (isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }
    
    const updatedItem = await storage.updateCartItem(itemId, quantity);
    
    if (!updatedItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item' });
  }
});

// Remove item from cart (authenticated only)
router.delete('/items/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const cart = await storage.getCart(userId);
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemId = parseInt(req.params.id);
    const success = await storage.removeCartItem(itemId);
    
    if (!success) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart' });
  }
});

export default router;