"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewBadge() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    date: "",
    badgeUrl: "",
    imageUrl: "",
    skills: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);

  // Uploads handled by server endpoint /api/upload-badge which uses a service role key

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setUploadError(null);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
      // start immediate upload via server endpoint
      uploadToServer(f).catch((err) => {
        console.error("Upload failed:", err);
        setUploadError(String(err));
      });
    } else {
      setPreviewUrl(null);
    }
  };

  const uploadToServer = async (f: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", f);
      const res = await fetch("/api/upload-badge", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");
      setFormData((p) => ({ ...p, imageUrl: data.publicUrl }));
      setUploadedPath(data.path);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    // remove preview and form image field; if uploadedPath exists, delete from storage
    setPreviewUrl(null);
    setFile(null);
    setFormData((p) => ({ ...p, imageUrl: "" }));
    setUploadError(null);
    if (uploadedPath) {
      try {
        await fetch("/api/upload-badge", {
          method: "DELETE",
          body: JSON.stringify({ path: uploadedPath }),
        });
      } catch (err) {
        console.error("Error removing uploaded image:", err);
      }
      setUploadedPath(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);

      // If an upload is still in progress, prevent submitting until it's done
      if (uploading) {
        alert(
          "Please wait for the image to finish uploading before submitting."
        );
        return;
      }

      // Use the imageUrl already set by the immediate upload (if any)
      const imageUrl = formData.imageUrl;

      const res = await fetch("/api/badges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, imageUrl, skills: skillsArray }),
      });

      if (res.ok) router.push("/cms/certificates/badges");
    } catch (err) {
      console.error("Error creating badge", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/cms/certificates/badges"
            className="text-primary hover:underline text-sm mb-2 block"
          >
            ← Back to Badges
          </Link>
          <h1 className="text-3xl font-bold">Add New Badge</h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Badge Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Issuer</label>
            <input
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Credly Badge URL
            </label>
            <input
              name="badgeUrl"
              value={formData.badgeUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Image (upload)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />

            {previewUrl && (
              <div className="mt-3 flex items-start gap-3">
                <img
                  src={previewUrl}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  {uploading ? (
                    <div className="text-sm text-muted-foreground">
                      Uploading image...
                    </div>
                  ) : uploadError ? (
                    <div className="text-sm text-red-500">
                      Upload error: {uploadError}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Image ready
                    </div>
                  )}
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove image
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Skills (comma-separated)
            </label>
            <input
              name="skills"
              value={formData.skills}
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
              {loading ? "Creating..." : "Create Badge"}
            </button>
            <Link
              href="/cms/certificates/badges"
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
