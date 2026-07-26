"use client";

/**
 * Drop-in replacement for the Vite project's src/lib/content.ts.
 * Same public API (useContent / updateContent / resetContent /
 * exportContent / importContent / TAG_COLORS) but backed by the
 * Next.js API + PostgreSQL instead of localStorage.
 *
 * USAGE: copy every file from the Vite project's src/components/ into
 * this project's src/components/ UNCHANGED and add "use client"; at the
 * top of each. They import from "@/lib/content" (or "../lib/content"),
 * which resolves to this file.
 */

import { useSyncExternalStore, useEffect, type ReactNode, createContext, useContext } from "react";
import React from "react";

export type TagColor =
  | "indigo" | "purple" | "sky" | "pink" | "red"
  | "teal" | "violet" | "fuchsia" | "green" | "cyan";

export const TAG_COLORS: Record<TagColor, string> = {
  indigo: "bg-indigo-500/15 text-indigo-300 border-indigo-400/30",
  purple: "bg-purple-500/15 text-purple-300 border-purple-400/30",
  sky: "bg-sky-500/15 text-sky-300 border-sky-400/30",
  pink: "bg-pink-500/15 text-pink-300 border-pink-400/30",
  red: "bg-red-500/15 text-red-300 border-red-400/30",
  teal: "bg-teal-500/15 text-teal-300 border-teal-400/30",
  violet: "bg-violet-500/15 text-violet-300 border-violet-400/30",
  fuchsia: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/30",
  green: "bg-green-500/15 text-green-300 border-green-400/30",
  cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
};

export interface HeroCard { tag: string; title: string; img: string; video: string }
export interface Project { tag: string; title: string; sub: string; img: string; video: string }
export interface SkillTag { label: string; color: TagColor }
export interface SkillCard { tags: SkillTag[]; title: string; points: string[]; isNew: boolean }
export interface Plan { name: string; price: string; unit: string; features: string[]; featured: boolean }
export interface Review { quote: string; name: string; role: string }
export interface SiteContent {
  brand: string;
  nav: { id: string; label: string }[];
  hero: { badge: string; script: string; title: string; subtitle: string; primaryCta: string; secondaryCta: string; cards: HeroCard[] };
  marquee: string[];
  stats: { heading: string; accent: string; items: { value: number; suffix: string; label: string }[]; cta: string };
  skills: { eyebrow: string; heading: string; cards: SkillCard[] };
  why: { eyebrow: string; heading: string; left: { title: string; sub: string }; right: { title: string; sub: string }; points: string[]; quoteTitle: string; quoteBody: string };
  services: { eyebrow: string; heading: string; plans: Plan[] };
  work: { eyebrow: string; heading: string; sub: string; cta: string; projects: Project[] };
  testimonials: { eyebrow: string; heading: string; reviews: Review[] };
  cta: { line1: string; line2: string; sub: string; button: string };
  contact: { headingPre: string; headingAccent: string; email: string; instagram: string; youtube: string; location: string; response: string; tools: string[]; formTitle: string; submit: string };
  footer: string;
}

/* ------------------------------ store ------------------------------ */

// Referenced by the copied CMSEditor.tsx (footer hint). The real defaults
// live in the database seed (src/db/queries.ts).
export const DEFAULT_CONTENT = { brand: "BHAVYA" } as unknown as SiteContent;

let current: SiteContent | null = null;
const listeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function emit() { listeners.forEach((l) => l()); }
function subscribe(cb: () => void) { listeners.add(cb); return () => listeners.delete(cb); }
function getSnapshot(): SiteContent | null { return current; }

export function useContent(): any {
  const ctx = useContext(ContentReadyContext);
  // subscribe so admin edits in the same tab re-render instantly
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  if (!current && ctx) current = ctx;
  if (!current) throw new Error("SiteContentProvider missing");
  return current;
}

const ContentReadyContext = createContext<any>(null);

export function SiteContentProvider({ data, children }: { data: SiteContent; children: ReactNode }) {
  useEffect(() => {
    if (!current) { current = data; emit(); }
  }, [data]);
  return React.createElement(ContentReadyContext.Provider, { value: data }, children);
}

/* --------------------------- admin writes --------------------------- */

function persistToServer() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      });
    } catch {
      /* offline / not authed — edits stay local for the session */
    }
  }, 400);
}

export function updateContent(next: SiteContent) {
  current = next;
  emit();
  persistToServer();
}

export async function resetContent() {
  await fetch("/api/admin/settings", { method: "DELETE", credentials: "include" });
  const res = await fetch("/api/data");
  current = await res.json();
  emit();
}

export function exportContent(): string {
  return JSON.stringify(current, null, 2);
}

export async function importContent(json: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== "object" || !("brand" in parsed)) {
      return { ok: false, error: "That doesn't look like a content file." };
    }
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });
    if (!res.ok) return { ok: false, error: "Not authorized." };
    current = parsed as SiteContent;
    emit();
    return { ok: true };
  } catch {
    return { ok: false, error: "Invalid JSON." };
  }
}
