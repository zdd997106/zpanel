import { Injectable } from '@nestjs/common';
import { DataType } from '@zpanel/core';

import { Model } from 'src/database';
import { TransformerService as MediaTransformerService } from 'src/media';

// ----------

@Injectable()
export class TransformerService {
  constructor(
    private readonly mediaTransformerService: MediaTransformerService,
  ) {}

  public toUserDto = (
    user: Model.User & {
      avatar: null | Model.Media;
      role: Pick<Model.Role, 'code' | 'name'>;
    },
  ): DataType.UserDto => {
    return {
      id: user.clientId,
      email: user.email,
      name: user.name,
      bios: user.bios,
      role: user.role.code,
      roleName: user.role.name,
      avatar:
        user.avatar && this.mediaTransformerService.toMediaDto(user.avatar),
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
