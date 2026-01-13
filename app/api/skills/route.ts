import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

// Revalidate cache every 60 seconds
export const revalidate = 60;

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      select: {
        id: true,
        name: true,
        category: true,
      },
      orderBy: { category: "asc" },
    });

    return NextResponse.json(skills, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[skills] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const skill = await prisma.skill.create({
      data: {
        name: body.name,
        category: body.category,
      },
    });
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("[v0] Error creating skill:", error);
    return NextResponse.json(
      { error: "Failed to create skill", details: String(error) },
      { status: 500 }
    );
  }
}
