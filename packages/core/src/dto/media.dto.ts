import { isEmpty, omitBy } from 'lodash';
import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';

// ----- GET: MEDIA -----

export class GetMediaDto extends createZodDto(
  z.preprocess(
    (v) => omitBy(v as never, isEmpty),
    z.object({
      cache: z.oneOf(['true', 'false']).optional(),
    }),
  ),
) {}

// ----- GET: DOWNLOAD MEDIA -----

export class DownloadMediaDto extends createZodDto(
  z.preprocess(
    (v) => omitBy(v as never, isEmpty),
    z.object({
      filename: z.string().optional(),
    }),
  ),
) {}
