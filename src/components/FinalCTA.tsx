import Reveal from "./Reveal";
import { useContent } from "../lib/content";

export default function FinalCTA() {
  const { cta } = useContent();

  return (
    <section className="relative overflow-hidden bg-black py-36">
      {/* center hairline */}
      <span className="absolute left-1/2 top-0 h-full w-px bg-white/10" />
      <div className="absolute left-1/2 top-1/2 h-[30rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
        <Reveal>
          <h2 className="font-display text-glow-white text-[clamp(3rem,10vw,7.5rem)] leading-[1.02] text-white">
            {cta.line1}
            <br />
            {cta.line2}
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-8 text-lg text-gray-400 sm:text-xl">{cta.sub}</p>
        </Reveal>
        <Reveal delay={280} className="mt-12 flex justify-center">
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="group relative rounded-lg border border-white/30 px-12 py-5 text-lg font-bold text-white transition-colors duration-300 hover:border-lime hover:text-lime"
          >
            <span className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-lime" />
            <span className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-lime" />
            {cta.button}
          </button>
        </Reveal>
      </div>
    </section>
  );
}
