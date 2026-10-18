import { resolveBasePrice } from './priceService';

/**
 * Calculate the full tinting cost for a resolved formula.
 *
 * @param {Object} params
 * @param {Object} params.formula - a single formula record (Product+Formula already resolved)
 * @param {string} params.canSize - e.g. "1L", "4L"
 * @param {number} params.cans - number of cans (>= 1)
 * @param {Map} params.colourantIndex - Map<ColorantId, colourant record>
 * @param {Map} params.basePriceIndex - Map<"ProductName|BaseName", {size: price}>
 * @param {Object} params.overrides - manual base price overrides, keyed by overrideKey()
 * @returns {Object} full cost breakdown, unrounded internally
 */
export function calculateTintingCost({
  formula,
  canSize,
  cans,
  colourantIndex,
  basePriceIndex,
  overrides,
}) {
  const canLiters = parseFloat(canSize);
  const fillingVolume = formula.FillingVolume || 1;
  const scaleFactor = canLiters / fillingVolume;

  // --- Colourant lines ---
  let colourantCostPerCan = 0;
  let hasMissingColourant = false;

  const colourantLines = (formula.Colorants || []).map((c) => {
    const colourant = colourantIndex.get(Number(c.ColorantId));
    const quantityMl = c.UsedAmount * scaleFactor;

    if (!colourant) {
      hasMissingColourant = true;
      return {
        colorantId: c.ColorantId,
        name: c.ColorantName || `Unknown colourant #${c.ColorantId}`,
        quantityMl,
        pricePerLitre: null,
        cost: null,
        rgb: null,
        missing: true,
      };
    }

    const cost = quantityMl * colourant.Price;
    colourantCostPerCan += cost;

    return {
      colorantId: c.ColorantId,
      name: colourant.ColorantName,
      quantityMl,
      pricePerLitre: colourant.Price,
      cost,
      rgb: colourant.RGB,
      missing: false,
    };
  });

  // --- Base paint cost ---
  const basePriceResult = resolveBasePrice({
    basePriceIndex,
    productName: formula.ProductName,
    baseName: formula.BasePaintName,
    canSize,
    overrides,
  });

  const basePaintCostPerCan = basePriceResult.price; // null if missing
  const hasMissingBasePrice = basePriceResult.price === null;

  // --- Totals ---
  const finalCostPerCan =
    hasMissingBasePrice || hasMissingColourant
      ? null
      : basePaintCostPerCan + colourantCostPerCan;

  return {
    canLiters,
    cans,
    colourantLines,
    colourantCostPerCan,
    colourantCostTotal: colourantCostPerCan * cans,
    basePaintCostPerCan,
    basePaintCostTotal: hasMissingBasePrice ? null : basePaintCostPerCan * cans,
    basePriceSource: basePriceResult.source,
    finalCostPerCan,
    finalCostTotal: finalCostPerCan === null ? null : finalCostPerCan * cans,
    hasMissingColourant,
    hasMissingBasePrice,
  };
}
