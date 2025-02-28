import z from '@zpanel/core/schema';
import { EPermissionStatus, UpdatePermissionDto } from '@zpanel/core';
import { groupBy } from 'lodash';

// ----------

export const schema = z.object({
  permissions: z.array(UpdatePermissionDto.schema).superRefine((permissions, ctx) => {
    const indexMap = new Map(
      permissions.map((permission, index) => [permission.id, index] as const),
    );
    Object.values(groupBy(permissions, 'code'))
      .filter((group) => group.length > 1)
      .flat()
      .forEach((duplicate) => {
        ctx.addIssue({
          path: [indexMap.get(duplicate.id)!, 'code'],
          code: 'custom',
          message: 'Duplicate code',
        });
      });
  }),
});

export interface FieldValues extends z.infer<typeof schema> {}

export type FieldKey = keyof FieldValues;

export const initialValues: FieldValues = {
  permissions: [],
};

export type PermissionItem = UpdatePermissionDto;

export const initialPermissionItem: PermissionItem = {
  id: '',
  code: '',
  name: '',
  parentId: null,
  status: EPermissionStatus.ENABLED,
  action: 0,
};
