# Copilot Instructions for AMS Frontend

## Project Overview
This is the frontend for an Academic Management System (AMS) built with Next.js 16 (App Router). It serves teachers and students.
**CRITICAL:** This is a **pure frontend** application. It connects to a separate backend API.

## Self-Maintenance
**IMPORTANT:** When making major architectural changes, new feature implementations, or significant updates to the project structure, **automatically update this instruction file** to reflect those changes. Keep this document as the single source of truth for the project.

## Architecture & Boundaries
- **Frontend Only:** DO NOT create API routes (`app/api/...`) inside Next.js.
- **Backend Integration:**
  - Use the external API for all data operations.
  - If a required API endpoint is missing from documentation, **STOP** and ask the user for the request/response format. Do not mock or workaround without approval.
  - **API Response Format:** The backend returns responses in the format:
    ```typescript
    {
      status_code: number,
      message: string,
      data: { ...otherFields }
    }
    ```
- **Authentication:**
  - Implemented via `better-auth` client and custom `AuthContext`.
  - Reference: `lib/auth-client.ts` and `lib/auth-context.tsx`.
  - **Always use `useAuth()` hook** from `lib/auth-context.tsx` to access user data, session, and auth state.
  - For auth operations (signin, signout), use `authClient` from `lib/auth-client.ts`.
  - User type includes: `id`, `email`, `name`, `image`, `role`, `firstName`, `lastName`, `phone`, `gender`, `admissionNumber`, `admissionYear`, `candidateCode`, `department`, etc.

## Tech Stack & Conventions
- **Framework:** Next.js 16 (App Router), React 19.
- **Language:** TypeScript.
- **Styling:**
  - **Tailwind CSS v4:** Use `@theme` and CSS variables in `app/globals.css`.
  - **Shadcn UI:** Use for all UI components.
    - Location: `components/ui/`.
    - Add components via CLI or strictly following Shadcn patterns.
  - **Icons:** `lucide-react`.
  - **Animations:** `framer-motion` for advanced animations.
- **State/Forms:** `react-hook-form` with `zod` validation.
- **Date Utilities:** `date-fns` for date formatting and manipulation.
- **Theming:** `next-themes` for dark/light mode support.

## Coding Standards
1.  **Styling:**
    - Use `app/globals.css` for all color/theme variables (OKLCH format).
    - Use `cn()` helper from `@/lib/utils` for conditional class merging.
    - Example: `className={cn("bg-background text-foreground", className)}`.
    - Always ensure components support both light and dark modes using theme-aware Tailwind classes.
2.  **Components:**
    - Place reusable UI components in `components/ui`.
    - Place feature-specific components in `components/<feature>` (e.g., `components/student`, `components/dashboard`).
    - Ensure all components are responsive (mobile-first).
    - Use proper mobile breakpoints: `md:` for desktop, default for mobile.
3.  **Imports:**
    - Use path aliases defined in `tsconfig.json` / `components.json`:
      - `@/components` -> `components/`
      - `@/lib` -> `lib/`
      - `@/ui` -> `components/ui/`

## Project Structure
- **Routes:**
  - `/dashboard` - Main dashboard (role-based routing)
  - `/dashboard/(student)` - Student-specific dashboard
  - `/profile` - User profile page
  - `/signin` - Sign in page
  - `/onboarding` - User onboarding
- **Components:**
  - `components/ui/` - Shadcn UI components
  - `components/student/` - Student-specific components (greeting-header, attendance-overview, marks-overview, assignments-list, notifications-list)
  - `components/dashboard/` - Dashboard components (Dock navigation)
  - `components/appshell/` - Layout components (navbar, sidebar, profile)

## Student Dashboard Features
The student dashboard (`/dashboard/(student)`) includes:
1. **Greeting Header:** Time-based greeting with dynamic backgrounds (Good Morning, Good Noon, Good Afternoon, Good Evening, Good Night, Good Late Night)
2. **Attendance Overview:** Subject-wise attendance with color-coded warnings
3. **Marks Overview:** Academic performance with grades (A+, A, B+, B, C, F)
4. **Assignments List:** Shows assignments with deadlines and status badges
5. **Notifications List:** Teacher announcements with type indicators

All components are responsive with mobile-first design and support dark/light modes.

## Navigation
- **Desktop:** Animated dock at bottom with magnification effects (`components/dashboard/Dock.tsx`)
- **Mobile:** Fixed bottom navigation bar with icons and labels
- **Dock Items:** Home, Profile (with user avatar), Archive, Courses, Settings

## Critical Workflows
- **Dev Server:** `npm run dev` (runs on port 3232)
- **Linting:** `npm run lint`
- **Adding UI Components:** Prefer using existing Shadcn components in `components/ui`. If a new one is needed, ensure it matches the project's `new-york` style and `neutral` base color.

## "What to do if..."
- **API is missing:** "I cannot implement this feature because the backend API endpoint is not documented. Please provide the API endpoint path, method, request body, and response format."
- **Auth is needed:** Use `import { useAuth } from "@/lib/auth-context"` for user data and session. Use `import { authClient } from "@/lib/auth-client"` for auth operations.
