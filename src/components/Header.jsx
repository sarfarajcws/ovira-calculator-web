import { SWITCH_TO_NEW_URL } from "../config/appLinks";

export default function Header() {
  return (
    <header
      className="border-b border-line bg-paper-raised/70 backdrop-blur-sm sticky top-0 z-30"
      style={{
        paddingTop: "var(--safe-area-inset-top, env(safe-area-inset-top, 0px))",
      }}
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-4 flex items-center gap-3">
        <img
          src="/assets/ovira-calculator-icon.png"
          alt="OVIRA Tinting Cost Calculator"
          className="h-9 w-9 shrink-0 object-contain"
        />

        <div className="leading-tight">
          <p className="font-display font-semibold text-[15px] tracking-tight">
            OVIRA PAINTS
          </p>
          <p className="text-xs text-ink-soft">Tinting Cost Calculator</p>
        </div>
        <div className="ml-auto shrink-0">
          {SWITCH_TO_NEW_URL ? (
            <a
              href={SWITCH_TO_NEW_URL}
              className="inline-flex items-center rounded-lg border border-line bg-paper-raised px-3 py-1.5 text-xs sm:text-sm font-semibold text-ink-soft hover:text-rust hover:border-rust transition-colors"
            >
              Switch to New
            </a>
          ) : (
            <span
              role="link"
              aria-disabled="true"
              title="New app URL is not configured yet"
              className="inline-flex items-center rounded-lg border border-line px-3 py-1.5 text-xs sm:text-sm font-semibold text-ink-soft opacity-70 cursor-not-allowed"
            >
              Switch to New
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
