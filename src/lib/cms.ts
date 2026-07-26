"use client";

/**
 * Client shim matching the Vite project's src/lib/cms.ts public surface
 * used by Contact.tsx. Submissions now POST to the database via the
 * /api/contact route instead of localStorage.
 */
export interface Submission {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  createdAt: number;
  read: boolean;
}

export async function addSubmission(data: Omit<Submission, "id" | "createdAt" | "read">) {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch {
    /* network failure — form still shows its success state */
  }
}

export function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}
