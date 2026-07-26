import { Star } from "lucide-react";
import Reveal from "./Reveal";
import { useContent, type Review } from "../lib/content";

const AVATAR_COLORS = ["bg-blue-500", "bg-violet-500", "bg-orange-500", "bg-emerald-500", "bg-rose-500"];

function Card({ r, i }: { r: Review; i: number }) {
  return (
    <div className="mx-3 flex w-[22rem] shrink-0 flex-col rounded-2xl border border-white/[0.07] bg-[#121316] p-8 sm:w-[24rem]">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, s) => (
          <Star key={s} size={16} className="text-amber-400" fill="currentColor" />
        ))}
      </div>
      <p className="mt-5 flex-1 italic leading-relaxed text-gray-300">"{r.quote}"</p>
      <div className="mt-7 flex items-center gap-4">
        <span
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-bold text-white ${
            AVATAR_COLORS[i % AVATAR_COLORS.length]
          }`}
        >
          {r.name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </span>
        <div>
          <p className="font-bold text-white">{r.name}</p>
          <p className="text-sm text-gray-500">{r.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { testimonials } = useContent();
  const row = [...testimonials.reviews, ...testimonials.reviews];

  return (
    <section id="testimonials" className="overflow-hidden bg-ink-3 py-28">
      <Reveal className="px-5 text-center">
        <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">{testimonials.eyebrow}</p>
        <h2 className="mt-4 text-4xl font-bold text-white sm:text-6xl">{testimonials.heading}</h2>
      </Reveal>

      <div className="marquee-paused relative mt-16">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-3 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-3 to-transparent" />
        <div className="animate-marquee-slow flex w-max">
          {row.map((r, i) => (
            <Card key={i} r={r} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
