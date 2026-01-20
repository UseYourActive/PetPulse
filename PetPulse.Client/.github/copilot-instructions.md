# PetPulse Client - Copilot Instructions

## Project Overview

PetPulse is a veterinary management system web application built with **React 19**, **TypeScript**, **Vite**, and **Material-UI (MUI)**. This is the frontend client that manages pet owners, pets, veterinarians, and appointments.

### Tech Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite (using Rolldown)
- **UI Library**: Material-UI v7
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Styling**: Emotion (via MUI)
- **Linting**: ESLint 9 with TypeScript support

## Architecture

### Routing Structure
The application uses a **nested route layout pattern** defined in `src/App.tsx`:

```
/ (Layout wraps all child routes)
  ├── / (Home)
  ├── /owners (Owners Management)
  ├── /pets (Pets/Patient Records)
  ├── /vets (Veterinarians)
  └── /appointments (Appointments)
```

The `Layout` component (`src/layout/Layout.tsx`) provides the persistent navigation bar with Material-UI `AppBar` and `Toolbar`. All page content is rendered via `<Outlet />`, ensuring the navigation persists across route changes.

### Directory Structure
- `src/pages/` - Route page components (Home, Owners, Pets, Vets, Appointments)
- `src/layout/` - Layout wrapper component with persistent navigation
- `src/components/` - Reusable UI components (currently empty, populate as features develop)
- `src/hooks/` - Custom React hooks (currently empty, use for shared logic)
- `src/utils/` - Utility functions (currently empty, use for helpers and API interactions)
- `src/assets/` - Static assets

## Developer Workflows

### Development Server
```bash
npm run dev
```
Starts Vite dev server with hot module replacement (HMR) at `http://localhost:5173`. React Fast Refresh enabled for instant component updates.

### Production Build
```bash
npm run build
```
Runs TypeScript compilation (`tsc -b`) then Vite build. Outputs to `dist/` directory.

### Linting
```bash
npm run lint
```
Uses ESLint 9 with modern flat config. Current setup uses basic recommended rules; see README for upgrading to type-aware rules.

### Preview Built App
```bash
npm run preview
```
Previews the production build locally before deployment.

## Project-Specific Patterns & Conventions

### Component Structure
- **Functional Components**: All components are functional components using React Hooks
- **Default Exports**: Pages export as default (`export default function PageName()`)
- **MUI Integration**: Use MUI components (`Typography`, `Button`, `Container`, `Box`, `AppBar`, etc.) for consistent UI
- **Props Pattern**: Not yet established; follow functional component patterns when creating reusable components

### Data Flow (Planned)
- **HTTP Layer**: Use Axios (already installed) in `src/utils/` API client functions
- **State Management**: React Context or hooks pattern recommended; no centralized state management (Redux) currently
- **Service Pattern**: Create utility functions for backend calls rather than inline API logic

### Styling Approach
- **MUI theming**: Leverage MUI's `sx` prop for inline styling
- **Emotion**: Used implicitly via MUI; avoid direct Emotion usage unless necessary
- **Global Styles**: CSS files for global styling (`src/index.css`, `src/App.css`)

### TypeScript Practices
- Strict mode enabled (default Vite setup)
- Use interface-based typing for props
- Avoid `any` type
- Leverage React types: `React.FC`, `ReactNode`, etc.

### Navigation
- Use `useNavigate()` hook from React Router (see Layout component example)
- Links via `navigate()` calls, not `<a>` tags
- Maintain consistent navigation button naming in Layout

## Integration Points & Dependencies

### Backend Integration
The application is designed to communicate with a backend API (implied by pet management domain). When implementing API calls:
- Create API client functions in `src/utils/` (e.g., `src/utils/api.ts`)
- Export axios instance for centralized configuration (base URL, headers, interceptors)
- Use error handling and loading states consistently

### Material-UI Data Grid
`@mui/x-data-grid` is installed; use `<DataGrid />` for the pet/owner/vet tables expected in pages.

### React Router DOM
- Current version: 7.12.0 (latest)
- Uses modern relative route configurations
- Outlet pattern for nested layouts established in current codebase

## Critical Development Notes

1. **Page Path Mismatch**: Note in `App.tsx` that the import path is `Owner/Owners` but route is `/owners`—maintain consistency when adding new pages.

2. **Empty Scaffolding**: Components, hooks, and utils directories are empty scaffolds. Populate as features are implemented rather than pre-populating with boilerplate.

3. **TypeScript Config**: Two configs present—`tsconfig.app.json` (app code) and `tsconfig.node.json` (build config). Ensure imports resolve correctly.

4. **No Testing Framework**: Vitest or Jest not yet configured; add when TDD becomes necessary.

5. **Rolldown-Based Vite**: Project uses `rolldown-vite` (newer Vite variant with Rolldown bundler) for improved performance.

## Common Tasks

**Add a new page:**
1. Create component in `src/pages/PageName/PageName.tsx`
2. Import in `src/App.tsx`
3. Add `<Route>` in the Layout route group
4. Add navigation button in `src/layout/Layout.tsx`

**Add reusable component:**
1. Create in `src/components/ComponentName/ComponentName.tsx`
2. Export and import where needed
3. Use MUI components as base building blocks

**Add utility function:**
1. Create in `src/utils/` with descriptive filename
2. Export named functions
3. Document expected params and return types with TSDoc comments

