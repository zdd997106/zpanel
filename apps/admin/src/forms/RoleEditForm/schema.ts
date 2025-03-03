import z from '@zpanel/core/schema';
import { CreateRoleDto, ERoleStatus } from '@zpanel/core';

// ----------

export const schema = CreateRoleDto.schema.and(z.object({}));

export interface FieldValues extends z.infer<typeof schema> {}

export type FieldKey = keyof FieldValues;

export const initialValues: FieldValues = {
  code: '',
  name: '',
  status: ERoleStatus.ENABLED,
  description: '',
  rolePermissions: [],
};
