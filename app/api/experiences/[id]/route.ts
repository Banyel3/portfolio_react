import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        testimonials: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!experience)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(experience);
  } catch (error) {
    console.error("[experiences/[id]] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch experience", details: String(error) },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.experience.update({
      where: { id },
      data: {
        company: body.company,
        role: body.role || null,
        location: body.location || null,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[experiences/[id]] PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update experience", details: String(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[experiences/[id]] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete experience", details: String(error) },
      { status: 500 },
    );
  }
}
