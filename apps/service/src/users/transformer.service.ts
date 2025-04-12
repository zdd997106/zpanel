import { Injectable } from '@nestjs/common';
import { DataType, ENotificationStatus } from '@zpanel/core';

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

  public toUserDto = (
    user: Model.User & {
      avatar: null | Model.Media;
      role: Pick<Model.Role, 'code' | 'name' | 'clientId'>;
    },
  ): DataType.UserDto => {
    return {
      id: user.clientId,
      account: user.account,
      email: user.email,
      name: user.name,
      status: user.status,
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
      account: user.account,
      status: user.status,
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
      account: user.account,
      email: user.email,
      name: user.name,
    };
  };

  public toUserNotificationDto = (
    userNotification: Model.UserNotification & {
      notification: Model.Notification & {
        sender: null | Model.User;
      };
    },
  ): DataType.UserNotificationDto => {
    const notification = userNotification.notification;
    return {
      id: notification.clientId,
      title: notification.title,
      message: notification.message,
      link: notification.link,
      sender: notification.sender && this.toUserPreviewDto(notification.sender),
      read: userNotification.status === ENotificationStatus.READ,
      type: notification.type,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  };

  public toUserOptionDto = (
    user: Pick<Model.User, 'clientId' | 'name' | 'email'>,
  ): DataType.SelectOptionDto => {
    return {
      label: `${user.name} (${user.email})`,
      value: user.clientId,
    };
  };
}
