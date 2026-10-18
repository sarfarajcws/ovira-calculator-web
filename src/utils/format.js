// Money is only rounded/formatted at display time — never in calculations.
// Indian-locale thousands grouping is fine for whole totals, but must never
// be applied to decimal per-litre unit prices (e.g. 1.145 must stay 1.145,
// not become "1,145").

export function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** For per-litre colourant/base unit prices — plain decimal, no grouping. */
export function formatUnitPrice(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return `₹${value.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}`;
}

export function formatMl(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return `${value.toFixed(2)} ml`;
}
