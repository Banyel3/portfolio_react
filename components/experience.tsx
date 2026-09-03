import SectionHeader from "@/components/section-header";

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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatRange(start: string, end: string | null) {
  const s = new Date(start);
  const startLabel = `${MONTHS[s.getUTCMonth()]} ${s.getUTCFullYear()}`;
  if (!end) return `${startLabel} — Present`;
  const e = new Date(end);
  return `${startLabel} — ${MONTHS[e.getUTCMonth()]} ${e.getUTCFullYear()}`;
}

// One Experience row per role. Rows sharing a company name (case-insensitive)
// render as one company block with the roles stacked newest first, so a
// promotion or a second contract at the same place reads as one tenure.
function groupByCompany(list: Experience[]) {
  const groups = new Map<string, { company: string; location: string | null; roles: Experience[] }>();
  for (const exp of list) {
    const key = exp.company.trim().toLowerCase();
    if (!groups.has(key)) groups.set(key, { company: exp.company, location: exp.location ?? null, roles: [] });
    groups.get(key)!.roles.push(exp);
  }
  // Input is already newest-first; group order follows each company's newest role.
  return Array.from(groups.values());
}

export default function Experience({ initialExperiences = [] }: { initialExperiences?: Experience[] }) {
  const experiences = Array.isArray(initialExperiences) ? initialExperiences : [];
  if (experiences.length === 0) return null;
  const groups = groupByCompany(experiences);

  return (
    <section id="experience" className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
      <SectionHeader title="Experience">Contract and remote roles. Outcomes over duties.</SectionHeader>

      {groups.map((g) => {
        const isPresent = g.roles.some((r) => r.endDate === null);
        const span = formatRange(g.roles[g.roles.length - 1].startDate, isPresent ? null : g.roles[0].endDate);
        return (
          <article
            key={g.company}
            className="grid grid-cols-1 gap-4 border-t border-border py-9 first-of-type:border-t-0 md:grid-cols-[200px_1fr] md:gap-12"
          >
            <div className="relative pt-1 font-mono text-[13px] font-medium text-muted-foreground">
              <span
                aria-hidden
                className={`mr-3 inline-block h-2.5 w-2.5 rounded-full border-2 border-primary align-middle md:absolute md:-right-7 md:top-2 md:mr-0 ${
                  isPresent ? "bg-primary animate-pulse-dot" : "bg-background"
                }`}
              />
              {span}
            </div>

            <div>
              <h3 className="font-display text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground">
                {g.company}
                {g.location && (
                  <small className="mt-1 block text-sm font-medium tracking-normal text-muted-foreground">{g.location}</small>
                )}
              </h3>

              <ol className={g.roles.length > 1 ? "mt-5 space-y-7 border-l border-border pl-5" : "mt-3"}>
                {g.roles.map((exp) => {
                  const stack = exp.stack.filter(Boolean);
                  const multi = g.roles.length > 1;
                  return (
                    <li key={exp.id} className="relative">
                      {multi && (
                        <span
                          aria-hidden
                          className={`absolute -left-[25px] top-1.5 h-2 w-2 rounded-full ${exp.endDate === null ? "bg-primary" : "bg-border"}`}
                        />
                      )}
                      {exp.role && (
                        <p className="text-base font-medium text-accent">
                          {exp.role}
                          {multi && (
                            <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                              {formatRange(exp.startDate, exp.endDate)}
                            </span>
                          )}
                        </p>
                      )}
                      <p className="mt-2 max-w-[640px] whitespace-pre-line leading-relaxed text-muted-foreground">{exp.description}</p>
                      {exp.outcomes && <p className="mt-3 max-w-[640px] text-sm font-medium text-primary">{exp.outcomes}</p>}

                      {stack.length > 0 && (
                        <div className="mt-3.5 flex flex-wrap gap-1.5">
                          {stack.slice(0, 8).map((s) => (
                            <span key={s} className="rounded-md border border-border px-2 py-1 font-mono text-xs text-muted-foreground">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {exp.testimonials.map((t) => (
                        <blockquote
                          key={t.id}
                          className="relative mt-6 max-w-[720px] rounded-xl border border-border bg-card px-[26px] py-[22px] before:absolute before:-left-px before:bottom-5 before:top-5 before:w-px before:bg-accent"
                        >
                          <p className="text-base leading-[1.6] text-foreground">“{t.quote.trim()}”</p>
                          <footer className="mt-3 text-[13px] font-medium text-muted-foreground">
                            <b className="font-semibold text-foreground">{t.authorName}</b>
                            {t.authorRole && <> · {t.authorRole}, {g.company}</>}
                          </footer>
                        </blockquote>
                      ))}
                    </li>
                  );
                })}
              </ol>
            </div>
          </article>
        );
      })}
    </section>
  );
}
