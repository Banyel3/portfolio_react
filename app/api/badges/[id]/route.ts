import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.badge.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[badges/[id]] DELETE error", error);
    return NextResponse.json(
      { error: "Failed to delete badge", details: String(error) },
      { status: 500 }
    );
  }
}
