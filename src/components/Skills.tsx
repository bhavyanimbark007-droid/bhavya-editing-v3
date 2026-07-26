import { Plus, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import { TAG_COLORS, useContent } from "../lib/content";

export default function Skills() {
  const { skills } = useContent();

  return (
    <section id="skills" className="dot-bg relative bg-ink py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">{skills.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-bold text-white sm:text-6xl">{skills.heading}</h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {skills.cards.map((card, i) => (
            <Reveal key={`${card.title}-${i}`} delay={(i % 2) * 120}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111419] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-lime/50 hover:shadow-[0_0_40px_rgba(198,245,63,0.12)] sm:p-10">
                <span className="font-display pointer-events-none absolute -top-3 right-5 text-[7rem] leading-none text-white/[0.05]">
                  {i + 1}
                </span>
                {card.isNew && (
                  <span className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-violet-500 px-3 py-1 text-xs font-semibold text-white">
                    <Sparkles size={12} /> New
                  </span>
                )}
                <div className="flex flex-wrap gap-2.5">
                  {card.tags.map((t, ti) => (
                    <span
                      key={`${t.label}-${ti}`}
                      className={`rounded-lg border px-3.5 py-1.5 text-sm font-semibold ${TAG_COLORS[t.color]}`}
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
                <h3 className="mt-6 text-2xl font-bold text-white">{card.title}</h3>
                <ul className="mt-6 space-y-3.5">
                  {card.points.map((p, pi) => (
                    <li key={`${p}-${pi}`} className="flex items-start gap-3 text-[15px] text-gray-400">
                      <Plus size={16} className="mt-1 shrink-0 text-lime" strokeWidth={3} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
