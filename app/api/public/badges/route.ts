import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Revalidate cache every 60 seconds
export const revalidate = 60;

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
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(badges, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[api/public/badges] GET error", error);
    return NextResponse.json(
      { error: "Failed to fetch badges" },
      { status: 500 }
    );
  }
}
