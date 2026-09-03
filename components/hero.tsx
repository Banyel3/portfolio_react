import { Github, Linkedin, Mail } from "lucide-react";
import {
  AVAILABILITY,
  RESUME_PATH,
  CONTACT_EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
} from "@/lib/constants";
import InfraStatusCard from "@/components/infra-status-card";

const SOCIALS = [
  { href: `mailto:${CONTACT_EMAIL}`, label: "Email", Icon: Mail, external: false },
  { href: GITHUB_URL, label: "GitHub", Icon: Github, external: true },
  { href: LINKEDIN_URL, label: "LinkedIn", Icon: Linkedin, external: true },
];

export default function Hero() {
  return (
    <header className="relative overflow-hidden px-6 pb-20 pt-32 md:px-12 md:pt-40">
      {/* Ambient glow + dot grid, fades out before the first section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_78%_-10%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(color-mix(in_oklch,var(--foreground)_7%,transparent)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom,black_0,black_60%,transparent_100%)]"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
        <div>
          {AVAILABILITY.open && (
            <span
              className="animate-rise inline-flex h-7 items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-400/10 pl-2.5 pr-3 text-[12.5px] font-medium text-emerald-400"
              style={{ animationDelay: "40ms" }}
            >
              <i className="h-[7px] w-[7px] rounded-full bg-emerald-400 animate-pulse-dot" />
              {AVAILABILITY.text}
            </span>
          )}

          <h1
            className="animate-rise mt-5 font-display text-6xl font-bold leading-[0.95] tracking-[-0.035em] text-foreground sm:text-7xl lg:text-[96px]"
            style={{ animationDelay: "120ms" }}
          >
            Vaniel
            <br />
            Cornelio<span className="text-primary">.</span>
          </h1>

          <p
            className="animate-rise mt-5 font-display text-xl font-medium leading-snug tracking-[-0.01em] text-foreground sm:text-2xl"
            style={{ animationDelay: "220ms" }}
          >
            Backend Developer <span className="text-accent">&amp;</span> Cloud Engineer
          </p>

          <p
            className="animate-rise mt-4 max-w-[560px] text-[17px] leading-relaxed text-muted-foreground"
            style={{ animationDelay: "300ms" }}
          >
            I ship and run production backends. Postgres, Docker, Nginx, Cloudflare Tunnel. The
            infrastructure on the right is real, self-hosted, and probed every 60 seconds.
          </p>

          <div className="animate-rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "380ms" }}>
            <a
              href={RESUME_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-[42px] items-center gap-2 rounded-lg bg-primary px-[18px] text-sm font-medium text-primary-foreground shadow-[0_8px_24px_-8px_color-mix(in_oklch,var(--primary)_60%,transparent)] transition-[transform,filter] duration-150 hover:-translate-y-px hover:brightness-110 active:scale-[0.98]"
            >
              View Résumé
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </a>
            <a
              href="#work"
              className="inline-flex h-[42px] items-center rounded-lg border border-border px-[18px] text-sm font-medium text-foreground transition-colors duration-150 hover:border-primary"
            >
              See the projects
            </a>
            <a
              href="#contact"
              className="inline-flex h-[42px] items-center px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </a>
          </div>

          <div className="animate-rise mt-10 flex gap-2.5" style={{ animationDelay: "460ms" }}>
            {SOCIALS.map(({ href, label, Icon, external }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-primary hover:text-foreground"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="animate-rise" style={{ animationDelay: "260ms" }}>
          <InfraStatusCard />
        </div>
      </div>
    </header>
  );
}
