// ----------

interface Invert {
  <T extends (...args: any[]) => boolean>(callback: T): (...args: Parameters<T>) => boolean;
  (value: Promise<unknown>): boolean;
  (value: unknown): boolean;
}

export const invert: Invert = (target: unknown) => {
  if (typeof target === 'function') {
    return ((...args: unknown[]) => invert(target(...args))) as never;
  }

  if (target instanceof Promise) {
    return target.then((value) => !value) as never;
  }

  return !target as never;
};
