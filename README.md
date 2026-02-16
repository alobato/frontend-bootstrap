# Frontend Bootstrap (Vite + React Router + Apollo + shadcn + Tailwind v4)

A production-ready frontend bootstrap for admin-style systems using GraphQL.

This template includes:
- Authentication flow (`login`, `logout`, `me`) with cookie-based session (`credentials: include`)
- Protected admin routes with role check (`admin`)
- CRUD examples for `Authors`, `Books`, `Categories`, and `Publishers`
- Reusable UI primitives (shadcn) and consistent loading/error/empty states

## 1. Architecture Overview

### Stack
- `Vite` + `React` + `TypeScript`
- `React Router` for route structure and protected flows
- `Apollo Client` for GraphQL queries/mutations/cache
- `Tailwind v4` + `shadcn/ui`
- `Sonner` for toasts

### High-level layers
- `src/apollo`: Apollo client setup
- `src/contexts`: auth/session logic
- `src/router`: route tree and guards
- `src/layouts`: app shells (root/admin)
- `src/pages`: route pages (auth + admin screens)
- `src/graphql`: GraphQL operations
- `src/components`: reusable UI and admin helpers
- `src/types`: GraphQL DTO types used by the UI

## 2. Important Files

### App bootstrap
- `src/main.tsx`
  - Wraps app with `ApolloProvider` and `AuthProvider`
- `src/App.tsx`
  - Applies theme provider and router provider

### Apollo and API
- `src/apollo/client.ts`
  - GraphQL endpoint config
  - `credentials: "include"`
  - Uses `VITE_GRAPHQL_URI` (or fallback to `VITE_API_URL/graphql`)

### Auth
- `src/contexts/AuthContext.tsx`
  - Central auth state (`user`, `isAuthenticated`, `isAdmin`)
  - `login`, `logout`, startup session loading via `me`

### Routing
- `src/router/routes.tsx`
  - Full route tree
  - `/login` (public) and `/admin/*` (protected)
- `src/router/ProtectedRoute.tsx`
  - Auth + admin-role guard
- `src/router/NotLoggedRoute.tsx`
  - Redirects logged users away from login page

### Layouts
- `src/layouts/RootLayout.tsx`
  - Route outlet + toaster
- `src/layouts/AdminLayout.tsx`
  - Admin navigation, theme switcher, logout

### GraphQL operations
- `src/graphql/queries.ts`
  - `me`, `ping`, `authors`, `books`, `categories`, `publishers`
- `src/graphql/mutations.ts`
  - login/logout + create/update for all core entities

### Admin pages
- `src/pages/admin/Dashboard.tsx`
- `src/pages/admin/Authors.tsx`
- `src/pages/admin/Books.tsx`
- `src/pages/admin/Categories.tsx`
- `src/pages/admin/Publishers.tsx`

### Shared UI helpers
- `src/components/admin/states.tsx`
  - Reusable `Loading`, `Error`, and `Empty` cards
- `src/lib/format.ts`
  - Date formatting helper

### Dev server setup
- `vite.config.ts`
  - Dev server pinned to `http://localhost:3000` (`strictPort: true`)

## 3. What You Must Change After Cloning

## 3.1 Environment variables
Create/update `.env`:

```bash
VITE_API_URL=http://localhost:8000
# Optional (preferred for explicitness):
VITE_GRAPHQL_URI=http://localhost:8000/graphql
```

If your backend runs elsewhere, update these values.

## 3.2 Backend schema alignment
If your backend schema differs from this bootstrap:
1. Update operations in `src/graphql/queries.ts` and `src/graphql/mutations.ts`
2. Update DTOs in `src/types/graphql.ts`
3. Adjust forms and list rendering in affected admin pages

## 3.3 Auth behavior
If your backend auth contract changes:
- Update `src/contexts/AuthContext.tsx`
- Update role conditions in `src/router/ProtectedRoute.tsx`
- Ensure cookie/token strategy matches backend expectations

## 3.4 Navigation
Update admin menu links in:
- `src/layouts/AdminLayout.tsx`

## 3.5 Branding / design tokens
- Global design tokens are in `src/index.css`
- Theme behavior is in `src/components/theme-provider.tsx`

## 4. How to Add a New Screen (Step by Step)

Use this exact workflow for consistency.

1. Define GraphQL operations
- Add query/mutation in `src/graphql/queries.ts` or `src/graphql/mutations.ts`
- Add required types/interfaces in `src/types/graphql.ts`

2. Create the page component
- Add new file under `src/pages/admin/<Feature>.tsx`
- Implement query with loading/error/empty states
- Reuse `QueryLoadingCard`, `QueryErrorCard`, `EmptyStateCard`

3. Add route
- Register route in `src/router/routes.tsx` under `/admin`

4. Add sidebar navigation item
- Add menu entry in `src/layouts/AdminLayout.tsx`

5. Add form behavior (if CRUD)
- Use `useMutation`
- Show success/error feedback with `toast`
- Refetch data or update cache after mutation

6. Verify
- Run `pnpm build`
- Run `pnpm dev` and manually test:
  - unauthenticated access
  - authenticated admin flow
  - mutation success/error

## 5. Recommended Conventions for New Screens

- Keep one screen per file in `src/pages/admin`
- Keep API operations centralized in `src/graphql/*`
- Keep UI state messages in English
- Prefer shadcn components over custom raw HTML controls
- Always implement:
  - loading state
  - error state with retry
  - empty state
  - success/error toasts on mutation

## 6. Best Prompt Templates for Codex or Cursor

Use one of these prompts directly.

### 6.1 Prompt for creating a full new admin screen

```text
You are working in a Vite + React + TypeScript + React Router + Apollo + shadcn + Tailwind v4 project.

Create a new admin screen called <FeatureName>.

Requirements:
1) Add GraphQL operations in src/graphql/queries.ts and src/graphql/mutations.ts.
2) Add/update TypeScript interfaces in src/types/graphql.ts.
3) Create page file at src/pages/admin/<FeatureName>.tsx with:
   - useQuery/useMutation
   - loading, error, and empty states using src/components/admin/states.tsx
   - form + list using shadcn components
   - toasts for mutation success/error
4) Register route under /admin in src/router/routes.tsx.
5) Add sidebar menu item in src/layouts/AdminLayout.tsx.
6) Keep all user-facing text in English.
7) Run pnpm build and fix all TypeScript errors.

Backend schema for this feature:
<paste queries, mutations, inputs, and types here>
```

### 6.2 Prompt for adapting existing screen to a new backend schema

```text
Update the existing admin screen <FeatureName> to match this new GraphQL schema.

Do the following:
1) Update GraphQL operations in src/graphql/queries.ts and src/graphql/mutations.ts.
2) Update relevant types in src/types/graphql.ts.
3) Refactor src/pages/admin/<FeatureName>.tsx to use the new fields and variables.
4) Preserve shadcn UI patterns and loading/error/empty states.
5) Keep strings in English.
6) Run pnpm build and fix all issues.

New schema:
<paste schema>
```

### 6.3 Prompt for adding a read-only screen fast

```text
Create a read-only admin screen <FeatureName> that lists data from GraphQL.

Use:
- query in src/graphql/queries.ts
- typed response in src/types/graphql.ts
- page at src/pages/admin/<FeatureName>.tsx
- loading/error/empty states from src/components/admin/states.tsx
- route + sidebar item

Do not add mutations. Keep UI in shadcn style and text in English. Run pnpm build at the end.
```

## 7. Suggested Next Improvements

- Add GraphQL Code Generator for strongly typed operations/hooks
- Add table abstraction for repeated list patterns
- Add route-level code splitting for smaller initial bundle
- Add automated tests for auth guard and admin CRUD flows

## 8. Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

---
If you keep the structure above, new screens stay predictable, typed, and easy to maintain.
