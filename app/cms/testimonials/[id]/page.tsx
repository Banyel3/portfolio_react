"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const id = params?.id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    clientName: "",
    clientRole: "",
    clientCompany: "",
    testimonial: "",
    date: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchTestimonial = async () => {
      setInitialLoading(true);
      try {
        const res = await fetch(`/api/testimonials/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const testimonial = await res.json();
        setFormData({
          clientName: testimonial.clientName || "",
          clientRole: testimonial.clientRole || "",
          clientCompany: testimonial.clientCompany || "",
          testimonial: testimonial.testimonial || "",
          date: testimonial.date || "",
        });
      } catch (error) {
        console.error("Error loading testimonial:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchTestimonial();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/cms/testimonials");
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/cms/testimonials"
            className="text-primary hover:underline text-sm mb-2 block"
          >
            ← Back to Testimonials
          </Link>
          <h1 className="text-3xl font-bold">Edit Testimonial</h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Client Name *
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Role/Title
              </label>
              <input
                type="text"
                name="clientRole"
                value={formData.clientRole}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
                placeholder="CEO"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                name="clientCompany"
                value={formData.clientCompany}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
                placeholder="Tech Startup"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date/Year</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none"
              placeholder="2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Testimonial *
            </label>
            <textarea
              name="testimonial"
              value={formData.testimonial}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none resize-none"
              placeholder="What did the client say about your work?"
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
              href="/cms/testimonials"
              className="px-6 py-2 rounded-lg border border-border hover:bg-card"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
