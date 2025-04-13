import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';
import { EUserStatus } from 'src/enum';

import { querySchema, paginationSchema, passwordSchema, accountSchema } from './helpers';

// ----- GET: USERS -----

export class FindUsersDto extends createZodDto(
  querySchema(
    paginationSchema(
      z.object({
        account: z.string().optional(),
        name: z.string().optional(),
        email: z.string().optional(),
        role: z.string().optional(),
        status: z.enums.userStatus().default(EUserStatus.ACTIVE),
      }),
    ),
  ),
) {}

// ----- UPDATE: USER -----

export class UpdateUserDto extends createZodDto(
  z.object({
    name: z.string().nonempty('Name required').max(50, 'Name cannot be longer than 50 letters'),
    account: accountSchema().nonempty('Account required'),
    password: passwordSchema().or(z.literal('')),
    role: z.string().nonempty('Role required'),
    avatar: z.entities.media().nullable(),
    status: z.enums.userStatus(),
    bios: z.string().max(1024, 'Bios cannot be longer than 1024 letters').optional(),
  }),
) {}

// ----- CREATE: USER -----

export class CreateUserDto extends createZodDto(
  UpdateUserDto.schema.and(
    z.object({
      password: z.string().nonempty('Password required'),
    }),
  ),
) {}

// ----- UPDATE: USER (SELF) -----

export class UpdateUserProfileDto extends createZodDto(
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

// ----- UPDATE: USER PASSWORD -----

export class UpdateUserPasswordDto extends createZodDto(
  z.object({
    password: passwordSchema(),
  }),
) {}

// ----- GET: USER NOTIFICATIONS -----

export class FindUserNotificationsDto extends createZodDto(
  querySchema(
    paginationSchema(
      z.object({
        status: z.enums.notificationStatus().optional(),
        type: z.enums.notificationType().optional(),
      }),
    ),
  ),
) {}

// ----- GET: USER NOTIFICATIONS -----

export class FindUserNotificationsCountDto extends createZodDto(
  z.object({
    status: z.string().or(z.enums.notificationStatus().optional()),
  }),
) {}

// ----- UPDATE: USER NOTIFICATIONS -----

export class UpdateUsersNotificationsDto extends createZodDto(
  z.object({
    ids: z.array(z.string()),
    status: z.enums.notificationStatus(),
  }),
) {}

// ----- UPDATE: ALL USER NOTIFICATIONS -----

export class UpdateUsersNotificationsAllDto extends createZodDto(
  z.object({
    status: z.enums.notificationStatus(),
  }),
) {}
