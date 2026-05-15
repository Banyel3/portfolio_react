import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const caseStudy = await prisma.caseStudy.findUnique({ where: { id } });
    if (!caseStudy) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(caseStudy);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch case study", details: String(error) },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data: Record<string, unknown> = {};
    const passthrough = [
      "slug", "title", "role", "summary", "problem", "decisions",
      "architecture", "ops", "reflections", "liveUrl", "repoUrl",
      "stack", "experienceId", "projectId", "featured", "order",
    ] as const;
    for (const key of passthrough) {
      if (key in body) data[key] = body[key];
    }
    const updated = await prisma.caseStudy.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update case study", details: String(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.caseStudy.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete case study", details: String(error) },
      { status: 500 },
    );
  }
}
