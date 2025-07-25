# Overview

This is a full-stack web application built with a React frontend and Express.js backend. The application uses TypeScript throughout and implements a modern tech stack with Shadcn/UI components, Drizzle ORM for database operations, and TanStack Query for state management. The project appears to be set up as a foundation for building web applications with user authentication capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Shadcn/UI component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for development and production builds

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (configured for Neon database)
- **ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: Hot reloading with tsx

## Project Structure
The application follows a monorepo structure with clear separation of concerns:
- `client/` - React frontend application
- `server/` - Express.js backend application
- `shared/` - Shared TypeScript types and database schema
- `migrations/` - Database migration files

# Key Components

## Database Schema
Located in `shared/schema.ts`, the application currently defines:
- **Users table**: Contains user authentication data (id, username, password)
- **Type safety**: Uses Drizzle-Zod for runtime validation
- **PostgreSQL features**: Utilizes UUID generation and proper indexing

## Storage Layer
The application implements an abstraction layer for data access:
- **Interface-based design**: `IStorage` interface defines CRUD operations
- **Memory implementation**: `MemStorage` class for development/testing
- **Database implementation**: Ready for Drizzle ORM integration
- **Methods**: User management (getUser, getUserByUsername, createUser)

## Frontend Components
- **UI Library**: Complete Shadcn/UI component set including forms, dialogs, tables, charts
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Accessibility**: Built-in accessibility features through Radix UI
- **Theme Support**: Dark/light mode with CSS custom properties

## API Client
- **HTTP Client**: Custom fetch wrapper with error handling
- **Authentication**: Cookie-based session management
- **Query Integration**: Seamless integration with TanStack Query
- **Error Handling**: Centralized error handling with toast notifications

# Data Flow

1. **Client Requests**: Frontend makes API calls through the query client
2. **Route Handling**: Express routes process requests and call storage methods
3. **Data Access**: Storage layer abstracts database operations
4. **Response**: JSON responses sent back to client
5. **State Updates**: TanStack Query manages client-side state and caching

## Authentication Flow
- Session-based authentication using PostgreSQL for session storage
- User credentials stored securely in the users table
- Session cookies for maintaining user state across requests

# External Dependencies

## Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **State Management**: TanStack Query for server state
- **UI Framework**: Radix UI primitives with Shadcn/UI wrapper
- **Styling**: Tailwind CSS with additional utilities
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date manipulation

## Backend Dependencies
- **Web Framework**: Express.js with TypeScript support
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Session Management**: express-session with connect-pg-simple
- **Development**: tsx for TypeScript execution, esbuild for production builds

## Development Tools
- **Build Tools**: Vite for frontend, esbuild for backend
- **Database Tools**: Drizzle Kit for migrations and introspection
- **Code Quality**: TypeScript for type safety
- **Replit Integration**: Custom plugins for Replit development environment

# Deployment Strategy

## Development
- **Frontend**: Vite dev server with hot module replacement
- **Backend**: tsx with automatic restart on file changes
- **Database**: Drizzle Kit for schema management and migrations
- **Environment**: Replit-optimized with custom plugins

## Production Build
- **Frontend**: Static build output to `dist/public`
- **Backend**: Single bundled file using esbuild
- **Database**: Production PostgreSQL with connection pooling
- **Serving**: Express serves both API and static frontend files

## Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **Session Configuration**: Secure session handling in production

The application is designed to be easily deployable on various platforms with minimal configuration changes, supporting both development and production environments effectively.