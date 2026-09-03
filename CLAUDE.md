# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — start Next.js dev server (Turbopack, default port 3000).
- `pnpm build` — runs `prisma generate` then `next build`. Always do a Prisma generate after schema changes; the build script handles it but ad-hoc work may need `pnpm exec prisma generate` first.
- `pnpm start` — serve the production build.
- `pnpm lint` — ESLint via `eslint .` (flat config, defaults only — no project-specific rules file).
- Prisma migrations: `pnpm exec prisma migrate dev --name <name>` against `DATABASE_URL`. Neon requires a separate writable branch for `shadowDatabaseUrl` (see comment in `prisma/schema.prisma`).
- Prisma Studio: `pnpm exec prisma studio`.

There is no test suite configured.

`next.config.mjs` sets `typescript.ignoreBuildErrors: true` and `images.unoptimized: true` — type errors will NOT fail the build, so type-check intentionally (`pnpm exec tsc --noEmit`) when correctness matters.

## Architecture

Single-page personal portfolio with an inline CMS, all in one Next.js 16 App Router project (React 19, TypeScript, Tailwind v4, shadcn/ui "new-york").

### Three concerns, one app

1. **Public site** — `app/page.tsx` composes `Hero → About → Certificates → Badges → Projects → Testimonials → Footer` from `components/*.tsx`. These are client components that fetch from the API routes.
2. **CMS** — `app/cms/` is an unauthenticated admin UI (one route per entity: `badges`, `certificates`, `projects`, `skills`, `testimonials`) for creating/editing content. There is no auth gate; do not deploy publicly without adding one.
3. **REST API** — `app/api/<entity>/route.ts` (list + create) and `app/api/<entity>/[id]/route.ts` (read/update/delete). `app/api/public/badges/` is a read-only public variant. All list routes set `revalidate = 60` and `Cache-Control: s-maxage=60, stale-while-revalidate=300`.

### Data layer

- **Database**: Neon Postgres via Prisma. The Prisma client is a global singleton in `lib/prisma.ts` to survive HMR. Schema in `prisma/schema.prisma` defines `Certificate`, `Project`, `Skill`, `Badge`, `Testimonial`, and the `CertificationLevel` enum (ENTRY/INTERMEDIATE/ADVANCED). Arrays (`technologies`, `skills`, `images`) are Postgres `text[]`.
- **Direct SQL escape hatch**: `actions.ts` (project root) uses `@neondatabase/serverless` (`neon()` tagged template). Only one server action exists; prefer Prisma unless serverless edge SQL is needed.
- **Image storage**: Supabase Storage, bucket `SUPABASE_BUCKET_NAME` (default `projects`). Uploads go through `app/api/upload-project/route.ts` and `app/api/upload-badge/route.ts` using the **service role key** (server-side only). 5 MB limit, image MIME enforced, public URL falls back to a 7-day signed URL if the bucket is private. `utils/supabase/{client,server,middleware}.ts` provide anon-key clients for non-upload reads.
- **Project categories** are centralized in `lib/constants.ts` (`PROJECT_CATEGORIES`); use this constant everywhere instead of hard-coding category strings — it feeds both the CMS dropdown and the portfolio filter.

### Required environment variables

- `DATABASE_URL` — Neon Postgres connection string. Append `&connect_timeout=15&pool_timeout=20`: Neon suspends idle computes and the first connections after a wake take 8–11 s, which otherwise surfaces as P1001 "Can't reach database server" or P2024 pool timeout. `app/page.tsx` also warms one connection before its parallel queries and retries connection errors once; in production a still-failing query throws so ISR keeps the last good page.
- `SHADOW_DATABASE_URL` — optional, only for `prisma migrate` against Neon (separate branch).
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public Supabase client.
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, used by upload routes. Never expose.
- `SUPABASE_BUCKET_NAME` — defaults to `projects`.
- `RESEND_API_KEY` — server-only, used by `app/api/contact/route.ts` to email the contact form. Without it the form returns 503 and shows the mailto fallback.
- `RESEND_FROM` — optional sender (`Name <you@yourdomain>`); defaults to Resend's `onboarding@resend.dev`, which can only deliver to the Resend account owner's address.
- `CONTACT_TO` — optional recipient; defaults to `CONTACT_EMAIL` in `lib/constants.ts`.

### Conventions

- Path alias `@/*` maps to repo root (see `tsconfig.json`); use `@/components/...`, `@/lib/prisma`, etc.
- shadcn primitives live in `components/ui/`; do not edit them when adding features — compose them in the feature components at `components/<name>.tsx`.
- Fonts: `Space_Grotesk` (display) and `Inter` (body) are loaded in `app/layout.tsx` via CSS variables `--font-display` / `--font-body`. Theme handled by `next-themes` through `components/theme-provider.tsx`.
- Both `pnpm-lock.yaml` and `package-lock.json` are committed; `pnpm-lock.yaml` is the source of truth — keep `package-lock.json` in sync or remove it if switching tools.
- The site identity is "Backend Developer & Cloud Engineer" (see `app/layout.tsx` metadata and recent commits). Match copy and tone when editing public-facing strings.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
