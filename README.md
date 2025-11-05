# Locals Only V2

A full-stack Airbnb Experiences clone built with Next.js, React, TypeScript, Prisma, and Vercel Postgres.

## 🚀 Tech Stack

- **Frontend**: Next.js (App Router) + React + TypeScript + styled-components
- **Backend**: Next.js API Routes
- **Database**: Vercel Postgres (PostgreSQL)
- **ORM**: Prisma
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or Vercel Postgres)
- Yarn package manager (or npm)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Set Up Database

1. Create a `.env` file in the root directory:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
```

For Vercel Postgres, use the connection string provided in your Vercel dashboard.

### 3. Initialize Prisma

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
  app/
    api/
      experiences/
        route.ts         # GET + POST endpoints
      experiences/[id]/
        route.ts         # GET + PUT + DELETE endpoints
    experiences/
      page.tsx           # Experiences listing page
      [id]/page.tsx      # Experience detail page
  components/
    ExperienceCard.tsx   # Reusable experience card component
  hooks/
    useExperiencesQuery.ts  # React Query hook for experiences
  lib/
    prisma.ts            # Prisma client singleton
    apiClient.ts         # Axios client configuration
  styles/
    globalStyles.ts      # Global styled-components styles
  types/
    experience.ts        # TypeScript types
  utils/
    formatters.ts        # Utility functions

prisma/
  schema.prisma          # Prisma schema definition
  seed.ts                # Database seed script
```

## 🎯 Features

- ✅ List all experiences
- ✅ View experience details
- ✅ Create new experiences (API endpoint)
- ✅ Update experiences (API endpoint)
- ✅ Delete experiences (API endpoint)
- ✅ Server-side rendering (SSR)
- ✅ React Query for state management
- ✅ Responsive design with styled-components
- ✅ Type-safe with TypeScript

## 📝 API Endpoints

- `GET /api/experiences` - Get all experiences
- `POST /api/experiences` - Create a new experience
- `GET /api/experiences/[id]` - Get a specific experience
- `PUT /api/experiences/[id]` - Update an experience
- `DELETE /api/experiences/[id]` - Delete an experience

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your `DATABASE_URL` environment variable in Vercel dashboard
4. Vercel will automatically deploy your app

After deployment, run:
```bash
npm run db:push
npm run db:seed
```

## 📄 License

MIT
