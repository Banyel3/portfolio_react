import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

type Patchable = {
  name?: string;
  category?: string | null;
  proficiency?: string | null;
  context?: string | null;
};

function normalizeString(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Patchable;
    const data: Patchable = {};

    if (typeof body.name === "string") {
      const next = body.name.trim();
      if (next.length === 0) {
        return NextResponse.json({ error: "name cannot be empty" }, { status: 400 });
      }
      data.name = next;
    }

    const category = normalizeString(body.category);
    if (category !== undefined) data.category = category;
    const proficiency = normalizeString(body.proficiency);
    if (proficiency !== undefined) data.proficiency = proficiency;
    const context = normalizeString(body.context);
    if (context !== undefined) data.context = context;

    const skill = await prisma.skill.update({ where: { id }, data });
    return NextResponse.json(skill);
  } catch (error) {
    console.error("[skills] PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update skill", details: String(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.skill.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[skills] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete skill", details: String(error) },
      { status: 500 },
    );
  }
}
