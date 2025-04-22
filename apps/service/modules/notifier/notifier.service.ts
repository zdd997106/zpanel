import { Injectable } from '@nestjs/common';
import {
  ENotificationAudience,
  ENotificationStatus,
  ENotificationType,
  ERole,
} from '@zpanel/core';
import { DatabaseService } from 'modules/database';
import { MailService } from 'modules/mail';

@Injectable()
export class NotifierService {
  constructor(
    private readonly mailService: MailService,
    private readonly dbs: DatabaseService,
  ) {}

  public async send(
    audience: ENotificationAudience,
    config: NotificationConfig,
  ) {
    const { type, title, message, sender, audienceValue = [] } = config;

    await this.dbs.$transaction(async (tx) => {
      const notification = await tx.notification.create({
        data: {
          type,
          audience,
          title,
          message,
          ...(sender && { sender: { connect: { clientId: sender } } }),
        },
      });

      const users = await this.findUsers(audience, audienceValue);
      const recipients = await tx.userNotification.createManyAndReturn({
        include: { user: true },
        data: users.map((userId) => ({
          userId,
          status: ENotificationStatus.SEND,
          notificationId: notification.nid,
        })),
      });

      // [TODO] Feature plan: Schedule for batch sending for large number of recipients
      await Promise.all(
        recipients.map(async ({ user }) => {
          if (!user.emailNotify || !user.email) return;

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

  public async sendAll(
    config: Omit<NotificationConfig, 'audience' | 'audienceValue'>,
  ) {
    return await this.send(ENotificationAudience.ALL, config);
  }

  public async sendAdmin(
    config: Omit<NotificationConfig, 'audience' | 'audienceValue'>,
  ) {
    return await this.send(ENotificationAudience.ADMIN, config);
  }

  public async sendUser(
    user: string,
    config: Omit<NotificationConfig, 'audience' | 'audienceValue'>,
  ) {
    return await this.send(ENotificationAudience.USER, {
      ...config,
      audienceValue: [user],
    });
  }

  // --- PRIVATE ---

  private async findUsers(
    audience: ENotificationAudience,
    audienceValue: string[],
  ) {
    switch (audience) {
      case ENotificationAudience.ALL: {
        return await this.dbs.user
          .findMany({ select: { uid: true } })
          .then((users) => users.map((user) => user.uid));
      }

      case ENotificationAudience.ROLE: {
        return await this.dbs.user
          .findMany({
            select: { uid: true },
            where: { role: { code: { in: audienceValue } } },
          })
          .then((users) => users.map((user) => user.uid));
      }

      case ENotificationAudience.ADMIN: {
        return await this.dbs.user
          .findMany({
            select: { uid: true },
            where: { role: { code: ERole.ADMIN } },
          })
          .then((users) => users.map((user) => user.uid));
      }

      case ENotificationAudience.USER: {
        return await this.dbs.user
          .findMany({
            select: { uid: true },
            where: { clientId: { in: audienceValue } },
          })
          .then((users) => users.map((user) => user.uid));
        break;
      }
    }
  }
}

// ----- TYPES -----

interface NotificationConfig {
  type: ENotificationType;
  title: string;
  message: string;
  audienceValue?: string[];
  sender?: string;
  link?: string | null;
}
