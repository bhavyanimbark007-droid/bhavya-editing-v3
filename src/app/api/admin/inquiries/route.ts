import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { adminGuard } from "@/lib/adminCrud";
import { listInquiries } from "@/db/queries";

export async function GET() {
  const g = adminGuard();
  if (g) return g;
  return NextResponse.json(await listInquiries());
}

export async function PUT(req: NextRequest) {
  const g = adminGuard();
  if (g) return g;
  const { id, read } = await req.json();
  const [row] = await db.update(inquiries).set({ read: !!read }).where(eq(inquiries.id, id)).returning();
  return NextResponse.json(row);
}

export async function DELETE(req: NextRequest) {
  const g = adminGuard();
  if (g) return g;
  const { id } = await req.json();
  await db.delete(inquiries).where(eq(inquiries.id, id));
  return NextResponse.json({ ok: true });
}
