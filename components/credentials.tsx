"use client";
import { useMemo, useState } from "react";

type Cert = { id: string; title: string; issuer: string; level?: string | null };
type Badge = { id: string; title: string; issuer: string; imageUrl?: string | null; badgeUrl?: string | null };
type Skill = { id: string; name: string; category?: string | null; proficiency?: string | null; context?: string | null };

const UNCATEGORIZED_KEY = "__uncategorized__";

type Tab = "certs" | "badges" | "skills";

export default function Credentials({
  certificates,
  badges,
  skills,
}: {
  certificates: Cert[];
  badges: Badge[];
  skills: Skill[];
}) {
  const [tab, setTab] = useState<Tab>("certs");
  const certs = Array.isArray(certificates) ? certificates : [];
  const bdg = Array.isArray(badges) ? badges : [];
  const sk = Array.isArray(skills) ? skills : [];

  const groupedSkills = useMemo(() => {
    const map = new Map<string, Skill[]>();
    for (const s of sk) {
      const cat = s.category && s.category.trim().length > 0 ? s.category : UNCATEGORIZED_KEY;
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(s);
    }
    const entries = Array.from(map.entries());
    entries.sort(([a], [b]) => {
      if (a === UNCATEGORIZED_KEY) return 1;
      if (b === UNCATEGORIZED_KEY) return -1;
      return a.localeCompare(b);
    });
    return entries;
  }, [sk]);

  return (
    <section id="credentials" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <header className="mb-8">
        <p className="label text-xs uppercase tracking-wide text-muted-foreground">
          Credentials
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Certifications, badges &amp; skills
        </h2>
      </header>

      <div className="mb-6 flex gap-2">
        <TabBtn active={tab === "certs"} onClick={() => setTab("certs")} count={certs.length}>
          Certifications
        </TabBtn>
        <TabBtn active={tab === "badges"} onClick={() => setTab("badges")} count={bdg.length}>
          Badges
        </TabBtn>
        <TabBtn active={tab === "skills"} onClick={() => setTab("skills")} count={sk.length}>
          Skills
        </TabBtn>
      </div>

      {tab === "certs" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-4 rounded-lg border border-border p-4 transition hover:border-primary"
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{c.title}</div>
                {c.issuer && <div className="text-xs text-muted-foreground">{c.issuer}</div>}
                {c.level && (
                  <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                    {c.level}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "badges" && (
        <div className="flex flex-wrap gap-4">
          {bdg.map((b) => (
            <a
              key={b.id}
              href={b.badgeUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center"
              title={b.title}
            >
              {b.imageUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={b.imageUrl} alt={b.title} className="h-16 w-16 object-contain" />
              )}
              <span className="mt-1 max-w-[6rem] truncate text-xs">{b.title}</span>
            </a>
          ))}
        </div>
      )}

      {tab === "skills" && (
        groupedSkills.length === 0 ? (
          <p className="text-sm text-muted-foreground">No skills yet.</p>
        ) : (
          <div className="space-y-6">
            {groupedSkills.map(([category, items]) => (
              <div key={category}>
                <h3 className="mb-3 text-xs uppercase tracking-widest text-muted-foreground font-display">
                  {category === UNCATEGORIZED_KEY ? "Other" : category}
                  <span className="ml-2 text-[10px] opacity-60">{items.length}</span>
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((s) => (
                    <div key={s.id} className="rounded-lg border border-border p-3 transition hover:border-primary/50">
                      <div className="font-medium">{s.name}</div>
                      {(s.proficiency || s.context) && (
                        <div className="text-xs text-muted-foreground">
                          {[s.proficiency, s.context].filter(Boolean).join(" · ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </section>
  );
}

function TabBtn({
  active, onClick, children, count,
}: { active: boolean; onClick: () => void; children: React.ReactNode; count: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm transition ${
        active
          ? "bg-primary text-primary-foreground"
          : "border border-border text-muted-foreground hover:border-primary hover:text-foreground"
      }`}
    >
      {children}
      <span className="ml-1.5 text-xs opacity-70">{count}</span>
    </button>
  );
}
