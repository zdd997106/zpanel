import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';

// ----- UPDATE: USER -----

export class UpdateUserDto extends createZodDto(
  z.object({
    name: z.string().nonempty('Name required').max(50, 'Name cannot be longer than 50 letters'),
    avatar: z.entities.media().nullable(),
    emailNotify: z.boolean(),
    bios: z.string().max(1024, 'Bios cannot be longer than 1024 letters').optional(),
  }),
) {}

// ----- ACTION: REQUEST TO UPDATE USER EMAIL -----

export class RequestToUpdateUserEmailDto extends createZodDto(
  z.object({
    email: z.string().email('Invalid email').nonempty('Email required'),
  }),
) {}

// ----- UPDATE: USER EMAIL -----

export class UpdateUserEmailDto extends createZodDto(
  z.object({
    token: z.string(),
  }),
) {}

// ----- UPDATE: USER ROLE ------

export class UpdateUserRoleDto extends createZodDto(
  z.object({
    role: z.string().nonempty('Role required'),
  }),
) {}

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
