"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Download,
  RotateCcw,
  Upload,
  Trash2,
  ChevronDown,
  Check,
  LayoutDashboard,
  Zap,
  ListOrdered,
  Sparkles,
  Layers,
  User,
  Megaphone,
  Film,
  MessageSquare,
  PenLine,
  Mail,
  Plus,
} from "lucide-react";

import {
  DEFAULT_CONTENT,
  TAG_COLORS,
  exportContent,
  importContent,
  resetContent,
  updateContent,
  useContent,
  type SiteContent,
  type TagColor,
} from "../lib/content";

/* -------------------------- Helpers -------------------------- */

const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-lime";

function F({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold tracking-[0.15em] text-gray-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function T({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      className={inputCls}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function A({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <textarea
      className={`${inputCls} resize-y`}
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function N({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="number"
      className={inputCls}
      value={value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
    />
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

/* -------------------------- Editor -------------------------- */

export default function CMSEditor() {
  const c = useContent();
  const set = (next: SiteContent) => updateContent(next);

  const [flash, setFlash] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const doExport = () => {
    const blob = new Blob([exportContent()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site-content.json";
    a.click();
    URL.revokeObjectURL(url);
    setFlash("Exported");
  };

  const doImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = importContent(String(reader.result));
      setFlash(res.ok ? "Imported" : res.error || "Failed");
    };
    reader.readAsText(file);
  };

  const doReset = () => {
    if (window.confirm("Reset ALL content?")) {
      resetContent();
      setFlash("Reset");
    }
  };

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(""), 2000);
    return () => clearTimeout(t);
  }, [flash]);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {flash && (
          <span className="text-lime text-xs font-semibold">{flash}</span>
        )}

        <button onClick={doExport} className="btn">
          <Download size={14} /> Export
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          className="btn"
        >
          <Upload size={14} /> Import
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) doImport(f);
            e.target.value = "";
          }}
        />

        <button onClick={doReset} className="btn">
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* HERO EDITOR */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Hero Section</h3>

        <F label="Title">
          <T
            value={c.hero.title}
            onChange={(v) =>
              set({ ...c, hero: { ...c.hero, title: v } })
            }
          />
        </F>

        <div className="space-y-3">
          {c.hero.cards.map((card: any, i: number) => (
            <div key={i} className="border p-3 rounded">
              <Row>
                <F label="Card Title">
                  <T
                    value={card.title}
                    onChange={(v) =>
                      set({
                        ...c,
                        hero: {
                          ...c.hero,
                          cards: c.hero.cards.map(
                            (x: any, j: number) =>
                              j === i ? { ...x, title: v } : x
                          ),
                        },
                      })
                    }
                  />
                </F>

                <F label="Tag">
                  <T
                    value={card.tag}
                    onChange={(v) =>
                      set({
                        ...c,
                        hero: {
                          ...c.hero,
                          cards: c.hero.cards.map(
                            (x: any, j: number) =>
                              j === i ? { ...x, tag: v } : x
                          ),
                        },
                      })
                    }
                  />
                </F>
              </Row>

              <button
                onClick={() =>
                  set({
                    ...c,
                    hero: {
                      ...c.hero,
                      cards: c.hero.cards.filter(
                        (_: any, j: number) => j !== i
                      ),
                    },
                  })
                }
                className="text-red-400 text-xs mt-2"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            onClick={() =>
              set({
                ...c,
                hero: {
                  ...c.hero,
                  cards: [
                    ...c.hero.cards,
                    { tag: "NEW", title: "New Card", img: "", video: "" },
                  ],
                },
              })
            }
            className="text-lime text-xs"
          >
            <Plus size={14} /> Add Card
          </button>
        </div>
      </div>
    </div>
  );
}