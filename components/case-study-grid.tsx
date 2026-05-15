import Link from "next/link";

type CaseStudyCard = {
  id: string;
  slug: string;
  title: string;
  role: string | null;
  summary: string;
  stack: string[];
  architecture: string | null;
};

export default function CaseStudyGrid({
  caseStudies,
}: {
  caseStudies: CaseStudyCard[];
}) {
  if (!Array.isArray(caseStudies) || caseStudies.length === 0) {
    // Anchor target preserved so hero "#work" CTA still scrolls somewhere.
    return <section id="work" className="sr-only" aria-hidden="true" />;
  }

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <header className="mb-10">
        <p className="label text-xs uppercase tracking-wide text-muted-foreground">
          Featured work
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Case Studies
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {caseStudies.map((cs, i) => (
          <Link
            key={cs.id}
            href={`/work/${cs.slug}`}
            className="group flex flex-col rounded-xl border border-border bg-card/50 p-6 transition hover:border-primary hover:bg-card animate-fade-up"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            {cs.architecture && (
              <div className="mb-4 aspect-video overflow-hidden rounded-md border border-border bg-background">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cs.architecture}
                  alt={`${cs.title} architecture`}
                  className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                />
              </div>
            )}
            <div className="mb-2 flex flex-wrap gap-1.5">
              {cs.stack.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
            <h3 className="font-display text-xl font-semibold group-hover:text-primary">
              {cs.title}
            </h3>
            {cs.role && (
              <p className="mt-0.5 text-xs text-muted-foreground">{cs.role}</p>
            )}
            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
              {cs.summary}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
              Read case study →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
