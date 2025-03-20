import { pick } from 'lodash';
import { Injectable } from '@nestjs/common';
import { DataType } from '@zpanel/core';

import { Model } from 'src/database';

// ----------

@Injectable()
export class TransformerService {
  constructor() {}

  public toRoleDto = (
    role: Model.Role & { _count: { users: number } },
  ): DataType.RoleDto => {
    return {
      ...pick(role, [
        'name',
        'code',
        'description',
        'status',
        'createdAt',
        'updatedAt',
      ]),
      id: role.clientId,
      userCount: role._count.users,
    };
  };

  public toRoleDetailDto = (
    role: Model.Role & {
      permissions: (Pick<Model.RolePermission, 'action'> & {
        permission: Pick<Model.Permission, 'clientId'>;
      })[];
    },
  ): DataType.RoleDetailDto => {
    return {
      ...pick(role, [
        'name',
        'code',
        'description',
        'status',
        'createdAt',
        'updatedAt',
      ]),
      id: role.clientId,
      rolePermissions: role.permissions.map((permission) => ({
        id: permission.permission.clientId,
        action: permission.action,
      })),
    };
  };

  public toRolePreviewDto = (
    role: Pick<Model.Role, 'name' | 'code' | 'clientId'>,
  ): DataType.RolePreviewDto => {
    return {
      ...pick(role, ['name', 'code']),
      id: role.clientId,
    };
  };

  public toRoleOptionDto = (
    role: Pick<Model.Role, 'code' | 'name'>,
  ): DataType.SelectOptionDto => {
    return {
      label: role.name,
      value: role.code,
    };
  };
}
