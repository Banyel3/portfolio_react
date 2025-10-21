"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Trash2, Edit2, Plus } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  category: string
  technologies: string[]
  githubLink?: string
  liveLink?: string
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects")
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" })
      setProjects(projects.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/cms" className="text-primary hover:underline text-sm mb-2 block">
                ← Back to CMS
              </Link>
              <h1 className="text-3xl font-bold">Manage Projects</h1>
            </div>
            <Link
              href="/cms/projects/new"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <Link
              href="/cms/projects/new"
              className="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Add your first project
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="p-6 rounded-lg bg-card border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent inline-block mt-2">
                      {project.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/cms/projects/${project.id}`} className="p-2 rounded hover:bg-accent/10 text-accent">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-2 rounded hover:bg-red-500/10 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="text-xs px-2 py-1 rounded bg-primary/5 text-primary">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
