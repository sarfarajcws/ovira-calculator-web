import { normalizeHex, isLightColor } from '../utils/color';

export default function ColourDot({ rgb, size = 10 }) {
  const hex = normalizeHex(rgb);

  if (!hex) {
    return (
      <span
        className="inline-block rounded-full border border-dashed border-line-strong shrink-0"
        style={{ width: size, height: size }}
        title="Colour unavailable"
      />
    );
  }

  return (
    <span
      className="inline-block rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: hex,
        border: isLightColor(hex) ? '1px solid var(--color-line-strong)' : 'none',
      }}
    />
  );
}
