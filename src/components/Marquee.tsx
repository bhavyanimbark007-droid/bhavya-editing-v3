import { Sparkles, Zap } from "lucide-react";
import { useContent } from "../lib/content";

export default function Marquee() {
  const { marquee } = useContent();
  const row = [...marquee, ...marquee];
  return (
    <div className="marquee-paused overflow-hidden border-y border-white/5 bg-black py-5">
      <div className="animate-marquee flex w-max items-center">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10 pr-10">
            <span className="flex items-center gap-3 text-sm font-semibold tracking-[0.25em] text-gray-300">
              {i % 2 === 0 ? (
                <Zap size={16} className="text-lime" fill="currentColor" />
              ) : (
                <Sparkles size={16} className="text-lime" fill="currentColor" />
              )}
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
