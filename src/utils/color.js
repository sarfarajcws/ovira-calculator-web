const HEX_RE = /^#?([0-9A-Fa-f]{6})$/;

/**
 * Normalize a raw RGB value from the data (e.g. "66B039" or "#66B039")
 * into a CSS-usable "#RRGGBB" string. Returns null for missing/invalid input
 * — callers must render a neutral fallback rather than guessing a colour.
 */
export function normalizeHex(raw) {
  if (!raw) return null;
  const match = HEX_RE.exec(raw.trim());
  if (!match) return null;
  return `#${match[1].toUpperCase()}`;
}

/** Perceived brightness (0-255) — used to decide light-swatch borders/text contrast. */
export function relativeBrightness(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

export function isLightColor(hex) {
  const brightness = relativeBrightness(hex);
  return brightness === null ? false : brightness > 200;
}
