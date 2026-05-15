// server-only — do not add "use client"; passes raw Prisma types
import Link from "next/link";

type Decision = { title: string; chose: string; rejected?: string; why: string };

export type CaseStudyPageProps = {
  title: string;
  slug: string;
  role: string | null;
  summary: string;
  problem: string;
  decisions: Decision[];
  architecture: string | null;
  ops: string | null;
  reflections: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  stack: string[];
};

export default function CaseStudyPage(props: CaseStudyPageProps) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12 sm:py-20">
      <Link href="/#work" className="text-sm text-muted-foreground hover:underline">
        ← All case studies
      </Link>

      <header className="mt-4 mb-10">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">{props.title}</h1>
        {props.role && (
          <p className="mt-2 text-sm text-muted-foreground">{props.role}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {props.stack.map((s) => (
            <span
              key={s}
              className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
        <p className="mt-6 max-w-prose text-lg leading-relaxed">{props.summary}</p>
      </header>

      <Section title="Problem">
        <p className="max-w-prose whitespace-pre-line">{props.problem}</p>
      </Section>

      {props.decisions.length > 0 && (
        <Section title="Decisions">
          <ol className="space-y-6">
            {props.decisions.map((d, i) => (
              <li key={i} className="rounded-lg border border-border p-5">
                <h3 className="font-semibold">
                  {i + 1}. {d.title}
                </h3>
                <p className="mt-2 text-sm">
                  <strong>Chose:</strong> {d.chose}
                </p>
                {d.rejected && (
                  <p className="mt-1 text-sm">
                    <strong>Rejected:</strong> {d.rejected}
                  </p>
                )}
                <p className="mt-2 text-sm text-muted-foreground">
                  <strong>Why:</strong> {d.why}
                </p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {props.architecture && (
        <Section title="Architecture">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={props.architecture}
            alt={`${props.title} architecture`}
            className="w-full rounded-lg border border-border"
          />
        </Section>
      )}

      {props.ops && (
        <Section title="Operations">
          <pre className="max-w-prose whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
            {props.ops}
          </pre>
        </Section>
      )}

      {props.reflections && (
        <Section title="What I'd do differently">
          <p className="max-w-prose whitespace-pre-line">{props.reflections}</p>
        </Section>
      )}

      <Section title="Try it">
        <div className="flex flex-wrap gap-3">
          {props.liveUrl && (
            <a
              href={props.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Live demo →
            </a>
          )}
          {props.repoUrl && (
            <a
              href={props.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:border-primary"
            >
              View source →
            </a>
          )}
        </div>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 font-display text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}
