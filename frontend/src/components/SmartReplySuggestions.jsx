import { useMemo } from "react";

function SmartReplySuggestions({ suggestions, loading, error, onSelect }) {
  const showSuggestions = !loading && !error && Array.isArray(suggestions) && suggestions.length > 0;

  const renderedContent = useMemo(() => {
    if (loading) {
      return <p className="text-sm text-ink-muted">Loading smart replies…</p>;
    }

    if (error) {
      return <p className="text-sm text-rose-600">{error}</p>;
    }

    if (showSuggestions) {
      return (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion}-${index}`}
              type="button"
              onClick={() => onSelect(suggestion)}
              className="min-h-[40px] rounded-full border border-stroke bg-surface-secondary px-4 py-2 text-left text-sm text-ink transition duration-200 ease-in-out hover:-translate-y-0.5 hover:border-primary/80 hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {suggestion}
            </button>
          ))}
        </div>
      );
    }

    return null;
  }, [error, loading, onSelect, showSuggestions, suggestions]);

  if (!loading && !error && !showSuggestions) return null;

  return (
    <div className="border-t border-stroke bg-white/95 px-4 py-4 shadow-sm transition duration-200 ease-in-out sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-sm font-semibold text-ink">✨ Suggested Replies</h4>
            <p className="text-xs text-ink-muted">Tap a suggestion to insert it into your message.</p>
          </div>
          {!loading && !error && showSuggestions && (
            <p className="text-xs text-ink-muted">Tap to use</p>
          )}
        </div>
        <div className="min-w-0">{renderedContent}</div>
      </div>
    </div>
  );
}

export default SmartReplySuggestions;
