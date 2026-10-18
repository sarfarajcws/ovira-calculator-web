export default function EmptyState({ productSelected }) {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong bg-paper-raised/50 flex flex-col items-center justify-center text-center px-6 py-16 h-full min-h-[260px]">
      <div className="h-12 w-12 rounded-full bg-brand-soft flex items-center justify-center mb-4">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="var(--color-brand)" strokeWidth="1.6" />
          <path d="M17 17L13 13" stroke="var(--color-brand)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-sm font-medium text-ink mb-1">
        {productSelected ? 'Search for a colour or formula' : 'Select a product to begin'}
      </p>
      <p className="text-xs text-ink-soft max-w-[220px]">
        {productSelected
          ? 'Try a shade code like X159, or a shade name like Loud Lime.'
          : 'Choose a product line to see its available shades.'}
      </p>
    </div>
  );
}
