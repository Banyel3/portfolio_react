import { Github, Linkedin, Mail } from "lucide-react";

export default function Hero() {
  return (
    <header className="relative pt-36 pb-20 px-6 md:px-12 overflow-hidden dot-grid">
      {/* Radial gradient bloom behind image */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-5%,oklch(0.65_0.22_240_/_0.1),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
        {/* Left Column: Name & Socials */}
        <div className="lg:col-span-5 z-10 space-y-8 order-2 lg:order-1 hero-fade-1">
          <div className="space-y-3">
            <span className="text-primary font-display font-medium tracking-wide text-sm uppercase">
              Hi, I&apos;m
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
              Vaniel
              <br />
              Cornelio<span className="text-primary" style={{ WebkitTextFillColor: 'var(--color-primary)' }}>.</span>
            </h1>
          </div>
          <div className="flex gap-3 pt-2">
            <a
              href="mailto:cornelio.vaniel38@gmail.com"
              className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="Email"
            >
              <Mail size={15} />
            </a>
            <a
              href="https://github.com/Banyel3"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="GitHub"
            >
              <Github size={15} />
            </a>
            <a
              href="https://www.linkedin.com/in/vaniel-john-cornelio-4ba8aa278/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={15} />
            </a>
          </div>
        </div>

        {/* Center Column: Profile Image */}
        <div className="lg:col-span-4 relative flex justify-center order-1 lg:order-2 hero-fade-2">
          <div className="relative z-10">
            {/* Ambient glow */}
            <div className="absolute -inset-8 bg-[radial-gradient(circle,oklch(0.65_0.22_240_/_0.18),transparent_65%)] rounded-full blur-2xl" />
            {/* Double-bezel image frame */}
            <div className="p-[2px] rounded-t-full rounded-b-3xl bg-gradient-to-br from-primary/60 via-primary/30 to-accent/30 relative z-10">
              <div className="rounded-t-full rounded-b-[1.25rem] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
                <img
                  src="/profile.png"
                  alt="Vaniel Cornelio"
                  className="w-64 md:w-80 h-80 md:h-96 object-cover contrast-110"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Introduction */}
        <div className="lg:col-span-3 space-y-8 z-10 order-3 flex flex-col justify-center hero-fade-3">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-muted-foreground/70 font-semibold">
              — Introduction
            </span>
            <h2 className="text-xl md:text-2xl font-display font-medium text-foreground">
              Backend Developer &amp; Cloud Engineer.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              I build backend systems and design, deploy, and operate cloud
              infrastructure. My self-hosted platform runs production-grade
              services on Linux using Docker, Nginx, Cloudflare Tunnel, and
              secure remote access — the same stack used in real cloud
              environments.
            </p>
          </div>
          <p className="text-xs text-muted-foreground/60 font-display tracking-wide">
            Cloud Engineering &middot; Self-hosted infrastructure
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://demo.vancornelio.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-display font-medium text-sm transition-all duration-300 hover:shadow-[0_0_20px_oklch(0.65_0.22_240_/_0.5)] hover:scale-[1.02] active:scale-[0.98]"
              aria-label="Open infrastructure demo platform in new tab"
            >
              View Infra Demo
              <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-xs group-hover:translate-x-0.5 transition-transform duration-200">
                ↗
              </span>
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 text-primary font-display font-medium group text-sm"
            >
              My story
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
