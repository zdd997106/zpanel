import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';

import { ALL_ACTIONS } from './helpers';

// ----- CREATE: PERMISSION -----

export class CreatePermissionDto extends createZodDto(
  z.object({
    id: z.string().optional(), // [NOTE] Needed for parent-child reference, not saved to the database
    code: z
      .string()
      .nonempty('Required')
      .max(40)
      .regex(/^\S+$/, 'should not contain whitespace')
      .regex(/^[A-Z_0-9]+$/, 'should contain only uppercase, underscore, and number')
      .regex(/^[A-Z]/, 'must start with uppercase'),
    name: z.string().nonempty('Required').max(64).trim(),
    parentId: z.string().nullable(),
    status: z.enums.permissionStatus(),
    action: z
      .number()
      .min(0, 'Invalid action')
      .int('Invalid action')
      .refine((value) => (value & ~ALL_ACTIONS) === 0, { message: 'Invalid action' }),
  }),
) {}

// ----- UPDATE: PERMISSION -----

export class UpdatePermissionDto extends createZodDto(
  CreatePermissionDto.schema.and(
    z.object({
      id: z.string(),
    }),
  ),
) {}

// ----- UPDATE: PERMISSIONS -----

export class UpdatePermissionsDto extends createZodDto(
  z.object({
    newPermissions: z.array(CreatePermissionDto.schema),
    changedPermissions: z.array(UpdatePermissionDto.schema),
    deletedIds: z.array(z.string()),
  }),
) {}
