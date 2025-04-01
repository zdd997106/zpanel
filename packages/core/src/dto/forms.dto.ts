import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';
import { paginationSchema, querySchema } from './helpers';

// ----- POST: CREATE CONTACT FORM SUBMISSION -----

export class CreateContactMeFormSubmissionDto extends createZodDto(
  z.object({
    name: z.string().nonempty('Name required').max(100, 'Name cannot be longer than 100 letters'),
    email: z.string().nonempty('Email required').email('Invalid email format'),
    description: z.string().nonempty('Project description required'),
    budget: z.string().optional(),
    service: z.string().optional(),
  }),
) {}

// ----- GET: FIND CONTACT FORM SUBMISSIONS -----

export class FindContactMeFormSubmissionsDto extends createZodDto(
  querySchema(
    paginationSchema(
      z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        service: z.string().optional(),
        archived: z.stringBoolean().default(false),
      }),
    ),
  ),
) {}

// ----- PATCH: UPDATE CONTACT FORM SUBMISSION -----

export class UpdateContactMeFormSubmissionDto extends createZodDto(
  z.object({
    archived: z.boolean().optional(),
  }),
) {}
