# HRD EventHub — Technology Overview

This document summarizes the key technologies used in the HRD EventHub UI project and how they fit together.

## Core Framework
- **Next.js 16 (App Router)** — Server‑rendered React framework used for routing, layouts, API routes, and build tooling. The app is organized under `app/` with nested route groups such as `(auth)` and `(root)`.
- **React 19** — Core UI library powering all components and state management.
- **TypeScript** — Static typing across the codebase for safer refactors and better IDE support.

## Authentication
- **NextAuth.js v4** — Authentication framework for Next.js. The custom credentials provider is wired in `libs/auth.ts`, and API routes are served from `app/api/auth/[...nextauth]/route.ts`.

## Styling & UI
- **Tailwind CSS v4** — Utility‑first CSS framework used for layout and design.
- **Shadcn UI / Radix UI** — Component primitives and design system utilities for consistent UI.
- **Class Variance Authority + Tailwind Merge** — Class composition helpers for reusable component variants.

## State Management
- **Zustand** — Lightweight state container used for auth flows (registration and reset password states).

## Animations & Icons
- **Framer Motion** — Animation library used for motion and layout transitions.
- **Lucide React / Font Awesome** — Icon sets for UI consistency.

## Tooling & Quality
- **ESLint (eslint-config-next)** — Linting and Next.js best practices.
- **Husky** — Git hooks to enforce checks before commits/pushes.

## Project Structure Highlights
- `app/` — Routes, layouts, metadata, and page components.
- `components/` — Reusable UI and feature components.
- `actions/`, `service/`, `libs/` — Data fetching, auth services, and helpers.
- `types/` — Shared TypeScript types and NextAuth module augmentation.

## Build & Runtime
- **Build**: `next build` for production bundles.
- **Dev**: `next dev` for local development.
- **Deployment**: Works on any platform that supports Next.js (Vercel recommended).




---------
- forbidden
- message : UNVERIFIED_EMAIL
```json
payload : {
    email : "penhseyha4879@gmail.com"
}
```