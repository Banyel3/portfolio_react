"use client";

import { Quote } from "lucide-react";

interface ExperienceTestimonial {
  id: string;
  authorName: string;
  authorRole?: string | null;
  quote: string;
}

interface Experience {
  id: string;
  company: string;
  role?: string | null;
  location?: string | null;
  description: string;
  outcomes: string | null;
  stack: string[];
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

export default function Experience({
  initialExperiences = [],
}: {
  initialExperiences?: Experience[];
}) {
  const experiences = Array.isArray(initialExperiences)
    ? initialExperiences
    : [];

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14 space-y-3 animate-fade-up">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            — Experience
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Where I&apos;ve worked.
          </h2>
        </div>

        <ol className="relative border-l-2 border-border ml-3 space-y-10">
            {experiences.map((exp, i) => {
              const isPresent = exp.endDate === null;
              return (
              <li
                key={exp.id}
                className="relative pl-8 animate-fade-up"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <span
                  aria-hidden
                  className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-background border-2 border-primary ${
                    isPresent ? "animate-pulse-dot" : ""
                  }`}
                />

                <div className="inline-block mb-3">
                  <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-display font-semibold tracking-wide shadow-sm shadow-primary/30">
                    {formatRange(exp.startDate, exp.endDate)}
                  </span>
                </div>

                <div className="rounded-lg border border-border bg-card p-5 md:p-6 space-y-3 transition-all duration-300 hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-lg md:text-xl font-display font-bold text-foreground">
                      {exp.company}
                    </h3>
                    {exp.role && (
                      <span className="text-sm text-accent font-medium">
                        {exp.role}
                      </span>
                    )}
                    {exp.location && (
                      <span className="text-xs text-muted-foreground">
                        · {exp.location}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>

                  {exp.outcomes && (
                    <p className="mt-3 text-sm font-medium text-primary">
                      ↳ {exp.outcomes}
                    </p>
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

                  {exp.testimonials.length > 0 && (
                    <div className="pt-4 mt-2 border-t border-border space-y-4">
                      {exp.testimonials.map((t) => (
                        <figure
                          key={t.id}
                          className="rounded-md bg-background/40 border border-border/60 p-4"
                        >
                          <Quote className="w-4 h-4 text-primary/60 mb-2" />
                          <blockquote className="text-sm text-foreground/90 italic leading-relaxed">
                            “{t.quote}”
                          </blockquote>
                          <figcaption className="mt-3 text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground/80">
                              {t.authorName}
                            </span>
                            {t.authorRole && <span> — {t.authorRole}</span>}
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  )}
                </div>
              </li>
              );
            })}
          </ol>
      </div>
    </section>
  );
}
