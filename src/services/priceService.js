// Resolves base paint price for a given Product + Base + Can Size,
// with support for a user-entered manual override when the source
// data has no price for that combination (e.g. ECO GUARD's
// BASE-17-YELLOW, which base-prices.json does not cover).

// Known base-name mismatches between formulas.json and base-prices.json.
// Confirmed by OVIRA PAINTS: these refer to the same physical base, just
// recorded under different names in the two source files.
const BASE_NAME_ALIASES = {
  'BASE-17-YELLOW': 'BASE-17',
};

export function getBaseNameAlias(baseName) {
  return BASE_NAME_ALIASES[baseName] || null;
}

function canSizeLiters(label) {
  const n = parseFloat(label);
  return Number.isFinite(n) ? n : 0;
}

/** All can sizes present anywhere in base-prices.json, largest set, sorted ascending by litre. */
export function getAllCanSizes(basePricesData) {
  const sizes = new Set();
  for (const product of basePricesData.products) {
    for (const base of product.bases) {
      Object.keys(base.prices).forEach((s) => sizes.add(s));
    }
  }
  return Array.from(sizes).sort((a, b) => canSizeLiters(a) - canSizeLiters(b));
}

/** Build Map<"ProductName|BaseName", {size: price}> for fast lookup. */
export function buildBasePriceIndex(basePricesData) {
  const index = new Map();
  for (const product of basePricesData.products) {
    for (const base of product.bases) {
      index.set(`${product.product}|${base.base}`, base.prices);
    }
  }
  return index;
}

export function overrideKey(productName, baseName, canSize) {
  return `${productName}|${baseName}|${canSize}`;
}

/**
 * Resolve the base paint price for a can.
 * Returns { price: number|null, source: 'data' | 'override' | 'missing' }
 */
export function resolveBasePrice({
  basePriceIndex,
  productName,
  baseName,
  canSize,
  overrides,
}) {
  const key = overrideKey(productName, baseName, canSize);
  if (overrides && Object.prototype.hasOwnProperty.call(overrides, key)) {
    const val = overrides[key];
    if (typeof val === 'number' && Number.isFinite(val)) {
      return { price: val, source: 'override' };
    }
  }

  const directPrices = basePriceIndex.get(`${productName}|${baseName}`);
  if (directPrices && Object.prototype.hasOwnProperty.call(directPrices, canSize)) {
    return { price: directPrices[canSize], source: 'data' };
  }

  const aliasBaseName = BASE_NAME_ALIASES[baseName];
  if (aliasBaseName) {
    const aliasPrices = basePriceIndex.get(`${productName}|${aliasBaseName}`);
    if (aliasPrices && Object.prototype.hasOwnProperty.call(aliasPrices, canSize)) {
      return { price: aliasPrices[canSize], source: 'data-alias' };
    }
  }

  return { price: null, source: 'missing' };
}
