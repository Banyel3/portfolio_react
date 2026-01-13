"use client";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function CMSDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Portfolio CMS</h1>
              <p className="text-muted-foreground mt-1">
                Manage your portfolio content
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Badges Card */}
          <Link
            href="/cms/certificates/badges"
            className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Badges</h2>
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Manage your Credly badges and micro-credentials
            </p>
            <div className="text-sm text-primary font-medium">Manage →</div>
          </Link>

          {/* Certificates Card */}
          <Link
            href="/cms/certificates"
            className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Certificates</h2>
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Manage your certifications and credentials
            </p>
            <div className="text-sm text-primary font-medium">Manage →</div>
          </Link>

          {/* Projects Card */}
          <Link
            href="/cms/projects"
            className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Projects</h2>
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Manage your portfolio projects
            </p>
            <div className="text-sm text-primary font-medium">Manage →</div>
          </Link>

          {/* Skills Card */}
          <Link
            href="/cms/skills"
            className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Skills</h2>
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Manage your technical skills
            </p>
            <div className="text-sm text-primary font-medium">Manage →</div>
          </Link>

          {/* Testimonials Card */}
          <Link
            href="/cms/testimonials"
            className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Testimonials</h2>
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Manage client reviews and testimonials
            </p>
            <div className="text-sm text-primary font-medium">Manage →</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
