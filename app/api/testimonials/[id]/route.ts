import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("[testimonials/[id]] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonial", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        clientName: body.clientName,
        clientRole: body.clientRole || null,
        clientCompany: body.clientCompany || null,
        testimonial: body.testimonial,
        date: body.date || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[testimonials/[id]] PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[testimonials/[id]] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial", details: String(error) },
      { status: 500 }
    );
  }
}
