import { useState } from 'react';
import { formatCurrency } from '../utils/format';
import { getBaseNameAlias } from '../services/priceService';

export default function CostSummary({ calc, formula, canSize, onSetOverride, onClearOverride }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const startEdit = () => {
    setDraft(
      calc.basePaintCostPerCan !== null ? String(calc.basePaintCostPerCan) : ''
    );
    setEditing(true);
  };

  const submitEdit = () => {
    const value = parseFloat(draft);
    if (Number.isFinite(value) && value >= 0) {
      onSetOverride(value);
    }
    setEditing(false);
  };

  return (
    <div className="rounded-2xl border border-line bg-paper-raised p-5">
      <h3 className="font-display text-sm font-semibold mb-4">Cost Summary</h3>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-ink-soft">Base Paint Cost ({canSize} × {calc.cans})</span>
          {calc.hasMissingBasePrice && !editing ? (
            <span className="flex items-center gap-2">
              <span className="text-xs text-amber bg-amber-soft px-2 py-1 rounded-md font-medium">
                Price unavailable
              </span>
              <button
                type="button"
                onClick={startEdit}
                className="text-xs font-medium text-brand hover:underline"
              >
                Set price
              </button>
            </span>
          ) : editing ? (
            <span className="flex items-center gap-1.5">
              <span className="text-ink-soft text-xs">₹</span>
              <input
                autoFocus
                type="number"
                min="0"
                step="0.01"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitEdit()}
                className="w-24 rounded-md border border-line px-2 py-1 text-right font-mono text-sm focus:border-brand"
                placeholder="per can"
              />
              <button
                type="button"
                onClick={submitEdit}
                className="text-xs font-medium text-white bg-brand rounded-md px-2 py-1 hover:bg-brand-dark"
              >
                Save
              </button>
            </span>
          ) : (
            <span className="font-mono font-medium flex items-center gap-2">
              {formatCurrency(calc.basePaintCostTotal)}
              {calc.basePriceSource === 'override' && (
                <button
                  type="button"
                  onClick={() => {
                    onClearOverride();
                  }}
                  className="text-[11px] text-ink-soft hover:text-rust underline decoration-dotted"
                  title="Revert to source data / clear manual price"
                >
                  manual
                </button>
              )}
              {calc.basePriceSource === 'data-alias' && (
                <span
                  className="text-[11px] text-ink-soft"
                  title={`${formula.BasePaintName} is priced using ${getBaseNameAlias(formula.BasePaintName)} — same base, recorded under a different name in the two source files`}
                >
                  via {getBaseNameAlias(formula.BasePaintName)}
                </span>
              )}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-ink-soft">Colourant Cost</span>
          <span className="font-mono font-medium">
            {calc.hasMissingColourant ? (
              <span className="text-danger text-xs font-sans">Incomplete data</span>
            ) : (
              formatCurrency(calc.colourantCostTotal)
            )}
          </span>
        </div>
      </div>

      <div className="my-4 border-t border-dashed border-line-strong" />

      <div className="flex items-center justify-between">
        <span className="font-display font-semibold">Final Cost</span>
        <span className="font-display text-xl font-bold text-brand">
          {calc.finalCostTotal === null ? (
            <span className="text-sm font-sans font-medium text-danger">
              Unavailable — resolve missing data above
            </span>
          ) : (
            formatCurrency(calc.finalCostTotal)
          )}
        </span>
      </div>
    </div>
  );
}
