"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Edit2, Plus } from "lucide-react";

interface Testimonial {
  id: string;
  clientName: string;
  clientRole?: string;
  clientCompany?: string;
  testimonial: string;
  date?: string;
}

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      setTestimonials(testimonials.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/cms"
                className="text-primary hover:underline text-sm mb-2 block"
              >
                ← Back to CMS
              </Link>
              <h1 className="text-3xl font-bold">Manage Testimonials</h1>
            </div>
            <Link
              href="/cms/testimonials/new"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Add Testimonial
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No testimonials yet</p>
            <Link
              href="/cms/testimonials/new"
              className="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Add your first testimonial
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-6 rounded-lg bg-card border border-border"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {testimonial.clientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {testimonial.clientName}
                        </h3>
                        {(testimonial.clientRole ||
                          testimonial.clientCompany) && (
                          <p className="text-sm text-muted-foreground">
                            {testimonial.clientRole}
                            {testimonial.clientRole &&
                              testimonial.clientCompany &&
                              " at "}
                            {testimonial.clientCompany}
                          </p>
                        )}
                      </div>
                    </div>
                    {testimonial.date && (
                      <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent inline-block mt-3">
                        {testimonial.date}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/cms/testimonials/${testimonial.id}`}
                      className="p-2 rounded hover:bg-accent/10 text-accent"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteTestimonial(testimonial.id)}
                      className="p-2 rounded hover:bg-red-500/10 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "{testimonial.testimonial}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
