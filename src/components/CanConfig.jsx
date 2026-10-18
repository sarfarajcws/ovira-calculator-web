import Dropdown from './Dropdown';

export default function CanConfig({ canSizes, canSize, cans, onCanSizeChange, onCansChange }) {
  const canSizeOptions = canSizes.map((s) => ({ value: s, label: s }));

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-semibold tracking-wide text-ink-soft uppercase mb-2">
          Can Size
        </label>
        <Dropdown
          value={canSize}
          options={canSizeOptions}
          onChange={onCanSizeChange}
          ariaLabel="Can Size"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-wide text-ink-soft uppercase mb-2">
          Number of Cans
        </label>
        <div className="flex items-center rounded-xl border border-line bg-paper-raised overflow-hidden">
          <button
            type="button"
            onClick={() => onCansChange(cans - 1)}
            disabled={cans <= 1}
            aria-label="Decrease number of cans"
            className="h-11 w-11 flex items-center justify-center text-lg text-ink disabled:text-ink-soft/40 hover:bg-paper transition-colors"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={cans}
            onChange={(e) => onCansChange(parseInt(e.target.value, 10))}
            className="w-full text-center text-sm font-semibold font-mono bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => onCansChange(cans + 1)}
            aria-label="Increase number of cans"
            className="h-11 w-11 flex items-center justify-center text-lg text-ink hover:bg-paper transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
