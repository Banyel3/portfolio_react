"use client";

import { useEffect, useState } from "react";

type Skill = {
  id: string;
  name: string;
  category: string;
};

export default function CoreSkills() {
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/skills");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: Skill[] = await res.json();
        if (mounted) setSkills(data);
      } catch (err) {
        console.error("Failed to load skills", err);
        if (mounted) setError(String(err));
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="text-sm text-destructive">Failed to load skills</div>
    );
  }

  if (!skills) {
    return <div className="text-sm text-muted-foreground">Loading skills…</div>;
  }

  // Render top skills (or all) as pill tags — adjust as desired
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((s) => (
        <span
          key={s.id}
          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
        >
          {s.name}
        </span>
      ))}
    </div>
  );
}
