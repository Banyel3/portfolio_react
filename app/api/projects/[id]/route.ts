import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    console.error("[projects/[id]] GET error", error);
    return NextResponse.json(
      { error: "Failed to fetch project", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        technologies: body.technologies || [],
        githubLink: body.githubLink || null,
        liveLink: body.liveLink || null,
        imageUrl: body.imageUrl || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[projects/[id]] PATCH error", error);
    return NextResponse.json(
      { error: "Failed to update project", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[projects/[id]] DELETE error", error);
    return NextResponse.json(
      { error: "Failed to delete project", details: String(error) },
      { status: 500 }
    );
  }
}
