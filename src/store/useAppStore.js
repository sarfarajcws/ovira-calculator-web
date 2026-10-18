import { create } from 'zustand';
import { loadCalculatorData } from '../services/dataService';
import { buildFormulaIndex, getFormulasForProduct, searchFormulas } from '../services/formulaService';
import { buildBasePriceIndex, getAllCanSizes } from '../services/priceService';

// Manual base-price overrides are a small, explicit user setting (not cached
// formula/pricing data), so persisting them in localStorage is reasonable —
// this is unrelated to the "no offline formula database" requirement.
const OVERRIDES_STORAGE_KEY = 'ovira.basePriceOverrides.v1';

function loadOverrides() {
  try {
    const raw = localStorage.getItem(OVERRIDES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveOverrides(overrides) {
  try {
    localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // non-fatal — overrides simply won't persist across sessions
  }
}

const DEFAULT_ERROR_MESSAGE =
  'Unable to load calculator data. Please check your internet connection and reload.';

export const useAppStore = create((set, get) => ({
  status: 'loading', // loading | error | ready
  errorMessage: null,

  products: [],
  colourantIndex: new Map(),
  formulaIndex: new Map(),
  basePriceIndex: new Map(),
  canSizes: [],
  overrides: loadOverrides(),

  selectedProductId: null,
  searchQuery: '',
  searchResults: [],
  selectedFormula: null,
  canSize: null,
  cans: 1,

  async init() {
    set({ status: 'loading', errorMessage: null });
    try {
      const { products, formulas, colourants, basePrices } = await loadCalculatorData();

      const colourantIndex = new Map(
        colourants.colourants.map((c) => [Number(c.ColorantId), c])
      );
      const formulaIndex = buildFormulaIndex(formulas.formulas);
      const basePriceIndex = buildBasePriceIndex(basePrices);
      const canSizes = getAllCanSizes(basePrices);

      set({
        status: 'ready',
        products: products.products,
        colourantIndex,
        formulaIndex,
        basePriceIndex,
        canSizes,
        canSize: canSizes[0] || null,
      });
    } catch (err) {
      set({ status: 'error', errorMessage: DEFAULT_ERROR_MESSAGE });
      // eslint-disable-next-line no-console
      console.error(err);
    }
  },

  selectProduct(productId) {
    set({
      selectedProductId: productId,
      searchQuery: '',
      searchResults: [],
      selectedFormula: null,
    });
  },

  setSearchQuery(query) {
    const { formulaIndex, selectedProductId } = get();
    const results = selectedProductId
      ? searchFormulas(formulaIndex, selectedProductId, query)
      : [];
    set({ searchQuery: query, searchResults: results });
  },

  selectFormula(formula) {
    set({ selectedFormula: formula, searchQuery: '', searchResults: [] });
  },

  clearSelectedFormula() {
    set({ selectedFormula: null });
  },

  setCanSize(canSize) {
    set({ canSize });
  },

  setCans(cans) {
    const n = Math.max(1, Math.floor(cans) || 1);
    set({ cans: n });
  },

  setOverride(key, value) {
    const overrides = { ...get().overrides, [key]: value };
    saveOverrides(overrides);
    set({ overrides });
  },

  clearOverride(key) {
    const overrides = { ...get().overrides };
    delete overrides[key];
    saveOverrides(overrides);
    set({ overrides });
  },

  getProductFormulas() {
    const { formulaIndex, selectedProductId } = get();
    return selectedProductId ? getFormulasForProduct(formulaIndex, selectedProductId) : [];
  },
}));
