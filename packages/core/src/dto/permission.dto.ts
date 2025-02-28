import { isNumber } from 'lodash';
import { createZodDto } from 'nestjs-zod/dto';
import { EPermissionAction } from 'src/enum';

import { z } from 'src/schema';

// ----- CREATE: PERMISSION -----

export class CreatePermissionDto extends createZodDto(
  z.object({
    id: z.string().optional(),
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
      .refine((value) => (value & ~allActions) === 0, { message: 'Invalid action' }),
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

const allActions = Object.values(EPermissionAction)
  .filter(isNumber)
  .reduce((acc, value) => acc | value, 0);

// ----- UPDATE: PERMISSIONS -----

export class UpdatePermissionsDto extends createZodDto(
  z.object({
    newPermissions: z.array(CreatePermissionDto.schema),
    changedPermissions: z.array(UpdatePermissionDto.schema),
    deletedIds: z.array(z.string()),
  }),
) {}
