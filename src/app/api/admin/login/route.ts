import { NextRequest, NextResponse } from "next/server";
import {
  clearSessionCookie,
  createSessionToken,
  hasPasswordConfigured,
  requireAdmin,
  setPassword,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";

export async function GET() {
  return NextResponse.json({
    hasPassword: await hasPasswordConfigured(),
    authed: requireAdmin(),
  });
}

export async function POST(req: NextRequest) {
  const { password, setup } = await req.json().catch(() => ({}));
  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const configured = await hasPasswordConfigured();

  // First-run setup: no hash anywhere yet → create it.
  if (!configured) {
    if (!setup) return NextResponse.json({ error: "Setup required" }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "Min 8 characters" }, { status: 400 });
    await setPassword(password);
    setSessionCookie(createSessionToken());
    return NextResponse.json({ ok: true });
  }

  const ok = await verifyPassword(password);
  if (!ok) return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  setSessionCookie(createSessionToken());
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
