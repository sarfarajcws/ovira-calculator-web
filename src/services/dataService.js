// Loads calculator data directly from /data/*.json on every app load.
// No IndexedDB / localStorage / service-worker caching of formula data —
// this is intentional per the app's "always current data" requirement.

const DATA_BASE = '/data';

async function fetchJson(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to load ${path}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function loadCalculatorData() {
  const [products, formulas, colourants, basePrices] = await Promise.all([
    fetchJson(`${DATA_BASE}/products.json`),
    fetchJson(`${DATA_BASE}/formulas.json`),
    fetchJson(`${DATA_BASE}/colourants.json`),
    fetchJson(`${DATA_BASE}/base-prices.json`),
  ]);

  return { products, formulas, colourants, basePrices };
}
