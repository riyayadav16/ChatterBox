import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const languages = ["English", "Hindi", "Spanish", "French", "German", "Japanese"];

function AiLanguageSelector({ onSelect, onClose }) {
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
        closeDialog();
      }
    };

    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        closeDialog();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const closeDialog = () => {
    if (isClosing) return;
    setIsOpen(false);
    setIsClosing(true);
    window.setTimeout(onClose, 220);
  };

  const handleLanguage = (language) => {
    setIsOpen(false);
    setIsClosing(true);
    window.setTimeout(() => onSelect(language), 220);
  };

  return (
    <div
      className={
        "fixed inset-0 z-40 flex items-center justify-center px-4 py-4 transition-opacity duration-220 ease-in-out " +
        (isOpen ? "opacity-100" : "opacity-0")
      }
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        className={
          "relative w-full max-w-md rounded-3xl border border-stroke bg-white p-5 shadow-2xl transition-all duration-220 ease-in-out " +
          (isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2")
        }
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">Translate message</p>
            <p className="mt-1 text-sm text-ink-muted">Choose a target language for translation.</p>
          </div>
          <button
            type="button"
            onClick={closeDialog}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-stroke bg-surface-secondary text-ink transition duration-200 ease-in-out hover:bg-slate-100 active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {languages.map((language) => (
            <button
              key={language}
              type="button"
              onClick={() => handleLanguage(language)}
              className="rounded-2xl border border-stroke bg-surface-secondary px-4 py-3 text-left text-sm text-ink transition duration-200 ease-in-out hover:border-primary hover:bg-primary/10 active:scale-95"
            >
              {language}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AiLanguageSelector;
