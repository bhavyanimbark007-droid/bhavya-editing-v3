import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

export interface VideoItem {
  src: string;
  title: string;
  tag?: string;
}

export default function VideoModal({
  video,
  onClose,
}: {
  video: VideoItem | null;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!video) return;
    setLoading(true);
    setFailed(false);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      videoRef.current?.pause();
    };
  }, [video, onClose]);

  if (!video) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[95] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Playing ${video.title}`}
    >
      <div
        className="animate-modal-in relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {video.tag && (
              <span className="rounded-full border border-lime/50 bg-lime/15 px-3 py-1 text-[11px] font-semibold tracking-[0.15em] text-lime">
                {video.tag}
              </span>
            )}
            <h3 className="text-lg font-bold text-white">{video.title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close video"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.05] text-gray-300 transition-all hover:rotate-90 hover:border-lime hover:text-lime"
          >
            <X size={18} />
          </button>
        </div>

        {/* player */}
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_0_80px_rgba(198,245,63,0.12)]">
          {loading && !failed && (
            <div className="absolute inset-0 z-10 grid place-items-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={34} className="animate-spin text-lime" />
                <p className="text-xs font-semibold tracking-[0.2em] text-gray-400">LOADING…</p>
              </div>
            </div>
          )}
          {failed ? (
            <div className="absolute inset-0 grid place-items-center">
              <div className="flex flex-col items-center gap-3 text-center">
                <AlertTriangle size={34} className="text-amber-400" />
                <p className="font-bold text-white">Preview couldn't load</p>
                <p className="max-w-xs text-sm text-gray-500">
                  Check your connection and try again.
                </p>
                <button
                  onClick={() => {
                    setFailed(false);
                    setLoading(true);
                    videoRef.current?.load();
                    videoRef.current?.play().catch(() => {});
                  }}
                  className="mt-1 rounded-full border border-lime/60 px-5 py-2 text-sm font-bold text-lime transition-colors hover:bg-lime hover:text-black"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <video
              key={video.src}
              ref={videoRef}
              src={video.src}
              controls
              autoPlay
              playsInline
              preload="metadata"
              onCanPlay={() => setLoading(false)}
              onLoadedData={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setFailed(true);
              }}
              className="h-full w-full bg-black"
            />
          )}
        </div>

        <p className="mt-4 text-center text-xs text-gray-600">
          Press <kbd className="rounded border border-white/15 bg-white/[0.05] px-1.5 py-0.5 font-sans text-gray-400">ESC</kbd> or click outside to close
        </p>
      </div>
    </div>
  );
}
