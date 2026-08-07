import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, ChevronRight } from "lucide-react";

const actions = [
  { value: "summarize", label: "Summarize" },
  { value: "rewrite_professionally", label: "Rewrite Professionally" },
  { value: "make_shorter", label: "Make Shorter" },
  { value: "make_friendlier", label: "Make Friendlier" },
  { value: "translate", label: "Translate" },
];

function AiActionMenu({ onSelect, onClose, position }) {
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const style = useMemo(
    () => ({
      left: position?.left ?? 0,
      top: position?.top ?? 0,
    }),
    [position]
  );

  useEffect(() => {
    requestAnimationFrame(() => setIsOpen(true));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
      }
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const closeMenu = (callback) => {
    if (isClosing) return;
    setIsOpen(false);
    setIsClosing(true);
    window.setTimeout(callback, 200);
  };

  const handleSelect = (action) => {
    closeMenu(() => onSelect(action));
  };

  const handleClose = () => {
    closeMenu(onClose);
  };

  return (
    <div
      style={{ position: "fixed", left: style.left, top: style.top }}
      className={
        "z-40 min-w-[220px] rounded-3xl border border-stroke bg-white p-3 shadow-2xl transition-all duration-200 ease-in-out " +
        (isOpen
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 translate-y-1")
      }
      ref={menuRef}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">AI Assistant</p>
          <p className="text-xs text-ink-muted">Choose an action for this message.</p>
        </div>
      </div>

      <div className="space-y-1">
        {actions.map((action) => (
          <button
            key={action.value}
            type="button"
            onClick={() => handleSelect(action.value)}
            className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm text-ink transition duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-surface-secondary active:scale-95 active:bg-slate-100"
          >
            <span>{action.label}</span>
            <ChevronRight className="h-4 w-4 text-ink-muted" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default AiActionMenu;
