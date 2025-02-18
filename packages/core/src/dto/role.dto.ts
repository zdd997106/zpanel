import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';

// ----- GET: FIND ALL -----

export class FindAllRolesDto extends createZodDto(
  z.object({
    q: z.string().optional(),
    status: z.enums.roleStatus().optional(),
  }),
) {}

// ----- POST: CREATE ONE -----

export class CreateRoleDto extends createZodDto(
  z.object({
    code: z
      .string()
      .min(1, 'Code Required')
      .regex(/^[a-zA-Z_0-9]+$/)
      .max(50, 'Length cannot be longer than 50 letters')
      .toUpperCase(),
    name: z.string().min(1, 'Name Required').max(50, 'Length cannot be longer than 50 letters'),
    description: z.string().max(300, 'Length cannot be longer than 300 letters'),
    status: z.enums.roleStatus(),
  }),
) {}

// ----- PUT: UPDATE ONE -----

export class UpdateRoleDto extends createZodDto(CreateRoleDto.schema) {}

// ----- PUT: UPDATE RELATED PERMISSIONS -----

export class UpdateRolePermissionsDto extends createZodDto(
  z.array(
    z.object({
      id: z.string(),
      action: z.array(z.enums.permissionAction()),
    }),
  ),
) {}
