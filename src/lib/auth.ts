import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

const COOKIE = "bhavya_admin_session";
const SESSION_MS = 30 * 60 * 1000;

function secret() {
  return process.env.JWT_SECRET || "dev-only-secret-change-me";
}

export async function getStoredHash(): Promise<string | null> {
  if (process.env.ADMIN_PASSWORD_HASH) return process.env.ADMIN_PASSWORD_HASH;
  const [row] = await db.select({ adminPasswordHash: siteSettings.adminPasswordHash }).from(siteSettings).limit(1);
  return row?.adminPasswordHash ?? null;
}

export async function setPassword(pw: string) {
  const hash = await bcrypt.hash(pw, 10);
  await db.update(siteSettings).set({ adminPasswordHash: hash }).where(eq(siteSettings.id, 1));
}

export async function verifyPassword(pw: string): Promise<boolean> {
  const hash = await getStoredHash();
  if (!hash) return false;
  return bcrypt.compare(pw, hash);
}

export function hasPasswordConfigured(): Promise<boolean> {
  return getStoredHash().then((h) => !!h);
}

/* ------------------------- session tokens ------------------------- */

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const payload = `${randomBytes(16).toString("hex")}.${Date.now() + SESSION_MS}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [rand, exp, sig] = parts;
  const payload = `${rand}.${exp}`;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  return Number(exp) > Date.now();
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MS / 1000,
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export function requireAdmin(): boolean {
  const token = cookies().get(COOKIE)?.value;
  return isValidSessionToken(token);
}
