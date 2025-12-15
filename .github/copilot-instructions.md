# Next.js 16 + Tailwind v4 Project Instructions

## Project Overview
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Library**: React 19

## Architecture & Structure
- **App Router**: All routes are defined in the `app/` directory.
  - `app/page.tsx`: Home page.
  - `app/layout.tsx`: Root layout, includes font configuration and global styles.
  - `app/globals.css`: Global CSS, Tailwind v4 imports, and theme variables.
- **Fonts**: Uses `next/font` with Geist Sans and Geist Mono.
- **Configuration**:
  - `next.config.ts`: Next.js configuration.
  - `tsconfig.json`: TypeScript configuration (strict mode, path aliases `@/*`).
  - `eslint.config.mjs`: ESLint configuration.

## Development Workflow
- **Run Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`

## Coding Conventions

### React & Next.js
- **Server Components**: Default to Server Components. Use `"use client"` only when necessary (state, effects, event listeners).
- **Metadata**: Define metadata in `layout.tsx` or `page.tsx` using the `Metadata` API.
- **Fonts**: Use CSS variables for fonts defined in `app/layout.tsx` (e.g., `var(--font-geist-sans)`).

### Styling (Tailwind CSS v4)
- **Import**: Tailwind is imported via `@import "tailwindcss";` in `app/globals.css`.
- **Theming**: Use CSS variables for theme colors (e.g., `--background`, `--foreground`) and map them in `@theme` block if needed.
- **Dark Mode**: Implemented via media query `@media (prefers-color-scheme: dark)` in `app/globals.css`.

### TypeScript
- **Strict Mode**: Enabled. Ensure all types are explicitly defined.
- **Path Aliases**: Use `@/` to import from the root directory.

## Key Files
- [app/layout.tsx](app/layout.tsx): Root layout structure.
- [app/globals.css](app/globals.css): Tailwind setup and global styles.
- [next.config.ts](next.config.ts): Next.js config.
