"use client";

import { useState } from "react";
import { PROJECT_CATEGORIES_WITH_ALL } from "@/lib/constants";
import ProjectModal from "./project-modal";

// NOTE: Filtering out projects that are linked to featured case studies is
// deferred. See docs/superpowers/specs/2026-05-15-portfolio-improvements-design.md §6.

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

type Variant = "primary" | "overflow";

export default function Projects({
  initialProjects = [],
  variant = "primary",
}: {
  initialProjects?: Project[];
  variant?: Variant;
}) {
  const projects = Array.isArray(initialProjects) ? initialProjects : [];
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const isOverflow = variant === "overflow";

  return (
    <section
      id={isOverflow ? "more-projects" : "projects"}
      className={
        isOverflow
          ? "py-12 px-6 md:px-12 bg-card"
          : "py-20 px-6 md:px-12 bg-card"
      }
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {isOverflow ? (
          <header className="mb-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              More Projects
            </h2>
          </header>
        ) : (
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                — Portfolio
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground max-w-lg">
                All Creative Works,
                <br />
                Selected Projects.
              </h2>
              <p className="text-muted-foreground text-sm max-w-sm">
                A selection of my work across backend engineering, cloud
                infrastructure, and automation.
              </p>
            </div>
            <a
              href="https://github.com/Banyel3"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-display font-medium group"
            >
              Explore more
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>
          </div>
        )}

        <div className="mb-12 p-6 md:p-8 bg-background border border-border rounded-lg">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                — Cloud Engineering Project
              </span>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Self-Hosted Cloud Platform
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A self-hosted cloud platform I built and operate as a
                real-world Cloud Engineering project. Runs production services
                on Ubuntu Server using Docker, Nginx, and Cloudflare Tunnel —
                the same stack used in professional cloud environments.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  "Ubuntu Server",
                  "Cloudflare Tunnel",
                  "Nginx",
                  "Docker",
                  "Portainer",
                  "Cockpit",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-1 rounded bg-primary/5 text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <a
                href="https://demo.vancornelio.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-display font-medium hover:opacity-90 transition-opacity"
              >
                Visit Demo Platform
                <span>↗</span>
              </a>
              <a
                href="https://files.demo.vancornelio.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary font-display font-medium"
              >
                Open File Browser Demo
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {PROJECT_CATEGORIES_WITH_ALL.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 font-display text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-background border border-border text-foreground hover:border-primary/50 hover:-translate-y-0.5"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, i) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                style={{ animationDelay: `${i * 60}ms` }}
                className="group relative bg-background border border-border overflow-hidden hover:translate-y-[-5px] hover:border-primary/50 hover:shadow-primary/5 transition-all duration-300 hover:shadow-xl text-left w-full animate-fade-up"
              >
                {/* Image or gradient header */}
                {project.images && project.images.length > 0 ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="text-xs uppercase tracking-wider border border-white/20 px-3 py-1 rounded-full bg-black/30 text-white/80 backdrop-blur-sm">
                        {project.category}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-48 bg-linear-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                    <span className="text-3xl font-display font-bold text-primary/30">
                      {project.title.charAt(0)}
                    </span>
                    <div className="absolute top-4 right-4">
                      <span className="text-xs uppercase tracking-wider border border-border px-3 py-1 rounded-full text-muted-foreground">
                        {project.category}
                      </span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 rounded bg-primary/5 text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded bg-primary/5 text-primary">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

        {/* Automations Subsection */}
        <div className="mt-16 pt-12 border-t border-border/50">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              — Automations
            </span>
            <h3 className="text-2xl font-display font-bold mt-2 text-foreground">
              Workflow Automations
            </h3>
            <p className="text-muted-foreground text-sm mt-2">
              A centralized collection of my n8n workflow automations
            </p>
          </div>
          <a
            href="https://github.com/Banyel3/n8n-automations"
            target="_blank"
            rel="noopener noreferrer"
            className="group block max-w-md bg-background border border-border hover:border-primary/50 hover:translate-y-[-3px] transition-all duration-300 hover:shadow-xl"
          >
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
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
                <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent">
                  n8n Workflows
                </span>
              </div>
              <h4 className="text-lg font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                n8n Automations
              </h4>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                A repository containing my personal workflow automations built
                with n8n, covering various tasks and integrations.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded bg-primary/5 text-primary">
                  n8n
                </span>
                <span className="text-xs px-2 py-1 rounded bg-primary/5 text-primary">
                  Automation
                </span>
                <span className="text-xs px-2 py-1 rounded bg-primary/5 text-primary">
                  Workflows
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
