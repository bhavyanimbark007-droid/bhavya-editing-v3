import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { adminGuard } from "@/lib/adminCrud";

/**
 * Signed Cloudinary upload — no SDK needed.
 * Client posts FormData with a `file`; we sign the request server-side
 * using CLOUDINARY_API_SECRET and forward it.
 */
export async function POST(req: NextRequest) {
  const g = adminGuard();
  if (g) return g;

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return NextResponse.json({ error: "Cloudinary env vars not configured" }, { status: 500 });
  }

  const incoming = await req.formData();
  const file = incoming.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = incoming.get("folder")?.toString() || "bhavya";
  const signature = createHmac("sha1", CLOUDINARY_API_SECRET)
    .update(`folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`)
    .digest("hex");

  const out = new FormData();
  out.append("file", file);
  out.append("api_key", CLOUDINARY_API_KEY);
  out.append("timestamp", String(timestamp));
  out.append("folder", folder);
  out.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    method: "POST",
    body: out,
  });
  const json = await res.json();
  if (!res.ok) return NextResponse.json(json, { status: res.status });
  return NextResponse.json({ url: json.secure_url, publicId: json.public_id });
}
