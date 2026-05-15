import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.experienceId) {
      return NextResponse.json(
        { error: "experienceId is required" },
        { status: 400 },
      );
    }
    const testimonial = await prisma.testimonial.create({
      data: {
        experienceId: body.experienceId,
        authorName: body.authorName,
        authorRole: body.authorRole || null,
        quote: body.quote,
      },
    });
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("[testimonials] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial", details: String(error) },
      { status: 500 },
    );
  }
}
