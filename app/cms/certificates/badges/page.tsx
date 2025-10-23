"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Plus } from "lucide-react";

interface Badge {
  id: string;
  title: string;
  issuer: string;
  date: string;
  badgeUrl?: string;
  imageUrl?: string;
  skills: string[];
}

export default function BadgesManager() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const res = await fetch("/api/badges");
      const data = await res.json();
      setBadges(data);
    } catch (error) {
      console.error("Error fetching badges:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBadge = async (id: string) => {
    if (!confirm("Delete this badge?")) return;
    try {
      await fetch(`/api/badges/${id}`, { method: "DELETE" });
      setBadges(badges.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error deleting badge:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <Link
              href="/cms/certificates"
              className="text-primary hover:underline text-sm mb-2 block"
            >
              ← Back to Certificates
            </Link>
            <h1 className="text-3xl font-bold">Manage Badges</h1>
          </div>
          <Link
            href="/cms/certificates/badges/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Badge
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : badges.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No badges yet</p>
            <Link
              href="/cms/certificates/badges/new"
              className="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Add your first badge
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="p-6 rounded-lg bg-card border border-border flex items-start justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{badge.title}</h3>
                  <p className="text-sm text-accent">{badge.issuer}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {badge.date}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {badge.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-1 rounded bg-primary/5 text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <a
                    href={badge.badgeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded hover:bg-accent/10 text-accent"
                  >
                    View
                  </a>
                  <button
                    onClick={() => deleteBadge(badge.id)}
                    className="p-2 rounded hover:bg-red-500/10 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
