import { useEffect, useRef, useState } from 'react';

/**
 * Custom-styled dropdown replacing native <select>.
 * Purely a presentational/interaction component — callers still own the
 * selected value and onChange, so no calculation or state logic changes.
 *
 * options: Array<{ value: string, label: string }>
 */
export default function Dropdown({
  value,
  options,
  onChange,
  placeholder = 'Select…',
  disabled = false,
  ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const listRef = useRef(null);

  const selected = options.find((o) => String(o.value) === String(value));

  useEffect(() => {
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      const idx = options.findIndex((o) => String(o.value) === String(value));
      setActiveIndex(idx >= 0 ? idx : 0);
    }
  }, [open, options, value]);

  useEffect(() => {
    if (open && activeIndex >= 0 && listRef.current) {
      const el = listRef.current.children[activeIndex];
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [open, activeIndex]);

  const selectOption = (opt) => {
    onChange(opt.value);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (options[activeIndex]) selectOption(options[activeIndex]);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between rounded-xl border border-line bg-paper-raised px-4 py-3 text-sm font-medium text-ink disabled:bg-paper disabled:cursor-not-allowed disabled:text-ink-soft focus:border-brand transition-colors cursor-pointer"
      >
        <span className={selected ? '' : 'text-ink-soft font-normal'}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={`h-4 w-4 text-ink-soft shrink-0 ml-2 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="none"
        >
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="absolute z-30 mt-2 w-full max-h-72 overflow-y-auto rounded-xl border border-line bg-paper-raised shadow-lg py-1"
        >
          {options.map((opt, idx) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectOption(opt);
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-brand-soft text-brand-dark'
                    : idx === activeIndex
                    ? 'bg-paper text-ink'
                    : 'text-ink'
                }`}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
