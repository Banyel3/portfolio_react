"use client";
import { useMemo, useState } from "react";
import SectionHeader from "@/components/section-header";

type Cert = { id: string; title: string; issuer: string; level?: string | null; date?: string };
type Badge = { id: string; title: string; issuer: string; imageUrl?: string | null; badgeUrl?: string | null };
type Skill = { id: string; name: string; category?: string | null; proficiency?: string | null; context?: string | null };

type Tab = "skills" | "badges" | "certs";
const TABS: { key: Tab; label: string }[] = [
  { key: "skills", label: "Skills" },
  { key: "badges", label: "Badges" },
  { key: "certs", label: "Certifications" },
];

const UNCATEGORIZED = "__uncategorized__";

export default function Credentials({
  certificates,
  badges,
  skills,
}: {
  certificates: Cert[];
  badges: Badge[];
  skills: Skill[];
}) {
  const [tab, setTab] = useState<Tab>("skills");
  const certs = Array.isArray(certificates) ? certificates : [];
  const bdg = Array.isArray(badges) ? badges : [];
  const sk = Array.isArray(skills) ? skills : [];
  const counts: Record<Tab, number> = { skills: sk.length, badges: bdg.length, certs: certs.length };
  const idx = TABS.findIndex((t) => t.key === tab);

  const grouped = useMemo(() => {
    const map = new Map<string, Skill[]>();
    for (const s of sk) {
      const cat = s.category?.trim() ? s.category : UNCATEGORIZED;
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(s);
    }
    return Array.from(map.entries()).sort(([a], [b]) =>
      a === UNCATEGORIZED ? 1 : b === UNCATEGORIZED ? -1 : a.localeCompare(b),
    );
  }, [sk]);

  return (
    <section id="credentials" className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
      <SectionHeader
        title="Credentials"
        aside={
          <div
            role="tablist"
            aria-label="Credential type"
            className="relative grid grid-cols-3 rounded-[10px] border border-border bg-card p-[3px]"
          >
            <span
              aria-hidden
              className="absolute bottom-[3px] top-[3px] w-[calc((100%-6px)/3)] rounded-lg bg-background shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-transform duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateX(calc(${idx} * 100% + ${idx * 3}px))`, left: 3 }}
            />
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                type="button"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`relative z-10 rounded-lg px-4 py-2 text-[13.5px] font-medium transition-colors ${
                  tab === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
                <b className="ml-1.5 font-mono text-[11px] font-medium text-muted-foreground">{counts[t.key]}</b>
              </button>
            ))}
          </div>
        }
      />

      <div key={tab} className="animate-fade-in">
        {tab === "skills" &&
          (grouped.length === 0 ? (
            <Empty>No skills yet.</Empty>
          ) : (
            <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {grouped.map(([category, items]) => (
                <div key={category}>
                  <h4 className="mb-3 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground after:h-px after:flex-1 after:bg-border after:content-['']">
                    {category === UNCATEGORIZED ? "Other" : category}
                  </h4>
                  <ul className="flex flex-wrap gap-2">
                    {items.map((s, i) => (
                      <li
                        key={s.id}
                        title={[s.proficiency, s.context].filter(Boolean).join(" · ") || undefined}
                        className="animate-fade-up rounded-lg border border-border bg-card px-3 py-[7px] text-[13.5px] font-medium text-foreground transition-[border-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:border-primary"
                        style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
                      >
                        {s.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}

        {tab === "badges" &&
          (bdg.length === 0 ? (
            <Empty>No badges yet.</Empty>
          ) : (
            <div className="flex flex-wrap gap-4">
              {bdg.map((b) => (
                <a
                  key={b.id}
                  href={b.badgeUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 rounded-xl border border-border bg-card py-3 pl-3 pr-4 transition-colors hover:border-primary"
                >
                  {b.imageUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={b.imageUrl} alt="" className="h-14 w-14 object-contain" />
                  )}
                  <span>
                    <b className="block text-sm font-semibold text-foreground">{b.title}</b>
                    <span className="text-[13px] text-muted-foreground">{b.issuer}</span>
                  </span>
                </a>
              ))}
            </div>
          ))}

        {tab === "certs" &&
          (certs.length === 0 ? (
            <Empty>No certifications yet.</Empty>
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {certs.map((c) => (
                <li key={c.id} className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary">
                  <div className="truncate font-medium text-foreground">{c.title}</div>
                  <div className="mt-0.5 text-[13px] text-muted-foreground">
                    {[c.issuer, c.date].filter(Boolean).join(" · ")}
                  </div>
                  {c.level && (
                    <div className="mt-2 inline-block rounded border border-border px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {c.level}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ))}
      </div>
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">{children}</p>;
}
