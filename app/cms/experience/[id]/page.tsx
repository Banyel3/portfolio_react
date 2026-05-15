"use client";

import type React from "react";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Plus } from "lucide-react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, i) => CURRENT_YEAR + 2 - i);

interface Testimonial {
  id: string;
  authorName: string;
  authorRole?: string | null;
  quote: string;
}

interface ExperienceData {
  id: string;
  company: string;
  role: string | null;
  location: string | null;
  description: string;
  outcomes: string | null;
  stack: string[];
  startDate: string;
  endDate: string | null;
  testimonials: Testimonial[];
}

export default function EditExperience({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company: "",
    role: "",
    location: "",
    description: "",
    outcomes: "",
    stack: "",
    startMonth: 1,
    startYear: CURRENT_YEAR,
    endMonth: 1,
    endYear: CURRENT_YEAR,
    isCurrent: false,
  });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [newTestimonial, setNewTestimonial] = useState({
    authorName: "",
    authorRole: "",
    quote: "",
  });
  const [addingTestimonial, setAddingTestimonial] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/experiences/${id}`);
        if (!res.ok) return;
        const data: ExperienceData = await res.json();
        const start = new Date(data.startDate);
        const end = data.endDate ? new Date(data.endDate) : null;
        setForm({
          company: data.company,
          role: data.role ?? "",
          location: data.location ?? "",
          description: data.description,
          outcomes: data.outcomes ?? "",
          stack: (data.stack ?? []).join(", "),
          startMonth: start.getUTCMonth() + 1,
          startYear: start.getUTCFullYear(),
          endMonth: end ? end.getUTCMonth() + 1 : new Date().getMonth() + 1,
          endYear: end ? end.getUTCFullYear() : CURRENT_YEAR,
          isCurrent: end === null,
        });
        setTestimonials(data.testimonials);
      } catch (error) {
        console.error("Error loading experience:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : undefined;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name.endsWith("Month") || name.endsWith("Year")
            ? Number(value)
            : value,
    }));
  };

  const saveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const startDate = new Date(
        Date.UTC(form.startYear, form.startMonth - 1, 1),
      ).toISOString();
      const endDate = form.isCurrent
        ? null
        : new Date(
            Date.UTC(form.endYear, form.endMonth - 1, 1),
          ).toISOString();
      const res = await fetch(`/api/experiences/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: form.company,
          role: form.role,
          location: form.location,
          description: form.description,
          outcomes: form.outcomes,
          stack: form.stack
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          startDate,
          endDate,
        }),
      });
      if (res.ok) router.push("/cms/experience");
    } catch (error) {
      console.error("Error saving experience:", error);
    } finally {
      setSaving(false);
    }
  };

  const addTestimonial = async () => {
    if (!newTestimonial.authorName || !newTestimonial.quote) return;
    setAddingTestimonial(true);
    try {
      const res = await fetch(`/api/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experienceId: id, ...newTestimonial }),
      });
      if (res.ok) {
        const created: Testimonial = await res.json();
        setTestimonials((prev) => [...prev, created]);
        setNewTestimonial({ authorName: "", authorRole: "", quote: "" });
      }
    } catch (error) {
      console.error("Error adding testimonial:", error);
    } finally {
      setAddingTestimonial(false);
    }
  };

  const deleteTestimonial = async (testimonialId: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await fetch(`/api/testimonials/${testimonialId}`, { method: "DELETE" });
      setTestimonials((prev) => prev.filter((t) => t.id !== testimonialId));
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/cms/experience"
            className="text-primary hover:underline text-sm mb-2 block"
          >
            ← Back to Experience
          </Link>
          <h1 className="text-3xl font-bold">Edit Experience</h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <form onSubmit={saveExperience} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Company *</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleFormChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <input
                type="text"
                name="role"
                value={form.role}
                onChange={handleFormChange}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleFormChange}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Start *</label>
            <div className="grid grid-cols-2 gap-4">
              <select
                name="startMonth"
                value={form.startMonth}
                onChange={handleFormChange}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                name="startYear"
                value={form.startYear}
                onChange={handleFormChange}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">End</label>
              <label className="text-sm flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isCurrent"
                  checked={form.isCurrent}
                  onChange={handleFormChange}
                  className="accent-primary"
                />
                Currently working here
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select
                name="endMonth"
                value={form.endMonth}
                onChange={handleFormChange}
                disabled={form.isCurrent}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none disabled:opacity-50"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                name="endYear"
                value={form.endYear}
                onChange={handleFormChange}
                disabled={form.isCurrent}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none disabled:opacity-50"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleFormChange}
              required
              rows={5}
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Outcomes (quantified result)
            </label>
            <input
              type="text"
              name="outcomes"
              value={form.outcomes}
              onChange={handleFormChange}
              placeholder="Reduced API latency by 40% via caching"
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Stack (comma-separated)
            </label>
            <input
              type="text"
              name="stack"
              value={form.stack}
              onChange={handleFormChange}
              placeholder="Node.js, PostgreSQL, AWS"
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/cms/experience"
              className="px-6 py-2 rounded-lg border border-border hover:bg-card"
            >
              Cancel
            </Link>
          </div>
        </form>

        <section className="border-t border-border pt-10">
          <h2 className="text-2xl font-bold mb-6">Testimonials</h2>

          <div className="space-y-4 mb-8">
            {testimonials.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No testimonials yet for this role.
              </p>
            ) : (
              testimonials.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-lg bg-card border border-border flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <p className="text-sm italic mb-2">“{t.quote}”</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground/80">
                        {t.authorName}
                      </span>
                      {t.authorRole && <span> — {t.authorRole}</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteTestimonial(t.id)}
                    className="p-2 rounded hover:bg-red-500/10 text-red-500"
                    aria-label="Delete testimonial"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              Add testimonial
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Author name *"
                value={newTestimonial.authorName}
                onChange={(e) =>
                  setNewTestimonial((p) => ({
                    ...p,
                    authorName: e.target.value,
                  }))
                }
                className="px-3 py-2 rounded-lg bg-background border border-border focus:border-primary outline-none text-sm"
              />
              <input
                type="text"
                placeholder="Author role (optional)"
                value={newTestimonial.authorRole}
                onChange={(e) =>
                  setNewTestimonial((p) => ({
                    ...p,
                    authorRole: e.target.value,
                  }))
                }
                className="px-3 py-2 rounded-lg bg-background border border-border focus:border-primary outline-none text-sm"
              />
            </div>
            <textarea
              placeholder="Quote *"
              rows={3}
              value={newTestimonial.quote}
              onChange={(e) =>
                setNewTestimonial((p) => ({ ...p, quote: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary outline-none text-sm resize-none"
            />
            <button
              type="button"
              onClick={addTestimonial}
              disabled={
                addingTestimonial ||
                !newTestimonial.authorName ||
                !newTestimonial.quote
              }
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 text-sm"
            >
              {addingTestimonial ? "Adding..." : "Add testimonial"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
