# React Performance Lab

Practical demonstrations of advanced React optimization techniques for production applications.

[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0+-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

## Overview

This project demonstrates production-grade React performance optimization patterns through interactive examples. The goal is to bridge the gap between theoretical knowledge and practical application—showing how architectural decisions at the component and state management level directly impact user experience.

Each pattern included here solves real problems encountered in scaling React applications. Rather than presenting isolated examples, the lab integrates these techniques into a cohesive application that feels complete and usable. This approach helps clarify not just *what* to optimize, but *why* and *when* each technique matters.

## Features

**List Virtualization** — Rendering 50,000 items in a virtualized list remains responsive because only DOM nodes in the visible viewport are mounted. Using react-window under the hood eliminates the traditional problem of initializing and diffing tens of thousands of elements. The performance difference becomes immediately obvious when you compare scrolling through a standard list versus a virtualized one at this scale.

**Concurrent Rendering** — Input fields paired with `startTransition` and `useDeferredValue` remain responsive even under heavy computational load. As you type, the UI updates instantly while React defers the expensive operation of filtering and rendering large result sets. This pattern prevents the common frustration where typing lags because the main thread is locked rendering updates.

**State Normalization** — A normalized store pattern achieves O(1) lookups and updates instead of O(n) traversal through nested object structures. The demo shows how denormalized state forces you to locate and update deeply nested values, while a flat, indexed structure allows direct access. For applications managing thousands of entities, this architectural choice becomes a performance multiplier.

**Core Web Vitals Panel** — A metrics dashboard displays Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and First Input Delay (FID) in real-time. These measurements directly reflect what users experience, making them invaluable for assessing whether optimizations actually improve perceived performance. The panel uses the Web Vitals API to capture metrics as they occur.

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Build | Vite 5+ | Sub-second HMR and optimized production builds outweigh Next.js overhead for this use case |
| Framework | React 19 | Access to latest APIs like `use()` and concurrent features without framework abstraction |
| Language | TypeScript 5+ | Full type safety for exploring patterns that are otherwise error-prone |
| Styling | Tailwind CSS 4 | Utility-first approach scales well and keeps styles colocated with component logic |
| Components | shadcn/ui | Accessible, unstyled components that integrate seamlessly with Tailwind |

## Getting Started

**Clone the repository**
```
git clone <repository-url>
cd react-perf-lab
```

**Install dependencies**
```
npm install
```

**Start the development server**
```
npm run dev
```

The application launches at `http://localhost:5173` with full HMR support.

**Build for production**
```
npm run build
```

## Project Structure

The `src/` folder is organized by concern:

- `src/components/` — Reusable UI components and layout containers
  - `code-panel.tsx` — Display code snippets with syntax highlighting for each optimization
  - `demo-card.tsx` — Wrapper component for each interactive demonstration
  - `ui/` — shadcn/ui components (button, badge, switch, tabs) with Tailwind styling
- `src/lib/` — Utilities and helpers
  - `utils.ts` — Shared functions for class name merging, data generation, and metric calculations
- `src/main.tsx` — React application entry point
- `src/App.tsx` — Root component orchestrating feature tabs and state

The `public/` folder contains static assets served as-is. All dynamic imports use Vite's module resolution.

## Key Decisions

**Vite over Next.js** — This project prioritizes developer experience and fast iteration over full-stack framework features. Vite provides sub-second HMR and straightforward configuration, whereas Next.js introduces abstraction layers that obscure how optimizations work. For a portfolio project focused on client-side patterns, Vite's simplicity is an advantage.

**Faker.js for data generation** — Rather than hardcoding sample data, `faker.js` generates realistic datasets on demand. This allows the virtualization and state normalization demos to work with meaningful volume (50,000+ items) without inflating the bundle size.

**Normalized state in a single component** — The state normalization demo implements a flat store structure within component state rather than using Redux or Zustand. This keeps focus on the pattern itself and avoids framework-specific boilerplate that would distract from the core concept.

**Tailwind CSS 4 with CSS Nesting** — The new CSS nesting support in Tailwind 4 eliminates the need for PostCSS plugins and reduces configuration friction. This keeps the build setup lean while maintaining production-grade styling.

**Web Vitals API integration** — Metrics are captured using the browser's native Web Vitals API rather than a third-party library. This demonstrates how to integrate performance monitoring without external dependencies, useful context for anyone building metrics into their own applications.
