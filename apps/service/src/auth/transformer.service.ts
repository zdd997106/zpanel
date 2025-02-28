import { Injectable } from '@nestjs/common';
import { DataType, ERole } from '@zpanel/core';

import { Model } from 'src/database';
import { MediaService } from 'src/media';

// ----------

@Injectable()
export class TransformerService {
  constructor(private readonly mediaService: MediaService) {}

  public toAuthUserDto = (
    user: Model.User & { role: Model.Role; avatar: Model.Media | null },
  ): DataType.AuthUserDto => {
    return {
      id: user.clientId,
      avatarUrl: user.avatar
        ? this.mediaService.getMediaUrl(user.avatar)
        : null,
      email: user.email,
      name: user.name,
      role: user.role.code as ERole,
      roleName: user.role.name,
    };
  };

  // public toPermissionKey = (
  //   permission: Model.Permission & {
  //     roles: Pick<Model.RolePermission, 'value'>[];
  //   },
  // ): string => {
  //   return [
  //     permission.code,
  //     permission.roles[0].value.toString(16).toUpperCase(),
  //   ].join(':');
  // };
}
