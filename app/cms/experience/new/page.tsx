"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function NewExperience() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company: "",
    role: "",
    location: "",
    description: "",
    outcomes: "",
    stack: "",
    startMonth: new Date().getMonth() + 1,
    startYear: CURRENT_YEAR,
    endMonth: new Date().getMonth() + 1,
    endYear: CURRENT_YEAR,
    isCurrent: false,
  });

  const handleChange = (
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
          : type === "number" || name.endsWith("Month") || name.endsWith("Year")
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const startDate = new Date(
        Date.UTC(form.startYear, form.startMonth - 1, 1),
      ).toISOString();
      const endDate = form.isCurrent
        ? null
        : new Date(
            Date.UTC(form.endYear, form.endMonth - 1, 1),
          ).toISOString();

      const res = await fetch("/api/experiences", {
        method: "POST",
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
      if (res.ok) {
        const created = await res.json();
        router.push(`/cms/experience/${created.id}`);
      }
    } catch (error) {
      console.error("Error creating experience:", error);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold">Add New Experience</h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Company *</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
              placeholder="Acme Corp"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <input
                type="text"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
                placeholder="Backend Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
                placeholder="Remote"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Start *</label>
            <div className="grid grid-cols-2 gap-4">
              <select
                name="startMonth"
                value={form.startMonth}
                onChange={handleChange}
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
                onChange={handleChange}
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
                  onChange={handleChange}
                  className="accent-primary"
                />
                Currently working here
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select
                name="endMonth"
                value={form.endMonth}
                onChange={handleChange}
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
                onChange={handleChange}
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
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none resize-none"
              placeholder="What did you do at this role?"
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
              onChange={handleChange}
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
              onChange={handleChange}
              placeholder="Node.js, PostgreSQL, AWS"
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Experience"}
            </button>
            <Link
              href="/cms/experience"
              className="px-6 py-2 rounded-lg border border-border hover:bg-card"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
