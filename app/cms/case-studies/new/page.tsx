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
