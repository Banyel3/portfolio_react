"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Edit2, Plus } from "lucide-react";

interface ExperienceTestimonial {
  id: string;
  authorName: string;
}

interface Experience {
  id: string;
  company: string;
  role?: string | null;
  location?: string | null;
  description: string;
  startDate: string;
  endDate: string | null;
  testimonials: ExperienceTestimonial[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatRange(start: string, end: string | null) {
  const s = new Date(start);
  const startLabel = `${MONTHS[s.getUTCMonth()]} ${s.getUTCFullYear()}`;
  if (!end) return `${startLabel} — Present`;
  const e = new Date(end);
  return `${startLabel} — ${MONTHS[e.getUTCMonth()]} ${e.getUTCFullYear()}`;
}

// One Experience row = one role. Rows with the same company name are one
// group here and one block on the public site, so "another role at the same
// company" is just another row with the same company.
function groupByCompany(list: Experience[]) {
  const groups = new Map<string, { company: string; location: string | null; roles: Experience[] }>();
  for (const exp of list) {
    const key = exp.company.trim().toLowerCase();
    if (!groups.has(key)) groups.set(key, { company: exp.company, location: exp.location ?? null, roles: [] });
    groups.get(key)!.roles.push(exp);
  }
  return Array.from(groups.values());
}

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/experiences")
      .then((r) => r.json())
      .then((data) => setExperiences(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error fetching experiences:", error))
      .finally(() => setLoading(false));
  }, []);

  const deleteExperience = async (id: string) => {
    if (!confirm("Delete this role? Its testimonials will be deleted too.")) return;
    try {
      await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      setExperiences((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  const groups = groupByCompany(experiences);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/cms" className="text-primary hover:underline text-sm mb-2 block">
                ← Back to CMS
              </Link>
              <h1 className="text-3xl font-bold">Manage Experience</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                One entry per role. Entries with the same company name are shown as one company on the site.
              </p>
            </div>
            <Link
              href="/cms/experience/new"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No experience yet</p>
            <Link
              href="/cms/experience/new"
              className="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Add your first experience
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map((g) => {
              const addRoleHref = `/cms/experience/new?company=${encodeURIComponent(g.company)}${
                g.location ? `&location=${encodeURIComponent(g.location)}` : ""
              }`;
              return (
                <section key={g.company.toLowerCase()} className="rounded-lg border border-border bg-card">
                  <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
                    <div>
                      <h2 className="text-lg font-semibold">{g.company}</h2>
                      <p className="text-xs text-muted-foreground">
                        {[g.location, `${g.roles.length} role${g.roles.length === 1 ? "" : "s"}`]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <Link
                      href={addRoleHref}
                      className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:border-primary"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add role
                    </Link>
                  </div>
                  <ul className="divide-y divide-border">
                    {g.roles.map((exp) => (
                      <li key={exp.id} className="flex items-start justify-between gap-4 px-6 py-4">
                        <div className="flex-1 space-y-1.5">
                          <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                            {formatRange(exp.startDate, exp.endDate)}
                          </span>
                          <h3 className="font-medium">{exp.role || <span className="text-muted-foreground">No role title</span>}</h3>
                          <p className="line-clamp-2 text-sm text-muted-foreground">{exp.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {exp.testimonials.length} testimonial{exp.testimonials.length === 1 ? "" : "s"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/cms/experience/${exp.id}`} className="p-2 rounded hover:bg-accent/10 text-accent" aria-label="Edit role">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => deleteExperience(exp.id)}
                            className="p-2 rounded hover:bg-red-500/10 text-red-500"
                            aria-label="Delete role"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
