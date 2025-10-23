import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const badges = await prisma.badge.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(badges);
  } catch (error) {
    console.error("[badges] GET error", error);
    return NextResponse.json(
      { error: "Failed to fetch badges", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const badge = await prisma.badge.create({
      data: {
        title: body.title,
        issuer: body.issuer,
        date: body.date,
        badgeUrl: body.badgeUrl || null,
        imageUrl: body.imageUrl || null,
        skills: body.skills || [],
      },
    });
    return NextResponse.json(badge, { status: 201 });
  } catch (error) {
    console.error("[badges] POST error", error);
    return NextResponse.json(
      { error: "Failed to create badge", details: String(error) },
      { status: 500 }
    );
  }
}
