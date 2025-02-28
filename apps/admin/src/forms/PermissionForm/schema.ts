import z from '@zpanel/core/schema';
import { EPermissionStatus } from '@zpanel/core';
import { actionConfig } from './configs';

// ----------

export const schema = z.object({
  permissions: z.array(
    z.object({
      id: z.string(),
      code: z.string(),
      name: z.string(),
      parentId: z.string().nullable(),
      status: z.enums.permissionStatus(),
      action: z.number().min(0, 'Invalid action').max(actionConfig.value.all, 'Invalid action'),
    }),
  ),
});

export interface FieldValues extends z.infer<typeof schema> {}

export type FieldKey = keyof FieldValues;

export const initialValues: FieldValues = {
  permissions: [],
};

export type PermissionItem = FieldValues['permissions'][number];

export const initialPermission: PermissionItem = {
  id: '',
  code: '',
  name: '',
  parentId: null,
  status: EPermissionStatus.ENABLED,
  action: 0,
};
