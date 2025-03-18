import { isEmpty, omitBy } from 'lodash';
import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';

// ----- GET: MEDIA -----

export class GetMediaDto extends createZodDto(
  z.preprocess(
    (v) => omitBy(v as never, isEmpty),
    z.object({
      filename: z.string().optional(),
      cache: z.oneOf(['true', 'false']).optional(),
    }),
  ),
) {}
