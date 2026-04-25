"use client";

import { useEffect, useState } from "react";
import { PROJECT_CATEGORIES_WITH_ALL } from "@/lib/constants";
import ProjectModal from "./project-modal";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  githubLink?: string;
  liveLink?: string;
  images?: string[];
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-20 px-6 md:px-12 bg-card">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4 reveal">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs font-semibold text-primary/50 select-none tabular-nums">04</span>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground">
                Selected Projects.
              </h2>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm">
              A selection of my work across backend engineering, cloud
              infrastructure, and automation.
            </p>
          </div>
          <a
            href="https://github.com/Banyel3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary font-display font-medium group text-sm reveal"
            style={{ animationDelay: "0.1s" }}
          >
            Explore more
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </a>
        </div>

        {/* Featured Cloud Platform */}
        <div className="mb-12 reveal" style={{ animationDelay: "0.15s" }}>
          <div className="p-[1px] rounded-2xl bg-gradient-to-br from-primary/40 to-accent/20">
            <div className="relative overflow-hidden p-6 md:p-10 bg-gradient-to-br from-background via-background to-primary/5 rounded-[calc(1rem-1px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              {/* Watermark */}
              <span className="absolute -right-4 top-1/2 -translate-y-1/2 text-[8rem] font-black text-primary/4 uppercase tracking-widest select-none pointer-events-none leading-none hidden md:block">
                CLOUD
              </span>

              <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="space-y-4 max-w-2xl">
                  {/* Live badge */}
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                    <span className="text-xs text-muted-foreground/50">·</span>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground/60 font-semibold">
                      Cloud Engineering
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                    Self-Hosted Cloud Platform
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A self-hosted cloud platform I built and operate as a
                    real-world Cloud Engineering project. Runs production services
                    on Ubuntu Server using Docker, Nginx, and Cloudflare Tunnel —
                    the same stack used in professional cloud environments.
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Ubuntu Server · Cloudflare Tunnel · Nginx · Docker · Portainer · Cockpit
                  </p>
                </div>

                <div className="flex flex-col gap-3 md:items-end shrink-0">
                  <a
                    href="https://demo.vancornelio.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-display font-medium transition-all duration-300 hover:shadow-[0_0_20px_oklch(0.65_0.22_240_/_0.4)] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Visit Demo Platform
                    <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-xs group-hover:translate-x-0.5 transition-transform duration-200">
                      ↗
                    </span>
                  </a>
                  <a
                    href="https://files.demo.vancornelio.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary font-display font-medium group"
                  >
                    File Browser Demo
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-12 reveal" style={{ animationDelay: "0.2s" }}>
          {PROJECT_CATEGORIES_WITH_ALL.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full font-display text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-[0_0_16px_oklch(0.65_0.22_240_/_0.3)]"
                  : "bg-background border border-border text-foreground hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-[1px] rounded-2xl bg-gradient-to-br from-border/40 to-border/10">
                <div className="bg-background rounded-[calc(1rem-1px)]">
                  <div className="aspect-video bg-muted/30 animate-pulse rounded-t-[calc(1rem-1px)]" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted/30 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-muted/20 rounded animate-pulse" />
                    <div className="h-3 bg-muted/20 rounded animate-pulse w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project, index) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group reveal p-[1px] rounded-2xl bg-gradient-to-br from-border/50 to-border/15
                  hover:from-primary/40 hover:to-accent/20
                  hover:-translate-y-2
                  hover:shadow-[0_16px_48px_oklch(0.65_0.22_240_/_0.18)]
                  transition-all duration-300 text-left w-full"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="bg-background rounded-[calc(1rem-1px)] overflow-hidden h-full shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">

                  {/* Card header */}
                  {project.images && project.images.length > 0 ? (
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                      />
                      {/* Subtle dark gradient at bottom for legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                      {/* Index — top left */}
                      <span className="absolute top-3 left-4 font-mono text-xs text-white/30 font-semibold tabular-nums select-none">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Open indicator — top right, hover reveal */}
                      <span className="absolute top-3 right-4 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        ↗
                      </span>

                      {/* Category — bottom left */}
                      <span className="absolute bottom-3 left-4 text-xs px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white/85 border border-white/15 font-medium">
                        {project.category}
                      </span>
                    </div>
                  ) : (
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-card to-background">
                      {/* Dot grid texture */}
                      <div className="absolute inset-0 dot-grid opacity-60" />
                      {/* Radial glow */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_50%,oklch(0.65_0.22_240_/_0.08),transparent_65%)]" />
                      {/* Category watermark */}
                      <span className="absolute inset-0 flex items-center justify-center text-[5rem] font-black text-primary/5 uppercase tracking-widest select-none leading-none pointer-events-none">
                        {project.category.split(" ")[0]}
                      </span>

                      {/* Index — top left */}
                      <span className="absolute top-3 left-4 font-mono text-xs text-foreground/20 font-semibold tabular-nums select-none">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Open indicator — top right */}
                      <span className="absolute top-3 right-4 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        ↗
                      </span>

                      {/* Category pill — bottom left */}
                      <span className="absolute bottom-3 left-4 text-xs px-2.5 py-1 rounded-full bg-primary/15 backdrop-blur-sm text-primary border border-primary/25 font-medium">
                        {project.category}
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 flex flex-col gap-2">
                    <h3 className="text-base font-display font-semibold text-foreground group-hover:text-primary transition-colors duration-200 leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Footer row: tech + view CTA */}
                    <div className="flex items-center justify-between gap-3 pt-2 mt-auto">
                      <p className="text-xs text-muted-foreground/50 truncate">
                        {project.technologies.slice(0, 3).join(" · ")}
                        {project.technologies.length > 3 && (
                          <span className="text-muted-foreground/40"> +{project.technologies.length - 3}</span>
                        )}
                      </p>
                      <span className="shrink-0 text-xs text-primary font-medium font-display flex items-center gap-1 group-hover:gap-1.5 transition-all duration-200">
                        View <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                      </span>
                    </div>
                  </div>

                </div>
              </button>
            ))}
          </div>
        )}

        {/* Automations Subsection */}
        <div className="mt-16 pt-12 border-t border-border/40">
          <div className="mb-8 reveal">
            <span className="text-xs uppercase tracking-widest text-muted-foreground/70 font-semibold">
              — Automations
            </span>
            <h3 className="text-2xl font-display font-bold mt-2 text-foreground">
              Workflow Automations
            </h3>
            <p className="text-muted-foreground text-sm mt-2">
              A centralized collection of my n8n workflow automations
            </p>
          </div>

          <div className="reveal" style={{ animationDelay: "0.1s" }}>
            <div className="p-[1px] rounded-2xl bg-gradient-to-br from-border/60 to-border/20 hover:from-primary/30 hover:to-accent/10 hover:-translate-y-1 hover:shadow-[0_8px_32px_oklch(0.65_0.22_240_/_0.12)] transition-all duration-300 max-w-md">
              <a
                href="https://github.com/Banyel3/n8n-automations"
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-background rounded-[calc(1rem-1px)] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <circle cx="12" cy="5" r="2" />
                        <circle cx="5" cy="19" r="2" />
                        <circle cx="19" cy="19" r="2" />
                        <path d="M12 7v4" />
                        <path d="M5 17v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
                      </svg>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                      n8n Workflows
                    </span>
                  </div>
                  <h4 className="text-base font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                    n8n Automations
                  </h4>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    A repository containing my personal workflow automations built
                    with n8n, covering various tasks and integrations.
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground/50">n8n · Automation · Workflows</p>
                    <span className="text-xs text-primary font-medium font-display flex items-center gap-1 group-hover:gap-1.5 transition-all duration-200">
                      View <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
