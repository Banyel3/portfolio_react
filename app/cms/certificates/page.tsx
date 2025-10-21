"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Trash2, Edit2, Plus } from "lucide-react"

interface Certificate {
  id: string
  title: string
  issuer: string
  date: string
  description: string
  skills: string[]
}

export default function CertificatesManager() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const res = await fetch("/api/certificates")
      const data = await res.json()
      setCertificates(data)
    } catch (error) {
      console.error("Error fetching certificates:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteCertificate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return

    try {
      await fetch(`/api/certificates/${id}`, { method: "DELETE" })
      setCertificates(certificates.filter((c) => c.id !== id))
    } catch (error) {
      console.error("Error deleting certificate:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/cms" className="text-primary hover:underline text-sm mb-2 block">
                ← Back to CMS
              </Link>
              <h1 className="text-3xl font-bold">Manage Certificates</h1>
            </div>
            <Link
              href="/cms/certificates/new"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Add Certificate
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No certificates yet</p>
            <Link
              href="/cms/certificates/new"
              className="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Add your first certificate
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-6 rounded-lg bg-card border border-border flex items-start justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{cert.title}</h3>
                  <p className="text-sm text-accent">{cert.issuer}</p>
                  <p className="text-sm text-muted-foreground mt-2">{cert.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {cert.skills.map((skill) => (
                      <span key={skill} className="text-xs px-2 py-1 rounded bg-primary/5 text-primary">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link href={`/cms/certificates/${cert.id}`} className="p-2 rounded hover:bg-accent/10 text-accent">
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteCertificate(cert.id)}
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
  )
}
