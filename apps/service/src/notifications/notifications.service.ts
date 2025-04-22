import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import {
  CreateNotificationsDto,
  ENotificationAudience,
  FindAllNotificationsDto,
} from '@zpanel/core';
import { Request } from 'express';
import { includes } from 'lodash';

import { DatabaseService } from 'modules/database';
import { NotifierService } from 'modules/notifier';
import { createValidationError, Inspector } from 'utils';

// ----------

@Injectable()
export class NotificationsService {
  constructor(
    private readonly dbs: DatabaseService,
    private readonly notifierService: NotifierService,
    @Inject(REQUEST) private readonly req: Request,
  ) {}

  public async findAllNotifications(
    findAllNotificationsDto: FindAllNotificationsDto,
  ) {
    const whereInput: Prisma.NotificationWhereInput = {
      type: findAllNotificationsDto.type,
      audience: findAllNotificationsDto.audience,
      sender: findAllNotificationsDto.sender
        ? { clientId: findAllNotificationsDto.sender }
        : undefined,
    };

    const notifications = await this.dbs.notification.findMany({
      include: { sender: true },
      where: whereInput,
      orderBy: findAllNotificationsDto.orderBy
        ? { [findAllNotificationsDto.orderBy]: findAllNotificationsDto.order }
        : { nid: 'desc' },
      skip: findAllNotificationsDto.limit * (findAllNotificationsDto.page - 1),
      take: findAllNotificationsDto.limit,
    });

    const count = await this.dbs.notification.count({ where: whereInput });

    return { notifications, count };
  }

  public async getNotificationDetail(id: string) {
    return new Inspector(
      this.dbs.notification.findUnique({
        include: { sender: true, recipients: { include: { user: true } } },
        where: { clientId: id },
      }),
    ).essential();
  }

  public async createNotification({
    audience,
    audienceValue,
    ...createNotificationDto
  }: CreateNotificationsDto) {
    if (
      includes(
        [ENotificationAudience.ROLE, ENotificationAudience.USER],
        audience,
      ) &&
      (!audienceValue || !audienceValue.length)
    ) {
      throw createValidationError(['audienceValue'], 'Required');
    }

    const sender = this.req.signedInInfo.userId;
    await this.notifierService.send(audience, {
      ...createNotificationDto,
      sender,
      audienceValue: audienceValue || [],
    });
  }
}
