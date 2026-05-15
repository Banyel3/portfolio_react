# Portfolio Improvements — Design Doc

**Date:** 2026-05-15
**Owner:** Vaniel Cornelio
**Status:** Draft for review

## 1. Goal

Reposition the portfolio to win interviews for **Backend Developer & Cloud Engineer** roles, serving both recruiter skim (≤30s) and hiring manager depth (≤2min) without forcing a context switch.

## 2. Context

The current site has a strong asset (a live self-hosted infrastructure demo at `demo.vancornelio.dev`) but does not lead with it, does not quantify any outcomes, lists projects without case-study depth, and exposes certs/badges/testimonials as separate flat sections. Recent design audit research surfaced four recurring portfolio failure modes — broken demos, generic tech lists, no metrics, no story — only the first of which is currently avoided.

## 3. Direction

A hybrid layout that gives recruiters a scannable above-fold and hiring managers click-through depth, anchored by **one flagship case study** (the infrastructure demo) and **two additional case studies** for top-shelf projects.

Three structural moves:

1. **Hero becomes a skim layer.** Identity one-liner, three quantified highlights, two CTAs (résumé + book a call), availability badge, and a live status card for the infra demo.
2. **Featured Case Studies replace the projects grid as the primary depth surface.** New route `/work/[slug]` per featured project. Card grid on the homepage shows 3-5 case study teasers.
3. **Credentials section consolidates certs + badges + skills.** Single block, tabbed or filtered, instead of three independent sections.

## 4. Information Architecture

**Current order:**
Hero → Experience → About → Certificates → Badges → Projects → Footer

**New order:**
Hero (skim) → Quantified Highlights → Featured Case Studies → More Projects (overflow) → Experience → Credentials → About → Contact CTA → Footer

Rationale: skim → proof → depth → narrative → credibility → personality → conversion. About moves below credentials because hiring managers want proof before personality; recruiters skip About entirely. The legacy Projects grid is retained as overflow so existing items still surface without competing with case studies.

## 5. Section-by-Section Spec

### 5.1 Hero (Skim Layer)

**Above the fold:**
- Display headline: "Backend Developer & Cloud Engineer" (unchanged).
- Sub: one-line value prop tied to a verb + outcome, not adjectives. Draft: *"I ship and run production backends — self-hosted Kubernetes, Postgres, observability included."*
- Three-column highlights strip (see 5.2).
- Two CTAs: primary `View Résumé` (links to `/resume.pdf`), secondary `See Live Infrastructure` (anchors to flagship case study).
- Availability badge: small pill, e.g. "Open to roles — available June 2026". Pulled from a single constant in `lib/constants.ts` so it can be toggled in one place.
- Right-rail: existing profile image, but adds a live infra status card overlay (green/red dot, "demo.vancornelio.dev — up", last-checked timestamp). Server component fetches the status server-side with a 60s cache.

**Out of scope for this iteration:** dark/light toggle redesign (current `next-themes` setup is fine), animated background.

### 5.2 Quantified Highlights

Inline strip directly under the hero CTAs. Three tiles. Examples to choose from:
- Demo uptime % (last 30 days, pulled from a health log or hardcoded for now).
- Deployments shipped (count from CI history; can be hardcoded initially).
- APIs / endpoints in production.
- Largest dataset handled.
- Languages / runtimes deployed.

Anti-pattern guardrail: no vanity metrics ("100% passion"). Every tile must be a verifiable number with a unit. If a number cannot be honestly produced, drop that tile rather than fake it.

### 5.3 Featured Case Studies

Becomes the primary depth surface on the homepage. The legacy Projects grid stays but is demoted below this section as a "More Projects" overflow (see §6 for component decision).

**Homepage card grid** (3-5 cards):
- Thumbnail (architecture-diagram-style, not screenshot).
- Title + role + stack tags (max 4).
- 2-line outcome teaser. Example: *"Self-hosted Kubernetes cluster running 6 services with full observability — Prometheus, Grafana, Loki — and zero-downtime deploys via GitHub Actions."*
- CTA: `Read case study →` links to `/work/[slug]`.

**`/work/[slug]` page template:**
1. **Title + role + dates + stack pills.**
2. **Outcome summary** (1 paragraph, leads with the quantified result).
3. **Problem** — what was broken / missing / wanted, in user-or-business terms.
4. **Decisions** — 3-5 numbered decisions with rationale. For each: *what I chose, what I rejected, why*.
5. **Architecture** — diagram (SVG or Excalidraw export). Captioned.
6. **Implementation highlights** — links to specific PRs / commits / files where appropriate.
7. **Operations** — for cloud/infra projects: CI/CD diagram, observability screenshots, deploy cadence.
8. **What I'd do differently** — short, honest. Hiring managers explicitly look for this.
9. **Try it** — live demo link + GitHub repo. Both required; if either is missing the page does not ship.

**Flagship case study: the infrastructure demo.** This is the depth piece the rest of the site points at. It must be the most polished `/work/[slug]` page and is non-negotiable scope.

**Two more case studies** to be selected from existing projects based on (a) live demo health, (b) interest to backend+cloud audiences, (c) story strength. Selection is part of execution scope, not this design doc.

### 5.4 Experience Timeline

Keep current vertical timeline structure. Three additions:

- **Quantified outcomes line** per role. Format: "Shipped X / improved Y by Z%". If a role has no honest number, the line is omitted rather than padded.
- **Stack pills** under each role title (max 5).
- **Inline testimonial** stays — already nested under the experience model.
- **"Featured work" link** per role: if a role produced a case study, link to it.

No structural change to the existing `components/experience.tsx`. Animation behavior unchanged.

### 5.5 Credentials (new consolidated section)

Replaces the three independent Certificates / Badges / Skills sections.

Single section, three tabs or filter chips: **Certifications · Badges · Skills**.

- Certifications: keep the existing `Certificate` model and CMS, render as cards.
- Badges: keep the existing `Badge` model and CMS, render as compact icon grid.
- Skills: introduce a proficiency-labelled list to avoid the 25-tech-list anti-pattern. Format: *"Go — 2 years, daily" / "Terraform — 6 months, side projects"*. Schema addition required: `Skill.proficiency` (string) and `Skill.context` (string). Existing `Skill` model in `prisma/schema.prisma` is used.

Filter state is client-side; no URL routing for tabs to keep this simple.

### 5.6 About

Stays. Moves below Credentials. Tighten copy to ≤3 short paragraphs:
1. Who you are + how you work (one sentence each).
2. What you're optimizing for in your next role (signals fit).
3. Outside-of-work line (humanizes; one sentence).

Drop any generic "passionate developer" filler.

### 5.7 Contact CTA

New dedicated section before the footer.
- Single primary CTA: book a call (calendly-style link or mailto with prefilled subject).
- Secondary: GitHub, LinkedIn, email — already in footer; keep there too but elevate to this section.
- Optional: an "open to" matrix — Backend / Cloud / Full-time / Contract — using simple toggle pills.

## 6. Routes and Components

**New routes:**
- `/work/[slug]/page.tsx` — case study page, server component, fetches from a new `CaseStudy` model.
- `/resume.pdf` — static asset in `/public`. User must commit the PDF; the design assumes it exists.

**New components:**
- `components/highlights-strip.tsx` — three-tile metrics row.
- `components/infra-status-card.tsx` — server component, fetches demo health.
- `components/case-study-grid.tsx` — homepage grid.
- `components/case-study-page.tsx` — `/work/[slug]` body.
- `components/credentials.tsx` — consolidates certs+badges+skills with tab state.
- `components/contact-cta.tsx` — pre-footer CTA section.

**Components that change:**
- `components/hero.tsx` — adds CTAs, availability badge, status card slot.
- `components/about.tsx` — copy tighten, no structural change.
- `components/experience.tsx` — adds outcomes line + stack pills + featured-work link.
- `components/navigation.tsx` — nav items reorder, possibly add "Work" entry.
- `app/page.tsx` — section reorder, swap projects for case studies, drop Testimonials reference (already done in prior work).

**Components retired or hidden:**
- `components/projects.tsx` — kept but demoted below the Featured Case Studies section as a "More Projects" overflow grid. Filter UI stays. If a project becomes a case study, it is removed from this grid (filter by `CaseStudy.projectId NOT IN (...)`).
- `components/certificates.tsx` and `components/badges.tsx` — folded into `credentials.tsx`. Existing models stay; only the rendering is unified.

## 7. Data Model Changes

**New model: `CaseStudy`.**

```prisma
model CaseStudy {
  id            String   @id @default(cuid())
  slug          String   @unique
  title         String
  role          String?
  summary       String   // 1-paragraph outcome
  problem       String
  decisions     Json     // array of { title, chose, rejected, why }
  architecture  String?  // image URL (SVG/PNG in Supabase)
  ops           String?  // markdown blob for ops section
  reflections   String?  // "what I'd do differently"
  liveUrl       String?
  repoUrl       String?
  stack         String[] // pg text[]
  experienceId  String?
  experience    Experience? @relation(fields: [experienceId], references: [id], onDelete: SetNull)
  projectId     String?  // optional link to existing Project
  featured      Boolean  @default(false)
  order         Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  @@index([featured, order])
  @@map("case_studies")
}
```

`Experience` gets `caseStudies CaseStudy[]` back-relation.
`Project` keeps no new column; cross-linking is one-directional via `CaseStudy.projectId` to keep the schema simple.

**Skill model addition:**
```prisma
model Skill {
  // existing fields...
  proficiency String?  // "2 years, daily"
  context     String?  // "side projects" / "production"
}
```

**Migration strategy:** additive only. No destructive changes. Use `prisma db push` if schema is ahead of migrations, otherwise `prisma migrate dev --name add_case_studies_and_skill_proficiency`.

## 8. API and CMS

New endpoints, mirroring existing patterns:
- `app/api/case-studies/route.ts` — GET list, POST create.
- `app/api/case-studies/[id]/route.ts` — GET, PATCH, DELETE.
- `app/cms/case-studies/page.tsx`, `new/page.tsx`, `[id]/page.tsx` — CMS pages.

All list endpoints carry `revalidate = 60` and the standard `Cache-Control: s-maxage=60, stale-while-revalidate=300` header to match the rest of the API.

**`/cms` remains unauthenticated in this design.** Auth is called out as a separate follow-up; this design doc does **not** ship the auth gate. If you deploy publicly with new CMS routes before adding auth, you expand the unauthenticated surface — note this in the PR description.

## 9. Animation and Motion

The recent animation pass (fade-up, pulse-dot, stagger delays, `prefers-reduced-motion` guard) is kept as-is. New components reuse those utility classes. No new keyframes added in this iteration unless a specific section needs one. Constraint: motion must remain subtle and never block content from being readable.

## 10. Typography and Spacing

Keep current `Space_Grotesk` (display) + `Inter` (body) pairing. Tighten:
- Section vertical rhythm: enforce a single spacing scale (`py-16` mobile, `py-24` desktop) for all top-level sections.
- Headline weights audited: only one `font-display` weight per page (700 for hero, 600 elsewhere).
- Line length on prose sections clamped to `max-w-prose` (~65ch) for case study bodies.

## 11. Performance

Hero, highlights, case study grid, and credentials are all server components fetching via Prisma. Continue using `Promise.all` parallel fetches in `app/page.tsx` to avoid waterfalls. `/work/[slug]` pages use `generateStaticParams` so featured case studies are statically generated at build time, with `revalidate = 60` for ISR.

`prisma generate` runs in the build script; no change needed.

## 11.1 SEO and Metadata

`/work/[slug]` pages export `generateMetadata` returning per-case-study `title` (`<title>${title} — Vaniel Cornelio</title>`), `description` (the `summary` field), and `openGraph` block (image = `architecture` field or a fallback). Homepage metadata stays as-is. No sitemap.xml generation is in scope for this iteration.

## 12. Out of Scope

- Auth on `/cms` (separate task; flagged as a security follow-up).
- Dark/light theme redesign (current is fine).
- Mobile-first redesign of the timeline (it works on mobile; polish only).
- Analytics integration.
- Blog or articles section.
- Multi-language support.

## 13. Risks

- **Empty case study pages**: shipping the route without a polished body is worse than not shipping the route. Mitigation: gate `/work/[slug]` behind `featured = true` and require all required fields populated before publish.
- **Faked metrics**: any unverifiable highlight number undermines the whole portfolio. Mitigation: drop a tile rather than invent.
- **CMS surface expansion without auth**: adding `/cms/case-studies/*` without auth widens the publicly-writable footprint. Mitigation: ship auth gate in a follow-up before the next deploy.
- **Infra status card failure mode**: if the status endpoint times out, the hero must degrade gracefully — render the card with a neutral state, not an error.
- **Design doc execution drift**: with full-restructure scope, partial execution leaves the site in a broken in-between state. Mitigation: ship behind a single PR or feature flag.

## 14. Acceptance Criteria

The portfolio is considered shipped on this design when:

1. Homepage section order matches §4.
2. Hero has résumé CTA, availability badge, live infra status card, and a three-tile highlights strip with real numbers.
3. At least one flagship `/work/[slug]` page exists (the infra demo), with all template sections (5.3) populated.
4. At least two more case studies exist OR the section explicitly displays only the flagship with a "more coming soon" placeholder removed (not faked).
5. Certs + badges + skills are unified into a single Credentials section with tab filters.
6. Experience cards show quantified outcomes + stack pills.
7. Contact CTA section exists with a working primary action.
8. `pnpm lint` passes. `pnpm exec tsc --noEmit` passes (ignoring the pre-existing `vaul` import in `components/ui/drawer.tsx`).
9. No section regression: every section that exists today still renders without errors when its DB data is missing (graceful empty states).

## 15. Open Questions for User

1. Which **two non-flagship projects** should become `/work/[slug]` case studies? (Need title + slug + which existing Project row.)
2. Do you have a **résumé PDF** ready to drop at `/public/resume.pdf`, or should this be a follow-up?
3. **Availability badge** text — exact wording and target date.
4. **Three highlight numbers** for the strip — which three, with what values?
5. **Calendly / contact link** — what URL or email for the Contact CTA primary button?
6. Design resolves this: legacy projects grid is **kept** as "More Projects" overflow below the case studies. Confirm or override.
