import { NextResponse } from "next/server";
import { assembleContent } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await assembleContent();
    return NextResponse.json(content);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
