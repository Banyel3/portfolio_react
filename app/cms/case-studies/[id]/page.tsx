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
      <JsonArea
        label="Decisions (JSON array)"
        value={data.decisions}
        onSave={(parsed) => save({ decisions: parsed })}
      />
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

function JsonArea({
  label,
  value,
  onSave,
}: {
  label: string;
  value: unknown;
  onSave: (parsed: unknown) => void;
}) {
  const [v, setV] = useState(JSON.stringify(value ?? [], null, 2));
  const [err, setErr] = useState<string | null>(null);
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <textarea
        value={v}
        onChange={(e) => {
          setV(e.target.value);
          setErr(null);
        }}
        onBlur={() => {
          try {
            const parsed = JSON.parse(v);
            onSave(parsed);
          } catch {
            setErr("Invalid JSON");
          }
        }}
        rows={10}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
        placeholder='[{ "title": "...", "chose": "...", "rejected": "...", "why": "..." }]'
      />
      {err && <p className="text-xs text-destructive">{err}</p>}
    </label>
  );
}
