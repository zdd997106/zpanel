import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';
import { paginationSchema, querySchema } from './helpers';

export class FindAllNotificationsDto extends createZodDto(
  querySchema(
    paginationSchema(
      z.object({
        type: z.enums.notificationType().optional(),
        audience: z.enums.notificationAudience().optional(),
        sender: z.string().optional(),
      }),
    ),
  ),
) {}

export class CreateNotificationsDto extends createZodDto(
  z.object({
    title: z.string().nonempty('Required').max(256),
    message: z.string().nonempty('Required').max(1024),
    link: z.string().nullable(),
    type: z.enums.notificationType(),
    audience: z.enums.notificationAudience(),
    audienceValue: z.array(z.string()).nullable(),
  }),
) {}
