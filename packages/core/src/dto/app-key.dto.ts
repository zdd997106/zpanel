import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';

// ----- UPDATE: APP KEY -----

export class UpdateAppKeyDto extends createZodDto(
  z.object({
    name: z.string().max(64),
    status: z.enums.appKeyStatus(),
    rateLimit: z.number().int().positive(),
    origins: z.array(z.string()),
    allowPaths: z.array(
      z.object({
        path: z.string(),
        method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
      }),
    ),
  }),
) {}

// ----- CREATE: APP KEY -----

export class CreateAppKeyDto extends createZodDto(
  UpdateAppKeyDto.schema.and(
    z.object({
      expiresAt: z.date().nullable(),
    }),
  ),
) {}
