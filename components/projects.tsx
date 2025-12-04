"use client";

import { useEffect, useState } from "react";
import { PROJECT_CATEGORIES_WITH_ALL } from "@/lib/constants";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  githubLink?: string;
  liveLink?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-20 sm:py-32 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Projects</h2>
          <p className="text-muted-foreground">
            A selection of my work across software engineering, AI/ML, and
            automations
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          {PROJECT_CATEGORIES_WITH_ALL.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:border-primary/50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">
            Loading projects...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <a
                key={project.id}
                href={project.githubLink || project.liveLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="mb-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
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
              </a>
            ))}
          </div>
        )}

        {/* Automations Subsection */}
        <div className="mt-16 pt-12 border-t border-border/50">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">Automations</h3>
            <p className="text-muted-foreground text-sm">
              A centralized collection of my n8n workflow automations
            </p>
          </div>
          <a
            href="https://github.com/Banyel3/n8n-automations"
            target="_blank"
            rel="noopener noreferrer"
            className="group block max-w-md p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg"
          >
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
                  <path d="M12 3v3" />
                  <path d="M18.5 13h-13" />
                  <path d="M18.5 13a4.5 4.5 0 1 0 0 9h1a2 2 0 1 0 0-4h-1" />
                  <path d="M5.5 13a4.5 4.5 0 1 1 0 9h-1a2 2 0 1 1 0-4h1" />
                  <path d="M12 3a4 4 0 0 1 4 4v3" />
                  <path d="M8 7a4 4 0 0 1 4-4" />
                </svg>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent">
                n8n Workflows
              </span>
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              n8n Automations
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
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
          </a>
        </div>
      </div>
    </section>
  );
}
