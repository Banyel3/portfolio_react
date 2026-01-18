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
    images: "",
  });
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; path: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      setInitialLoading(true);
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            alert("Project not found");
          } else {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return;
        }
        const project = await res.json();
        setFormData({
          title: project.title || "",
          description: project.description || "",
          category: project.category || "Software Engineering",
          technologies: (project.technologies || []).join(", "),
          githubLink: project.githubLink || "",
          liveLink: project.liveLink || "",
          images: "",
        });
        // Set existing images from database
        if (project.images && Array.isArray(project.images)) {
          setUploadedImages(project.images.map((url: string) => ({ url, path: "" })));
        }
      } catch (error) {
        console.error("Error loading project:", error);
        alert("Failed to load project. The database may be unavailable.");
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload-project", {
          method: "POST",
          body: form,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Upload failed");
        return { url: data.publicUrl, path: data.path };
      });

      const results = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...results]);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError(String(err));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (index: number) => {
    const image = uploadedImages[index];
    // Only delete from storage if it has a path (newly uploaded)
    if (image.path) {
      try {
        await fetch("/api/upload-project", {
          method: "DELETE",
          body: JSON.stringify({ path: image.path }),
        });
      } catch (err) {
        console.error("Error removing uploaded image:", err);
      }
    }
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
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

      const imagesArray = uploadedImages.map((img) => img.url);

      if (uploading) {
        alert("Please wait for images to finish uploading before submitting.");
        return;
      }

      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          technologies: technologiesArray,
          images: imagesArray,
        }),
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

          <div>
            <label className="block text-sm font-medium mb-2">
              Project Images (upload multiple)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
            />
            
            {uploading && (
              <div className="mt-2 text-sm text-muted-foreground">
                Uploading images...
              </div>
            )}
            
            {uploadError && (
              <div className="mt-2 text-sm text-red-500">
                Upload error: {uploadError}
              </div>
            )}

            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`Project ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
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
