import { RawCreateParams, z } from 'zod';
import { createWithDefinedPreprocess } from './helpers';

// ----------

const mediaPreprocess = createWithDefinedPreprocess((value) => {
  if (value?.id) return value;
  return undefined;
});

export function media(params?: RawCreateParams) {
  return mediaPreprocess(
    z.object(
      {
        id: z.string(),
      },
      params,
    ),
  );
}
