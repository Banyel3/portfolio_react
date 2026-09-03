import { CONTACT_EMAIL } from "@/lib/constants";

const FACTS = [
  { k: "Based", v: "Philippines · Remote" },
  { k: "Timezone", v: "UTC+8 · overlaps US/AU" },
  { k: "Outside work", v: "Home lab, keyboards, writing" },
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[380px_1fr] lg:gap-[72px]">
        <div className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-card">
          {/* Sharp photo underneath; the tinted grayscale copy above fades out on hover (opacity only, no filter animation) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/profile.png" alt="Vaniel Cornelio" className="h-full w-full object-cover" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/profile.png" alt="" className="h-full w-full object-cover grayscale contrast-[1.05]" />
            <div className="absolute inset-0 bg-primary opacity-80 mix-blend-color" />
          </div>
          <span className="absolute bottom-3.5 left-3.5 z-10 rounded-md border border-border bg-background/70 px-2.5 py-1.5 font-mono text-[11px] font-medium text-foreground backdrop-blur">
            vaniel@homelab:~$
          </span>
        </div>

        <div>
          <h2 className="reveal font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground md:text-[40px]">
            Real infrastructure.
            <br />
            Not a tutorial, not a sandbox.
          </h2>
          <p className="mt-4 max-w-[620px] text-base leading-relaxed text-muted-foreground">
            I optimize for systems that{" "}
            <strong className="font-medium text-foreground">
              stay up, deploy cleanly, and explain themselves under failure
            </strong>
            . The demo behind the status panel runs on Ubuntu Server with Docker, Nginx, and Cloudflare
            Tunnel, the same stack I would hand a team.
          </p>
          <p className="mt-4 max-w-[620px] text-base leading-relaxed text-muted-foreground">
            Looking for a team building real distributed backends: Postgres, queues, observability,
            Kubernetes. I work best where I can own deploys end-to-end.
          </p>

          <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            {FACTS.map((f) => (
              <div key={f.k} className="bg-card px-[18px] py-4">
                <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">{f.k}</dt>
                <dd className="mt-1.5 text-[15px] font-medium text-foreground">{f.v}</dd>
              </div>
            ))}
          </dl>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group mt-6 inline-flex items-center gap-2 font-mono text-[15px] font-medium text-accent hover:text-foreground"
          >
            {CONTACT_EMAIL}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
