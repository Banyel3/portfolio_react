"use client";

import { useEffect, useState } from "react";
import type { Badge } from "@prisma/client";

export default function Badges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await fetch("/api/public/badges");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setBadges(data);
      } catch (error) {
        console.error("Error fetching badges:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  return (
    <section id="badges" className="py-12 px-6 md:px-12 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 space-y-2">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            — Credentials
          </span>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Badges &amp; Certifications
          </h2>
          <p className="text-muted-foreground text-sm">
            Credly badges and micro-credentials
          </p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">
            Loading badges...
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 items-center justify-center">
            {badges.map((badge) => (
              <div key={badge.id} className="flex items-center justify-center">
                {badge.badgeUrl ? (
                  <a
                    href={badge.badgeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    {badge.imageUrl ? (
                      <img
                        src={badge.imageUrl}
                        alt={badge.title}
                        className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded transform transition-transform hover:scale-105 hover:shadow-lg"
                      />
                    ) : (
                      <div className="w-28 h-28 sm:w-32 sm:h-32 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </a>
                ) : badge.imageUrl ? (
                  <img
                    src={badge.imageUrl}
                    alt={badge.title}
                    className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded transform transition-transform hover:scale-105 hover:shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
