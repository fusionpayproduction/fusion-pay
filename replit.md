# Overview

FusionPay is a modern payment gateway application built with a React frontend and Express.js backend. The application provides a complete payment processing solution with UPI integration, admin dashboard, and a responsive user interface. It features a fintech-focused design system with dark/light theme support and glassmorphism UI elements.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Routing**: React Router for client-side navigation
- **Animation**: Framer Motion for smooth animations and transitions
- **Theme System**: Custom theme provider supporting dark/light modes with system preference detection

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **Development**: TSX for TypeScript execution, hot reload via Vite integration

## Data Storage
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Schema Management**: Drizzle migrations in `./migrations` directory
- **Connection**: Neon serverless PostgreSQL via `@neondatabase/serverless`
- **Fallback Storage**: In-memory storage implementation for development/testing

## Authentication & Authorization
- **Session Management**: Express sessions with PostgreSQL storage
- **User Schema**: Username/password authentication with unique constraints
- **Admin Access**: Role-based access control for administrative functions

## Design System
- **Component Library**: Comprehensive shadcn/ui components with Radix primitives
- **Color System**: HSL-based color variables for consistent theming
- **Typography**: Tailwind typography with custom font configurations
- **Responsive Design**: Mobile-first approach with glassmorphism effects
- **Accessibility**: Radix UI ensures ARIA compliance and keyboard navigation

## Development Workflow
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Development Server**: Integrated Vite dev server with HMR
- **Type Safety**: Strict TypeScript configuration across frontend and backend
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)

# External Dependencies

## Core Frontend Dependencies
- **React Ecosystem**: React 18 with TypeScript, React Router, React Query
- **UI Components**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Animation**: Framer Motion, Embla Carousel
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

## Backend Dependencies
- **Server Framework**: Express.js with TypeScript support
- **Database**: Drizzle ORM, @neondatabase/serverless, PostgreSQL
- **Session Management**: express-session, connect-pg-simple
- **Validation**: Zod schema validation, drizzle-zod integration
- **Development Tools**: tsx for TypeScript execution, nanoid for ID generation

## Development Tools
- **Build Tools**: Vite, esbuild, PostCSS with Autoprefixer
- **TypeScript**: Strict configuration with path mapping
- **Linting & Formatting**: ESLint configuration (implied by shadcn/ui setup)
- **Replit Integration**: @replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer

## Third-Party Services
- **Database Hosting**: Neon PostgreSQL serverless platform
- **Development Environment**: Replit with custom plugin integration
- **Payment Processing**: UPI payment integration (implementation pending)
- **Deployment**: Production build optimized for Node.js environments