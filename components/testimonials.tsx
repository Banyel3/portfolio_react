"use client";

import { useEffect, useState } from "react";

interface Testimonial {
  id: string;
  clientName: string;
  clientRole?: string;
  clientCompany?: string;
  testimonial: string;
  date?: string;
}

export default function Testimonials() {
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

  // Don't render the section if there are no testimonials
  if (!loading && testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className="py-20 sm:py-32 border-t border-border"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Client Testimonials
            </h2>
          </div>
          <p className="text-muted-foreground">
            What clients have to say about working with me
          </p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">
            Loading testimonials...
          </div>
        ) : (
          /* Timeline */
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-border" />

            {/* Testimonial cards */}
            <div className="space-y-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="relative flex gap-6">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-4 h-4 rounded-full bg-primary border-4 border-background" />
                  </div>

                  {/* Card */}
                  <div className="flex-1 pb-2">
                    {/* Date badge */}
                    {testimonial.date && (
                      <span className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-md bg-primary text-primary-foreground">
                        {testimonial.date}
                      </span>
                    )}

                    {/* Testimonial content */}
                    <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        "{testimonial.testimonial}"
                      </p>
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
                          <p className="font-semibold text-foreground">
                            {testimonial.clientName}
                          </p>
                          {(testimonial.clientRole ||
                            testimonial.clientCompany) && (
                            <p className="text-sm text-muted-foreground">
                              {testimonial.clientRole}
                              {testimonial.clientRole &&
                                testimonial.clientCompany &&
                                " at "}
                              {testimonial.clientCompany && (
                                <span className="text-primary">
                                  {testimonial.clientCompany}
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
