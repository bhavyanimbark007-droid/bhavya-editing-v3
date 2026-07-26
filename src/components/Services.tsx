import { ArrowRight, Check, Star } from "lucide-react";
import Reveal from "./Reveal";
import { useContent } from "../lib/content";

export default function Services() {
  const { services } = useContent();

  return (
    <section id="services" className="relative bg-ink-3 py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">{services.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-bold text-white sm:text-6xl">{services.heading}</h2>
        </Reveal>

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
          {services.plans.map((plan, i) => (
            <Reveal key={`${plan.name}-${i}`} delay={i * 120} className="h-full">
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1.5 sm:p-9 ${
                  plan.featured
                    ? "border-lime/70 bg-[#111409] shadow-[0_0_50px_rgba(198,245,63,0.15)]"
                    : "border-white/[0.08] bg-[#101114] hover:border-white/20"
                }`}
              >
                {plan.featured && (
                  <span className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-lime px-4 py-1.5 text-xs font-bold tracking-[0.12em] text-black">
                    <Star size={12} fill="currentColor" /> MOST POPULAR
                  </span>
                )}
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-5xl text-lime">{plan.price}</span>
                  <span className="text-gray-500">{plan.unit}</span>
                </p>

                <ul className="mt-8 flex-1 space-y-4">
                  {plan.features.map((f, fi) => (
                    <li key={`${f}-${fi}`} className="flex items-center gap-3 text-[15px] text-gray-300">
                      <Check size={16} className="shrink-0 text-lime" strokeWidth={3} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className={`mt-9 inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold transition-all duration-200 hover:scale-[1.03] active:scale-95 ${
                    plan.featured
                      ? "glow-lime bg-lime text-black"
                      : "border border-white/25 text-white hover:border-lime hover:text-lime"
                  }`}
                >
                  Get Started <ArrowRight size={17} />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
