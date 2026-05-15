# Portfolio Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the portfolio into a layered recruiter-skim + hiring-manager-depth experience anchored by case studies, a quantified hero, and consolidated credentials.

**Architecture:** Next.js 16 App Router server components fetch portfolio data via Prisma `Promise.all` in `app/page.tsx`. A new `CaseStudy` model + `/work/[slug]` route adds depth surface. A consolidated `Credentials` component replaces three flat sections. Hero gains skim-layer CTAs and a live infra status card. Legacy `components/projects.tsx` is demoted to an overflow grid below case studies.

**Tech Stack:** Next.js 16, React 19, TypeScript, Prisma + Neon Postgres, Tailwind v4, shadcn/ui, Supabase Storage.

**Verification model (no test suite in this repo):**
- After each code task: `pnpm exec tsc --noEmit` must pass (ignore the pre-existing `vaul` import error in `components/ui/drawer.tsx`).
- After each task: `pnpm lint` must pass.
- After UI tasks: start `pnpm dev`, load `http://localhost:3000`, smoke-test the changed section.
- After data tasks: load Prisma Studio (`pnpm exec prisma studio`) and confirm tables/columns.

**Reference spec:** `docs/superpowers/specs/2026-05-15-portfolio-improvements-design.md`. Re-read sections referenced in each task before starting it.

---

## Phase 1 — Data Foundation

### Task 1: Add `CaseStudy` model and extend `Skill` model

**Spec reference:** §7 of design doc.

**Files:**
- Modify: `prisma/schema.prisma`
- Migration: `prisma/migrations/<timestamp>_add_case_studies_and_skill_proficiency/migration.sql` (auto-generated)

- [ ] **Step 1: Add `CaseStudy` model and back-relation**

Append to `prisma/schema.prisma` after the existing `Project` model:

```prisma
model CaseStudy {
  id           String   @id @default(cuid())
  slug         String   @unique
  title        String
  role         String?
  summary      String   // 1-paragraph outcome
  problem      String
  decisions    Json     // array of { title, chose, rejected, why }
  architecture String?  // image URL (SVG/PNG in Supabase)
  ops          String?  // markdown blob for ops section
  reflections  String?  // "what I'd do differently"
  liveUrl      String?
  repoUrl      String?
  stack        String[]
  experienceId String?
  experience   Experience? @relation(fields: [experienceId], references: [id], onDelete: SetNull)
  projectId    String?
  project      Project?    @relation(fields: [projectId], references: [id], onDelete: SetNull)
  featured     Boolean  @default(false)
  order        Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([featured, order])
  @@map("case_studies")
}
```

Then add the back-relations:

In `model Experience`, add inside the model block:
```prisma
  caseStudies CaseStudy[]
```

In `model Project`, add inside the model block:
```prisma
  caseStudies CaseStudy[]
```

- [ ] **Step 2: Extend `Skill` model with proficiency + context**

Modify `model Skill` to add two optional string fields:

```prisma
model Skill {
  id          String   @id @default(cuid())
  name        String   @unique
  category    String
  proficiency String?  // e.g. "2 years, daily"
  context     String?  // e.g. "production" / "side projects"
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([category])
  @@map("skills")
}
```

- [ ] **Step 3: Run Prisma generate**

Run: `pnpm exec prisma generate`
Expected: "Generated Prisma Client" success line, no errors.

- [ ] **Step 4: Push schema to database**

Schema-drift convention in this repo prefers `db push` over `migrate dev` (see previous session — Neon shadow DB friction). Use:

Run: `pnpm exec prisma db push`
Expected: "Your database is now in sync with your Prisma schema." Tables `case_studies` created, `skills` has new nullable columns. No data loss.

If Prisma reports drift requiring data loss, stop and ask the user — do not pass `--accept-data-loss` for unexpected drift.

- [ ] **Step 5: Verify via Prisma Studio**

Run: `pnpm exec prisma studio` (opens browser).
Confirm: `CaseStudy` table exists, `Skill` has `proficiency` and `context` columns.
Stop the studio process when done.

- [ ] **Step 6: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat(db): add CaseStudy model and Skill proficiency/context"
```

---

### Task 2: Case Study API routes

**Spec reference:** §8 of design doc. Mirrors patterns from `app/api/experiences/route.ts`.

**Files:**
- Create: `app/api/case-studies/route.ts`
- Create: `app/api/case-studies/[id]/route.ts`

- [ ] **Step 1: Implement list + create route**

Create `app/api/case-studies/route.ts`:

```typescript
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(caseStudies, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[case-studies] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch case studies", details: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const caseStudy = await prisma.caseStudy.create({
      data: {
        slug: body.slug,
        title: body.title,
        role: body.role || null,
        summary: body.summary,
        problem: body.problem,
        decisions: body.decisions ?? [],
        architecture: body.architecture || null,
        ops: body.ops || null,
        reflections: body.reflections || null,
        liveUrl: body.liveUrl || null,
        repoUrl: body.repoUrl || null,
        stack: body.stack ?? [],
        experienceId: body.experienceId || null,
        projectId: body.projectId || null,
        featured: Boolean(body.featured),
        order: Number(body.order ?? 0),
      },
    });
    return NextResponse.json(caseStudy, { status: 201 });
  } catch (error) {
    console.error("[case-studies] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create case study", details: String(error) },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 2: Implement id route (GET / PATCH / DELETE)**

Create `app/api/case-studies/[id]/route.ts`:

```typescript
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const caseStudy = await prisma.caseStudy.findUnique({ where: { id } });
    if (!caseStudy) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(caseStudy);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch case study", details: String(error) },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data: Record<string, unknown> = {};
    const passthrough = [
      "slug", "title", "role", "summary", "problem", "decisions",
      "architecture", "ops", "reflections", "liveUrl", "repoUrl",
      "stack", "experienceId", "projectId", "featured", "order",
    ] as const;
    for (const key of passthrough) {
      if (key in body) data[key] = body[key];
    }
    const updated = await prisma.caseStudy.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update case study", details: String(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.caseStudy.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete case study", details: String(error) },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 3: Verify routes load (type check)**

Run: `pnpm exec tsc --noEmit`
Expected: passes (pre-existing `vaul` error in `components/ui/drawer.tsx` may appear — ignore it).

- [ ] **Step 4: Smoke test GET**

Start dev: `pnpm dev` (run in background).
Hit: `http://localhost:3000/api/case-studies`
Expected: HTTP 200 + `[]` (empty array, no rows yet).
Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add app/api/case-studies
git commit -m "feat(api): add CaseStudy CRUD routes"
```

---

### Task 3: CMS pages for case studies

**Spec reference:** §8. Pattern matches `app/cms/experience/`.

**Files:**
- Create: `app/cms/case-studies/page.tsx`
- Create: `app/cms/case-studies/new/page.tsx`
- Create: `app/cms/case-studies/[id]/page.tsx`
- Modify: `app/cms/page.tsx` (add Case Studies card)

- [ ] **Step 1: List page**

Create `app/cms/case-studies/page.tsx`:

```typescript
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function CaseStudiesCmsPage() {
  const items = await prisma.caseStudy.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/cms" className="text-sm text-muted-foreground hover:underline">
            ← Back to CMS
          </Link>
          <h1 className="mt-2 text-3xl font-bold">Case Studies</h1>
        </div>
        <Link
          href="/cms/case-studies/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + New Case Study
        </Link>
      </div>

      <ul className="divide-y divide-border rounded-lg border border-border">
        {items.length === 0 && (
          <li className="p-6 text-sm text-muted-foreground">No case studies yet.</li>
        )}
        {items.map((cs) => (
          <li key={cs.id} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium">
                {cs.title}{" "}
                {cs.featured && (
                  <span className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    featured
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">/{cs.slug}</div>
            </div>
            <Link href={`/cms/case-studies/${cs.id}`} className="text-sm hover:underline">
              Edit →
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 2: New (create) page**

Create `app/cms/case-studies/new/page.tsx`:

```typescript
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function NewCaseStudyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setSaving(true);
    setError(null);
    const stack = String(formData.get("stack") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const body = {
      slug: formData.get("slug"),
      title: formData.get("title"),
      role: formData.get("role"),
      summary: formData.get("summary"),
      problem: formData.get("problem"),
      decisions: [],
      liveUrl: formData.get("liveUrl"),
      repoUrl: formData.get("repoUrl"),
      stack,
      featured: formData.get("featured") === "on",
      order: Number(formData.get("order") ?? 0),
    };
    const res = await fetch("/api/case-studies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}));
      setError(detail.error ?? "Failed to create");
      setSaving(false);
      return;
    }
    const created = await res.json();
    router.push(`/cms/case-studies/${created.id}`);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/cms/case-studies" className="text-sm text-muted-foreground hover:underline">
        ← Back
      </Link>
      <h1 className="mt-2 mb-6 text-3xl font-bold">New Case Study</h1>
      <form action={onSubmit} className="space-y-4">
        <Field label="Title" name="title" required />
        <Field label="Slug" name="slug" required help="lowercase-with-dashes, becomes /work/<slug>" />
        <Field label="Role" name="role" />
        <Field label="Live URL" name="liveUrl" />
        <Field label="Repo URL" name="repoUrl" />
        <Field label="Stack (comma-separated)" name="stack" />
        <Textarea label="Summary (1 paragraph)" name="summary" required />
        <Textarea label="Problem" name="problem" required />
        <div className="flex items-center gap-3">
          <label className="text-sm">
            <input type="checkbox" name="featured" className="mr-2" />
            Featured on homepage
          </label>
          <Field label="Order" name="order" type="number" defaultValue="0" />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {saving ? "Saving…" : "Create"}
        </button>
      </form>
    </main>
  );
}

function Field({
  label, name, type = "text", required, help, defaultValue,
}: { label: string; name: string; type?: string; required?: boolean; help?: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      {help && <span className="text-xs text-muted-foreground">{help}</span>}
    </label>
  );
}

function Textarea({ label, name, required }: { label: string; name: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <textarea
        name={name}
        required={required}
        rows={4}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
    </label>
  );
}
```

- [ ] **Step 3: Edit page**

Create `app/cms/case-studies/[id]/page.tsx`:

```typescript
"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  role: string | null;
  summary: string;
  problem: string;
  decisions: unknown;
  architecture: string | null;
  ops: string | null;
  reflections: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  stack: string[];
  featured: boolean;
  order: number;
};

export default function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<CaseStudy | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/case-studies/${id}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError("Failed to load"));
  }, [id]);

  async function save(patch: Partial<CaseStudy>) {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/case-studies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      setError("Failed to save");
      setSaving(false);
      return;
    }
    setData(await res.json());
    setSaving(false);
  }

  async function destroy() {
    if (!confirm("Delete this case study?")) return;
    await fetch(`/api/case-studies/${id}`, { method: "DELETE" });
    router.push("/cms/case-studies");
  }

  if (!data) return <main className="p-12">Loading…</main>;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12 space-y-4">
      <Link href="/cms/case-studies" className="text-sm text-muted-foreground hover:underline">
        ← Back
      </Link>
      <h1 className="text-3xl font-bold">{data.title}</h1>
      <Text label="Title" value={data.title} onSave={(v) => save({ title: v })} />
      <Text label="Slug" value={data.slug} onSave={(v) => save({ slug: v })} />
      <Text label="Role" value={data.role ?? ""} onSave={(v) => save({ role: v })} />
      <Text label="Live URL" value={data.liveUrl ?? ""} onSave={(v) => save({ liveUrl: v })} />
      <Text label="Repo URL" value={data.repoUrl ?? ""} onSave={(v) => save({ repoUrl: v })} />
      <Text
        label="Stack (comma-separated)"
        value={data.stack.join(", ")}
        onSave={(v) => save({ stack: v.split(",").map((s) => s.trim()).filter(Boolean) })}
      />
      <Area label="Summary" value={data.summary} onSave={(v) => save({ summary: v })} />
      <Area label="Problem" value={data.problem} onSave={(v) => save({ problem: v })} />
      <Area label="Architecture (image URL)" value={data.architecture ?? ""} onSave={(v) => save({ architecture: v })} />
      <Area label="Ops" value={data.ops ?? ""} onSave={(v) => save({ ops: v })} />
      <Area label="Reflections" value={data.reflections ?? ""} onSave={(v) => save({ reflections: v })} />

      <div className="flex items-center gap-4">
        <label className="text-sm">
          <input
            type="checkbox"
            checked={data.featured}
            onChange={(e) => save({ featured: e.target.checked })}
            className="mr-2"
          />
          Featured
        </label>
        <Text label="Order" value={String(data.order)} onSave={(v) => save({ order: Number(v) })} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saving && <p className="text-sm text-muted-foreground">Saving…</p>}

      <button
        onClick={destroy}
        className="mt-4 rounded-md border border-destructive px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
      >
        Delete
      </button>
    </main>
  );
}

function Text({ label, value, onSave }: { label: string; value: string; onSave: (v: string) => void }) {
  const [v, setV] = useState(value);
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => v !== value && onSave(v)}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
    </label>
  );
}

function Area({ label, value, onSave }: { label: string; value: string; onSave: (v: string) => void }) {
  const [v, setV] = useState(value);
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <textarea
        value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => v !== value && onSave(v)}
        rows={4}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
    </label>
  );
}
```

- [ ] **Step 4: Add Case Studies card to `/cms`**

In `app/cms/page.tsx`, find the existing card grid and add a new card mirroring the Experience card pattern:

```tsx
<Link
  href="/cms/case-studies"
  className="group rounded-lg border border-border p-6 transition hover:border-primary"
>
  <h2 className="text-lg font-semibold group-hover:text-primary">Case Studies</h2>
  <p className="mt-2 text-sm text-muted-foreground">
    Featured deep-dives for the homepage and /work/[slug] pages.
  </p>
</Link>
```

Place it in the same flex/grid container the other cards already use. Read `app/cms/page.tsx` first to match the existing JSX style.

- [ ] **Step 5: Type check**

Run: `pnpm exec tsc --noEmit`
Expected: passes.

- [ ] **Step 6: Smoke test CMS**

Start `pnpm dev`. Open `http://localhost:3000/cms/case-studies`. Click "+ New Case Study". Fill required fields, submit. Confirm redirect to edit page. Edit a field, confirm saves on blur. Delete to clean up. Stop dev server.

- [ ] **Step 7: Commit**

```bash
git add app/cms/case-studies app/cms/page.tsx
git commit -m "feat(cms): add Case Studies management UI"
```

---

## Phase 2 — Skim Layer

### Task 4: Constants for availability + highlights

**Spec reference:** §5.1, §5.2. Single source for content that varies independently from code structure.

**Files:**
- Modify: `lib/constants.ts`

- [ ] **Step 1: Read existing constants**

Read `lib/constants.ts`. Note the existing `PROJECT_CATEGORIES` export shape — match style.

- [ ] **Step 2: Append availability + highlights**

Add to the bottom of `lib/constants.ts`:

```typescript
export const AVAILABILITY = {
  open: true,
  text: "Open to roles — available June 2026",
} as const;

export type HighlightTile = {
  label: string;
  value: string;
  unit?: string;
};

// All three tiles MUST be verifiable. Drop a tile rather than fake a number.
export const HIGHLIGHTS: HighlightTile[] = [
  { label: "Demo uptime (30d)", value: "—", unit: "%" },
  { label: "Production deploys", value: "—" },
  { label: "Services self-hosted", value: "—" },
];

export const RESUME_PATH = "/resume.pdf";
export const CONTACT_BOOK_URL = "mailto:gamerofgames76@gmail.com?subject=Backend%2FCloud%20opportunity";
```

The `"—"` placeholders are intentional. They will be replaced by the user supplying real values during execution; tasks that depend on this data note when real values are required vs. when a placeholder is acceptable.

- [ ] **Step 3: Type check + commit**

Run: `pnpm exec tsc --noEmit` — expected pass.
```bash
git add lib/constants.ts
git commit -m "feat(constants): add availability, highlights, resume, contact"
```

---

### Task 5: `HighlightsStrip` component

**Spec reference:** §5.2.

**Files:**
- Create: `components/highlights-strip.tsx`

- [ ] **Step 1: Component**

Create `components/highlights-strip.tsx`:

```typescript
import { HIGHLIGHTS } from "@/lib/constants";

export default function HighlightsStrip() {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      aria-label="Portfolio highlights"
    >
      {HIGHLIGHTS.map((tile, i) => (
        <div
          key={tile.label}
          className="rounded-lg border border-border bg-card/50 p-4 animate-fade-up"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="text-2xl font-display font-semibold tabular-nums">
            {tile.value}
            {tile.unit && <span className="ml-0.5 text-base text-muted-foreground">{tile.unit}</span>}
          </div>
          <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
            {tile.label}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Type check + commit**

```bash
pnpm exec tsc --noEmit
git add components/highlights-strip.tsx
git commit -m "feat(ui): add HighlightsStrip component"
```

---

### Task 6: `InfraStatusCard` component

**Spec reference:** §5.1.

**Files:**
- Create: `components/infra-status-card.tsx`

- [ ] **Step 1: Server component with fetch + graceful degrade**

Create `components/infra-status-card.tsx`:

```typescript
const DEMO_URL = "https://demo.vancornelio.dev";

type Status = "up" | "down" | "unknown";

async function probeDemo(): Promise<Status> {
  try {
    const res = await fetch(DEMO_URL, {
      method: "HEAD",
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    });
    return res.ok ? "up" : "down";
  } catch {
    return "unknown";
  }
}

export default async function InfraStatusCard() {
  const status = await probeDemo();
  const dotColor =
    status === "up" ? "bg-green-500" : status === "down" ? "bg-red-500" : "bg-zinc-400";
  const label =
    status === "up" ? "up" : status === "down" ? "down" : "no signal";

  return (
    <a
      href={DEMO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-foreground"
      aria-label={`Self-hosted infrastructure demo status: ${label}`}
    >
      <span className={`inline-block h-2 w-2 rounded-full ${dotColor} animate-pulse-dot`} />
      <span className="font-medium text-foreground">demo.vancornelio.dev</span>
      <span>—</span>
      <span>{label}</span>
    </a>
  );
}
```

Note: `animate-pulse-dot` is already defined in `app/globals.css` from a prior task. Confirm it still exists; if not, fall back to `animate-pulse`.

- [ ] **Step 2: Type check + commit**

```bash
pnpm exec tsc --noEmit
git add components/infra-status-card.tsx
git commit -m "feat(ui): add InfraStatusCard server component"
```

---

### Task 7: Hero refactor (CTAs, availability badge, status card)

**Spec reference:** §5.1.

**Files:**
- Modify: `components/hero.tsx`

- [ ] **Step 1: Read current hero**

Read `components/hero.tsx` fully. Identify: existing layout (likely a two-column flex), profile image position, current CTA(s) if any.

- [ ] **Step 2: Add imports**

At the top of `components/hero.tsx`, add (or merge with existing imports):

```typescript
import Link from "next/link";
import { AVAILABILITY, RESUME_PATH, CONTACT_BOOK_URL } from "@/lib/constants";
import InfraStatusCard from "@/components/infra-status-card";
```

If hero is currently a `"use client"` component, the `InfraStatusCard` (server component) cannot be rendered directly inside it. Two paths:

**Option A (preferred):** Convert hero to a server component and move any interactive bits (e.g., scroll handlers) into a small child client component. Keep the file structure shallow.

**Option B:** Keep hero as client component and pass `<InfraStatusCard />` as a `children`/slot prop from `app/page.tsx`.

Pick Option A if hero's only client behavior is hover styles (which are pure CSS). Pick Option B if it uses state or effects.

Inspect first. Document the choice in the commit message.

- [ ] **Step 3: Insert availability badge + CTAs**

Below the existing display headline and sub-text, before the two-column split (or in the left column above the existing image), add:

```tsx
{AVAILABILITY.open && (
  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary animate-fade-up">
    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
    {AVAILABILITY.text}
  </div>
)}

<div className="mt-6 flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: "240ms" }}>
  <a
    href={RESUME_PATH}
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
  >
    View Résumé
  </a>
  <Link
    href="#work"
    className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-primary"
  >
    See Live Infrastructure
  </Link>
  <a
    href={CONTACT_BOOK_URL}
    className="rounded-md border border-transparent bg-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
  >
    Contact →
  </a>
</div>

<div className="mt-4">
  <InfraStatusCard />
</div>
```

The `#work` anchor target is the Featured Case Studies section, which will be assigned `id="work"` in Task 17.

- [ ] **Step 4: Verify dev**

Run: `pnpm dev`. Load `/`. Confirm hero shows availability badge, two CTAs, and a status card with a colored dot. Confirm résumé link returns 404 if `/resume.pdf` is missing — that is acceptable for now; Task 8 places the file.

- [ ] **Step 5: Type check + commit**

```bash
pnpm exec tsc --noEmit
git add components/hero.tsx
git commit -m "feat(hero): add availability badge, CTAs, infra status card"
```

---

### Task 8: Résumé asset

**Spec reference:** §5.1.

**Files:**
- Create: `public/resume.pdf` (binary; user supplies)

- [ ] **Step 1: User uploads `resume.pdf` to `public/`**

This step requires the user to drop their CV into `public/resume.pdf`. If the file is not yet ready, leave the link in place — a 404 on the résumé link is a deferred-content issue, not a code issue. Confirm with the user before continuing.

- [ ] **Step 2: Commit if file exists**

```bash
git add public/resume.pdf
git commit -m "chore(public): add resume.pdf"
```

If the file is not ready, skip the commit and move on. Track this as a deferred item in the open-questions section of the design doc.

---

## Phase 3 — Case Studies Surface

### Task 9: `CaseStudyGrid` component

**Spec reference:** §5.3.

**Files:**
- Create: `components/case-study-grid.tsx`

- [ ] **Step 1: Component**

Create `components/case-study-grid.tsx`:

```typescript
import Link from "next/link";

type CaseStudyCard = {
  id: string;
  slug: string;
  title: string;
  role: string | null;
  summary: string;
  stack: string[];
  architecture: string | null;
};

export default function CaseStudyGrid({
  caseStudies,
}: {
  caseStudies: CaseStudyCard[];
}) {
  if (!Array.isArray(caseStudies) || caseStudies.length === 0) {
    return null;
  }

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <header className="mb-10">
        <p className="label text-xs uppercase tracking-wide text-muted-foreground">
          Featured work
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Case Studies
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {caseStudies.map((cs, i) => (
          <Link
            key={cs.id}
            href={`/work/${cs.slug}`}
            className="group flex flex-col rounded-xl border border-border bg-card/50 p-6 transition hover:border-primary hover:bg-card animate-fade-up"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            {cs.architecture && (
              <div className="mb-4 aspect-video overflow-hidden rounded-md border border-border bg-background">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cs.architecture}
                  alt={`${cs.title} architecture`}
                  className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                />
              </div>
            )}
            <div className="mb-2 flex flex-wrap gap-1.5">
              {cs.stack.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
            <h3 className="font-display text-xl font-semibold group-hover:text-primary">
              {cs.title}
            </h3>
            {cs.role && (
              <p className="mt-0.5 text-xs text-muted-foreground">{cs.role}</p>
            )}
            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
              {cs.summary}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
              Read case study →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type check + commit**

```bash
pnpm exec tsc --noEmit
git add components/case-study-grid.tsx
git commit -m "feat(ui): add CaseStudyGrid component"
```

---

### Task 10: `/work/[slug]` route + page

**Spec reference:** §5.3, §6.

**Files:**
- Create: `app/work/[slug]/page.tsx`
- Create: `components/case-study-page.tsx`

- [ ] **Step 1: CaseStudyPage component**

Create `components/case-study-page.tsx`:

```typescript
import Link from "next/link";

type Decision = { title: string; chose: string; rejected?: string; why: string };

export type CaseStudyPageProps = {
  title: string;
  slug: string;
  role: string | null;
  summary: string;
  problem: string;
  decisions: Decision[];
  architecture: string | null;
  ops: string | null;
  reflections: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  stack: string[];
};

export default function CaseStudyPage(props: CaseStudyPageProps) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12 sm:py-20">
      <Link href="/#work" className="text-sm text-muted-foreground hover:underline">
        ← All case studies
      </Link>

      <header className="mt-4 mb-10">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">{props.title}</h1>
        {props.role && (
          <p className="mt-2 text-sm text-muted-foreground">{props.role}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {props.stack.map((s) => (
            <span
              key={s}
              className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
        <p className="mt-6 max-w-prose text-lg leading-relaxed">{props.summary}</p>
      </header>

      <Section title="Problem">
        <p className="max-w-prose whitespace-pre-line">{props.problem}</p>
      </Section>

      {props.decisions.length > 0 && (
        <Section title="Decisions">
          <ol className="space-y-6">
            {props.decisions.map((d, i) => (
              <li key={i} className="rounded-lg border border-border p-5">
                <h3 className="font-semibold">
                  {i + 1}. {d.title}
                </h3>
                <p className="mt-2 text-sm">
                  <strong>Chose:</strong> {d.chose}
                </p>
                {d.rejected && (
                  <p className="mt-1 text-sm">
                    <strong>Rejected:</strong> {d.rejected}
                  </p>
                )}
                <p className="mt-2 text-sm text-muted-foreground">
                  <strong>Why:</strong> {d.why}
                </p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {props.architecture && (
        <Section title="Architecture">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={props.architecture}
            alt={`${props.title} architecture`}
            className="w-full rounded-lg border border-border"
          />
        </Section>
      )}

      {props.ops && (
        <Section title="Operations">
          <pre className="max-w-prose whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
            {props.ops}
          </pre>
        </Section>
      )}

      {props.reflections && (
        <Section title="What I'd do differently">
          <p className="max-w-prose whitespace-pre-line">{props.reflections}</p>
        </Section>
      )}

      <Section title="Try it">
        <div className="flex flex-wrap gap-3">
          {props.liveUrl && (
            <a
              href={props.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Live demo →
            </a>
          )}
          {props.repoUrl && (
            <a
              href={props.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:border-primary"
            >
              View source →
            </a>
          )}
        </div>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 font-display text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}
```

- [ ] **Step 2: Page route with `generateStaticParams` + `generateMetadata`**

Create `app/work/[slug]/page.tsx`:

```typescript
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CaseStudyPage, {
  type CaseStudyPageProps,
} from "@/components/case-study-page";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const studies = await prisma.caseStudy.findMany({
    where: { featured: true },
    select: { slug: true },
  });
  return studies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = await prisma.caseStudy.findUnique({ where: { slug } });
  if (!cs) return { title: "Case Study Not Found" };
  return {
    title: `${cs.title} — Vaniel Cornelio`,
    description: cs.summary,
    openGraph: {
      title: cs.title,
      description: cs.summary,
      images: cs.architecture ? [cs.architecture] : undefined,
    },
  };
}

export default async function WorkSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = await prisma.caseStudy.findUnique({ where: { slug } });
  if (!cs) notFound();

  const decisions = Array.isArray(cs.decisions)
    ? (cs.decisions as CaseStudyPageProps["decisions"])
    : [];

  return (
    <CaseStudyPage
      title={cs.title}
      slug={cs.slug}
      role={cs.role}
      summary={cs.summary}
      problem={cs.problem}
      decisions={decisions}
      architecture={cs.architecture}
      ops={cs.ops}
      reflections={cs.reflections}
      liveUrl={cs.liveUrl}
      repoUrl={cs.repoUrl}
      stack={cs.stack}
    />
  );
}
```

- [ ] **Step 3: Type check**

Run: `pnpm exec tsc --noEmit`
Expected: passes.

- [ ] **Step 4: Smoke test**

Insert a test row via Prisma Studio (or the CMS from Task 3). Start `pnpm dev`. Hit `http://localhost:3000/work/<slug>`. Confirm page renders with title, summary, problem section. Stop dev.

- [ ] **Step 5: Commit**

```bash
git add app/work components/case-study-page.tsx
git commit -m "feat(work): add /work/[slug] route with case study page template"
```

---

## Phase 4 — Depth Sections

### Task 11: Experience enhancements

**Spec reference:** §5.4.

**Files:**
- Modify: `prisma/schema.prisma` (add fields)
- Modify: `app/api/experiences/route.ts`
- Modify: `app/api/experiences/[id]/route.ts`
- Modify: `app/cms/experience/[id]/page.tsx`
- Modify: `components/experience.tsx`
- Modify: `app/page.tsx` (fetch new fields)

- [ ] **Step 1: Add `outcomes` and `stack` to `Experience`**

In `prisma/schema.prisma`, modify `model Experience` to add:

```prisma
  outcomes String?   // single-line quantified result, e.g. "Shipped X, cut latency by Y%"
  stack    String[]  // tech pills for this role
```

- [ ] **Step 2: Push schema**

Run: `pnpm exec prisma generate && pnpm exec prisma db push`
Expected: schema in sync. Existing rows have NULL outcomes and empty `stack`.

- [ ] **Step 3: Plumb through API**

In `app/api/experiences/route.ts` POST handler, add to the `data` block:
```typescript
outcomes: body.outcomes || null,
stack: body.stack ?? [],
```

In `app/api/experiences/[id]/route.ts` PATCH passthrough list, add `"outcomes"` and `"stack"`.

- [ ] **Step 4: CMS edit page — add fields**

In `app/cms/experience/[id]/page.tsx`, add editable inputs for `outcomes` (text input) and `stack` (comma-separated, same shape as case-study stack handling).

- [ ] **Step 5: Update `components/experience.tsx`**

Modify the type definition to include the new fields, then render them:

In the type:
```typescript
outcomes: string | null;
stack: string[];
```

Inside each timeline card, below the description (and above any testimonial), add:

```tsx
{exp.outcomes && (
  <p className="mt-3 text-sm font-medium text-primary">↳ {exp.outcomes}</p>
)}
{exp.stack && exp.stack.length > 0 && (
  <div className="mt-3 flex flex-wrap gap-1.5">
    {exp.stack.slice(0, 6).map((s) => (
      <span
        key={s}
        className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
      >
        {s}
      </span>
    ))}
  </div>
)}
```

- [ ] **Step 6: Update `app/page.tsx` fetch**

In `loadPortfolioData`, the `prisma.experience.findMany` block already uses `include`. No change required since outcomes/stack are scalar fields on Experience (selected by default). Verify by reading `app/page.tsx` and confirming Experience query does not use an explicit `select` that excludes them.

- [ ] **Step 7: Smoke + type check + commit**

```bash
pnpm exec tsc --noEmit
git add prisma/schema.prisma app/api/experiences app/cms/experience components/experience.tsx
git commit -m "feat(experience): add outcomes and stack pills"
```

---

### Task 12: `Credentials` consolidated component

**Spec reference:** §5.5.

**Files:**
- Create: `components/credentials.tsx`

- [ ] **Step 1: Component**

Create `components/credentials.tsx`:

```typescript
"use client";
import { useState } from "react";

type Cert = { id: string; title: string; issuer?: string | null; level?: string | null; imageUrl?: string | null; url?: string | null };
type Badge = { id: string; name: string; imageUrl?: string | null; url?: string | null };
type Skill = { id: string; name: string; category: string; proficiency?: string | null; context?: string | null };

type Tab = "certs" | "badges" | "skills";

export default function Credentials({
  certificates,
  badges,
  skills,
}: {
  certificates: Cert[];
  badges: Badge[];
  skills: Skill[];
}) {
  const [tab, setTab] = useState<Tab>("certs");
  const certs = Array.isArray(certificates) ? certificates : [];
  const bdg = Array.isArray(badges) ? badges : [];
  const sk = Array.isArray(skills) ? skills : [];

  return (
    <section id="credentials" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <header className="mb-8">
        <p className="label text-xs uppercase tracking-wide text-muted-foreground">
          Credentials
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Certifications, badges &amp; skills
        </h2>
      </header>

      <div className="mb-6 flex gap-2">
        <TabBtn active={tab === "certs"} onClick={() => setTab("certs")} count={certs.length}>
          Certifications
        </TabBtn>
        <TabBtn active={tab === "badges"} onClick={() => setTab("badges")} count={bdg.length}>
          Badges
        </TabBtn>
        <TabBtn active={tab === "skills"} onClick={() => setTab("skills")} count={sk.length}>
          Skills
        </TabBtn>
      </div>

      {tab === "certs" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((c) => (
            <a
              key={c.id}
              href={c.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-lg border border-border p-4 transition hover:border-primary"
            >
              {c.imageUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={c.imageUrl} alt={c.title} className="h-12 w-12 rounded object-cover" />
              )}
              <div className="min-w-0">
                <div className="truncate font-medium">{c.title}</div>
                {c.issuer && <div className="text-xs text-muted-foreground">{c.issuer}</div>}
              </div>
            </a>
          ))}
        </div>
      )}

      {tab === "badges" && (
        <div className="flex flex-wrap gap-4">
          {bdg.map((b) => (
            <a
              key={b.id}
              href={b.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center"
              title={b.name}
            >
              {b.imageUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={b.imageUrl} alt={b.name} className="h-16 w-16 object-contain" />
              )}
              <span className="mt-1 max-w-[6rem] truncate text-xs">{b.name}</span>
            </a>
          ))}
        </div>
      )}

      {tab === "skills" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sk.map((s) => (
            <div key={s.id} className="rounded-lg border border-border p-3">
              <div className="font-medium">{s.name}</div>
              {(s.proficiency || s.context) && (
                <div className="text-xs text-muted-foreground">
                  {[s.proficiency, s.context].filter(Boolean).join(" · ")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function TabBtn({
  active, onClick, children, count,
}: { active: boolean; onClick: () => void; children: React.ReactNode; count: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm transition ${
        active
          ? "bg-primary text-primary-foreground"
          : "border border-border text-muted-foreground hover:border-primary hover:text-foreground"
      }`}
    >
      {children}
      <span className="ml-1.5 text-xs opacity-70">{count}</span>
    </button>
  );
}
```

The `Cert` and `Badge` types are intentionally loose so they accept whatever the Prisma rows actually contain. If certificate or badge models use different field names than `title`/`name`/`imageUrl`/`url`, adjust the type and the JSX before this task is closed.

- [ ] **Step 2: Verify Prisma field names**

Open `prisma/schema.prisma` and confirm the exact field names on `Certificate` and `Badge`. If they differ from `title`/`issuer`/`level`/`imageUrl`/`url` for Certificate or `name`/`imageUrl`/`url` for Badge, edit the component's types and JSX accessors to match. **Do not** rename the database columns.

- [ ] **Step 3: Type check + commit**

```bash
pnpm exec tsc --noEmit
git add components/credentials.tsx
git commit -m "feat(ui): add Credentials consolidated section"
```

---

### Task 13: `ContactCta` component

**Spec reference:** §5.7.

**Files:**
- Create: `components/contact-cta.tsx`

- [ ] **Step 1: Component**

Create `components/contact-cta.tsx`:

```typescript
import { CONTACT_BOOK_URL } from "@/lib/constants";

export default function ContactCta() {
  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-16 sm:py-24 text-center">
      <h2 className="font-display text-3xl font-semibold sm:text-4xl">
        Let&apos;s build something.
      </h2>
      <p className="mx-auto mt-3 max-w-prose text-muted-foreground">
        Backend systems, cloud infra, internal tooling — happy to talk about your stack.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a
          href={CONTACT_BOOK_URL}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Book a call
        </a>
        <a
          href="https://github.com/Banyel3"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:border-primary"
        >
          GitHub
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type check + commit**

```bash
pnpm exec tsc --noEmit
git add components/contact-cta.tsx
git commit -m "feat(ui): add ContactCta section"
```

---

### Task 14: About copy tighten

**Spec reference:** §5.6.

**Files:**
- Modify: `components/about.tsx`

- [ ] **Step 1: Read current About**

Read `components/about.tsx`. Identify the current paragraphs.

- [ ] **Step 2: Replace prose with three short paragraphs**

Replace the body prose with three paragraphs matching the spec:
1. Who + how-you-work (one sentence each).
2. What you're optimizing for in your next role.
3. Outside-of-work (one sentence).

Concrete content must come from the user. As a placeholder, use:

```tsx
<p>
  Backend developer and cloud engineer. I optimize for systems that stay up, deploy cleanly, and explain themselves under failure.
</p>
<p>
  Looking for a team building real distributed backends — Postgres, queues, observability, Kubernetes. I work best where I can own deploys end-to-end.
</p>
<p>
  Outside work: home-lab tinkering, mechanical keyboards, and occasionally writing things that aren&apos;t YAML.
</p>
```

Mark these placeholders explicitly with a `{/* placeholder copy — replace before publish */}` comment so they cannot ship by accident.

- [ ] **Step 3: Type check + commit**

```bash
pnpm exec tsc --noEmit
git add components/about.tsx
git commit -m "feat(about): tighten copy to 3 paragraphs (placeholder)"
```

---

## Phase 5 — Wiring + Final IA

### Task 15: Update `app/page.tsx` to new section order

**Spec reference:** §4, §6.

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Read current page**

Re-read `app/page.tsx` to confirm current structure.

- [ ] **Step 2: Add fetches for case studies + skills**

In `loadPortfolioData`, add:

```typescript
safe(
  prisma.caseStudy.findMany({
    where: { featured: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      role: true,
      summary: true,
      stack: true,
      architecture: true,
    },
  }),
  [],
),
safe(
  prisma.skill.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
  [],
),
```

Add `caseStudies` and `skills` to the destructured tuple and the return object.

- [ ] **Step 3: Replace JSX with new section order**

Replace the `<main>` body in `Home` with:

```tsx
<main className="min-h-screen bg-background text-foreground">
  <Navigation />
  <Hero />
  <HighlightsStrip />
  <CaseStudyGrid caseStudies={JSON.parse(JSON.stringify(caseStudies))} />
  <Experience initialExperiences={JSON.parse(JSON.stringify(experiences))} />
  <Credentials
    certificates={JSON.parse(JSON.stringify(certificates))}
    badges={JSON.parse(JSON.stringify(badges))}
    skills={JSON.parse(JSON.stringify(skills))}
  />
  <About />
  {/* More Projects overflow — demoted from headline section */}
  <Projects initialProjects={JSON.parse(JSON.stringify(projects))} variant="overflow" />
  <ContactCta />
  <Footer />
</main>
```

Note: `HighlightsStrip` is wrapped in its own container in the component, but the hero's CTAs already nest above it. Pick one placement. If hero already includes the strip via a child slot, omit it here. Per spec §5.2 the strip is "directly under the hero CTAs" — for simplicity place it as a top-level section directly under `<Hero />` and let the hero handle its own internal spacing.

Add new imports at the top of `app/page.tsx`:

```typescript
import HighlightsStrip from "@/components/highlights-strip";
import CaseStudyGrid from "@/components/case-study-grid";
import Credentials from "@/components/credentials";
import ContactCta from "@/components/contact-cta";
```

Remove the now-unused imports for `Certificates` and `Badges` if they are no longer rendered. Keep `Projects` import (still used for overflow).

- [ ] **Step 4: Type check**

Run: `pnpm exec tsc --noEmit`
Expected: passes. The `variant` prop on `Projects` will fail until Task 17 — that is the expected failure that motivates the next task. If it fails, hold the commit and proceed to Task 17 first, then circle back to commit.

- [ ] **Step 5: Commit (gated by Task 17)**

After Task 17 lands:

```bash
git add app/page.tsx
git commit -m "feat(page): reorder sections to new IA"
```

---

### Task 16: Demote `Projects` to overflow

**Spec reference:** §6.

**Files:**
- Modify: `components/projects.tsx`

- [ ] **Step 1: Accept `variant` prop**

Read `components/projects.tsx`. Add a new prop:

```typescript
type Variant = "primary" | "overflow";

export default function Projects({
  initialProjects,
  variant = "primary",
}: {
  initialProjects: ProjectRow[];
  variant?: Variant;
}) {
  // ...
}
```

- [ ] **Step 2: Adjust styling for `overflow` variant**

When `variant === "overflow"`:
- Render with a smaller heading ("More Projects").
- Use a tighter grid (2 columns max on desktop instead of 3).
- Reduce the section padding (`py-12` instead of `py-24`).
- Drop the introductory subtitle.

Concretely, at the top of the rendered JSX:

```tsx
<section
  id={variant === "overflow" ? "more-projects" : "projects"}
  className={
    variant === "overflow"
      ? "mx-auto max-w-6xl px-6 py-12"
      : "mx-auto max-w-6xl px-6 py-16 sm:py-24"
  }
>
  <header className="mb-6">
    <h2
      className={
        variant === "overflow"
          ? "font-display text-2xl font-semibold"
          : "font-display text-3xl font-semibold sm:text-4xl"
      }
    >
      {variant === "overflow" ? "More Projects" : "Projects"}
    </h2>
  </header>
  {/* existing grid below */}
</section>
```

- [ ] **Step 3: Filter out projects that are featured case studies**

For now, filtering is a follow-up. The data model allows a project to be referenced by a case study via `CaseStudy.projectId`, but enforcing the exclusion requires a join. Defer this enforcement to a follow-up; track in the open questions section of the design doc. The current behavior — duplication between case studies and overflow projects — is acceptable for the first iteration.

- [ ] **Step 4: Type check + commit**

```bash
pnpm exec tsc --noEmit
git add components/projects.tsx
git commit -m "feat(projects): support overflow variant"
```

After this commit, return to Task 15 and commit `app/page.tsx`.

---

### Task 17: Navigation update

**Spec reference:** §6.

**Files:**
- Modify: `components/navigation.tsx`

- [ ] **Step 1: Read current nav**

Read `components/navigation.tsx`. Identify the `navItems` array (or equivalent).

- [ ] **Step 2: Update items to match new IA**

Set `navItems` to (preserve existing structure, just replace labels and hrefs):

```typescript
const navItems = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Credentials", href: "#credentials" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
```

If `Experience`, `About`, and the new sections do not yet carry the expected `id` attributes on their wrapping element, add them in their respective component files. For Experience that is `components/experience.tsx`, for About `components/about.tsx`.

- [ ] **Step 3: Update active-section scroll detection if present**

If `navigation.tsx` tracks the active section by `id`, ensure the `sections` array there matches the new ids: `work`, `experience`, `credentials`, `about`, `contact`. Remove any stale `testimonials` or `projects` entries.

- [ ] **Step 4: Smoke + commit**

Run: `pnpm dev`. Click each nav link and confirm scroll-to behavior works.

```bash
pnpm exec tsc --noEmit
git add components/navigation.tsx components/experience.tsx components/about.tsx
git commit -m "feat(nav): update items to new IA"
```

---

### Task 18: Final verification pass

**Spec reference:** §14 (acceptance criteria).

- [ ] **Step 1: Type check**

Run: `pnpm exec tsc --noEmit`
Expected: passes (modulo the pre-existing `vaul` import in `components/ui/drawer.tsx`).

- [ ] **Step 2: Lint**

Run: `pnpm lint`
Expected: passes.

- [ ] **Step 3: Build**

Run: `pnpm build`
Expected: build succeeds. Note any new warnings.

- [ ] **Step 4: Manual smoke**

Run: `pnpm dev`. Walk the full IA:
- Hero shows availability badge, two CTAs, infra status card with colored dot.
- Highlights strip renders three tiles.
- Case Studies grid renders featured rows (or is hidden if none featured).
- `/work/<slug>` for each featured case study loads with all sections.
- Experience timeline shows outcomes line + stack pills where present.
- Credentials renders all three tabs with counts.
- About shows three paragraphs.
- More Projects grid renders below About.
- Contact CTA renders.
- All nav links scroll to correct sections.

Stop dev when done.

- [ ] **Step 5: Acceptance criteria walkthrough**

Open `docs/superpowers/specs/2026-05-15-portfolio-improvements-design.md` §14. Tick off each criterion. Any unchecked criterion blocks completion.

- [ ] **Step 6: Final commit**

If polish edits were needed during the smoke pass:

```bash
git add -A
git commit -m "chore: post-restructure polish"
```

---

## Open Items Carried From Spec

These items remain outstanding and are not implemented by this plan:

1. **Real values** for the three highlight tiles (placeholder `"—"` in `lib/constants.ts`).
2. **Résumé PDF** in `public/resume.pdf`.
3. **About copy** must be replaced before publish.
4. **Two non-flagship case studies** — content authoring, not code.
5. **Filter More Projects to exclude case-studied projects** — deferred per Task 16 Step 3.
6. **Auth gate on `/cms`** — explicit security follow-up, separate plan.

Surface these to the user as a checklist after Task 18 lands.
