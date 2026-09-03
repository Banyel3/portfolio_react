import { Github, ExternalLink } from "lucide-react";
import SectionHeader from "@/components/section-header";

// Minor builds that do not get a case study: any Project row not linked to a
// featured CaseStudy (app/page.tsx does the filtering). Renders nothing when
// every project has a case study, so the section only appears once needed.

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  githubLink?: string | null;
  liveLink?: string | null;
}

export default function OtherProjects({ projects }: { projects: Project[] }) {
  if (!Array.isArray(projects) || projects.length === 0) return null;

  return (
    <section id="other-projects" className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
      <SectionHeader title="Other projects">Smaller builds, tools, and experiments without a full write-up.</SectionHeader>

      <ul className="divide-y divide-border border-y border-border">
        {projects.map((p) => (
          <li key={p.id} className="grid grid-cols-1 gap-3 py-5 md:grid-cols-[200px_1fr_auto] md:items-start md:gap-12">
            <span className="pt-0.5 font-mono text-[11px] uppercase tracking-[0.06em] text-accent">{p.category}</span>
            <div className="min-w-0">
              <h3 className="font-display text-lg font-semibold leading-tight tracking-[-0.01em] text-foreground">{p.title}</h3>
              <p className="mt-1.5 max-w-[640px] text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              {p.technologies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.technologies.slice(0, 6).map((t) => (
                    <span key={t} className="rounded-md border border-border px-2 py-1 font-mono text-xs text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2 md:pt-0.5">
              {p.githubLink && (
                <a
                  href={p.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.title} source on GitHub`}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  <Github size={15} />
                </a>
              )}
              {p.liveLink && (
                <a
                  href={p.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.title} live site`}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  <ExternalLink size={15} />
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
