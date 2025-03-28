import { Injectable } from '@nestjs/common';
import { pick } from 'lodash';
import { DataType } from '@zpanel/core';

import { Model } from 'modules/database';
import { TransformerService as UserTransformerService } from 'src/users/transformer.service';

// ----------

@Injectable()
export class TransformerService {
  constructor(private readonly user: UserTransformerService) {}

  public toNotificationDto = (
    notification: Model.Notification & {
      sender: Model.User | null;
    },
  ): DataType.NotificationDto => {
    return {
      ...pick(notification, [
        'title',
        'link',
        'type',
        'audience',
        'createdAt',
        'updatedAt',
      ]),
      id: notification.clientId,
      sender: notification.sender
        ? this.user.toUserPreviewDto(notification.sender)
        : null,
    };
  };

  public toNotificationDetailDto = (
    notification: Model.Notification & {
      sender: Model.User | null;
      recipients: (Model.UserNotification & { user: Model.User })[];
    },
  ): DataType.NotificationDetailDto => {
    return {
      ...pick(notification, [
        'title',
        'message',
        'link',
        'type',
        'audience',
        'createdAt',
        'updatedAt',
      ]),
      id: notification.clientId,
      recipients: notification.recipients.map((recipient) => ({
        ...this.user.toUserPreviewDto(recipient.user),
        status: recipient.status,
      })),
      sender: notification.sender
        ? this.user.toUserPreviewDto(notification.sender)
        : null,
    };
  };
}
