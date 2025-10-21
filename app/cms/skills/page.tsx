"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Trash2, Plus } from "lucide-react"

interface Skill {
  id: string
  name: string
  category: string
}

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [newSkill, setNewSkill] = useState({ name: "", category: "Languages" })

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills")
      const data = await res.json()
      setSkills(data)
    } catch (error) {
      console.error("Error fetching skills:", error)
    } finally {
      setLoading(false)
    }
  }

  const addSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkill.name.trim()) return

    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSkill),
      })

      if (res.ok) {
        const skill = await res.json()
        setSkills([...skills, skill])
        setNewSkill({ name: "", category: "Languages" })
      }
    } catch (error) {
      console.error("Error adding skill:", error)
    }
  }

  const deleteSkill = async (id: string) => {
    try {
      await fetch(`/api/skills/${id}`, { method: "DELETE" })
      setSkills(skills.filter((s) => s.id !== id))
    } catch (error) {
      console.error("Error deleting skill:", error)
    }
  }

  const categories = ["Languages", "Frameworks", "Tools", "Concepts"]
  const groupedSkills = categories.reduce(
    (acc, cat) => {
      acc[cat] = skills.filter((s) => s.category === cat)
      return acc
    },
    {} as Record<string, Skill[]>,
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/cms" className="text-primary hover:underline text-sm mb-2 block">
            ← Back to CMS
          </Link>
          <h1 className="text-3xl font-bold">Manage Skills</h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Add Skill Form */}
        <div className="mb-12 p-6 rounded-lg bg-card border border-border">
          <h2 className="text-xl font-semibold mb-4">Add New Skill</h2>
          <form onSubmit={addSkill} className="flex gap-4 flex-wrap">
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="Skill name"
              className="flex-1 min-w-48 px-4 py-2 rounded-lg bg-background border border-border focus:border-primary outline-none"
            />
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </form>
        </div>

        {/* Skills by Category */}
        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-4">{category}</h3>
                {groupedSkills[category].length === 0 ? (
                  <p className="text-muted-foreground text-sm">No skills in this category yet</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {groupedSkills[category].map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border"
                      >
                        <span>{skill.name}</span>
                        <button
                          onClick={() => deleteSkill(skill.id)}
                          className="ml-2 p-1 rounded hover:bg-red-500/10 text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
