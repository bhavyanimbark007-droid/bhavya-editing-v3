import { NextRequest, NextResponse } from "next/server";
import { createInquiry } from "@/db/queries";

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    if (!b.name || !b.email || !b.message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const row = await createInquiry({
      name: String(b.name).slice(0, 200),
      email: String(b.email).slice(0, 200),
      projectType: b.projectType || "",
      budget: b.budget || "",
      message: String(b.message).slice(0, 5000),
    });
    return NextResponse.json(row, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
