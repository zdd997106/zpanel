// ----- SETTINGS -----

const BASE_FONT_SIZE_PIXELS = 16;

// ----------

/**
 *
 * Converts a value from px to rem units
 *
 */
export function inRem(px: number | string) {
  const value = typeof px === 'number' ? px : parseFloat(px);
  return `${value / BASE_FONT_SIZE_PIXELS}rem`;
}

/**
 *
 * Converts a value from px to em units
 *
 */
export function inEm(px: number | string) {
  const value = typeof px === 'number' ? px : parseFloat(px);
  return `${value / BASE_FONT_SIZE_PIXELS}em`;
}

/**
 *
 * Returns a value in px units
 *
 */
export function inPx(px: number | string) {
  const value = typeof px === 'number' ? px : parseFloat(px);
  return `${value}px`;
}
