import Link from "next/link";
import ProjectThumb from "@/components/project-thumb";
import SectionHeader from "@/components/section-header";
import ScanLine from "@/components/scan-line";

type Status = "ACTIVE" | "WIP" | "DISCONTINUED";

type CaseStudyCard = {
  id: string;
  slug: string;
  title: string;
  role: string | null;
  summary: string;
  stack: string[];
  architecture: string | null;
  status: Status;
  project?: { images: string[]; category: string } | null;
};

// Active projects lead with no label. The other two groups get a subheading
// and a status pill on each card so the state is unmistakable.
const GROUPS: { status: Status; heading: string | null; pill: string | null; pillClass: string }[] = [
  { status: "ACTIVE", heading: null, pill: null, pillClass: "" },
  {
    status: "WIP",
    heading: "Work in progress",
    pill: "In progress",
    pillClass: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  },
  {
    status: "DISCONTINUED",
    heading: "Discontinued",
    pill: "Discontinued",
    pillClass: "border-border bg-muted text-muted-foreground",
  },
];

export default function CaseStudyGrid({ caseStudies }: { caseStudies: CaseStudyCard[] }) {
  if (!Array.isArray(caseStudies) || caseStudies.length === 0) {
    // Anchor target preserved so hero "#work" CTA still scrolls somewhere.
    return <section id="work" className="sr-only" aria-hidden="true" />;
  }

  let rowIndex = 0;

  return (
    <section id="work" className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
      <SectionHeader title="Projects">
        Each one opens into a case study: the problem, the decisions I made and rejected, how it runs,
        and what I would change.
      </SectionHeader>

      {GROUPS.map((g) => {
        const items = caseStudies.filter((cs) => (cs.status ?? "ACTIVE") === g.status);
        if (items.length === 0) return null;
        return (
          <div key={g.status} className={g.heading ? "mt-16" : ""}>
            {g.heading && (
              <h3 className="mb-2 flex items-center gap-3 font-display text-xl font-semibold tracking-[-0.02em] text-foreground after:h-px after:flex-1 after:bg-border after:content-['']">
                {g.heading}
                <span className="font-mono text-xs font-medium text-muted-foreground">{items.length}</span>
              </h3>
            )}

            {items.map((cs) => {
              const flip = rowIndex++ % 2 === 1;
              return (
                <Link
                  key={cs.id}
                  href={`/work/${cs.slug}`}
                  className={`group grid grid-cols-1 items-center gap-8 border-t border-border py-10 first-of-type:border-t-0 lg:grid-cols-2 lg:gap-14 ${
                    flip ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div>
                    <h3 className="font-display text-3xl font-semibold leading-[1.1] tracking-[-0.025em] text-foreground transition-colors group-hover:text-primary">
                      {cs.title}
                      {g.pill && (
                        <span
                          className={`ml-3 inline-block align-middle rounded-md border px-2 py-0.5 font-mono text-[11px] font-medium tracking-[0.04em] ${g.pillClass}`}
                        >
                          {g.pill}
                        </span>
                      )}
                    </h3>
                    {cs.role && (
                      <p className="mt-2 font-mono text-[13px] font-medium tracking-[0.02em] text-accent">{cs.role}</p>
                    )}
                    <p className="mt-4 max-w-[520px] text-[15.5px] leading-relaxed text-muted-foreground">{cs.summary}</p>
                    {cs.stack.length > 0 && (
                      <div className="mt-[18px] flex flex-wrap gap-1.5">
                        {cs.stack.slice(0, 6).map((s) => (
                          <span key={s} className="rounded-md border border-border px-2 py-1 font-mono text-xs text-muted-foreground">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                      Read the case study <span className="font-mono text-accent">/work/{cs.slug}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                        <path d="M5 12h14m-6-6 6 6-6 6" />
                      </svg>
                    </span>
                  </div>

                  <div className="relative">
                    <ProjectThumb
                      title={cs.title}
                      src={cs.project?.images?.find(Boolean) ?? cs.architecture}
                      label={`/work/${cs.slug}`}
                      category={cs.project?.category ?? cs.role}
                      tech={cs.stack}
                      className={`rounded-xl border border-border shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] ${
                        g.status === "DISCONTINUED" ? "opacity-80 saturate-50 transition-[opacity,filter] duration-500 group-hover:opacity-100 group-hover:saturate-100" : ""
                      }`}
                    />
                    <ScanLine />
                  </div>
                </Link>
              );
            })}
          </div>
        );
      })}
    </section>
  );
}
