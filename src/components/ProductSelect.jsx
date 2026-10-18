import Dropdown from './Dropdown';

export default function ProductSelect({ products, value, onChange }) {
  const options = products.map((p) => ({
    value: p.ProductId,
    label: p.ProductName,
  }));

  return (
    <div>
      <label className="block text-xs font-semibold tracking-wide text-ink-soft uppercase mb-2">
        Product
      </label>
      <Dropdown
        value={value}
        options={options}
        onChange={onChange}
        placeholder="Select a product…"
        ariaLabel="Product"
      />
    </div>
  );
}
