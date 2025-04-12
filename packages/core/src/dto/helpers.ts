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
      page: z.coerce.number().min(1).int().optional().default(1),
      limit: z.coerce.number().min(1).int().max(100).optional().default(10),
      orderBy: z.string().optional().default(''),
      order: z.oneOf([EOrder.ASC, EOrder.DESC]).optional().default(EOrder.DESC),
    })
    .and(schema);
}

export function passwordSchema(params: z.RawCreateParams = {}) {
  return z
    .string(params)
    .min(8, 'Password must includes at least 8 letters')
    .max(50, 'Password cannot be longer than 50 letters')
    .regex(/^\S+$/, 'Password cannot include spaces')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[0-9]/, 'Password must include at least one number');
}

export function accountSchema(params: z.RawCreateParams = {}) {
  return z
    .string(params)
    .regex(/^\S+$/, 'Account cannot include spaces')
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      'Invalid account format, only letters, numbers, underscore, hyphen, and dot are allowed',
    )
    .regex(/^[a-zA-Z]/, 'Account must start with a letter')
    .regex(/[a-zA-Z0-9]$/, 'symbols are not allowed at the end')
    .max(50, 'Account cannot be longer than 50 letters')
    .toLowerCase();
}
