import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.certificate.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting certificate:", error)
    return NextResponse.json({ error: "Failed to delete certificate", details: String(error) }, { status: 500 })
  }
}
