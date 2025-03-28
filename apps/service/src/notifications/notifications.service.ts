import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import {
  CreateNotificationsDto,
  ENotificationAudience,
  ENotificationStatus,
  ERole,
  FindAllNotificationsDto,
} from '@zpanel/core';
import { Request } from 'express';
import { includes } from 'lodash';

import { DatabaseService } from 'modules/database';
import { MailService } from 'modules/mail';
import { createValidationError, Inspector } from 'utils';

// ----------

@Injectable()
export class NotificationsService {
  constructor(
    private readonly dbs: DatabaseService,
    private readonly mailService: MailService,
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
    audienceValue,
    ...createNotificationDto
  }: CreateNotificationsDto) {
    if (
      includes(
        [ENotificationAudience.ROLE, ENotificationAudience.USER],
        createNotificationDto.audience,
      ) &&
      (!audienceValue || !audienceValue.length)
    ) {
      throw createValidationError(['audienceValue'], 'Required');
    }

    await this.dbs.$transaction(async (tx) => {
      const notification = await tx.notification.create({
        data: {
          ...createNotificationDto,
          sender: { connect: { clientId: this.req.signedInInfo.userId } },
        },
      });

      let userIds: number[] = [];
      switch (createNotificationDto.audience) {
        case ENotificationAudience.ALL: {
          userIds = await tx.user
            .findMany({ select: { uid: true } })
            .then((users) => users.map((user) => user.uid));
          break;
        }

        case ENotificationAudience.ROLE: {
          userIds = await tx.user
            .findMany({
              select: { uid: true },
              where: { role: { code: { in: audienceValue! } } },
            })
            .then((users) => users.map((user) => user.uid));
          break;
        }

        case ENotificationAudience.ADMIN: {
          userIds = await tx.user
            .findMany({
              select: { uid: true },
              where: { role: { code: ERole.ADMIN } },
            })
            .then((users) => users.map((user) => user.uid));
          break;
        }

        case ENotificationAudience.USER: {
          userIds = await tx.user
            .findMany({
              select: { uid: true },
              where: { clientId: { in: audienceValue! } },
            })
            .then((users) => users.map((user) => user.uid));
          break;
        }
      }

      const recipients = await tx.userNotification.createManyAndReturn({
        include: { user: true },
        data: userIds.map((userId) => ({
          userId,
          status: ENotificationStatus.SEND,
          notificationId: notification.nid,
        })),
      });

      // [TODO] Feature plan: Schedule for batch sending for large number of recipients
      await Promise.all(
        recipients.map(async ({ user }) => {
          if (!user.emailNotify) return;

          await this.mailService.sendNotificationUpdate(user.email, {
            title: notification.title,
            message: notification.message,
            link: notification.link,
            name: user.name,
          });
        }),
      );
    });
  }
}
