import { useEffect, useMemo } from "react";
import { useAppStore } from "./store/useAppStore";
import { calculateTintingCost } from "./services/calculationEngine";
import { overrideKey } from "./services/priceService";

import Header from "./components/Header";
import LoadingScreen from "./components/LoadingScreen";
import ErrorScreen from "./components/ErrorScreen";
import ProductSelect from "./components/ProductSelect";
import FormulaSearch from "./components/FormulaSearch";
import SelectedShadeCard from "./components/SelectedShadeCard";
import CanConfig from "./components/CanConfig";
import FormulaTable from "./components/FormulaTable";
import CostSummary from "./components/CostSummary";
import EmptyState from "./components/EmptyState";

function App() {
  const {
    status,
    errorMessage,
    products,
    colourantIndex,
    basePriceIndex,
    canSizes,
    overrides,
    selectedProductId,
    searchQuery,
    searchResults,
    selectedFormula,
    canSize,
    cans,
    init,
    selectProduct,
    setSearchQuery,
    selectFormula,
    clearSelectedFormula,
    setCanSize,
    setCans,
    setOverride,
    clearOverride,
  } = useAppStore();

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedProduct = useMemo(
    () =>
      products.find((p) => String(p.ProductId) === String(selectedProductId)),
    [products, selectedProductId],
  );

  const calc = useMemo(() => {
    if (!selectedFormula || !canSize) return null;
    return calculateTintingCost({
      formula: selectedFormula,
      canSize,
      cans,
      colourantIndex,
      basePriceIndex,
      overrides,
    });
  }, [
    selectedFormula,
    canSize,
    cans,
    colourantIndex,
    basePriceIndex,
    overrides,
  ]);

  if (status === "loading") return <LoadingScreen />;
  if (status === "error") {
    return (
      <ErrorScreen
        message={errorMessage}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const key = selectedFormula
    ? overrideKey(
        selectedFormula.ProductName,
        selectedFormula.BasePaintName,
        canSize,
      )
    : null;

  return (
    <div className="min-h-dvh">
      <Header />

      <main
        className="mx-auto max-w-5xl px-5 sm:px-8 py-6 sm:py-10"
        style={{
          paddingBottom:
            "calc(2.5rem + var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px)))",
        }}
      >
        <div className="grid lg:grid-cols-[340px_1fr] gap-6">
          {/* Left column — product + search */}
          <div className="min-w-0 space-y-5">
            <ProductSelect
              products={products}
              value={selectedProductId}
              onChange={(id) => selectProduct(id)}
            />
            <FormulaSearch
              disabled={!selectedProductId}
              productLabel={selectedProduct?.ProductName}
              query={searchQuery}
              results={searchResults}
              onQueryChange={setSearchQuery}
              onSelect={selectFormula}
            />

            {selectedFormula && (
              <button
                type="button"
                onClick={clearSelectedFormula}
                className="text-xs font-medium text-ink-soft hover:text-rust underline decoration-dotted"
              >
                Clear selected shade
              </button>
            )}
          </div>

          {/* Right column — selected shade + calculation */}
          <div className="min-w-0 space-y-5">
            {!selectedFormula ? (
              <EmptyState productSelected={!!selectedProductId} />
            ) : (
              <>
                <SelectedShadeCard formula={selectedFormula} />

                <CanConfig
                  canSizes={canSizes}
                  canSize={canSize}
                  cans={cans}
                  onCanSizeChange={setCanSize}
                  onCansChange={setCans}
                />

                {calc && (
                  <>
                    <FormulaTable lines={calc.colourantLines} />
                    <CostSummary
                      calc={calc}
                      formula={selectedFormula}
                      canSize={canSize}
                      onSetOverride={(value) => setOverride(key, value)}
                      onClearOverride={() => clearOverride(key)}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
