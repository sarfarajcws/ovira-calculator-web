// Formula indexing + product-scoped search.
// formulas.json has ~12.5k records after filtering to supported products.
// We never render them all — we index once by ProductId, then filter
// in-memory only within the selected product.

function normalizeText(value) {
  return (value ?? '')
    .toString()
    .trim()
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

// ShadeCode / ShadeName both arrive as "CODE - NAME" (identical strings).
// Split once so we can search/display the code and name independently.
function splitShade(shadeCode) {
  const idx = shadeCode.indexOf(' - ');
  if (idx === -1) {
    return { code: shadeCode, name: shadeCode };
  }
  return {
    code: shadeCode.slice(0, idx),
    name: shadeCode.slice(idx + 3),
  };
}

/**
 * Build an in-memory index: Map<ProductId(number), FormulaRecord[]>
 * Each formula record is enriched with normalized search fields.
 * This index is rebuilt once after data load and kept only in memory
 * (never persisted).
 */
export function buildFormulaIndex(formulas) {
  const index = new Map();

  for (const formula of formulas) {
    const { code, name } = splitShade(formula.ShadeCode || '');
    const enriched = {
      ...formula,
      _codeDisplay: code,
      _nameDisplay: name,
      _codeSearch: normalizeText(code),
      _nameSearch: normalizeText(name),
    };

    const pid = Number(formula.ProductId);
    if (!index.has(pid)) index.set(pid, []);
    index.get(pid).push(enriched);
  }

  return index;
}

export function getFormulasForProduct(index, productId) {
  const pid = Number(productId);
  return index.get(pid) || [];
}

/**
 * Search within a single product's formulas by shade code or shade name.
 * Case-insensitive, whitespace-normalized, partial match on either field.
 */
export function searchFormulas(index, productId, rawQuery, limit = 50) {
  const productFormulas = getFormulasForProduct(index, productId);
  const query = normalizeText(rawQuery);

  if (!query) return [];

  const results = [];
  for (const f of productFormulas) {
    if (f._codeSearch.includes(query) || f._nameSearch.includes(query)) {
      results.push(f);
      if (results.length >= limit) break;
    }
  }
  return results;
}
