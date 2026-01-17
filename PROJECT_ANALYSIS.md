# Project Analysis Report: Locals Only V2

## 📋 Project Overview

**Project Name:** Locals Only V2  
**Type:** Full-stack Airbnb Experiences clone  
**Tech Stack:**
- **Frontend:** Next.js 16.1 (App Router), React 19, TypeScript, styled-components
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (via Prisma)
- **ORM:** Prisma 6.19
- **State Management:** TanStack React Query (v5)
- **Authentication:** NextAuth.js v5 (Google OAuth)
- **Virtualization:** @tanstack/react-virtual
- **HTTP Client:** Axios

## 🎯 Project Purpose

A marketplace platform where:
- **Clients** can browse and book local experiences
- **Hosts** can create, edit, and delete their own experiences
- Features infinite scroll pagination with virtualization
- Supports dark/light theme toggle
- Server-side rendering with React Query for client-side state management

## ✅ ACTIVE FILES (Currently Used)

### App Routes
- ✅ `src/app/layout.tsx` - Root layout with providers
- ✅ `src/app/page.tsx` - Home page
- ✅ `src/app/providers.tsx` - React Query, NextAuth, Theme providers
- ✅ `src/app/experiences/page.tsx` - Experiences listing page
- ✅ `src/app/experiences/[id]/page.tsx` - Experience detail page
- ✅ `src/app/experiences/new/page.tsx` - Create experience page (hosts only)

### API Routes
- ✅ `src/app/api/auth/[...nextauth]/route.ts` - NextAuth handlers
- ✅ `src/app/api/experiences/route.ts` - GET (list with pagination) & POST
- ✅ `src/app/api/experiences/[id]/route.ts` - GET, PUT, DELETE

### Components
- ✅ `src/components/ExperienceCard.tsx` - Card component for experience grid
- ✅ `src/components/ExperienceGrid.tsx` - **ACTIVE** - Virtualized grid component (in use)
- ✅ `src/components/ExperienceDetailContent.tsx` - Detail view component
- ✅ `src/components/ExperienceForm.tsx` - Create/edit experience form
- ✅ `src/components/AuthButton.tsx` - Sign in/out button
- ✅ `src/components/ThemeToggle.tsx` - Dark/light theme toggle
- ✅ `src/components/UploadExperienceButton.tsx` - Button to navigate to create page

### Hooks
- ✅ `src/hooks/useExperiencesQuery.ts` - React Query hook for infinite scroll

### Libraries
- ✅ `src/lib/auth.ts` - NextAuth configuration
- ✅ `src/lib/prisma.ts` - Prisma client singleton
- ✅ `src/lib/apiClient.ts` - Axios client configuration
- ✅ `src/lib/styled-components-registry.tsx` - SSR support for styled-components

### Styles
- ✅ `src/styles/theme.ts` - Theme configuration (light/dark)
- ✅ `src/styles/globalStyles.ts` - Global styled-components styles
- ✅ `src/styles/styled.d.ts` - TypeScript declarations for styled-components

### Types
- ✅ `src/types/experience.ts` - Experience interface
- ✅ `src/types/next-auth.d.ts` - NextAuth type extensions

### Utils
- ✅ `src/utils/formatters.ts` - Price, rating, date formatters

### Database
- ✅ `prisma/schema.prisma` - Database schema
- ✅ `prisma/seed.ts` - Database seeding script

### Public Assets (Used)
- ✅ `public/localsOnlyLogoV4.7Tryangle.png` - **IN USE** - Logo referenced in:
  - `src/app/page.tsx`
  - `src/app/experiences/page.tsx`

### Configuration
- ✅ `package.json` - Dependencies and scripts
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `next.config.ts` - Next.js configuration
- ✅ `eslint.config.mjs` - ESLint configuration
- ✅ `next-env.d.ts` - Next.js TypeScript definitions
- ✅ `README.md` - Project documentation

---

## ❌ UNUSED FILES (Can Be Removed)

### Components
1. **`src/components/VirtualizedExperienceGrid.tsx`** 
   - **Status:** NOT USED
   - **Reason:** Duplicate implementation. `ExperienceGrid.tsx` is the active component used in `src/app/experiences/page.tsx`
   - **Action:** Safe to delete (or keep if you plan to switch implementations)

### Styles (Not Imported)
2. **`src/app/page.module.css`**
   - **Status:** NOT USED
   - **Reason:** Project uses styled-components, not CSS modules
   - **Action:** Safe to delete

3. **`src/app/globals.css`**
   - **Status:** NOT USED
   - **Reason:** Project uses styled-components global styles (`src/styles/globalStyles.ts`) instead
   - **Action:** Safe to delete

### Public Assets (Unused SVG Files)
4. **`public/file.svg`**
   - **Status:** NOT REFERENCED
   - **Action:** Safe to delete

5. **`public/globe.svg`**
   - **Status:** NOT REFERENCED
   - **Action:** Safe to delete

6. **`public/next.svg`**
   - **Status:** NOT REFERENCED (default Next.js file)
   - **Action:** Safe to delete

7. **`public/vercel.svg`**
   - **Status:** NOT REFERENCED (default Vercel file)
   - **Action:** Safe to delete

8. **`public/window.svg`**
   - **Status:** NOT REFERENCED
   - **Action:** Safe to delete

---

## 📊 File Usage Summary

### Total Source Files: 28
- **Active:** 25 files
- **Unused:** 3 files (components: 1, styles: 2)

### Total Public Assets: 6
- **Used:** 1 file (logo PNG)
- **Unused:** 5 files (SVG files)

### Key Findings:

1. **Two Grid Implementations:**
   - `ExperienceGrid.tsx` is actively used in the experiences page
   - `VirtualizedExperienceGrid.tsx` appears to be an older/unused implementation
   - Both use `@tanstack/react-virtual` but have different approaches

2. **Style System:**
   - Project uses **styled-components** exclusively
   - CSS module files (`page.module.css`) are leftover from Next.js template
   - `globals.css` is not imported (styling handled by `globalStyles.ts`)

3. **Public Assets:**
   - Only the logo PNG is actively used
   - All SVG files are default Next.js/Vercel template files and can be removed

---

## 🔍 Import Dependency Graph

### Main Entry Point
```
app/layout.tsx
├── lib/styled-components-registry.tsx
└── app/providers.tsx
    ├── styles/globalStyles.ts
    ├── styles/theme.ts
    └── (provides: React Query, NextAuth, Theme)
```

### Pages
```
app/page.tsx
└── (uses logo image)

app/experiences/page.tsx
├── components/ThemeToggle.tsx
├── components/AuthButton.tsx
├── components/UploadExperienceButton.tsx
├── hooks/useExperiencesQuery.ts
└── components/ExperienceGrid.tsx
    └── components/ExperienceCard.tsx
        └── utils/formatters.ts

app/experiences/[id]/page.tsx
└── components/ExperienceDetailContent.tsx
    └── utils/formatters.ts

app/experiences/new/page.tsx
├── lib/auth.ts
└── components/ExperienceForm.tsx
    └── lib/apiClient.ts
```

### API Routes
```
api/auth/[...nextauth]/route.ts
└── lib/auth.ts
    └── lib/prisma.ts

api/experiences/route.ts
├── lib/auth.ts
└── lib/prisma.ts

api/experiences/[id]/route.ts
├── lib/auth.ts
└── lib/prisma.ts
```

---

## 🎯 Recommendations

### Immediate Actions:
1. **Remove unused component:** `VirtualizedExperienceGrid.tsx` (or decide which grid implementation to keep)
2. **Remove unused styles:** `page.module.css` and `globals.css`
3. **Clean up public folder:** Remove unused SVG files

### Future Considerations:
- Both grid components implement virtualization; consider consolidating if `VirtualizedExperienceGrid` has features you want
- The project is well-structured with clear separation of concerns
- All type definitions are properly utilized

---

## 📈 Project Health: ✅ EXCELLENT

- No dead code (except noted unused files)
- Clear component structure
- Proper TypeScript usage
- Consistent styling approach (styled-components)
- Well-organized file structure
- All dependencies are actively used

---

*Generated: $(date)*
