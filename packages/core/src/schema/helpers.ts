import { RawCreateParams, z } from 'zod';

export function oneOf<T extends string | number | boolean | bigint | null | undefined>(
  items: T[],
  params?: RawCreateParams,
) {
  return z.any(params).refine(
    (value) => items.includes(value),
    (value) => ({
      message: `${JSON.stringify(value)} is not a member of ${JSON.stringify(items)}`,
    }),
  ) as unknown as z.ZodUnion<[z.ZodLiteral<T>, z.ZodLiteral<T>, ...z.ZodLiteral<T>[]]>;
}

export const withNumberPreprocess = createWithDefinedPreprocess((value) => {
  if (typeof value === 'number') return value;
  if (!value) return undefined as never;
  return Number(value);
});

// ----------

export function createWithDefinedPreprocess<TCallback extends (...args: any[]) => any>(
  callback: TCallback,
) {
  return function withPreprocess<T extends Zod.ZodTypeAny>(schema: T) {
    return new Proxy(z.preprocess(callback, schema), {
      get(target, key) {
        // Check if the key is one of the methods that should not be intercepted
        if (
          !['optional', 'nullish', 'nullable', 'default'].includes(key as string) &&
          key in target
        )
          return target[key as keyof typeof target];

        // Return undefined if the key is not present in the schema
        if (!(key in schema)) return undefined;

        // Return the original value if it's not a function
        const value = schema[key as keyof T];
        if (typeof value !== 'function') return value;

        // If the value is a function, wrap it to preserve chaining with preprocess
        return function (...args: never[]) {
          const result = value.bind(schema)(...args);
          return result instanceof z.Schema ? withPreprocess(result) : result;
        };
      },
    }) as unknown as T;
  };
}
