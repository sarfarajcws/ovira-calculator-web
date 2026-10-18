import ColourDot from './ColourDot';
import { formatCurrency, formatMl, formatUnitPrice } from '../utils/format';

// Grid-column templates (name column uses minmax(0, 1fr) so it can actually
// shrink/truncate below its content width — a plain <table> with the
// default table-layout:auto cannot do this, which was the source of the
// horizontal-overflow bug). Mobile shows 3 columns (Price/L hidden); sm+
// shows all 4. Both header and body rows share these templates so columns
// stay aligned.
const GRID_COLS = 'grid-cols-[minmax(0,1fr)_auto_auto] sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]';

export default function FormulaTable({ lines }) {
  return (
    <div className="w-full rounded-2xl border border-line bg-paper-raised overflow-hidden box-border">
      <div className="px-5 py-3.5 border-b border-line">
        <h3 className="font-display text-sm font-semibold">Colourant Formula</h3>
      </div>

      <div className="w-full min-w-0" role="table">
        <div
          role="row"
          className={`grid ${GRID_COLS} gap-x-3 px-5 py-2.5 text-xs text-ink-soft uppercase tracking-wide`}
        >
          <span role="columnheader" className="font-medium min-w-0 text-left">
            Colourant
          </span>
          <span role="columnheader" className="font-medium text-right">
            Quantity
          </span>
          <span role="columnheader" className="font-medium text-right hidden sm:block">
            Price/L
          </span>
          <span role="columnheader" className="font-medium text-right">
            Cost
          </span>
        </div>

        {lines.map((line) => (
          <div
            key={line.colorantId}
            role="row"
            className={`grid ${GRID_COLS} gap-x-3 px-5 py-3 items-center text-sm border-t border-line`}
          >
            <span role="cell" className="min-w-0 flex items-center gap-2.5">
              <ColourDot rgb={line.rgb} />
              <span className="min-w-0 font-medium truncate">{line.name}</span>
            </span>
            <span role="cell" className="text-right font-mono text-ink-soft whitespace-nowrap">
              {formatMl(line.quantityMl)}
            </span>
            <span role="cell" className="text-right font-mono text-ink-soft hidden sm:block whitespace-nowrap">
              {formatUnitPrice(line.pricePerLitre)}
            </span>
            <span role="cell" className="text-right font-mono font-semibold whitespace-nowrap">
              {line.missing ? (
                <span className="text-danger text-xs font-sans font-medium">Data missing</span>
              ) : (
                formatCurrency(line.cost)
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

