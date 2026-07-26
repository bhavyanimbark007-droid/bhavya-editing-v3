import { NextRequest, NextResponse } from "next/server";
import { applyContent, assembleContent, ensureSeedData } from "@/db/queries";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { adminGuard } from "@/lib/adminCrud";

export async function GET() {
  const content = await assembleContent();
  return NextResponse.json(content);
}

export async function PUT(req: NextRequest) {
  const g = adminGuard();
  if (g) return g;
  const body = await req.json();
  if (!body || typeof body !== "object" || !("brand" in body)) {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }
  await applyContent(body);
  return NextResponse.json({ ok: true });
}

/** DELETE = reset everything back to seed defaults */
export async function DELETE() {
  const g = adminGuard();
  if (g) return g;
  await db.delete(siteSettings).where(eq(siteSettings.id, 1));
  await ensureSeedData();
  return NextResponse.json({ ok: true });
}
