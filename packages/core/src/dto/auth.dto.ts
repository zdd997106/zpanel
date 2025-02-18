import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';

// ----- POST: SIGN UP -----

export class SignUpDto extends createZodDto(
  z.object({
    name: z.string().min(1, 'Name required').max(50, 'Name cannot be longer than 50 letters'),
    email: z.string().min(1, 'Email required').email('Invalid email format'),
    introduction: z
      .string()
      .min(1, 'Introduction required')
      .max(500, 'Introduction cannot be longer than 500 letters'),
  }),
) {}

// ----- POST: SIGN IN -----

export class SignInDto extends createZodDto(
  z.object({
    email: z.string().min(1, 'Email required'),
    password: z.string().min(1, 'Password required'),
  }),
) {}

// ----- POST: REQUEST TO RESET PASSWORD -----

export class RequestToResetPasswordDto extends createZodDto(
  z.object({
    email: z.string().min(1, 'Email required').email('Invalid email format'),
  }),
) {}
