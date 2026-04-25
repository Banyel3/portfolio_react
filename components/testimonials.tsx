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

  if (!loading && testimonials.length === 0) {
    return null;
  }

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section id="testimonials" className="py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Numbered section heading */}
        <div className="flex items-center gap-4 mb-14 reveal">
          <span className="font-mono text-xs font-semibold text-primary/50 select-none tabular-nums">05</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">Testimonials</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent ml-2" />
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">
            Loading testimonials...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center reveal" style={{ animationDelay: '0.1s' }}>
            {/* Left: Avatar / Initials */}
            <div className="md:col-span-4">
              <div className="p-[1px] rounded-xl bg-gradient-to-br from-primary/30 to-accent/15">
                <div className="w-full aspect-4/5 bg-gradient-to-br from-primary/15 to-accent/8 rounded-[calc(0.75rem-1px)] flex items-center justify-center
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <span className="text-6xl font-display font-bold text-primary/40">
                    {activeTestimonial?.clientName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quote Content */}
            <div className="md:col-span-8 space-y-8">
              <Quote className="w-10 h-10 text-primary/30" />
              <p className="text-xl md:text-2xl font-display font-medium text-foreground leading-relaxed">
                {activeTestimonial?.testimonial}
              </p>
              <div>
                <h4 className="text-lg font-bold text-foreground">
                  {activeTestimonial?.clientName}
                </h4>
                {(activeTestimonial?.clientRole ||
                  activeTestimonial?.clientCompany) && (
                  <p className="text-sm text-muted-foreground mt-0.5">
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

              {/* Navigation bars */}
              {testimonials.length > 1 && (
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`h-[3px] rounded-full transition-all duration-300 ${
                        index === activeIndex
                          ? "w-10 bg-primary"
                          : "w-5 bg-border hover:bg-muted-foreground cursor-pointer"
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
