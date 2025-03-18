import { Injectable } from '@nestjs/common';
import { DataType } from '@zpanel/core';

import { Model } from 'src/database';
import { MediaTransformerService } from 'src/media';
import { RoleTransformerService } from 'src/roles';

// ----------

@Injectable()
export class TransformerService {
  constructor(
    private readonly media: MediaTransformerService,
    private readonly role: RoleTransformerService,
  ) {}

  public toUserDto = (
    user: Model.User & {
      avatar: null | Model.Media;
      role: Pick<Model.Role, 'code' | 'name' | 'clientId'>;
    },
  ): DataType.UserDto => {
    return {
      id: user.clientId,
      email: user.email,
      name: user.name,
      role: this.role.toRolePreviewDto(user.role),
      avatar: user.avatar && this.media.toMediaDto(user.avatar),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };

  public toUserDetailDto = (
    user: Model.User & {
      avatar: null | Model.Media;
      role: Pick<Model.Role, 'code' | 'name' | 'clientId'>;
    },
  ): DataType.UserDetailDto => {
    return {
      id: user.clientId,
      email: user.email,
      name: user.name,
      bios: user.bios,
      role: this.role.toRolePreviewDto(user.role),
      avatar: user.avatar && this.media.toMediaDto(user.avatar),
      emailNotify: user.emailNotify,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };

  public toUserPreviewDto = (user: Model.User): DataType.UserPreviewDto => {
    return {
      id: user.clientId,
      email: user.email,
      name: user.name,
    };
  };
}
