import { isEmpty, isNumber, omitBy } from 'lodash';

import { EOrder, EPermissionAction } from 'src/enum';
import z from 'src/schema';

// ----- PERMISSION ACTION VALUE -----

/**
 * The value of all permission actions enabled.
 */
export const ALL_ACTIONS = Object.values(EPermissionAction)
  .filter(isNumber)
  .reduce((acc, value) => acc | value, 0);

export function querySchema<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((v) => omitBy(v ?? {}, isEmpty), schema);
}

export function paginationSchema<T extends z.AnyZodObject>(schema: T) {
  return z
    .object({
      page: z.number().min(1).int().optional().default(1),
      limit: z.number().min(1).int().max(100).optional().default(15),
      orderBy: z.string().optional().default(''),
      order: z.oneOf([EOrder.ASC, EOrder.DESC]).optional().default(EOrder.DESC),
    })
    .and(schema);
}
