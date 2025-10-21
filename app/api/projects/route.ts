import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] Fetching projects from database...")
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    })
    console.log("[v0] Successfully fetched projects:", projects.length)
    return NextResponse.json(projects)
  } catch (error) {
    console.error("[v0] Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects", details: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const project = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        technologies: body.technologies || [],
        githubLink: body.githubLink || null,
        liveLink: body.liveLink || null,
      },
    })
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project", details: String(error) }, { status: 500 })
  }
}
