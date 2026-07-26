import { ArrowRight, Play } from "lucide-react";
import Reveal from "./Reveal";
import { useContent } from "../lib/content";
import type { VideoItem } from "./VideoModal";

const FILTERS = [
  "",
  "",
  "hue-rotate(75deg) saturate(1.6) brightness(0.9)",
  "",
  "grayscale(1) contrast(1.1)",
  "sepia(0.35) saturate(1.4) hue-rotate(-12deg)",
];

export default function Work({ onPlay }: { onPlay: (v: VideoItem) => void }) {
  const { work } = useContent();

  return (
    <section id="work" className="relative overflow-hidden bg-ink-2 py-28">
      <span className="font-display pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 text-[20vw] leading-none text-white/[0.03]">
        WORK
      </span>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">{work.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-bold text-white sm:text-6xl">{work.heading}</h2>
          <p className="mt-4 text-lg text-gray-400">{work.sub}</p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {work.projects.map((p, i) => (
            <Reveal key={`${p.title}-${i}`} delay={(i % 3) * 110}>
              <button
                type="button"
                onClick={() => onPlay({ src: p.video, title: p.title, tag: p.tag })}
                aria-label={`Play ${p.title}`}
                className="group relative block aspect-[16/11] w-full cursor-pointer overflow-hidden rounded-2xl border border-white/[0.07] text-left"
              >
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={FILTERS[i % FILTERS.length] ? { filter: FILTERS[i % FILTERS.length] } : undefined}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 scale-75 place-items-center rounded-full border border-white/30 bg-white/15 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-hover:border-lime group-hover:bg-lime">
                  <Play size={18} fill="currentColor" className="translate-x-0.5 text-white transition-colors group-hover:text-black" />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="inline-block rounded-full border border-lime/50 bg-lime/15 px-3 py-1 text-[11px] font-semibold tracking-[0.15em] text-lime backdrop-blur-sm">
                    {p.tag}
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-white">{p.title}</h3>
                  <p className="mt-1 text-sm text-gray-400">{p.sub}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-14 flex justify-center">
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="glow-lime inline-flex items-center gap-2 rounded-full bg-lime px-9 py-4 text-base font-bold text-black transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            {work.cta} <ArrowRight size={18} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
