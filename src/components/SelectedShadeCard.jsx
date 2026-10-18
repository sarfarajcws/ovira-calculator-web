import { normalizeHex, isLightColor } from '../utils/color';

export default function SelectedShadeCard({ formula }) {
  const hex = normalizeHex(formula.ShadeRGB);
  const light = hex ? isLightColor(hex) : false;

  return (
    <div className="w-full rounded-2xl border border-line bg-paper-raised overflow-hidden box-border">
      <div
        className="relative w-full aspect-[12/5] min-h-[128px] flex items-end"
        style={{ backgroundColor: hex ?? '#E3DDD0' }}
      >
        {!hex && (
          <span className="absolute inset-0 flex items-center justify-center text-xs text-ink-soft font-mono">
            Colour data unavailable
          </span>
        )}
        {/* batch-stamp style code chip, evokes a paint tin lid marking */}
        <span
          className={`m-4 rounded-full px-3 py-1 text-[11px] font-mono font-semibold tracking-wider ${
            light
              ? 'bg-ink/85 text-white'
              : 'bg-white/90 text-ink'
          }`}
        >
          {formula._codeDisplay}
        </span>
      </div>

      <div className="px-5 py-4 min-w-0">
        <h2 className="font-display text-lg font-semibold text-ink mb-3 break-words">
          {formula._nameDisplay}
        </h2>
        <dl className="grid grid-cols-[auto_1fr] gap-y-2.5 gap-x-3 text-sm">
          <dt className="text-ink-soft shrink-0">Product</dt>
          <dd className="min-w-0 text-right font-medium break-words">{formula.ProductName}</dd>
          <dt className="text-ink-soft shrink-0">Base</dt>
          <dd className="min-w-0 text-right font-medium font-mono break-words">{formula.BasePaintName}</dd>
        </dl>
      </div>
    </div>
  );
}
