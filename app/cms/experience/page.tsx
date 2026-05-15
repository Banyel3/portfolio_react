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

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatRange(start: string, end: string | null) {
  const s = new Date(start);
  const startLabel = `${MONTHS[s.getUTCMonth()]} ${s.getUTCFullYear()}`;
  if (!end) return `${startLabel} — Present`;
  const e = new Date(end);
  const endLabel = `${MONTHS[e.getUTCMonth()]} ${e.getUTCFullYear()}`;
  return `${startLabel} — ${endLabel}`;
}

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch("/api/experiences");
      const data = await res.json();
      setExperiences(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (id: string) => {
    if (
      !confirm(
        "Delete this experience? Its testimonials will be deleted too.",
      )
    )
      return;
    try {
      await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      setExperiences((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/cms"
                className="text-primary hover:underline text-sm mb-2 block"
              >
                ← Back to CMS
              </Link>
              <h1 className="text-3xl font-bold">Manage Experience</h1>
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
        ) : experiences.length === 0 ? (
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
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-6 rounded-lg bg-card border border-border flex items-start justify-between gap-4"
              >
                <div className="flex-1 space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    {formatRange(exp.startDate, exp.endDate)}
                  </span>
                  <h3 className="text-lg font-semibold">
                    {exp.company}
                    {exp.role && (
                      <span className="text-accent font-normal ml-2">
                        — {exp.role}
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {exp.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {exp.testimonials.length} testimonial
                    {exp.testimonials.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/cms/experience/${exp.id}`}
                    className="p-2 rounded hover:bg-accent/10 text-accent"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteExperience(exp.id)}
                    className="p-2 rounded hover:bg-red-500/10 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
