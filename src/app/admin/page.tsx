"use client";

/**
 * Admin portal — same visual language as the Vite project's CMS.
 * The "Site Editor" tab reuses the copied CMSEditor.tsx component
 * (it talks to this project's "@/lib/content", which persists via the
 * /api/admin/settings route). The "Inbox" tab reads /api/admin/inquiries.
 */
import { useCallback, useEffect, useState } from "react";
import {
  Bell,
  BellRing,
  CheckCheck,
  Eye,
  EyeOff,
  Inbox,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  PenLine,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import CMSEditor from "@/components/CMSEditor";
import { SiteContentProvider } from "@/lib/content";
import { timeAgo, type Submission } from "@/lib/cms";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [hasPassword, setHasPassword] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/admin/login", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setAuthed(!!d.authed);
        setHasPassword(!!d.hasPassword);
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, []);

  if (!checked) return <div className="min-h-screen bg-ink" />;
  return <div className="min-h-screen bg-ink text-white">{authed ? <Dashboard onLogout={() => setAuthed(false)} /> : <Gate hasPassword={hasPassword} onAuthed={() => setAuthed(true)} />}</div>;
}

/* ------------------------------ gate ------------------------------ */

function Gate({ hasPassword, onAuthed }: { hasPassword: boolean; onAuthed: () => void }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw, setup: !hasPassword }),
    });
    const data = await res.json();
    if (res.ok) onAuthed();
    else setError(data.error || "Login failed");
    setBusy(false);
  };

  return (
    <div className="dot-bg flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d1017] p-8 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime/10 text-lime">
            {hasPassword ? <Lock size={22} /> : <KeyRound size={22} />}
          </span>
          <div>
            <h2 className="font-display text-2xl tracking-wide">{hasPassword ? "ADMIN ACCESS" : "SECURE YOUR CMS"}</h2>
            <p className="text-sm text-gray-500">{hasPassword ? "BHAVYA content CMS" : "Create your admin password"}</p>
          </div>
        </div>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoFocus
              placeholder={hasPassword ? "Enter your password" : "Min 8 characters"}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-12 text-white outline-none placeholder:text-gray-600 focus:border-lime"
            />
            <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-lime" aria-label="Toggle visibility">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">{error}</p>}
          <button
            type="submit"
            disabled={busy || !pw}
            className="glow-lime flex w-full items-center justify-center gap-2 rounded-full bg-lime py-4 font-bold text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40"
          >
            {busy ? "Verifying…" : hasPassword ? (<><Lock size={16} /> Unlock</>) : (<><ShieldCheck size={18} /> Create Password & Enter</>)}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-600">
            <ShieldCheck size={12} className="text-lime" /> bcrypt hash in PostgreSQL · httpOnly session cookie · 30-min expiry
          </p>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------- dashboard ---------------------------- */

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"inbox" | "editor">("inbox");
  const [subs, setSubs] = useState<Submission[]>([]);

    const [siteData, setSiteData] = useState<any>(null);

  useEffect(() => {
    if (tab === "editor") {
      fetch("/api/data", { credentials: "include" })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) setSiteData(data);
        })
        .catch(() => {});
    }
  }, [tab]);

  const load = useCallback(() => {
    fetch("/api/admin/inquiries", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then((rows) =>
        setSubs(
          (rows as any[]).map((r) => ({
            id: String(r.id),
            name: r.name,
            email: r.email,
            projectType: r.projectType || "",
            budget: r.budget || "",
            message: r.message,
            createdAt: new Date(r.createdAt).getTime(),
            read: !!r.read,
          })).reverse()
        )
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 8000); // live-ish polling for new leads
    return () => clearInterval(t);
  }, [load]);

  const unread = subs.filter((s) => !s.read).length;

  const patch = (id: string, body: object) =>
    fetch("/api/admin/inquiries", { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: Number(id), ...body }) }).then(load);
  const remove = (id: string) =>
    fetch("/api/admin/inquiries", { method: "DELETE", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: Number(id) }) }).then(load);

  return (
    <div className="relative min-h-screen">
      <div className="dot-bg pointer-events-none absolute inset-0" />
      <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime/10 text-lime"><ShieldCheck size={20} /></span>
            <div>
              <p className="font-display text-lg tracking-[0.15em]">BHAVYA CMS</p>
              <p className="text-xs text-gray-500">Next.js + PostgreSQL</p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
            <button onClick={() => setTab("inbox")} className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${tab === "inbox" ? "bg-lime text-black" : "text-gray-400 hover:text-white"}`}>
              <Inbox size={14} /> Inbox
              {unread > 0 && tab !== "inbox" && <span className="grid h-4 min-w-4 place-items-center rounded-full bg-lime px-1 text-[10px] font-bold text-black">{unread}</span>}
            </button>
            <button onClick={() => setTab("editor")} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${tab === "editor" ? "bg-lime text-black" : "text-gray-400 hover:text-white"}`}>
              <PenLine size={14} /> Site Editor
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 text-gray-300">
              {unread > 0 ? <BellRing size={17} className="animate-blink text-lime" /> : <Bell size={17} />}
              {unread > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-lime px-1 text-[11px] font-bold text-black">{unread}</span>}
            </span>
            <button
              onClick={async () => {
                await fetch("/api/admin/login", { method: "DELETE", credentials: "include" });
                onLogout();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-gray-200 hover:border-red-400 hover:text-red-300"
            >
              <LogOut size={15} /> Logout
            </button>
            <a href="/" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-gray-300 hover:border-lime hover:text-lime" aria-label="View site">
              <X size={17} />
            </a>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8">
       {tab === "editor" ? (
  siteData ? (
    <SiteContentProvider data={siteData}>
      <CMSEditor />
    </SiteContentProvider>
  ) : (
    <div className="text-center py-20 text-gray-500">
      Loading site content...
    </div>
  )
) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              {[
                { n: subs.length, l: "Total Requests" },
                { n: unread, l: "Unread" },
                { n: subs.filter((s) => s.createdAt >= Date.now() - 7 * 86400_000).length, l: "This Week" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-white/[0.07] bg-[#10131a] p-5 text-center">
                  <p className="font-display text-4xl text-lime">{s.n}</p>
                  <p className="mt-1 text-xs font-semibold tracking-[0.18em] text-gray-500">{s.l}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              {subs.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
                  <Inbox size={40} className="mx-auto text-gray-600" />
                  <p className="mt-4 text-lg font-bold">No hire requests yet</p>
                  <p className="mt-1 text-sm text-gray-500">Submissions from the contact form land here in real time.</p>
                </div>
              )}
              {subs.map((s) => (
                <article key={s.id} className={`rounded-2xl border bg-[#10131a] p-6 ${s.read ? "border-white/[0.07]" : "border-lime/40 shadow-[0_0_30px_rgba(198,245,63,0.07)]"}`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-lime/15 font-bold text-lime">
                        {s.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                      </span>
                      <div>
                        <p className="flex items-center gap-2 font-bold">{!s.read && <span className="h-2 w-2 rounded-full bg-lime" />}{s.name}</p>
                        <a href={`mailto:${s.email}`} className="text-sm text-gray-400 underline decoration-gray-600 underline-offset-4 hover:text-lime">{s.email}</a>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{timeAgo(s.createdAt)}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.projectType && <span className="rounded-full border border-lime/40 bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">{s.projectType}</span>}
                    {s.budget && <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-gray-300">{s.budget}</span>}
                  </div>
                  <p className="mt-4 whitespace-pre-wrap leading-relaxed text-gray-300">{s.message}</p>
                  <div className="mt-5 flex flex-wrap gap-2.5 border-t border-white/[0.06] pt-4">
                    <button onClick={() => patch(s.id, { read: !s.read })} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-gray-300 hover:border-lime hover:text-lime">
                      {s.read ? <Mail size={13} /> : <CheckCheck size={13} />} {s.read ? "Mark unread" : "Mark read"}
                    </button>
                    <a href={`mailto:${s.email}?subject=Re: Your video project`} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-gray-300 hover:border-lime hover:text-lime">
                      <Mail size={13} /> Reply
                    </a>
                    <button onClick={() => remove(s.id)} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-gray-400 hover:border-red-400 hover:text-red-300">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
