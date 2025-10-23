import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("[v0] Fetching certificates from database...");
    const certificates = await prisma.certificate.findMany({
      orderBy: { createdAt: "desc" },
    });
    console.log("[v0] Successfully fetched certificates:", certificates.length);
    return NextResponse.json(certificates);
  } catch (error) {
    console.error("[v0] Error fetching certificates:", error);
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
