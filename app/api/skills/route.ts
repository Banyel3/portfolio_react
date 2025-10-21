import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] Fetching skills from database...")
    const skills = await prisma.skill.findMany({
      orderBy: { category: "asc" },
    })
    console.log("[v0] Successfully fetched skills:", skills.length)
    return NextResponse.json(skills)
  } catch (error) {
    console.error("[v0] Error fetching skills:", error)
    return NextResponse.json({ error: "Failed to fetch skills", details: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const skill = await prisma.skill.create({
      data: {
        name: body.name,
        category: body.category,
      },
    })
    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating skill:", error)
    return NextResponse.json({ error: "Failed to create skill", details: String(error) }, { status: 500 })
  }
}
