import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      include: {
        testimonials: {
          select: {
            id: true,
            authorName: true,
            authorRole: true,
            quote: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json(experiences, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[experiences] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences", details: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const experience = await prisma.experience.create({
      data: {
        company: body.company,
        role: body.role || null,
        location: body.location || null,
        description: body.description,
        outcomes: body.outcomes || null,
        stack: body.stack ?? [],
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
    });
    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error("[experiences] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create experience", details: String(error) },
      { status: 500 },
    );
  }
}
