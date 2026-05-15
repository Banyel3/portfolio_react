"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Check, X, Pencil } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string | null;
  proficiency?: string | null;
  context?: string | null;
}

const UNCATEGORIZED = "__uncategorized__";

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [categoryChoice, setCategoryChoice] = useState<string>("");
  const [categoryInput, setCategoryInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState("");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills", { cache: "no-store" });
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const existingCategories = useMemo(() => {
    const set = new Set<string>();
    for (const s of skills) {
      if (s.category && s.category.trim().length > 0) set.add(s.category);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [skills]);

  const resolvedCategory = (): string | null => {
    if (categoryChoice === "__new__") {
      const trimmed = categoryInput.trim();
      return trimmed.length > 0 ? trimmed : null;
    }
    if (categoryChoice === "" || categoryChoice === UNCATEGORIZED) return null;
    return categoryChoice;
  };

  const addSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category: resolvedCategory(),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const skill = await res.json();
      setSkills((prev) => [...prev, skill]);
      setName("");
      setCategoryInput("");
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      await fetch(`/api/skills/${id}`, { method: "DELETE" });
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  const beginEdit = (s: Skill) => {
    setEditingId(s.id);
    setEditCategory(s.category ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditCategory("");
  };

  const saveEdit = async (id: string) => {
    const next = editCategory.trim();
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: next.length > 0 ? next : null }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
      cancelEdit();
    } catch (error) {
      console.error("Error updating skill:", error);
    }
  };

  const grouped = useMemo(() => {
    const map = new Map<string, Skill[]>();
    for (const s of skills) {
      const key = s.category && s.category.trim().length > 0 ? s.category : UNCATEGORIZED;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    const entries = Array.from(map.entries());
    entries.sort(([a], [b]) => {
      if (a === UNCATEGORIZED) return 1;
      if (b === UNCATEGORIZED) return -1;
      return a.localeCompare(b);
    });
    return entries;
  }, [skills]);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/cms" className="text-primary hover:underline text-sm mb-2 block">
            ← Back to CMS
          </Link>
          <h1 className="text-3xl font-bold">Manage Skills</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Categories are free-form. Leave empty for &quot;Uncategorized&quot;.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 p-6 rounded-lg bg-card border border-border">
          <h2 className="text-xl font-semibold mb-4">Add Skill</h2>
          <form
            onSubmit={addSkill}
            className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-start"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Skill name (e.g. PostgreSQL)"
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary outline-none"
              required
            />
            <div className="flex flex-col gap-2">
              <select
                value={categoryChoice}
                onChange={(e) => setCategoryChoice(e.target.value)}
                className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary outline-none"
              >
                <option value="">— Uncategorized —</option>
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__new__">+ New category…</option>
              </select>
              {categoryChoice === "__new__" && (
                <input
                  type="text"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="New category name"
                  className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  autoFocus
                />
              )}
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading…</div>
        ) : grouped.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No skills yet — add one above.
          </p>
        ) : (
          <div className="space-y-8">
            {grouped.map(([key, items]) => (
              <div key={key}>
                <h3 className="text-lg font-semibold mb-4">
                  {key === UNCATEGORIZED ? "Uncategorized" : key}
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({items.length})
                  </span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {items.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border"
                    >
                      <span className="font-medium">{skill.name}</span>
                      {editingId === skill.id ? (
                        <>
                          <input
                            list="cms-skill-categories"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            placeholder="Category"
                            className="ml-2 w-44 px-2 py-1 rounded bg-background border border-border focus:border-primary outline-none text-xs"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => saveEdit(skill.id)}
                            className="p-1 rounded text-primary hover:bg-primary/10"
                            aria-label="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="p-1 rounded text-muted-foreground hover:bg-muted/40"
                            aria-label="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => beginEdit(skill)}
                          className="ml-1 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/40"
                          aria-label="Edit category"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteSkill(skill.id)}
                        className="ml-1 p-1 rounded hover:bg-red-500/10 text-red-500"
                        aria-label="Delete skill"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <datalist id="cms-skill-categories">
              {existingCategories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
        )}
      </div>
    </div>
  );
}
