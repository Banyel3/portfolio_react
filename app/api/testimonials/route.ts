import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

// Revalidate cache every 60 seconds
export const revalidate = 60;

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      select: {
        id: true,
        clientName: true,
        clientRole: true,
        clientCompany: true,
        testimonial: true,
        date: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(testimonials, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[testimonials] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const testimonial = await prisma.testimonial.create({
      data: {
        clientName: body.clientName,
        clientRole: body.clientRole || null,
        clientCompany: body.clientCompany || null,
        testimonial: body.testimonial,
        date: body.date || null,
      },
    });
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("[testimonials] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial", details: String(error) },
      { status: 500 }
    );
  }
}
