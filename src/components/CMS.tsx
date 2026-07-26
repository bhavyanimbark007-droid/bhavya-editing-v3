import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Download,
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
import {
  getSubmissions,
  hasPassword,
  isAuthed,
  login,
  logout,
  passwordStrength,
  removeSubmission,
  setRead,
  setupPassword,
  subscribeToSubmissions,
  timeAgo,
  type Submission,
} from "../lib/cms";
import CMSEditor from "./CMSEditor";

const STRENGTH_LABELS = ["Too weak", "Weak", "Okay", "Strong", "Excellent"];
const STRENGTH_COLORS = ["bg-red-500", "bg-orange-500", "bg-amber-400", "bg-lime", "bg-lime"];

export default function CMS({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (open) setAuthed(isAuthed());
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // auto-logout when the session expires
  useEffect(() => {
    if (!open || !authed) return;
    const t = setInterval(() => {
      if (!isAuthed()) setAuthed(false);
    }, 10_000);
    return () => clearInterval(t);
  }, [open, authed]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-ink">
      {!authed ? (
        <Gate onAuthed={() => setAuthed(true)} onClose={onClose} />
      ) : (
        <Dashboard onLogout={() => setAuthed(false)} onClose={onClose} />
      )}
    </div>
  );
}

/* ------------------------- setup / login ------------------------- */

function Gate({ onAuthed, onClose }: { onAuthed: () => void; onClose: () => void }) {
  const isSetup = !hasPassword();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [lockMs, setLockMs] = useState(0);

  useEffect(() => {
    const l = getLockState();
    if (l.locked) setLockMs(l.msLeft);
  }, []);

  useEffect(() => {
    if (lockMs <= 0) return;
    const t = setInterval(() => setLockMs((m) => Math.max(0, m - 1000)), 1000);
    return () => clearInterval(t);
  }, [lockMs > 0]);

  const strength = passwordStrength(pw);
  const canSetup = isSetup && pw.length >= 8 && strength >= 3 && pw === pw2;

  const fail = (msg: string, ms?: number) => {
    setError(msg);
    if (ms) setLockMs(ms);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || lockMs > 0) return;
    setBusy(true);
    setError("");
    if (isSetup) {
      if (!canSetup) {
        setBusy(false);
        return;
      }
      await setupPassword(pw);
      onAuthed();
    } else {
      const res = await login(pw);
      if (res.ok) onAuthed();
      else fail(res.error || "Login failed.", res.lockedMs);
    }
    setBusy(false);
  };

  const lockSecs = Math.ceil(lockMs / 1000);

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5 py-16">
      <div className="dot-bg absolute inset-0" />
      <button
        onClick={onClose}
        aria-label="Close CMS"
        className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/10 text-gray-400 transition-colors hover:border-lime hover:text-lime"
      >
        <X size={18} />
      </button>

      <div
        className={`relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0d1017] p-8 sm:p-10 ${
          shake ? "animate-shake" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime/10 text-lime">
            {isSetup ? <KeyRound size={22} /> : <Lock size={22} />}
          </span>
          <div>
            <h2 className="font-display text-2xl tracking-wide text-white">
              {isSetup ? "SECURE YOUR CMS" : "ADMIN ACCESS"}
            </h2>
            <p className="text-sm text-gray-500">
              {isSetup ? "Create your admin password" : "BHAVYA lead inbox"}
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.18em] text-gray-500">
              {isSetup ? "CREATE PASSWORD" : "PASSWORD"}
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoFocus
                placeholder={isSetup ? "Min 8 chars, digit + symbol" : "Enter your password"}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-12 text-white outline-none transition-colors placeholder:text-gray-600 focus:border-lime"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-lime"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {isSetup && (
            <>
              <div>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        pw && i < strength ? STRENGTH_COLORS[strength] : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {pw ? STRENGTH_LABELS[strength] : "Use 8+ characters with a number & symbol"}
                </p>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold tracking-[0.18em] text-gray-500">
                  CONFIRM PASSWORD
                </label>
                <input
                  type={show ? "text" : "password"}
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition-colors placeholder:text-gray-600 focus:border-lime"
                />
                {pw2 && pw2 !== pw && (
                  <p className="mt-2 text-xs text-red-400">Passwords don't match</p>
                )}
              </div>
            </>
          )}

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              {error}
              {lockMs > 0 && ` Try again in ${lockSecs}s.`}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || lockMs > 0 || (isSetup && !canSetup)}
            className="glow-lime flex w-full items-center justify-center gap-2 rounded-full bg-lime py-4 font-bold text-black transition-transform duration-200 hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            {busy ? (
              "Verifying…"
            ) : lockMs > 0 ? (
              `Locked — ${lockSecs}s`
            ) : isSetup ? (
              <>
                <ShieldCheck size={18} /> Create Password & Enter
              </>
            ) : (
              <>
                <Lock size={16} /> Unlock Inbox
              </>
            )}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-gray-600">
            <ShieldCheck size={12} className="text-lime" />
            PBKDF2 · 150k iterations · brute-force lockout · 30-min sessions
          </p>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------- dashboard ---------------------------- */

interface Toast {
  id: string;
  name: string;
}

function Dashboard({ onLogout, onClose }: { onLogout: () => void; onClose: () => void }) {
  const [tab, setTab] = useState<"inbox" | "editor">("inbox");
  const [subs, setSubs] = useState<Submission[]>(() => getSubmissions());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const knownIds = useRef<Set<string>>(new Set(subs.map((s) => s.id)));

  const refresh = useCallback(() => {
    const next = getSubmissions();
    const fresh = next.filter((s) => !knownIds.current.has(s.id));
    fresh.forEach((s) => {
      knownIds.current.add(s.id);
      const id = s.id;
      setToasts((t) => [...t, { id, name: s.name }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 6000);
    });
    setSubs(next);
  }, []);

  useEffect(() => subscribeToSubmissions(refresh), [refresh]);

  const unread = subs.filter((s) => !s.read).length;
  const weekAgo = Date.now() - 7 * 86400_000;
  const thisWeek = subs.filter((s) => s.createdAt >= weekAgo).length;

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(subs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bhavya-leads-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen">
      <div className="dot-bg pointer-events-none absolute inset-0" />

      {/* top bar */}
      <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime/10 text-lime">
              <ShieldCheck size={20} />
            </span>
            <div>
              <p className="font-display text-lg tracking-[0.15em] text-white">BHAVYA CMS</p>
              <p className="text-xs text-gray-500">Hire request inbox</p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
            <button
              onClick={() => setTab("inbox")}
              className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                tab === "inbox" ? "bg-lime text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              <Inbox size={14} /> Inbox
              {unread > 0 && tab !== "inbox" && (
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-lime px-1 text-[10px] font-bold text-black">
                  {unread}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab("editor")}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                tab === "editor" ? "bg-lime text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              <PenLine size={14} /> Site Editor
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 text-gray-300">
              {unread > 0 ? (
                <BellRing size={17} className="animate-blink text-lime" />
              ) : (
                <Bell size={17} />
              )}
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-lime px-1 text-[11px] font-bold text-black">
                  {unread}
                </span>
              )}
            </span>
            <button
              onClick={exportJson}
              className="hidden items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-gray-200 transition-colors hover:border-lime hover:text-lime sm:inline-flex"
            >
              <Download size={15} /> Export
            </button>
            <button
              onClick={() => {
                logout();
                onLogout();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-gray-200 transition-colors hover:border-red-400 hover:text-red-300"
            >
              <LogOut size={15} /> Logout
            </button>
            <button
              onClick={onClose}
              aria-label="Close CMS"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-gray-300 transition-colors hover:border-lime hover:text-lime"
            >
              <X size={17} />
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {tab === "editor" ? (
          <CMSEditor />
        ) : (
          <>
        {/* stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { n: subs.length, l: "Total Requests" },
            { n: unread, l: "Unread" },
            { n: thisWeek, l: "This Week" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-2xl border border-white/[0.07] bg-[#10131a] p-5 text-center"
            >
              <p className="font-display text-4xl text-lime">{s.n}</p>
              <p className="mt-1 text-xs font-semibold tracking-[0.18em] text-gray-500">{s.l}</p>
            </div>
          ))}
        </div>

        {/* list */}
        <div className="mt-8 space-y-4">
          {subs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
              <Inbox size={40} className="mx-auto text-gray-600" />
              <p className="mt-4 text-lg font-bold text-white">No hire requests yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Submissions from your contact form will appear here instantly — with a live
                notification.
              </p>
            </div>
          )}

          {subs.map((s) => (
            <article
              key={s.id}
              className={`rounded-2xl border bg-[#10131a] p-6 transition-colors ${
                s.read ? "border-white/[0.07]" : "border-lime/40 shadow-[0_0_30px_rgba(198,245,63,0.07)]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lime/15 font-bold text-lime">
                    {s.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                  <div>
                    <p className="flex items-center gap-2 font-bold text-white">
                      {!s.read && <span className="h-2 w-2 rounded-full bg-lime" />}
                      {s.name}
                    </p>
                    <a
                      href={`mailto:${s.email}`}
                      className="text-sm text-gray-400 underline decoration-gray-600 underline-offset-4 transition-colors hover:text-lime"
                    >
                      {s.email}
                    </a>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{timeAgo(s.createdAt)}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {s.projectType && (
                  <span className="rounded-full border border-lime/40 bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">
                    {s.projectType}
                  </span>
                )}
                {s.budget && (
                  <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-gray-300">
                    {s.budget}
                  </span>
                )}
              </div>

              <p className="mt-4 whitespace-pre-wrap leading-relaxed text-gray-300">{s.message}</p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-white/[0.06] pt-4">
                <button
                  onClick={() => setRead(s.id, !s.read)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-gray-300 transition-colors hover:border-lime hover:text-lime"
                >
                  {s.read ? <Mail size={13} /> : <CheckCheck size={13} />}
                  {s.read ? "Mark unread" : "Mark read"}
                </button>
                <a
                  href={`mailto:${s.email}?subject=Re: Your video project`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-gray-300 transition-colors hover:border-lime hover:text-lime"
                >
                  <Mail size={13} /> Reply
                </a>
                {confirmId === s.id ? (
                  <span className="inline-flex items-center gap-2">
                    <button
                      onClick={() => {
                        removeSubmission(s.id);
                        setConfirmId(null);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3.5 py-2 text-xs font-bold text-white"
                    >
                      <Check size={13} /> Confirm delete
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-gray-400"
                    >
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmId(s.id)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-gray-400 transition-colors hover:border-red-400 hover:text-red-300"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
          </>
        )}
      </main>

      {/* live toasts */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-30 flex w-80 flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-toast-in pointer-events-auto flex items-center gap-3 rounded-2xl border border-lime/50 bg-[#10131a] p-4 shadow-[0_0_40px_rgba(198,245,63,0.2)]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime text-black">
              <BellRing size={18} />
            </span>
            <div>
              <p className="text-sm font-bold text-white">New hire request!</p>
              <p className="text-xs text-gray-400">{t.name} just submitted the form.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
