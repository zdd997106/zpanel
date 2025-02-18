import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';
import { ERowsPerPage } from 'src/enum';
import { withNumberPreprocess } from 'src/schema/helpers';

// ----- PAGINATION -----

export class PaginationDto extends createZodDto(
  z.object({
    page: withNumberPreprocess(z.number()).min(1, 'Page cannot be less than 1').default(1),
    rowsPerPage: z.enums.tableRowsPerPage().default(ERowsPerPage.NORMAL),
  }),
) {}
