export function merge<T>(a: T, b: unknown): T {
  if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(b)) {
    const entries = Array.from(new Set([...Object.keys(a), ...Object.keys(b)])).map((key) => [
      key,
      merge(a[key as never], b[key as never]),
    ]);
    return Object.fromEntries(entries);
  }

  if (b === undefined) return a;
  return b as never;
}
