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
    <section
      id="certificates"
      className="py-20 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 space-y-4">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            — Certifications
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Professional
            <br />
            Certifications.
          </h2>
          <p className="text-muted-foreground text-sm max-w-md">
            Professional certifications demonstrating expertise and commitment
            to continuous learning.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">
            Loading certificates...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="group p-8 bg-card border border-border hover:border-primary/50 hover:translate-y-[-3px] transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-accent">{cert.issuer}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
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
                      className="text-xs px-2 py-1 rounded bg-primary/5 text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
