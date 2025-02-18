import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';
import { withNumberPreprocess } from 'src/schema/helpers';

// ----- POST: CREATE DOMAIN -----

export class CreateDomainDto extends createZodDto(
  z.object({
    domain: z
      .string()
      .min(1, 'Domain name required!')
      .max(50, 'Domain name cannot be longer than 50 letters.')
      .regex(
        /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/,
        'Invalid domain name',
      ),
    description: z.string(),
    localPort: withNumberPreprocess(
      z
        .number({ required_error: 'Local port required!' })
        .positive('Port number should be a positive number')
        .refine((port) => ![80, 443].includes(port), 'Port number has been used'),
    ),
    certification: z.string().min(1, 'Certification required!'),
  }),
) {}

// ----- PUT: UPDATE DOMAIN -----

export class UpdateDomainDto extends createZodDto(CreateDomainDto.schema) {}

// ----- POST: CREATE CERTIFICATION -----

export class CreateCertificationDto extends createZodDto(
  z.object({
    name: z.string().min(1, 'Name required!').max(50, 'Name cannot be longer than 50 letters.'),
    description: z.string(),
    cert: z.string().min(1, 'Cert required'),
    key: z.string().min(1, 'Key required'),
  }),
) {}

// ----- PUT: UPDATE CERTIFICATION -----

export class UpdateCertificationDto extends createZodDto(
  z
    .object({
      name: z.string().min(1, 'Name required!').max(50, 'Name cannot be longer than 50 letters.'),
      description: z.string(),
      cert: z.string().optional(),
      key: z.string().optional(),
    })
    .refine(
      (args) => Boolean(args.cert && args.key) || Boolean(!args.cert && !args.key),
      (args) => ({
        path: !args.cert ? ['cert'] : ['key'],
        message: `${!args.cert ? 'Cert' : 'Key'} required!`,
      }),
    ),
) {}

// ----- POST: CREATE PUBLIC FILE -----

export class CreatePublicFileDto extends createZodDto(
  z.object({
    path: z
      .string()
      .regex(
        /^[a-zA-Z0-9)(\]\[\-_+\/\.]+$/,
        'Invalid path. Only allows a-z, A-Z, 0-9, [], (), -, +, /, ., and _',
      )
      .regex(/^\//, 'Invalid Name. Path name must start with /'),
    content: z.string(),
  }),
) {}

// ----- PUT: UPDATE PUBLIC FILE -----

export class UpdatePublicFileDto extends createZodDto(CreatePublicFileDto.schema) {}
