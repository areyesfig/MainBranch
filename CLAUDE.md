# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Main Branch** is a technology release aggregator built with Next.js 16 (App Router). It collects releases from 28+ tech sources (RSS feeds and GitHub/API endpoints), transforms and validates them, persists to Neon Postgres via Prisma, and renders them with React Server Components.

## Commands

```bash
npm run dev          # Dev server at localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest in watch mode
npm run test:run     # Vitest single run
npm run db:seed      # Seed DB with mock data
npm run db:sync      # Trigger /api/sync locally
npx prisma migrate dev   # Create/apply migrations
npx prisma studio        # DB GUI
```

To run a single test file: `npx vitest run path/to/file.test.ts`

To trigger sync for a single source: `curl "http://localhost:3000/api/sync?source=nextjs-blog"`

## Architecture

### Data Pipeline

```
[RSS/API Sources] → Fetchers → Transformers → Zod Validators → Prisma/Postgres → Server Components
```

- **Sources config**: `lib/sources/config.ts` — 16 RSS feeds + 12 API sources
- **Fetchers**: `lib/pipeline/fetchers/` — RssFetcher, ApiFetcher, FetcherFactory (factory pattern)
- **Transformers**: `lib/pipeline/transformers/toReleaseNote.ts` — version extraction, breaking change detection, content sanitization
- **Validation**: `lib/schemas/release.ts` — Zod schemas for all release data
- **DB layer**: `lib/db/releases.ts` — upsert by `(technology, version)`, JSON serialization for array fields
- **Data access**: `lib/data/releases.ts` — unified interface with automatic fallback to mock data if DB is empty

### App Structure

- `app/` — Next.js App Router pages and API routes
- `components/ui/` — shared UI components (shadcn-style)
- `components/news/` — domain-specific components (ReleaseCard, filters, timeline, migration guides)
- `contexts/` — React Context (NotificationContext for RSS preferences, persisted to localStorage)
- `types/` — TypeScript interfaces (`release.ts` for ReleaseNote, `sources.ts` for pipeline types)
- `lib/` — all business logic, DB access, pipeline code

### API Routes

- **GET /api/sync** — executes pipeline. Protected by `CRON_SECRET` Bearer token in production; no auth in dev. Runs via Vercel cron every 6 hours.
- **POST /api/releases/explain** — AI explanation via OpenAI (requires `OPENAI_API_KEY`)

### RSS Feed Endpoints (own feeds)

The project exposes its own RSS feeds via Route Handlers in `app/feed*/`:

- **GET /feed.xml** — all releases (max 50 items)
- **GET /feed/breaking** — only releases with `breakingChange: true`
- **GET /feed/high-impact** — releases with `impactScore ≥ 70`
- **GET /feed/[technology]** — releases filtered by stack slug (e.g. `/feed/react`, `/feed/nodejs`)

Shared builder: `lib/feed/buildFeed.ts` — `buildFeedXml()` + `FEED_HEADERS` + `escapeXml()`.
Autodiscovery `<link rel="alternate">` tags are declared in `app/layout.tsx` via `metadata.alternates`.

### Database

Neon Postgres with Prisma (pg adapter). Schema in `prisma/schema.prisma`. Key constraint: `@@unique([technology, version])` prevents duplicate releases. Array fields (features, tags, etc.) stored as JSON strings.

## Conventions

- Prioritize Server Components; use `"use client"` only where interactivity is needed
- Validate API contracts with Zod
- UI components go in `components/ui/` (shadcn style)
- Path alias: `@/*` maps to project root
- Tests use Vitest + React Testing Library + jsdom

## Environment Variables

- `DATABASE_URL` — Neon Postgres connection string (required)
- `CRON_SECRET` — protects `/api/sync` in production
- `GITHUB_TOKEN` — optional, increases GitHub API rate limit
- `OPENAI_API_KEY` — optional, enables AI explanations
