"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { PROJECT_CATEGORIES } from "@/lib/constants";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const id = params?.id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Software Engineering",
    technologies: "",
    githubLink: "",
    liveLink: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      setInitialLoading(true);
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const project = await res.json();
        setFormData({
          title: project.title || "",
          description: project.description || "",
          category: project.category || "Software Engineering",
          technologies: (project.technologies || []).join(", "),
          githubLink: project.githubLink || "",
          liveLink: project.liveLink || "",
        });
      } catch (error) {
        console.error("Error loading project:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);

    try {
      const technologiesArray = formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);

      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, technologies: technologiesArray }),
      });

      if (res.ok) {
        router.push("/cms/projects");
      } else {
        console.error("Failed to update project", await res.text());
      }
    } catch (error) {
      console.error("Error updating project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) router.push("/cms/projects");
      else console.error("Failed to delete project", await res.text());
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (initialLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/cms/projects"
            className="text-primary hover:underline text-sm mb-2 block"
          >
             Back to Projects
          </Link>
          <h1 className="text-3xl font-bold">Edit Project</h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Project Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
            >
              {PROJECT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Technologies (comma-separated)
            </label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              GitHub Link (optional)
            </label>
            <input
              type="url"
              name="githubLink"
              value={formData.githubLink}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Live Link (optional)
            </label>
            <input
              type="url"
              name="liveLink"
              value={formData.liveLink}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <Link
              href="/cms/projects"
              className="px-6 py-2 rounded-lg bg-card border border-border hover:border-primary/50"
            >
              Cancel
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:opacity-90"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
