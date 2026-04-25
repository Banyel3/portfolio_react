import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <>
      {/* Gradient fade into footer */}
      <div className="h-16 bg-gradient-to-b from-transparent to-background pointer-events-none" />

      <footer className="pb-12 px-6">
        {/* Gradient separator line */}
        <div className="max-w-7xl mx-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-12" />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold font-display text-xl ring-1 ring-primary/30">
            V
          </div>

          <p className="text-muted-foreground/70 text-xs">
            Backend Developer &amp; Cloud Engineer.
          </p>

          {/* Social Links */}
          <div className="flex gap-4 items-center text-muted-foreground">
            <a
              href="https://demo.vancornelio.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg border border-border/50 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-200 text-sm font-display"
              aria-label="Infrastructure demo"
            >
              Infra Demo ↗
            </a>
            <a
              href="https://github.com/Banyel3"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-border/50 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/vaniel-john-cornelio-4ba8aa278/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-border/50 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="mailto:cornelio.vaniel38@gmail.com"
              className="p-2 rounded-lg border border-border/50 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              aria-label="Email"
            >
              <Mail size={16} />
            </a>
          </div>

          <p className="text-xs text-muted-foreground/50">
            &copy; {new Date().getFullYear()} Vaniel Cornelio. All rights
            reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
