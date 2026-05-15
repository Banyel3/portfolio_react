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
        proficiency: true,
        context: true,
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
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
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    const categoryRaw = typeof body.category === "string" ? body.category.trim() : "";
    const category = categoryRaw.length > 0 ? categoryRaw : null;
    const proficiency =
      typeof body.proficiency === "string" && body.proficiency.trim().length > 0
        ? body.proficiency.trim()
        : null;
    const context =
      typeof body.context === "string" && body.context.trim().length > 0
        ? body.context.trim()
        : null;

    const skill = await prisma.skill.create({
      data: { name, category, proficiency, context },
    });
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("[skills] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create skill", details: String(error) },
      { status: 500 }
    );
  }
}
