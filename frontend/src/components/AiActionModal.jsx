import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Edit3, Loader2, X } from "lucide-react";

function AiActionModal({ result, loading, onCopy, onReplaceDraft, onClose }) {
  const content = useMemo(() => result?.trim() || "", [result]);
  const dialogRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsOpen(true));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
      }
    };

    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const closeModal = () => {
    if (isClosing) return;
    setIsOpen(false);
    setIsClosing(true);
    window.setTimeout(onClose, 220);
  };

  return (
    <div
      className={
        "fixed inset-0 z-50 flex items-center justify-center px-4 py-6 transition-opacity duration-220 ease-in-out " +
        (isOpen ? "opacity-100" : "opacity-0")
      }
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        className={
          "relative w-full max-w-lg rounded-3xl border border-white/80 bg-white p-6 shadow-2xl transition-all duration-220 ease-in-out " +
          (isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2")
        }
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">✨ AI Result</p>
            <h2 className="mt-2 text-xl font-semibold text-ink">AI assistant output</h2>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-stroke bg-surface-secondary text-ink transition duration-200 ease-in-out hover:bg-slate-100 active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-[120px] overflow-hidden rounded-3xl border border-stroke bg-surface-secondary p-4 text-sm leading-6 text-ink">
          {loading ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm font-semibold text-ink">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Generating response...
              </div>
              <div className="space-y-3">
                <div className="h-4 w-3/4 rounded-full bg-slate-200/80 animate-pulse" />
                <div className="h-4 rounded-full bg-slate-200/80 animate-pulse" />
                <div className="h-4 w-5/6 rounded-full bg-slate-200/80 animate-pulse" />
              </div>
            </div>
          ) : (
            <p>{content || "No AI result available."}</p>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          {loading ? (
            <button
              type="button"
              onClick={closeModal}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stroke bg-white px-4 py-3 text-sm font-semibold text-ink transition duration-200 ease-in-out hover:bg-slate-100 active:scale-95"
            >
              Cancel
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onCopy}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stroke bg-white px-4 py-3 text-sm font-semibold text-ink transition duration-200 ease-in-out hover:bg-slate-100 active:scale-95"
              >
                <Copy className="h-4 w-4" /> Copy
              </button>
              <button
                type="button"
                onClick={onReplaceDraft}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition duration-200 ease-in-out hover:bg-primary-accent active:scale-95"
              >
                <Edit3 className="h-4 w-4" /> Replace Draft
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AiActionModal;
