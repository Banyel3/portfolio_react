import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.skill.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting skill:", error)
    return NextResponse.json({ error: "Failed to delete skill", details: String(error) }, { status: 500 })
  }
}
