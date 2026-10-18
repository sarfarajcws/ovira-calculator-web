import { useState } from 'react';
import ColourDot from './ColourDot';

export default function FormulaSearch({
  disabled,
  productLabel,
  query,
  results,
  onQueryChange,
  onSelect,
}) {
  const [focused, setFocused] = useState(false);
  const showResults = focused && query.trim().length > 0;

  return (
    <div>
      <label className="block text-xs font-semibold tracking-wide text-ink-soft uppercase mb-2">
        Colour / Formula
      </label>

      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft"
          viewBox="0 0 20 20"
          fill="none"
        >
          <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M17 17L13 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          disabled={disabled}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          placeholder={disabled ? 'Select a product first' : 'Search shade code or shade name…'}
          className="w-full rounded-xl border border-line bg-paper-raised pl-10 pr-4 py-3 text-sm font-medium text-ink placeholder:text-ink-soft/70 disabled:bg-paper disabled:cursor-not-allowed focus:border-brand transition-colors"
        />

        {showResults && (
          <div className="absolute z-20 mt-2 w-full max-h-80 overflow-y-auto rounded-xl border border-line bg-paper-raised shadow-lg">
            {results.length === 0 ? (
              <p className="px-4 py-4 text-sm text-ink-soft">
                No shades found{productLabel ? ` in ${productLabel}` : ''}.
              </p>
            ) : (
              results.map((f) => (
                <button
                  key={f.FormulaId}
                  type="button"
                  onMouseDown={() => onSelect(f)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-brand-soft transition-colors border-b border-line last:border-b-0"
                >
                  <ColourDot rgb={f.ShadeRGB} size={22} />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink truncate">
                      {f._nameDisplay}
                    </span>
                    <span className="block text-xs font-mono text-ink-soft">
                      {f._codeDisplay}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
