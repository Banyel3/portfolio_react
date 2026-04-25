"use client";

import { useEffect, useState } from "react";
import type { Certificate } from "@prisma/client";

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch("/api/certificates");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCertificates(data);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  return (
    <section id="certificates" className="py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Numbered section heading */}
        <div className="flex items-center gap-4 mb-14 reveal">
          <span className="font-mono text-xs font-semibold text-primary/50 select-none tabular-nums">02</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">Certifications</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent ml-2" />
        </div>

        <p className="text-muted-foreground text-sm max-w-md mb-10 reveal" style={{ animationDelay: '0.1s' }}>
          Professional certifications demonstrating expertise and commitment
          to continuous learning.
        </p>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="p-[1px] rounded-xl bg-gradient-to-br from-border/40 to-border/10">
                <div className="bg-card rounded-[calc(0.75rem-1px)] p-8 h-48 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {certificates.map((cert, index) => (
              <div
                key={cert.id}
                className="reveal p-[1px] rounded-xl bg-gradient-to-br from-border/60 to-border/20 hover:from-primary/35 hover:to-accent/15 transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="group bg-card rounded-[calc(0.75rem-1px)] p-8 h-full
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
                  hover:shadow-[0_8px_32px_oklch(0.65_0.22_240_/_0.1)]
                  transition-shadow duration-500">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-display font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-accent mt-0.5">{cert.issuer}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20 shrink-0 ml-3">
                      {cert.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {cert.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-1 rounded bg-primary/5 text-primary border border-primary/15 hover:border-primary/35 transition-colors duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
