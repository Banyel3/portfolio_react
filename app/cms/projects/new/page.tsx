"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PROJECT_CATEGORIES } from "@/lib/constants";

export default function NewProject() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    try {
      await fetch("/api/upload-project", {
        method: "DELETE",
        body: JSON.stringify({ path: image.path }),
      });
    } catch (err) {
      console.error("Error removing uploaded image:", err);
    }
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          technologies: technologiesArray,
          images: imagesArray,
        }),
      });

      if (res.ok) {
        router.push("/cms/projects");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/cms/projects"
            className="text-primary hover:underline text-sm mb-2 block"
          >
            ← Back to Projects
          </Link>
          <h1 className="text-3xl font-bold">Add New Project</h1>
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
              placeholder="e.g., Network Intrusion Detection System"
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
              placeholder="Describe your project..."
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
              placeholder="e.g., Python, Machine Learning, scikit-learn"
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
              placeholder="https://github.com/..."
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
              placeholder="https://..."
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
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
            <Link
              href="/cms/projects"
              className="px-6 py-2 rounded-lg bg-card border border-border hover:border-primary/50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
