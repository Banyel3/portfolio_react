import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 px-6">
        {/* Logo */}
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold font-display text-xl">
          V
        </div>

        <p className="text-muted-foreground text-xs">
          Thanks for scrolling, that&apos;s all folks.
        </p>

        {/* Social Links */}
        <div className="flex gap-6 text-muted-foreground">
          <a
            href="https://github.com/Banyel3"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/vaniel-john-cornelio-4ba8aa278/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="mailto:cornelio.vaniel38@gmail.com"
            className="hover:text-primary transition-colors"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
        </div>

        <p className="text-xs text-muted-foreground/60">
          &copy; {new Date().getFullYear()} Vaniel Cornelio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
