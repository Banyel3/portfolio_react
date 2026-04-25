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
    <section id="badges" className="py-20 px-6 md:px-12 bg-card">
      <div className="max-w-7xl mx-auto">
        {/* Numbered section heading */}
        <div className="flex items-center gap-4 mb-14 reveal">
          <span className="font-mono text-xs font-semibold text-primary/50 select-none tabular-nums">03</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">Badges &amp; Credentials</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent ml-2" />
        </div>

        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-card/50 border border-border/40 rounded-xl p-4 animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {badges.map((badge, index) => {
              const inner = (
                <>
                  {badge.imageUrl ? (
                    <img
                      src={badge.imageUrl}
                      alt={badge.title}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                    />
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                  <span className="text-[10px] text-muted-foreground/70 text-center leading-tight line-clamp-2 w-full">
                    {badge.title}
                  </span>
                </>
              );

              const cardClasses = `reveal flex flex-col items-center gap-2 p-4 rounded-xl
                bg-background/50 border border-border/40
                hover:border-primary/30 hover:bg-card/80
                hover:shadow-[0_4px_16px_oklch(0.65_0.22_240_/_0.1)]
                transition-all duration-300`;

              return badge.badgeUrl ? (
                <a
                  key={badge.id}
                  href={badge.badgeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cardClasses}
                  style={{ animationDelay: `${index * 0.04}s` }}
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={badge.id}
                  className={`${cardClasses} cursor-default`}
                  style={{ animationDelay: `${index * 0.04}s` }}
                >
                  {inner}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
