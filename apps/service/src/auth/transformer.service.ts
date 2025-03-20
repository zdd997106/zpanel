import { Injectable } from '@nestjs/common';
import { DataType } from '@zpanel/core';

import { Model } from 'modules/database';
import { TransformerService as MediaTransformerService } from 'src/media/transformer.service';
import { TransformerService as RoleTransformerService } from 'src/roles/transformer.service';

// ----------

@Injectable()
export class TransformerService {
  constructor(
    private readonly media: MediaTransformerService,
    private readonly role: RoleTransformerService,
  ) {}

  public toAuthUserDto = (
    user: Model.User & { role: Model.Role; avatar: Model.Media | null },
  ): DataType.AuthUserDto => {
    return {
      id: user.clientId,
      email: user.email,
      name: user.name,
      avatar: user.avatar ? this.media.toMediaDto(user.avatar) : null,
      role: this.role.toRolePreviewDto(user.role),
    };
  };

  public toPermissionKey = (
    rolePermission: Pick<Model.RolePermission, 'action'> & {
      permission: Pick<Model.Permission, 'action' | 'code'>;
    },
  ): string => {
    const action = rolePermission.action & rolePermission.permission.action;
    return [
      rolePermission.permission.code,
      action.toString(16).toUpperCase(),
    ].join(':');
  };
}
