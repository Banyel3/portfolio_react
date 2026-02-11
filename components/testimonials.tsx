"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";

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
  const [activeIndex, setActiveIndex] = useState(0);

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

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section id="testimonials" className="py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center text-muted-foreground">
            Loading testimonials...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Avatar / Initials */}
            <div className="md:col-span-4">
              <div className="w-full aspect-4/5 bg-linear-to-br from-primary/20 to-accent/10 rounded-lg flex items-center justify-center">
                <span className="text-6xl font-display font-bold text-primary/40">
                  {activeTestimonial?.clientName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
            </div>

            {/* Right: Quote Content */}
            <div className="md:col-span-8 space-y-8">
              <Quote className="w-10 h-10 text-border" />
              <p className="text-xl md:text-2xl font-display font-medium text-foreground leading-relaxed">
                {activeTestimonial?.testimonial}
              </p>
              <div>
                <h4 className="text-lg font-bold text-foreground">
                  {activeTestimonial?.clientName}
                </h4>
                {(activeTestimonial?.clientRole ||
                  activeTestimonial?.clientCompany) && (
                  <p className="text-sm text-muted-foreground">
                    {activeTestimonial?.clientRole}
                    {activeTestimonial?.clientRole &&
                      activeTestimonial?.clientCompany &&
                      " at "}
                    {activeTestimonial?.clientCompany && (
                      <span className="text-primary">
                        {activeTestimonial.clientCompany}
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Navigation dots */}
              {testimonials.length > 1 && (
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`w-12 h-1 rounded-full transition-colors ${
                        index === activeIndex
                          ? "bg-primary"
                          : "bg-border hover:bg-muted-foreground cursor-pointer"
                      }`}
                      aria-label={`View testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
