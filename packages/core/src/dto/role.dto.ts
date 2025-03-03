import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';

import { ALL_ACTIONS } from './helpers';

// ----- UPDATE/CREATE: ROLE PERMISSION -----

export class RolePermissionDto extends createZodDto(
  z.object({
    id: z.string(),
    action: z
      .number()
      .min(0, 'Invalid action')
      .int('Invalid action')
      .refine((value) => (value & ~ALL_ACTIONS) === 0, { message: 'Invalid action' }),
  }),
) {}

// ----- CREATE: ROLE -----

export class CreateRoleDto extends createZodDto(
  z.object({
    code: z
      .string()
      .nonempty('Required')
      .max(40)
      .regex(/^\S+$/, 'should not contain whitespace')
      .regex(/^[A-Z_0-9]+$/, 'should contain only uppercase, underscore, and number')
      .regex(/^[A-Z]/, 'must start with uppercase'),
    name: z.string().nonempty('Required').max(64).trim(),
    status: z.enums.roleStatus(),
    description: z.string().max(255).trim(),
    rolePermissions: z.array(RolePermissionDto.schema),
  }),
) {}
