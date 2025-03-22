import { 
    User, InsertUser,
    Product, InsertProduct,
    Cart, InsertCart,
    CartItem, InsertCartItem,
    Order, InsertOrder,
    OrderItem, InsertOrderItem
  } from '@shared/schema';
  import { PrismaClient } from '@prisma/client';
  
  // Storage interface
  export interface IStorage {
    // User methods
    getUsers(limit?: number, offset?: number): Promise<User[]>;
    getUser(id: number): Promise<User | undefined>;
    getUserByEmail(email: string): Promise<User | undefined>;
    createUser(user: InsertUser): Promise<User>;
    updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
    deleteUser(id: number): Promise<boolean>;
    
    // Product methods
    getProducts(limit?: number, offset?: number): Promise<Product[]>;
    getProduct(id: number): Promise<Product | undefined>;
    createProduct(product: InsertProduct): Promise<Product>;
    updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
    deleteProduct(id: number): Promise<boolean>;
    
    // Cart methods
    getCart(userId: number): Promise<Cart | undefined>;
    createCart(cart: InsertCart): Promise<Cart>;
    
    // Cart item methods
    getCartItems(cartId: number): Promise<CartItem[]>;
    getCartItem(id: number): Promise<CartItem | undefined>;
    addCartItem(item: InsertCartItem): Promise<CartItem>;
    updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
    removeCartItem(id: number): Promise<boolean>;
    
    // Order methods
    getOrders(userId?: number, limit?: number, offset?: number): Promise<Order[]>;
    getOrder(id: number): Promise<Order | undefined>;
    createOrder(order: InsertOrder): Promise<Order>;
    updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
    
    // Order item methods
    getOrderItems(orderId: number): Promise<OrderItem[]>;
    createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  }
  
  // In-memory storage implementation
  export class MemStorage implements IStorage {
    private users: User[] = [];
    private products: Product[] = [];
    private carts: Cart[] = [];
    private cartItems: CartItem[] = [];
    private orders: Order[] = [];
    private orderItems: OrderItem[] = [];
    
    private userIdCounter = 1;
    private productIdCounter = 1;
    private cartIdCounter = 1;
    private cartItemIdCounter = 1;
    private orderIdCounter = 1;
    private orderItemIdCounter = 1;
    
    // User methods
    async getUsers(limit = 10, offset = 0): Promise<User[]> {
      return this.users.slice(offset, offset + limit);
    }
    
    async getUser(id: number): Promise<User | undefined> {
      return this.users.find(user => user.id === id);
    }
    
    async getUserByEmail(email: string): Promise<User | undefined> {
      return this.users.find(user => user.email === email);
    }
    
    async createUser(user: InsertUser): Promise<User> {
      const newUser: User = {
        id: this.userIdCounter++,
        ...user,
        role: user.role || 'customer', // Ensure role is always set
        createdAt: new Date()
      };
      this.users.push(newUser);
      return newUser;
    }
    
    async updateUser(id: number, userUpdate: Partial<InsertUser>): Promise<User | undefined> {
      const index = this.users.findIndex(user => user.id === id);
      if (index === -1) return undefined;
      
      const updatedUser = {
        ...this.users[index],
        ...userUpdate
      };
      
      this.users[index] = updatedUser;
      return updatedUser;
    }
    
    async deleteUser(id: number): Promise<boolean> {
      const initialLength = this.users.length;
      this.users = this.users.filter(user => user.id !== id);
      return initialLength !== this.users.length;
    }
    
    // Product methods
    async getProducts(limit = 10, offset = 0): Promise<Product[]> {
      return this.products.slice(offset, offset + limit);
    }
    
    async getProduct(id: number): Promise<Product | undefined> {
      return this.products.find(product => product.id === id);
    }
    
    async createProduct(product: InsertProduct): Promise<Product> {
      const newProduct: Product = {
        id: this.productIdCounter++,
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.products.push(newProduct);
      return newProduct;
    }
    
    async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
      const index = this.products.findIndex(product => product.id === id);
      if (index === -1) return undefined;
      
      const updatedProduct = {
        ...this.products[index],
        ...productUpdate,
        updatedAt: new Date()
      };
      
      this.products[index] = updatedProduct;
      return updatedProduct;
    }
    
    async deleteProduct(id: number): Promise<boolean> {
      const initialLength = this.products.length;
      this.products = this.products.filter(product => product.id !== id);
      return initialLength !== this.products.length;
    }
    
    // Cart methods
    async getCart(userId: number): Promise<Cart | undefined> {
      return this.carts.find(cart => cart.userId === userId);
    }
    
    async createCart(cart: InsertCart): Promise<Cart> {
      const newCart: Cart = {
        id: this.cartIdCounter++,
        ...cart,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.carts.push(newCart);
      return newCart;
    }
    
    // Cart item methods
    async getCartItems(cartId: number): Promise<CartItem[]> {
      return this.cartItems.filter(item => item.cartId === cartId);
    }
    
    async getCartItem(id: number): Promise<CartItem | undefined> {
      return this.cartItems.find(item => item.id === id);
    }
    
    async addCartItem(item: InsertCartItem): Promise<CartItem> {
      const newCartItem: CartItem = {
        id: this.cartItemIdCounter++,
        ...item,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.cartItems.push(newCartItem);
      return newCartItem;
    }
    
    async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
      const index = this.cartItems.findIndex(item => item.id === id);
      if (index === -1) return undefined;
      
      const updatedItem = {
        ...this.cartItems[index],
        quantity,
        updatedAt: new Date()
      };
      
      this.cartItems[index] = updatedItem;
      return updatedItem;
    }
    
    async removeCartItem(id: number): Promise<boolean> {
      const initialLength = this.cartItems.length;
      this.cartItems = this.cartItems.filter(item => item.id !== id);
      return initialLength !== this.cartItems.length;
    }
    
    // Order methods
    async getOrders(userId?: number, limit = 10, offset = 0): Promise<Order[]> {
      let filteredOrders = this.orders;
      if (userId !== undefined) {
        filteredOrders = filteredOrders.filter(order => order.userId === userId);
      }
      return filteredOrders.slice(offset, offset + limit);
    }
    
    async getOrder(id: number): Promise<Order | undefined> {
      return this.orders.find(order => order.id === id);
    }
    
    async createOrder(order: InsertOrder): Promise<Order> {
      const newOrder: Order = {
        id: this.orderIdCounter++,
        ...order,
        createdAt: new Date(),
        updatedAt: new Date(),
        paidAt: order.isPaid ? new Date() : null
      };
      this.orders.push(newOrder);
      return newOrder;
    }
    
    async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
      const index = this.orders.findIndex(order => order.id === id);
      if (index === -1) return undefined;
      
      const updatedOrder = {
        ...this.orders[index],
        status,
        updatedAt: new Date()
      };
      
      this.orders[index] = updatedOrder;
      return updatedOrder;
    }
    
    // Order item methods
    async getOrderItems(orderId: number): Promise<OrderItem[]> {
      return this.orderItems.filter(item => item.orderId === orderId);
    }
    
    async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
      const newOrderItem: OrderItem = {
        id: this.orderItemIdCounter++,
        ...item,
        createdAt: new Date()
      };
      this.orderItems.push(newOrderItem);
      return newOrderItem;
    }
  }
  
  // PostgreSQL storage implementation using Prisma
  export class PostgresStorage implements IStorage {
    private prisma: PrismaClient;
    
    constructor() {
      this.prisma = new PrismaClient();
    }
    
    // User methods
    // User methods
    async getUsers(limit = 10, offset = 0): Promise<User[]> {
      return this.prisma.user.findMany({
        take: limit,
        skip: offset
      });
    }
    
    async getUser(id: number): Promise<User | undefined> {
      return this.prisma.user.findUnique({
        where: { id }
      });
    }
    
    async getUserByEmail(email: string): Promise<User | undefined> {
      return this.prisma.user.findUnique({
        where: { email }
      });
    }
    
    async createUser(user: InsertUser): Promise<User> {
      const userData = {
        ...user,
        role: user.role || 'customer'
      };
      console.log('PostgreSQL - Creating user with data:', { ...userData, password: '[REDACTED]' });
      return this.prisma.user.create({
        data: userData
      });
    }
    
    async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
      return this.prisma.user.update({
        where: { id },
        data: user
      });
    }
    
    async deleteUser(id: number): Promise<boolean> {
      try {
        await this.prisma.user.delete({
          where: { id }
        });
        return true;
      } catch {
        return false;
      }
    }
    
    // Product methods
    async getProducts(limit = 10, offset = 0): Promise<Product[]> {
      return this.prisma.product.findMany({
        take: limit,
        skip: offset
      });
    }
    
    async getProduct(id: number): Promise<Product | undefined> {
      return this.prisma.product.findUnique({
        where: { id }
      });
    }
    
    async createProduct(product: InsertProduct): Promise<Product> {
      return this.prisma.product.create({
        data: product
      });
    }
    
    async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
      return this.prisma.product.update({
        where: { id },
        data: product
      });
    }
    
    async deleteProduct(id: number): Promise<boolean> {
      try {
        await this.prisma.product.delete({
          where: { id }
        });
        return true;
      } catch {
        return false;
      }
    }
    
    // Cart methods
    // Cart methods
    async getCart(userId: number): Promise<Cart | undefined> {
      return this.prisma.cart.findFirst({
        where: { userId }
      });
    }
    
    async createCart(cart: InsertCart): Promise<Cart> {
      return this.prisma.cart.create({
        data: cart
      });
    }
    
    // Cart item methods
    // Cart item methods
    async getCartItems(cartId: number): Promise<CartItem[]> {
      return this.prisma.cartItem.findMany({
        where: { cartId }
      });
    }
    
    async getCartItem(id: number): Promise<CartItem | undefined> {
      return this.prisma.cartItem.findUnique({
        where: { id }
      });
    }
    
    async addCartItem(item: InsertCartItem): Promise<CartItem> {
      return this.prisma.cartItem.create({
        data: item
      });
    }
    
    async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
      return this.prisma.cartItem.update({
        where: { id },
        data: { 
          quantity,
          updatedAt: new Date()
        }
      });
    }
    
    async removeCartItem(id: number): Promise<boolean> {
      try {
        await this.prisma.cartItem.delete({
          where: { id }
        });
        return true;
      } catch {
        return false;
      }
    }
    
    // Order methods
    // Order methods
    async getOrders(userId?: number, limit = 10, offset = 0): Promise<Order[]> {
      return this.prisma.order.findMany({
        where: userId ? { userId } : undefined,
        take: limit,
        skip: offset
      });
    }
    
    async getOrder(id: number): Promise<Order | undefined> {
      return this.prisma.order.findUnique({
        where: { id }
      });
    }
    
    async createOrder(order: InsertOrder): Promise<Order> {
      return this.prisma.order.create({
        data: order
      });
    }
    
    async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
      return this.prisma.order.update({
        where: { id },
        data: { 
          status,
          updatedAt: new Date()
        }
      });
    }
    
    // Order item methods
    async getOrderItems(orderId: number): Promise<OrderItem[]> {
      return this.prisma.orderItem.findMany({
        where: { orderId }
      });
    }
    
    async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
      return this.prisma.orderItem.create({
        data: item
      });
    }
  }
  
  // Create storage instance based on environment
  const isUsingDatabase = process.env.DATABASE_URL !== undefined;
  export const storage: IStorage = isUsingDatabase 
    ? new PostgresStorage() 
    : new MemStorage();