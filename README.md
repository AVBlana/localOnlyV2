# Locals Only V2

A full-stack Airbnb Experiences clone built with Next.js, React, TypeScript, Prisma, and Vercel Postgres.

## 🚀 Tech Stack

- **Frontend**: Next.js (App Router) + React + TypeScript + styled-components
- **Backend**: Next.js API Routes
- **Database**: Vercel Postgres (PostgreSQL)
- **ORM**: Prisma
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Auth**: NextAuth.js (Google OAuth 2.0)

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

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
AUTH_SECRET="generate-a-random-string" # or NEXTAUTH_SECRET for backwards compatibility
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
```

For Vercel Postgres, use the connection string provided in your Vercel dashboard.

> Tip: You can generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`.

### 3. Set Up Google OAuth

1. Visit [Google Cloud Console](https://console.cloud.google.com/).
2. Create (or select) a project and enable **Google OAuth consent screen**.
3. Create OAuth credentials for a **Web application**.
4. Add `http://localhost:3000` as an authorized origin.
5. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.
6. Copy the Client ID and Client Secret into `.env`.

### 4. Initialize Prisma

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
- ✅ Google sign-in with host/client roles
- ✅ Hosts-only experience upload flow

## 👥 Roles

- **Clients**: default role after Google sign-in; browse and book experiences.
- **Hosts**: can upload, edit, and remove their own experiences.

Mark a user as a host by updating their `role` column to `HOST` in the database (the seed script creates `host@example.com` as the default host).

## 📝 API Endpoints

- `GET /api/experiences` - Get all experiences
- `POST /api/experiences` - Create a new experience
- `GET /api/experiences/[id]` - Get a specific experience
- `PUT /api/experiences/[id]` - Update an experience
- `DELETE /api/experiences/[id]` - Delete an experience
- `GET /api/auth/session` - Retrieve the active auth session (NextAuth)

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
