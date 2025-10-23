import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.badge.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[badges/[id]] DELETE error", error);
    return NextResponse.json(
      { error: "Failed to delete badge", details: String(error) },
      { status: 500 }
    );
  }
}
