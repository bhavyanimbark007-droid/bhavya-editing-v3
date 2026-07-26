import { ArrowDown, Play } from "lucide-react";
import Reveal from "./Reveal";
import { useContent } from "../lib/content";
import type { VideoItem } from "./VideoModal";

const PARTICLES = [
  { top: "18%", left: "8%", size: 5, delay: "0s" },
  { top: "30%", left: "16%", size: 3, delay: "1.2s" },
  { top: "12%", left: "26%", size: 4, delay: "2.4s" },
  { top: "44%", left: "6%", size: 3, delay: "0.8s" },
  { top: "22%", left: "88%", size: 4, delay: "1.6s" },
  { top: "52%", left: "92%", size: 5, delay: "0.4s" },
  { top: "64%", left: "82%", size: 3, delay: "2s" },
  { top: "70%", left: "12%", size: 4, delay: "3s" },
  { top: "8%", left: "60%", size: 3, delay: "2.8s" },
];

function downloadResume() {
  const text = `BHAVYA — Video Editor & Motion Designer
=========================================

EXPERIENCE
3+ years editing for creators, brands and agencies.
50+ projects delivered · 2M+ views generated · 20+ happy clients.

CORE SKILLS
- Advanced Video Editing (Premiere Pro, After Effects, DaVinci Resolve)
- Short Form Content (Reels, Shorts, TikTok)
- Motion Graphics & VFX
- Content Strategy & Thumbnail Psychology

CONTACT
See the website for current email, Instagram and YouTube.
`;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Bhavya-Video-Editor-Resume.txt";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Hero({ onPlay }: { onPlay: (v: VideoItem) => void }) {
  const { hero } = useContent();

  return (
    <section id="home" className="relative overflow-hidden bg-ink pb-24 pt-36 sm:pt-44">
      {/* layered background */}
      <div className="grid-bg absolute inset-0" />
      <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#3f6212]/30 blur-[140px]" />
      <div className="absolute -bottom-48 -right-40 h-[36rem] w-[36rem] rounded-full bg-[#312e81]/35 blur-[150px]" />
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle absolute rounded-full bg-lime/70"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            boxShadow: "0 0 10px rgba(198,245,63,0.8)",
          }}
        />
      ))}

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex justify-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm text-gray-200">
            <span className="animate-blink h-2 w-2 rounded-full bg-lime" />
            <span aria-hidden>⚡</span> {hero.badge}
          </span>
        </Reveal>

        <Reveal delay={120} className="mt-10 text-center">
          <p className="font-script text-3xl italic text-gray-300 sm:text-5xl">{hero.script}</p>
          <h1 className="font-display text-glow-lime mt-1 text-[clamp(4.2rem,15vw,12.5rem)] leading-[0.92] tracking-tight text-lime">
            {hero.title}
          </h1>
        </Reveal>

        <Reveal delay={240}>
          <p className="mx-auto mt-8 max-w-xl text-center text-lg leading-relaxed text-gray-400 sm:text-xl">
            {hero.subtitle}
          </p>
        </Reveal>

        <Reveal delay={340} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
            className="glow-lime inline-flex items-center gap-2.5 rounded-full bg-lime px-8 py-4 text-base font-bold text-black transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <Play size={16} fill="currentColor" /> {hero.primaryCta}
          </button>
          <button
            onClick={downloadResume}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-8 py-4 text-base font-bold text-white transition-all duration-200 hover:border-lime hover:text-lime"
          >
            <ArrowDown size={16} /> {hero.secondaryCta}
          </button>
        </Reveal>

        {/* portfolio preview strip */}
        <div className="mt-20 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {hero.cards.map((card, i) => (
            <Reveal key={`${card.tag}-${i}`} delay={i * 110}>
              <button
                type="button"
                onClick={() => onPlay({ src: card.video, title: card.title, tag: card.tag })}
                aria-label={`Play ${card.title}`}
                className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 text-left"
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />
                <span className="absolute left-3 top-3 rounded-full border border-lime/50 bg-lime/15 px-3 py-1 text-[11px] font-semibold tracking-[0.15em] text-lime backdrop-blur-sm">
                  {card.tag}
                </span>
                <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-lime group-hover:bg-lime">
                  <Play size={18} fill="currentColor" className="translate-x-0.5 text-white transition-colors group-hover:text-black" />
                </span>
                <span className="absolute inset-x-0 bottom-4 text-center text-sm font-semibold text-white">
                  {card.title}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
