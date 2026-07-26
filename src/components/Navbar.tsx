import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useContent } from "../lib/content";

export default function Navbar() {
  const { brand, nav } = useContent();
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const pos = window.scrollY + window.innerHeight / 3;
      let current = "";
      for (const link of nav) {
        const el = document.getElementById(link.id);
        if (el && el.offsetTop <= pos) current = link.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [nav]);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed inset-x-3 top-3 z-50 sm:inset-x-5 sm:top-5">
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-[#0b0e15]/85 px-5 py-3 backdrop-blur-xl transition-shadow duration-300 sm:px-7 ${
          scrolled ? "shadow-[0_10px_40px_rgba(0,0,0,0.55)]" : ""
        }`}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-xl font-bold tracking-[0.18em] text-white transition-colors hover:text-lime"
        >
          {brand}
        </button>

        <ul className="hidden items-center gap-7 lg:flex">
          {nav.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className={`text-[15px] transition-colors duration-200 ${
                  active === l.id ? "font-medium text-lime" : "text-gray-300 hover:text-white"
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={() => go("contact")}
            className="glow-lime hidden rounded-full bg-lime px-7 py-3 text-[15px] font-bold text-black transition-transform duration-200 hover:scale-105 active:scale-95 sm:block"
          >
            Hire Me
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-7xl rounded-3xl border border-white/10 bg-[#0b0e15]/95 p-4 backdrop-blur-xl lg:hidden">
          {nav.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className={`block w-full rounded-xl px-4 py-3 text-left text-base transition-colors ${
                active === l.id ? "bg-lime/10 text-lime" : "text-gray-300 hover:bg-white/5"
              }`}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => go("contact")}
            className="mt-2 w-full rounded-full bg-lime py-3 font-bold text-black"
          >
            Hire Me
          </button>
        </div>
      )}
    </header>
  );
}
