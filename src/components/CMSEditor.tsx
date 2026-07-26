import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Check,
  ChevronDown,
  Download,
  Film,
  Layers,
  LayoutDashboard,
  ListOrdered,
  Mail,
  Megaphone,
  MessageSquare,
  PenLine,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
  User,
  Zap,
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

const SECTIONS = [
  { id: "general", label: "General", icon: LayoutDashboard },
  { id: "hero", label: "Hero", icon: Zap },
  { id: "marquee", label: "Marquee", icon: ListOrdered },
  { id: "stats", label: "Stats", icon: Sparkles },
  { id: "skills", label: "Skills", icon: Layers },
  { id: "why", label: "Why Me", icon: User },
  { id: "services", label: "Services", icon: Megaphone },
  { id: "work", label: "Portfolio", icon: Film },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "cta", label: "Final CTA", icon: PenLine },
  { id: "contact", label: "Contact", icon: Mail },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

/* --------------------------- field atoms --------------------------- */

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
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      className={inputCls}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function A({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      className={`${inputCls} resize-y`}
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function N({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      className={inputCls}
      value={value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
    />
  );
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
        value ? "border-lime/60 bg-lime/10 text-lime" : "border-white/15 text-gray-400 hover:border-white/30"
      }`}
    >
      <span
        className={`grid h-4 w-4 place-items-center rounded-full ${value ? "bg-lime text-black" : "bg-white/10"}`}
      >
        {value && <Check size={10} strokeWidth={4} />}
      </span>
      {label}
    </button>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

function ItemCard({
  title,
  onRemove,
  children,
  defaultOpen = false,
}: {
  title: string;
  onRemove?: () => void;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/30">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-sm font-bold text-white"
        >
          <ChevronDown
            size={15}
            className={`text-lime transition-transform ${open ? "" : "-rotate-90"}`}
          />
          {title}
        </button>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove item"
            className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      {open && <div className="space-y-3 border-t border-white/[0.06] p-4">{children}</div>}
    </div>
  );
}

function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-dashed border-lime/40 px-4 py-2 text-xs font-bold text-lime transition-colors hover:bg-lime/10"
    >
      <Plus size={14} /> {label}
    </button>
  );
}

/* ------------------------- string list editor ------------------------- */

function StringList({
  items,
  onChange,
  addLabel,
  placeholder,
}: {
  items: string[];
  onChange: (v: string[]) => void;
  addLabel: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((s, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={inputCls}
            value={s}
            placeholder={placeholder}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            aria-label="Remove"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 text-gray-500 transition-colors hover:border-red-400/50 hover:text-red-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <AddBtn label={addLabel} onClick={() => onChange([...items, ""])} />
    </div>
  );
}

/* --------------------------- section editors --------------------------- */

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-bold text-white">{children}</h3>;
}

function Editor({ section }: { section: SectionId }) {
  const c = useContent();
  const set = (next: SiteContent) => updateContent(next);

  switch (section) {
    case "general":
      return (
        <div className="space-y-5">
          <SectionTitle>Brand & Navigation</SectionTitle>
          <F label="BRAND NAME">
            <T value={c.brand} onChange={(v) => set({ ...c, brand: v })} />
          </F>
          <F label="FOOTER TEXT  ({year} becomes the current year)">
            <T value={c.footer} onChange={(v) => set({ ...c, footer: v })} />
          </F>
          <div>
            <p className="mb-2 text-[11px] font-semibold tracking-[0.15em] text-gray-500">
              NAVIGATION LABELS
            </p>
            <div className="space-y-2">
              {c.nav.map((n: any, i: number) => (
                <div key={n.id} className="flex items-center gap-2">
                  <span className="w-20 shrink-0 truncate text-xs text-gray-600">#{n.id}</span>
                  <T
                    value={n.label}
                    onChange={(v) =>
                      set({ ...c, nav: c.nav.map((x: any, j: number) => (j === i ? { ...x, label: v } : x)) })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "hero":
      return (
        <div className="space-y-5">
          <SectionTitle>Hero Section</SectionTitle>
          <Row>
            <F label="BADGE TEXT"><T value={c.hero.badge} onChange={(v) => set({ ...c, hero: { ...c.hero, badge: v } })} /></F>
            <F label="SCRIPT LINE"><T value={c.hero.script} onChange={(v) => set({ ...c, hero: { ...c.hero, script: v } })} /></F>
          </Row>
          <F label="BIG HEADLINE"><T value={c.hero.title} onChange={(v) => set({ ...c, hero: { ...c.hero, title: v } })} /></F>
          <F label="SUBTITLE"><A value={c.hero.subtitle} onChange={(v) => set({ ...c, hero: { ...c.hero, subtitle: v } })} /></F>
          <Row>
            <F label="PRIMARY BUTTON"><T value={c.hero.primaryCta} onChange={(v) => set({ ...c, hero: { ...c.hero, primaryCta: v } })} /></F>
            <F label="SECONDARY BUTTON"><T value={c.hero.secondaryCta} onChange={(v) => set({ ...c, hero: { ...c.hero, secondaryCta: v } })} /></F>
          </Row>
          <div>
            <p className="mb-2 text-[11px] font-semibold tracking-[0.15em] text-gray-500">PREVIEW CARDS</p>
            <div className="space-y-3">
              {c.hero.cards.map((card, i) => (
                <ItemCard
                  key={i}
                  title={card.title || `Card ${i + 1}`}
                  onRemove={() =>
                    set({ ...c, hero: { ...c.hero, cards: c.hero.cards.filter((_, j) => j !== i) } })
                  }
                >
                  <Row>
                    <F label="TAG"><T value={card.tag} onChange={(v) => set({ ...c, hero: { ...c.hero, cards: c.hero.cards.map((x, j) => (j === i ? { ...x, tag: v } : x)) } })} /></F>
                    <F label="TITLE"><T value={card.title} onChange={(v) => set({ ...c, hero: { ...c.hero, cards: c.hero.cards.map((x, j) => (j === i ? { ...x, title: v } : x)) } })} /></F>
                  </Row>
                  <F label="IMAGE URL"><T value={card.img} onChange={(v) => set({ ...c, hero: { ...c.hero, cards: c.hero.cards.map((x, j) => (j === i ? { ...x, img: v } : x)) } })} /></F>
                  <F label="VIDEO URL (MP4)"><T value={card.video} onChange={(v) => set({ ...c, hero: { ...c.hero, cards: c.hero.cards.map((x, j) => (j === i ? { ...x, video: v } : x)) } })} /></F>
                </ItemCard>
              ))}
              <AddBtn
                label="Add card"
                onClick={() =>
                  set({
                    ...c,
                    hero: {
                      ...c.hero,
                      cards: [...c.hero.cards, { tag: "NEW", title: "New Project", img: c.hero.cards[0]?.img || "", video: c.hero.cards[0]?.video || "" }],
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      );

    case "marquee":
      return (
        <div className="space-y-5">
          <SectionTitle>Scrolling Marquee</SectionTitle>
          <StringList
            items={c.marquee}
            onChange={(v) => set({ ...c, marquee: v })}
            addLabel="Add item"
            placeholder="SERVICE NAME"
          />
        </div>
      );

    case "stats":
      return (
        <div className="space-y-5">
          <SectionTitle>Stats Section</SectionTitle>
          <F label="HEADING"><T value={c.stats.heading} onChange={(v) => set({ ...c, stats: { ...c.stats, heading: v } })} /></F>
          <F label="LIME ACCENT LINE"><T value={c.stats.accent} onChange={(v) => set({ ...c, stats: { ...c.stats, accent: v } })} /></F>
          <F label="BUTTON TEXT"><T value={c.stats.cta} onChange={(v) => set({ ...c, stats: { ...c.stats, cta: v } })} /></F>
          <div className="space-y-3">
            {c.stats.items.map((s, i) => (
              <ItemCard key={i} title={s.label || `Stat ${i + 1}`}>
                <div className="grid gap-3 sm:grid-cols-3">
                  <F label="VALUE"><N value={s.value} onChange={(v) => set({ ...c, stats: { ...c.stats, items: c.stats.items.map((x, j) => (j === i ? { ...x, value: v } : x)) } })} /></F>
                  <F label="SUFFIX"><T value={s.suffix} onChange={(v) => set({ ...c, stats: { ...c.stats, items: c.stats.items.map((x, j) => (j === i ? { ...x, suffix: v } : x)) } })} /></F>
                  <F label="LABEL"><T value={s.label} onChange={(v) => set({ ...c, stats: { ...c.stats, items: c.stats.items.map((x, j) => (j === i ? { ...x, label: v } : x)) } })} /></F>
                </div>
              </ItemCard>
            ))}
          </div>
        </div>
      );

    case "skills":
      return (
        <div className="space-y-5">
          <SectionTitle>Skills Section</SectionTitle>
          <Row>
            <F label="EYEBROW"><T value={c.skills.eyebrow} onChange={(v) => set({ ...c, skills: { ...c.skills, eyebrow: v } })} /></F>
            <F label="HEADING"><T value={c.skills.heading} onChange={(v) => set({ ...c, skills: { ...c.skills, heading: v } })} /></F>
          </Row>
          <div className="space-y-3">
            {c.skills.cards.map((card, i) => (
              <ItemCard
                key={i}
                title={card.title || `Card ${i + 1}`}
                onRemove={() => set({ ...c, skills: { ...c.skills, cards: c.skills.cards.filter((_, j) => j !== i) } })}
              >
                <F label="CARD TITLE"><T value={card.title} onChange={(v) => set({ ...c, skills: { ...c.skills, cards: c.skills.cards.map((x, j) => (j === i ? { ...x, title: v } : x)) } })} /></F>
                <Toggle
                  label={'Show "New" badge'}
                  value={card.isNew}
                  onChange={(v) => set({ ...c, skills: { ...c.skills, cards: c.skills.cards.map((x, j) => (j === i ? { ...x, isNew: v } : x)) } })}
                />
                <div>
                  <p className="mb-2 text-[11px] font-semibold tracking-[0.15em] text-gray-500">TAGS</p>
                  <div className="space-y-2">
                    {card.tags.map((t, ti) => (
                      <div key={ti} className="flex gap-2">
                        <input
                          className={`${inputCls} flex-1`}
                          value={t.label}
                          onChange={(e) =>
                            set({ ...c, skills: { ...c.skills, cards: c.skills.cards.map((x, j) => j === i ? { ...x, tags: x.tags.map((y, k) => (k === ti ? { ...y, label: e.target.value } : y)) } : x) } })
                          }
                        />
                        <select
                          className={`${inputCls} w-28`}
                          value={t.color}
                          onChange={(e) =>
                            set({ ...c, skills: { ...c.skills, cards: c.skills.cards.map((x, j) => j === i ? { ...x, tags: x.tags.map((y, k) => (k === ti ? { ...y, color: e.target.value as TagColor } : y)) } : x) } })
                          }
                        >
                          {(Object.keys(TAG_COLORS) as TagColor[]).map((col) => (
                            <option key={col} value={col} className="bg-[#0e1118]">{col}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => set({ ...c, skills: { ...c.skills, cards: c.skills.cards.map((x, j) => j === i ? { ...x, tags: x.tags.filter((_, k) => k !== ti) } : x) } })}
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 text-gray-500 hover:text-red-400"
                          aria-label="Remove tag"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <AddBtn
                      label="Add tag"
                      onClick={() => set({ ...c, skills: { ...c.skills, cards: c.skills.cards.map((x, j) => j === i ? { ...x, tags: [...x.tags, { label: "Tag", color: "indigo" }] } : x) } })}
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold tracking-[0.15em] text-gray-500">BULLET POINTS</p>
                  <StringList
                    items={card.points}
                    onChange={(v) => set({ ...c, skills: { ...c.skills, cards: c.skills.cards.map((x, j) => (j === i ? { ...x, points: v } : x)) } })}
                    addLabel="Add point"
                  />
                </div>
              </ItemCard>
            ))}
            <AddBtn
              label="Add skill card"
              onClick={() =>
                set({ ...c, skills: { ...c.skills, cards: [...c.skills.cards, { tags: [{ label: "New", color: "indigo" }], title: "New Skill", points: ["Point one"], isNew: false }] } })
              }
            />
          </div>
        </div>
      );

    case "why":
      return (
        <div className="space-y-5">
          <SectionTitle>Why Hire Me</SectionTitle>
          <Row>
            <F label="EYEBROW"><T value={c.why.eyebrow} onChange={(v) => set({ ...c, why: { ...c.why, eyebrow: v } })} /></F>
            <F label="HEADING"><T value={c.why.heading} onChange={(v) => set({ ...c, why: { ...c.why, heading: v } })} /></F>
          </Row>
          <Row>
            <F label="LEFT TITLE"><T value={c.why.left.title} onChange={(v) => set({ ...c, why: { ...c.why, left: { ...c.why.left, title: v } } })} /></F>
            <F label="LEFT SUBTITLE"><T value={c.why.left.sub} onChange={(v) => set({ ...c, why: { ...c.why, left: { ...c.why.left, sub: v } } })} /></F>
          </Row>
          <Row>
            <F label="RIGHT TITLE"><T value={c.why.right.title} onChange={(v) => set({ ...c, why: { ...c.why, right: { ...c.why.right, title: v } } })} /></F>
            <F label="RIGHT SUBTITLE"><T value={c.why.right.sub} onChange={(v) => set({ ...c, why: { ...c.why, right: { ...c.why.right, sub: v } } })} /></F>
          </Row>
          <F label="CENTER POINTS">
            <StringList items={c.why.points} onChange={(v) => set({ ...c, why: { ...c.why, points: v } })} addLabel="Add point" />
          </F>
          <F label="QUOTE TITLE"><T value={c.why.quoteTitle} onChange={(v) => set({ ...c, why: { ...c.why, quoteTitle: v } })} /></F>
          <F label="QUOTE BODY"><A value={c.why.quoteBody} onChange={(v) => set({ ...c, why: { ...c.why, quoteBody: v } })} /></F>
        </div>
      );

    case "services":
      return (
        <div className="space-y-5">
          <SectionTitle>Services & Pricing</SectionTitle>
          <Row>
            <F label="EYEBROW"><T value={c.services.eyebrow} onChange={(v) => set({ ...c, services: { ...c.services, eyebrow: v } })} /></F>
            <F label="HEADING"><T value={c.services.heading} onChange={(v) => set({ ...c, services: { ...c.services, heading: v } })} /></F>
          </Row>
          <div className="space-y-3">
            {c.services.plans.map((p, i) => (
              <ItemCard
                key={i}
                title={p.name || `Plan ${i + 1}`}
                onRemove={() => set({ ...c, services: { ...c.services, plans: c.services.plans.filter((_, j) => j !== i) } })}
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <F label="NAME"><T value={p.name} onChange={(v) => set({ ...c, services: { ...c.services, plans: c.services.plans.map((x, j) => (j === i ? { ...x, name: v } : x)) } })} /></F>
                  <F label="PRICE"><T value={p.price} onChange={(v) => set({ ...c, services: { ...c.services, plans: c.services.plans.map((x, j) => (j === i ? { ...x, price: v } : x)) } })} /></F>
                  <F label="UNIT"><T value={p.unit} onChange={(v) => set({ ...c, services: { ...c.services, plans: c.services.plans.map((x, j) => (j === i ? { ...x, unit: v } : x)) } })} /></F>
                </div>
                <Toggle
                  label={'Show "Most Popular" badge'}
                  value={p.featured}
                  onChange={(v) => set({ ...c, services: { ...c.services, plans: c.services.plans.map((x, j) => (j === i ? { ...x, featured: v } : x)) } })}
                />
                <F label="FEATURES">
                  <StringList items={p.features} onChange={(v) => set({ ...c, services: { ...c.services, plans: c.services.plans.map((x, j) => (j === i ? { ...x, features: v } : x)) } })} addLabel="Add feature" />
                </F>
              </ItemCard>
            ))}
            <AddBtn
              label="Add plan"
              onClick={() => set({ ...c, services: { ...c.services, plans: [...c.services.plans, { name: "New Plan", price: "₹1,000", unit: "/ video", features: ["Feature"], featured: false }] } })}
            />
          </div>
        </div>
      );

    case "work":
      return (
        <div className="space-y-5">
          <SectionTitle>Portfolio</SectionTitle>
          <Row>
            <F label="EYEBROW"><T value={c.work.eyebrow} onChange={(v) => set({ ...c, work: { ...c.work, eyebrow: v } })} /></F>
            <F label="HEADING"><T value={c.work.heading} onChange={(v) => set({ ...c, work: { ...c.work, heading: v } })} /></F>
          </Row>
          <Row>
            <F label="SUBTITLE"><T value={c.work.sub} onChange={(v) => set({ ...c, work: { ...c.work, sub: v } })} /></F>
            <F label="BUTTON TEXT"><T value={c.work.cta} onChange={(v) => set({ ...c, work: { ...c.work, cta: v } })} /></F>
          </Row>
          <div className="space-y-3">
            {c.work.projects.map((p, i) => (
              <ItemCard
                key={i}
                title={p.title || `Project ${i + 1}`}
                onRemove={() => set({ ...c, work: { ...c.work, projects: c.work.projects.filter((_, j) => j !== i) } })}
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <F label="TAG"><T value={p.tag} onChange={(v) => set({ ...c, work: { ...c.work, projects: c.work.projects.map((x, j) => (j === i ? { ...x, tag: v } : x)) } })} /></F>
                  <F label="TITLE"><T value={p.title} onChange={(v) => set({ ...c, work: { ...c.work, projects: c.work.projects.map((x, j) => (j === i ? { ...x, title: v } : x)) } })} /></F>
                  <F label="SUBTITLE"><T value={p.sub} onChange={(v) => set({ ...c, work: { ...c.work, projects: c.work.projects.map((x, j) => (j === i ? { ...x, sub: v } : x)) } })} /></F>
                </div>
                <F label="IMAGE URL"><T value={p.img} onChange={(v) => set({ ...c, work: { ...c.work, projects: c.work.projects.map((x, j) => (j === i ? { ...x, img: v } : x)) } })} /></F>
                <F label="VIDEO URL (MP4)"><T value={p.video} onChange={(v) => set({ ...c, work: { ...c.work, projects: c.work.projects.map((x, j) => (j === i ? { ...x, video: v } : x)) } })} /></F>
              </ItemCard>
            ))}
            <AddBtn
              label="Add project"
              onClick={() => set({ ...c, work: { ...c.work, projects: [...c.work.projects, { tag: "NEW", title: "New Project", sub: "Description", img: c.work.projects[0]?.img || "", video: c.work.projects[0]?.video || "" }] } })}
            />
          </div>
        </div>
      );

    case "testimonials":
      return (
        <div className="space-y-5">
          <SectionTitle>Testimonials</SectionTitle>
          <Row>
            <F label="EYEBROW"><T value={c.testimonials.eyebrow} onChange={(v) => set({ ...c, testimonials: { ...c.testimonials, eyebrow: v } })} /></F>
            <F label="HEADING"><T value={c.testimonials.heading} onChange={(v) => set({ ...c, testimonials: { ...c.testimonials, heading: v } })} /></F>
          </Row>
          <div className="space-y-3">
            {c.testimonials.reviews.map((r, i) => (
              <ItemCard
                key={i}
                title={r.name || `Review ${i + 1}`}
                onRemove={() => set({ ...c, testimonials: { ...c.testimonials, reviews: c.testimonials.reviews.filter((_, j) => j !== i) } })}
              >
                <F label="QUOTE"><A value={r.quote} onChange={(v) => set({ ...c, testimonials: { ...c.testimonials, reviews: c.testimonials.reviews.map((x, j) => (j === i ? { ...x, quote: v } : x)) } })} /></F>
                <Row>
                  <F label="NAME"><T value={r.name} onChange={(v) => set({ ...c, testimonials: { ...c.testimonials, reviews: c.testimonials.reviews.map((x, j) => (j === i ? { ...x, name: v } : x)) } })} /></F>
                  <F label="ROLE"><T value={r.role} onChange={(v) => set({ ...c, testimonials: { ...c.testimonials, reviews: c.testimonials.reviews.map((x, j) => (j === i ? { ...x, role: v } : x)) } })} /></F>
                </Row>
              </ItemCard>
            ))}
            <AddBtn
              label="Add review"
              onClick={() => set({ ...c, testimonials: { ...c.testimonials, reviews: [...c.testimonials.reviews, { quote: "Amazing work!", name: "New Client", role: "Role" }] } })}
            />
          </div>
        </div>
      );

    case "cta":
      return (
        <div className="space-y-5">
          <SectionTitle>Final CTA</SectionTitle>
          <Row>
            <F label="LINE 1"><T value={c.cta.line1} onChange={(v) => set({ ...c, cta: { ...c.cta, line1: v } })} /></F>
            <F label="LINE 2"><T value={c.cta.line2} onChange={(v) => set({ ...c, cta: { ...c.cta, line2: v } })} /></F>
          </Row>
          <F label="SUBTITLE"><T value={c.cta.sub} onChange={(v) => set({ ...c, cta: { ...c.cta, sub: v } })} /></F>
          <F label="BUTTON TEXT"><T value={c.cta.button} onChange={(v) => set({ ...c, cta: { ...c.cta, button: v } })} /></F>
        </div>
      );

    case "contact":
      return (
        <div className="space-y-5">
          <SectionTitle>Contact Section</SectionTitle>
          <Row>
            <F label="HEADING"><T value={c.contact.headingPre} onChange={(v) => set({ ...c, contact: { ...c.contact, headingPre: v } })} /></F>
            <F label="ACCENT WORD"><T value={c.contact.headingAccent} onChange={(v) => set({ ...c, contact: { ...c.contact, headingAccent: v } })} /></F>
          </Row>
          <Row>
            <F label="EMAIL"><T value={c.contact.email} onChange={(v) => set({ ...c, contact: { ...c.contact, email: v } })} /></F>
            <F label="INSTAGRAM HANDLE"><T value={c.contact.instagram} onChange={(v) => set({ ...c, contact: { ...c.contact, instagram: v } })} /></F>
          </Row>
          <Row>
            <F label="YOUTUBE URL TEXT"><T value={c.contact.youtube} onChange={(v) => set({ ...c, contact: { ...c.contact, youtube: v } })} /></F>
            <F label="LOCATION"><T value={c.contact.location} onChange={(v) => set({ ...c, contact: { ...c.contact, location: v } })} /></F>
          </Row>
          <Row>
            <F label="RESPONSE TIME"><T value={c.contact.response} onChange={(v) => set({ ...c, contact: { ...c.contact, response: v } })} /></F>
            <F label="FORM TITLE"><T value={c.contact.formTitle} onChange={(v) => set({ ...c, contact: { ...c.contact, formTitle: v } })} /></F>
          </Row>
          <F label="SUBMIT BUTTON"><T value={c.contact.submit} onChange={(v) => set({ ...c, contact: { ...c.contact, submit: v } })} /></F>
          <F label="TOOLS I USE">
            <StringList items={c.contact.tools} onChange={(v) => set({ ...c, contact: { ...c.contact, tools: v } })} addLabel="Add tool" />
          </F>
        </div>
      );
  }
}

/* ------------------------------ shell ------------------------------ */

export default function CMSEditor() {
  const [section, setSection] = useState<SectionId>("general");
  const [flash, setFlash] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const doExport = () => {
    const blob = new Blob([exportContent()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bhavya-site-content.json";
    a.click();
    URL.revokeObjectURL(url);
    setFlash("Content exported");
  };

  const doImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = importContent(String(reader.result));
      setFlash(res.ok ? "Content imported" : res.error || "Import failed");
    };
    reader.readAsText(file);
  };

  const doReset = () => {
    if (window.confirm("Reset ALL site content to defaults? Your edits will be lost.")) {
      resetContent();
      setFlash("Reset to defaults");
    }
  };

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(""), 2500);
    return () => clearTimeout(t);
  }, [flash]);

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      {/* sidebar */}
      <aside className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all lg:w-full ${
                section === s.id
                  ? "border-lime/60 bg-lime/10 text-lime"
                  : "border-white/[0.07] bg-white/[0.02] text-gray-400 hover:border-white/20 hover:text-white"
              }`}
            >
              <Icon size={15} /> {s.label}
            </button>
          );
        })}
      </aside>

      {/* editor + toolbar */}
      <div>
        <div className="mb-5 flex flex-wrap items-center gap-2.5 rounded-2xl border border-white/[0.07] bg-[#10131a] p-3.5">
          <span className="mr-auto flex items-center gap-2 text-xs font-semibold text-gray-400">
            <span className="animate-blink h-2 w-2 rounded-full bg-lime" />
            Editing live — changes save automatically
          </span>
          {flash && (
            <span className="rounded-full border border-lime/50 bg-lime/10 px-3 py-1 text-xs font-bold text-lime">
              {flash}
            </span>
          )}
          <button onClick={doExport} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-gray-300 transition-colors hover:border-lime hover:text-lime">
            <Download size={13} /> Export
          </button>
          <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-gray-300 transition-colors hover:border-lime hover:text-lime">
            <Upload size={13} /> Import
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
          <button onClick={doReset} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-gray-300 transition-colors hover:border-red-400 hover:text-red-300">
            <RotateCcw size={13} /> Reset
          </button>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#10131a] p-6">
          <Editor section={section} />
        </div>

        <p className="mt-4 text-xs text-gray-600">
          Tip: keep the site open in another tab — your edits appear there in real time. Restore
          everything anytime with <span className="text-gray-400">Reset</span>, or back up your site
          with <span className="text-gray-400">Export</span>. Default content reference:{" "}
          {DEFAULT_CONTENT.brand}.
        </p>
      </div>
    </div>
  );
}
