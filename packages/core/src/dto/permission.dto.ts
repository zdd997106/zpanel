import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';

// ----- GET: FIND ALL -----

export class FindAllPermissionDto extends createZodDto(
  z.object({
    q: z.string().optional(),
    status: z.enums.permissionStatus().optional(),
  }),
) {}

// ----- POST: CREATE ONE -----

export class CreatePermissionDto extends createZodDto(
  z.object({
    code: z
      .string()
      .min(1, 'Code Required')
      .regex(/^[a-zA-Z_0-9]+$/, 'Invalid letter! Only A-Z, 0-9, and underline allowed.')
      .max(50, 'Length cannot be longer than 50 letters')
      .toUpperCase(),
    name: z.string().min(1, 'Name Required').max(50, 'Length cannot be longer than 50 letters'),
    description: z.string().max(300, 'Length cannot be longer than 300 letters'),
    action: z.array(z.enums.permissionAction()),
    status: z.enums.permissionStatus(),
  }),
) {}

// ----- PUT: UPDATE ONE -----

export class UpdatePermissionDto extends createZodDto(CreatePermissionDto.schema) {}
