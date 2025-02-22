import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';

// ----- UPDATE: USER PASSWORD -----

export class UpdateUserPasswordDto extends createZodDto(
  z.object({
    password: z
      .string()
      .min(1, 'Password required')
      .min(8, 'Password must includes at least 8 letters')
      .max(50, 'Password cannot be longer than 50 letters')
      .regex(/^\S+$/, 'Password cannot include spaces')
      .regex(/[a-z]/, 'Password must include at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[0-9]/, 'Password must include at least one number'),
  }),
) {}
