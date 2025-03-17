import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';

// ----- UPDATE: APP KEY -----

export class UpdateAppKeyDto extends createZodDto(
  z.object({
    name: z.string().max(64).nonempty('Name is required'),
    status: z.enums.appKeyStatus(),
    allowPaths: z.array(
      z
        .string()
        .regex(/\w+: \/\S+/, 'Invalid path format')
        .nonempty(),
    ),
  }),
) {}

// ----- CREATE: APP KEY -----

export class CreateAppKeyDto extends createZodDto(
  UpdateAppKeyDto.schema.and(
    z.object({
      expiresAt: z.string().pipe(z.coerce.date()).nullable(),
    }),
  ),
) {}
