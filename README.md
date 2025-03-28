# Bela SaaS Platform

A modern SaaS platform built with React, Express, and TypeScript, featuring authentication, product management, and a responsive UI using Shadcn/UI components.

## 🚀 Features

- **Authentication System**: Complete user authentication with role-based access control
- **Product Management**: Product listing, details, and cart functionality
- **Responsive Design**: Mobile-first approach with modern UI components
- **Admin Dashboard**: Dedicated admin interface for platform management
- **Real-time Updates**: Using WebSocket for live data updates
- **Database Integration**: PostgreSQL with Prisma ORM
- **Type Safety**: Full TypeScript support throughout the application

## 🛠️ Tech Stack

- **Frontend**:
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn/UI Components
  - Framer Motion
  - React Query
  - Wouter (Router)
- **Backend**:
  - Express.js
  - TypeScript
  - PostgreSQL
  - Prisma ORM
  - Passport.js
  - WebSocket

## 📦 Project Structure

```
Bela-Saas/
├── client/            # Frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   └── pages/      # Application pages
├── server/            # Backend application
│   ├── auth/          # Authentication logic
│   ├── routes/        # API routes
│   └── storage/       # Database operations
├── shared/            # Shared types and schemas
├── prisma/            # Prisma schema and migrations
└── migrations/        # Legacy database migrations
```

## 🚀 Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd Bela-Saas
```

2. **Install dependencies**

```bash
yarn install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL=your_database_url
SESSION_SECRET=your_session_secret
```

4. **Run database migrations**

```bash
yarn db:push
```

5. **Start development server**

```bash
yarn dev
```

## 🔑 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build production bundle
- `yarn start` - Start production server
- `yarn check` - Run TypeScript type checking
- `yarn db:push` - Push database schema changes
- `yarn prisma:generate` - Generate Prisma client
- `yarn prisma:studio` - Open Prisma Studio for database management
- `yarn seed` - Seed the database with test users

## 🔒 Authentication

The application uses session-based authentication with Passport.js. User roles include:
- `customer` - Regular user access
- `admin` - Administrative access

## 📚 API Routes

### Auth Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Product Routes
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart Routes
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove cart item

## 🎨 UI Components

The application uses Shadcn/UI components with custom styling. Key components include:
- Button
- Card
- Dialog
- Form
- Navigation
- Toast notifications

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔐 Security

- CSRF protection
- Session management
- Password hashing with bcrypt
- Input validation with Zod
- SQL injection prevention with Prisma ORM

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.