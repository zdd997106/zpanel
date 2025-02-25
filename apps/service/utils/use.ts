/**
 * Returns a function that calls the target function.
 */
export function use<T extends (...args: unknown[]) => void>(
  target: () => T,
): T {
  return ((...args: Parameters<T>) => target()(...args)) as T;
}
