import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';
import { PaginationDto } from './pagination.dto';

// ----- GET: FIND ALL -----

export class FindAllUserDto extends createZodDto(
  PaginationDto.schema.and(
    z.object({
      q: z.string().optional(),
    }),
  ),
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

// ----- UPDATE: USER PROFILE -----

export class UpdateUserProfileDto extends createZodDto(
  z.object({
    name: z.string().min(1, 'Required!').max(50, 'Name cannot be longer than 50 letters'),
    avatar: z.media().optional().nullable(),
    bios: z.string().optional(),
  }),
) {}

// ----- UPDATE: USER ROLE -----

export class UpdateUserRoleDto extends createZodDto(
  z.object({
    role: z.string(),
  }),
) {}
