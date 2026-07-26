import Reveal from "./Reveal";
import { useContent } from "../lib/content";

export default function WhyMe() {
  const { why } = useContent();

  return (
    <section id="why" className="relative overflow-hidden bg-black py-28">
      {/* ghost watermark */}
      <span className="font-display pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[22vw] leading-none text-white/[0.035]">
        WHY ME?
      </span>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">{why.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-bold text-white sm:text-6xl">{why.heading}</h2>
        </Reveal>

        <Reveal delay={150} className="relative mx-auto mt-16 max-w-4xl">
          <div className="relative">
            <svg viewBox="0 0 800 380" className="w-full" aria-hidden>
              <ellipse cx="400" cy="190" rx="310" ry="150" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
              <line x1="90" y1="190" x2="710" y2="190" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="400" y1="40" x2="400" y2="340" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <ellipse
                cx="400"
                cy="190"
                rx="310"
                ry="150"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="orbit-arc"
                pathLength={920}
              />
            </svg>

            <div className="absolute left-0 top-1/2 hidden -translate-y-1/2 text-right sm:block">
              <p className="text-xl font-bold text-white">{why.left.title}</p>
              <p className="font-script italic text-gray-400">{why.left.sub}</p>
            </div>
            <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 sm:block">
              <p className="text-xl font-bold text-white">{why.right.title}</p>
              <p className="font-script italic text-lime">{why.right.sub}</p>
            </div>

            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 text-center">
              {why.points.map((p) => (
                <p key={p} className="text-sm font-semibold text-white sm:text-base">
                  {p}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-10 sm:hidden">
            <div className="text-center">
              <p className="font-bold text-white">{why.left.title}</p>
              <p className="font-script italic text-gray-400">{why.left.sub}</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-white">{why.right.title}</p>
              <p className="font-script italic text-lime">{why.right.sub}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={250} className="mx-auto mt-16 max-w-2xl">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-10">
            <p className="text-lg font-bold text-white sm:text-xl">{why.quoteTitle}</p>
            <p className="mt-3 italic leading-relaxed text-gray-400">{why.quoteBody}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
