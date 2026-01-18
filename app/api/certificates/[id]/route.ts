import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.certificate.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting certificate:", error)
    return NextResponse.json({ error: "Failed to delete certificate", details: String(error) }, { status: 500 })
  }
}
