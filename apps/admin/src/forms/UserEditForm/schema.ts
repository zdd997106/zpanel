import z from '@zpanel/core/schema';
import { CreateUserDto, EUserStatus, UpdateUserDto } from '@zpanel/core';

// ----------

export const schema = {
  create: CreateUserDto.schema,
  update: UpdateUserDto.schema,
};

export type FieldValues = z.infer<typeof schema.update>;

export type FieldKey = keyof FieldValues;

export const initialValues: FieldValues = {
  name: '',
  account: '',
  password: '',
  role: '',
  avatar: null,
  status: EUserStatus.ACTIVE,
  bios: '',
};
