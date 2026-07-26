import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { useContent } from "../lib/content";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const dur = 1600;
          const tick = (t: number) => {
            const p = Math.min((t - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(eased * value));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="font-display text-6xl text-white sm:text-7xl">
      {n}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const { stats } = useContent();

  return (
    <section className="relative overflow-hidden bg-ink-3 py-28">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="text-center">
          <h2 className="text-4xl font-bold text-white sm:text-6xl">{stats.heading}</h2>
          <p className="font-display text-glow-lime mt-2 text-[clamp(3rem,9vw,6.5rem)] leading-none text-lime">
            {stats.accent}
          </p>
        </Reveal>

        <Reveal delay={150} className="mt-20 grid grid-cols-2 gap-y-14 lg:grid-cols-4">
          {stats.items.map((s, i) => (
            <div
              key={i}
              className={`relative flex flex-col items-center text-center ${
                i > 0 ? "lg:border-l lg:border-white/10" : ""
              }`}
            >
              <span className="absolute -top-8 h-8 w-px bg-lime/70" />
              <Counter value={s.value} suffix={s.suffix} />
              <span className="mt-4 max-w-[10rem] text-sm font-medium tracking-[0.2em] text-gray-400">
                {s.label}
              </span>
            </div>
          ))}
        </Reveal>

        <Reveal delay={250} className="mt-20 flex justify-center">
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="glow-lime inline-flex items-center gap-2 rounded-full bg-lime px-9 py-4 text-base font-bold text-black transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            {stats.cta} <ArrowRight size={18} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
