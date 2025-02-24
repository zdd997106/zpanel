/**
 * Returns the result of the target function if it is a function, otherwise returns the target value
 */
export function use<T>(target: T | (() => T)): T {
  return target instanceof Function
    ? (((...args: unknown[]) => target(...(args as []))) as T)
    : target;
}
