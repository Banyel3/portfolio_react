import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(caseStudies, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[case-studies] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch case studies", details: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const caseStudy = await prisma.caseStudy.create({
      data: {
        slug: body.slug,
        title: body.title,
        role: body.role || null,
        summary: body.summary,
        problem: body.problem,
        decisions: body.decisions ?? [],
        architecture: body.architecture || null,
        ops: body.ops || null,
        reflections: body.reflections || null,
        liveUrl: body.liveUrl || null,
        repoUrl: body.repoUrl || null,
        stack: body.stack ?? [],
        experienceId: body.experienceId || null,
        projectId: body.projectId || null,
        featured: Boolean(body.featured),
        order: Number(body.order ?? 0),
      },
    });
    return NextResponse.json(caseStudy, { status: 201 });
  } catch (error) {
    console.error("[case-studies] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create case study", details: String(error) },
      { status: 500 },
    );
  }
}
