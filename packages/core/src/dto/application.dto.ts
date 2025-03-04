import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';

// ----- UPDATE: APPROVE APPLICATION -----

export class ApproveApplicationDto extends createZodDto(
  z.object({
    role: z.string().nonempty('Role required'),
  }),
) {}

// ----- UPDATE: REJECT APPLICATION -----

export class RejectApplicationDto extends createZodDto(
  z.object({
    reason: z.string().nonempty('Reason required').max(250),
  }),
) {}
