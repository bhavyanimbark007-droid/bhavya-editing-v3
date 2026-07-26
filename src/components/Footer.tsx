import { ArrowUp, Mail } from "lucide-react";
import { useContent } from "../lib/content";

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.92 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

export default function Footer() {
  const { brand, footer, contact } = useContent();

  return (
    <footer className="border-t border-white/[0.06] bg-[#0b0e17] py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:flex-row sm:px-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-lg font-bold tracking-[0.18em] text-white transition-colors hover:text-lime"
        >
          {brand}
        </button>

        <div className="flex items-center gap-4">
          <p className="text-center text-sm text-gray-500">{footer.replace("{year}", String(new Date().getFullYear()))}</p>
          <button
            onClick={() => {
              window.location.hash = "cms";
              window.dispatchEvent(new Event("cms:open"));
            }}
            className="text-xs font-semibold text-gray-600 transition-colors hover:text-lime"
          >
            CMS Portal
          </button>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`mailto:${contact.email}`}
            aria-label="Email"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-gray-300 transition-all hover:border-lime hover:text-lime"
          >
            <Mail size={16} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-gray-300 transition-all hover:border-lime hover:text-lime"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-gray-300 transition-all hover:border-lime hover:text-lime"
          >
            <YoutubeIcon />
          </a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="grid h-10 w-10 place-items-center rounded-full bg-lime text-black transition-transform hover:scale-110"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
