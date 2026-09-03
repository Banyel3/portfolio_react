"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Decision = { title: string; chose: string; rejected?: string; why: string };

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
  projectId: string | null;
  featured: boolean;
  order: number;
  status: "ACTIVE" | "WIP" | "DISCONTINUED";
};

const STATUS_LABELS: Record<CaseStudy["status"], string> = {
  ACTIVE: "Active",
  WIP: "Work in progress",
  DISCONTINUED: "Discontinued",
};

type ProjectOption = { id: string; title: string; images?: string[] };

const EMPTY_DECISION: Decision = { title: "", chose: "", rejected: "", why: "" };

export default function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<CaseStudy | null>(null);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/case-studies/${id}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError("Failed to load"));
    fetch("/api/projects")
      .then((r) => r.json())
      .then((list) => setProjects(Array.isArray(list) ? list : []))
      .catch(() => {});
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

  const decisions: Decision[] = Array.isArray(data.decisions) ? (data.decisions as Decision[]) : [];

  return (
    <main className="mx-auto max-w-2xl px-6 py-12 space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/cms/case-studies" className="text-sm text-muted-foreground hover:underline">
          ← Back
        </Link>
        <Link
          href={`/work/${data.slug}`}
          target="_blank"
          className="text-sm text-primary hover:underline"
        >
          View /work/{data.slug} ↗
        </Link>
      </div>
      <h1 className="text-3xl font-bold">{data.title}</h1>

      <Text label="Title" value={data.title} onSave={(v) => save({ title: v })} />
      <Text
        label="Slug"
        value={data.slug}
        help="lowercase-with-dashes, becomes /work/<slug>"
        onSave={(v) => save({ slug: v })}
      />
      <Text label="Role" value={data.role ?? ""} onSave={(v) => save({ role: v })} />

      <label className="block">
        <span className="text-sm font-medium">Linked project</span>
        <select
          value={data.projectId ?? ""}
          onChange={(e) => save({ projectId: e.target.value || null })}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">— none —</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
        <span className="mt-1 block text-xs text-muted-foreground">
          The homepage card uses the linked project&apos;s first image as its thumbnail.
        </span>
      </label>

      <Text label="Live URL" value={data.liveUrl ?? ""} onSave={(v) => save({ liveUrl: v })} />
      <Text label="Repo URL" value={data.repoUrl ?? ""} onSave={(v) => save({ repoUrl: v })} />
      <Text
        label="Stack (comma-separated)"
        value={data.stack.join(", ")}
        onSave={(v) => save({ stack: v.split(",").map((s) => s.trim()).filter(Boolean) })}
      />
      <Area label="Summary (1 paragraph)" value={data.summary} onSave={(v) => save({ summary: v })} />
      <Area label="Problem" value={data.problem} rows={6} onSave={(v) => save({ problem: v })} />

      <DecisionsEditor value={decisions} onSave={(d) => save({ decisions: d })} />

      <ImageField
        label="Architecture image"
        value={data.architecture ?? ""}
        onSave={(v) => save({ architecture: v || null })}
      />

      <Area
        label="Operations (how it runs; line breaks kept)"
        value={data.ops ?? ""}
        rows={8}
        onSave={(v) => save({ ops: v })}
      />
      <Area
        label="What I'd do differently"
        value={data.reflections ?? ""}
        rows={5}
        onSave={(v) => save({ reflections: v })}
      />

      <label className="block">
        <span className="text-sm font-medium">Status</span>
        <select
          value={data.status}
          onChange={(e) => save({ status: e.target.value as CaseStudy["status"] })}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {(Object.keys(STATUS_LABELS) as CaseStudy["status"][]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <span className="mt-1 block text-xs text-muted-foreground">
          Homepage groups projects as Active, then Work in progress, then Discontinued.
        </span>
      </label>

      <div className="flex items-center gap-6">
        <label className="text-sm">
          <input
            type="checkbox"
            checked={data.featured}
            onChange={(e) => save({ featured: e.target.checked })}
            className="mr-2"
          />
          Featured on homepage
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

function Text({
  label,
  value,
  help,
  onSave,
}: {
  label: string;
  value: string;
  help?: string;
  onSave: (v: string) => void;
}) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => v !== value && onSave(v)}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      {help && <span className="mt-1 block text-xs text-muted-foreground">{help}</span>}
    </label>
  );
}

function Area({
  label,
  value,
  rows = 4,
  onSave,
}: {
  label: string;
  value: string;
  rows?: number;
  onSave: (v: string) => void;
}) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <textarea
        value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => v !== value && onSave(v)}
        rows={rows}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
    </label>
  );
}

function DecisionsEditor({
  value,
  onSave,
}: {
  value: Decision[];
  onSave: (d: Decision[]) => void;
}) {
  const [items, setItems] = useState<Decision[]>(value);
  useEffect(() => setItems(value), [value]);

  const commit = (next: Decision[]) => {
    setItems(next);
    onSave(next);
  };
  const update = (i: number, patch: Partial<Decision>) => {
    const next = items.map((d, j) => (j === i ? { ...d, ...patch } : d));
    setItems(next);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    commit(next);
  };

  return (
    <div className="block">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Decisions</span>
        <button
          type="button"
          onClick={() => commit([...items, { ...EMPTY_DECISION }])}
          className="rounded-md border border-border px-3 py-1 text-xs hover:border-primary"
        >
          + Add decision
        </button>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        What you chose, what you rejected, and why. Fields save when you leave them.
      </p>
      <ol className="mt-3 space-y-3">
        {items.length === 0 && (
          <li className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
            No decisions yet.
          </li>
        )}
        {items.map((d, i) => (
          <li key={i} className="rounded-md border border-border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Decision {i + 1}</span>
              <div className="flex gap-1">
                <IconBtn label="Move up" onClick={() => move(i, -1)} disabled={i === 0}>↑</IconBtn>
                <IconBtn label="Move down" onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</IconBtn>
                <IconBtn label="Remove" onClick={() => commit(items.filter((_, j) => j !== i))}>✕</IconBtn>
              </div>
            </div>
            <input
              placeholder="Title (e.g. Postgres over SQLite)"
              value={d.title}
              onChange={(e) => update(i, { title: e.target.value })}
              onBlur={() => onSave(items)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium"
            />
            <textarea
              placeholder="Chose…"
              value={d.chose}
              onChange={(e) => update(i, { chose: e.target.value })}
              onBlur={() => onSave(items)}
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Rejected… (optional)"
              value={d.rejected ?? ""}
              onChange={(e) => update(i, { rejected: e.target.value })}
              onBlur={() => onSave(items)}
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Why…"
              value={d.why}
              onChange={(e) => update(i, { why: e.target.value })}
              onBlur={() => onSave(items)}
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </li>
        ))}
      </ol>
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="h-7 w-7 rounded border border-border text-xs hover:border-primary disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function ImageField({
  label,
  value,
  onSave,
}: {
  label: string;
  value: string;
  onSave: (url: string) => void;
}) {
  const [v, setV] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => setV(value), [value]);

  async function upload(file: File) {
    setUploading(true);
    setErr(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload-project", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Upload failed");
      setV(json.publicUrl);
      onSave(json.publicUrl);
    } catch (e) {
      setErr(String(e));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1 flex gap-2">
        <input
          value={v}
          placeholder="https://… or upload"
          onChange={(e) => setV(e.target.value)}
          onBlur={() => v !== value && onSave(v)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <label className="shrink-0 cursor-pointer rounded-md border border-border px-3 py-2 text-sm hover:border-primary">
          {uploading ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
        </label>
      </div>
      {v && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={v} alt="" className="mt-2 max-h-56 rounded-md border border-border object-contain" />
      )}
      {err && <p className="mt-1 text-xs text-destructive">{err}</p>}
    </div>
  );
}
