import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const badges = await prisma.badge.findMany({
      select: {
        id: true,
        title: true,
        issuer: true,
        date: true,
        badgeUrl: true,
        imageUrl: true,
        skills: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(badges);
  } catch (error) {
    console.error("[api/public/badges] GET error", error);
    return NextResponse.json(
      { error: "Failed to fetch badges" },
      { status: 500 }
    );
  }
}
