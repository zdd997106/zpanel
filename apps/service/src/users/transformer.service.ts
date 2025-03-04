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

  public toUserDto = async (
    user: Model.User & {
      avatar: null | Model.Media;
      role: Pick<Model.Role, 'code' | 'name'>;
    },
  ): Promise<DataType.UserDto> => {
    return {
      id: user.clientId,
      email: user.email,
      name: user.name,
      bios: user.bios,
      role: user.role.code,
      roleName: user.role.name,
      avatar:
        user.avatar &&
        (await this.mediaTransformerService.toAccessibleMediaDto(user.avatar)),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };

  public toUserDtoList = async (
    users: Parameters<typeof this.toUserDto>[0][],
  ): Promise<DataType.UserDto[]> => {
    return await Promise.all(users.map(this.toUserDto));
  };
}
