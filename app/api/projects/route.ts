import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

// Revalidate cache every 60 seconds
export const revalidate = 60;

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        technologies: true,
        githubLink: true,
        liveLink: true,
        imageUrl: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[projects] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const project = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        technologies: body.technologies || [],
        githubLink: body.githubLink || null,
        liveLink: body.liveLink || null,
        images: body.images || [],
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("[v0] Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project", details: String(error) },
      { status: 500 }
    );
  }
}
