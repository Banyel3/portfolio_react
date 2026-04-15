import { Github, Linkedin, Mail } from "lucide-react";

export default function Hero() {
  return (
    <header className="relative pt-32 pb-20 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Name & Socials */}
        <div className="lg:col-span-5 z-10 space-y-8 order-2 lg:order-1">
          <div className="space-y-2">
            <span className="text-primary font-display font-medium tracking-wide text-sm uppercase">
              Hi, I&apos;m
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-tight">
              Vaniel
              <br />
              Cornelio<span className="text-primary">.</span>
            </h1>
            <div className="w-16 h-1 bg-primary mt-4" />
          </div>
          <div className="flex gap-4 pt-4">
            <a
              href="mailto:cornelio.vaniel38@gmail.com"
              className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-muted-foreground"
              aria-label="Email"
            >
              <Mail size={16} />
            </a>
            <a
              href="https://github.com/Banyel3"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-muted-foreground"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/vaniel-john-cornelio-4ba8aa278/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-muted-foreground"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>

        {/* Center Column: Profile Image */}
        <div className="lg:col-span-4 relative flex justify-center order-1 lg:order-2">
          <div className="relative z-10">
            <div className="absolute -inset-4 bg-linear-to-tr from-primary/20 to-transparent rounded-full blur-2xl" />
            <img
              src="/profile.png"
              alt="Vaniel Cornelio"
              className="w-64 md:w-80 h-80 md:h-96 object-cover rounded-t-full rounded-b-3xl contrast-110 shadow-2xl border-b-4 border-primary"
            />
          </div>
        </div>

        {/* Right Column: Introduction */}
        <div className="lg:col-span-3 space-y-8 z-10 order-3 flex flex-col justify-center">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              — Introduction
            </span>
            <h2 className="text-xl md:text-2xl font-display font-medium text-foreground">
              Backend Developer building robust systems, secure deployments, and self-hosted cloud infrastructure.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              I build backend systems that go beyond code into deployment,
              security, and infrastructure. My work spans software engineering,
              AI/ML, and automation, alongside a self-hosted cloud platform
              running on Linux with Cloudflare Tunnel, Nginx, Docker, and
              secure remote access.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-display tracking-wide">
              Self-hosted cloud infrastructure &middot; Live platform
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://demo.vancornelio.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-display font-medium group text-sm hover:opacity-90 transition-opacity"
              aria-label="Open infrastructure demo platform in new tab"
            >
              View Infra Demo
              <span className="group-hover:translate-x-0.5 transition-transform">
                ↗
              </span>
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 text-primary font-display font-medium group text-sm"
            >
              My story
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
