import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

// Revalidate cache every 60 seconds
export const revalidate = 60;

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      select: {
        id: true,
        title: true,
        issuer: true,
        date: true,
        description: true,
        skills: true,
        level: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(certificates, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[certificates] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data: any = {
      title: body.title,
      issuer: body.issuer,
      date: body.date,
      description: body.description,
      skills: body.skills || [],
    };

    if (body.level) data.level = body.level;

    const certificate = await prisma.certificate.create({ data });
    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error("[v0] Error creating certificate:", error);
    return NextResponse.json(
      { error: "Failed to create certificate", details: String(error) },
      { status: 500 }
    );
  }
}
