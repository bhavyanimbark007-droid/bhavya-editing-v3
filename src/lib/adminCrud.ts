import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { requireAdmin } from "@/lib/auth";

export function adminGuard() {
  if (!requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function makeCrud(table: any, fromBody: (b: any) => any) {
  return {
    async GET() {
      const g = adminGuard();
      if (g) return g;
      const rows = await db.select().from(table);
      return NextResponse.json(rows);
    },
    async POST(req: NextRequest) {
      const g = adminGuard();
      if (g) return g;
      const body = await req.json();
      const [row] = await db.insert(table).values(fromBody(body)).returning();
      return NextResponse.json(row, { status: 201 });
    },
    async PUT(req: NextRequest) {
      const g = adminGuard();
      if (g) return g;
      const body = await req.json();
      const { id, ...rest } = body;
      const [row] = await db.update(table).set(fromBody(rest)).where(eq(table.id, id)).returning();
      return NextResponse.json(row);
    },
    async DELETE(req: NextRequest) {
      const g = adminGuard();
      if (g) return g;
      const { id } = await req.json();
      await db.delete(table).where(eq(table.id, id));
      return NextResponse.json({ ok: true });
    },
  };
}
