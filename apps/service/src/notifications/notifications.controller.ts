import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  CreateNotificationsDto,
  EPermission,
  FindAllNotificationsDto,
} from '@zpanel/core';

import { PermissionGuard } from 'modules/guards';

import { TransformerService } from './transformer.service';
import { NotificationsService } from './notifications.service';

// ----------

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly transformerService: TransformerService,
  ) {}

  @PermissionGuard.CanRead(EPermission.NOTIFICATION_CONFIGURE)
  @Get()
  async findAllNotifications(
    @Query() findAllNotificationsDto: FindAllNotificationsDto,
  ) {
    const { notifications, count } =
      await this.notificationsService.findAllNotifications(
        findAllNotificationsDto,
      );

    return {
      items: notifications.map(this.transformerService.toNotificationDto),
      count,
    };
  }

  @PermissionGuard.CanRead(EPermission.NOTIFICATION_CONFIGURE)
  @Get(':id')
  async getAllNotificationDetail(@Param('id') id: string) {
    const notification =
      await this.notificationsService.getNotificationDetail(id);

    return this.transformerService.toNotificationDetailDto(notification);
  }

  @PermissionGuard.CanCreate(EPermission.NOTIFICATION_CONFIGURE)
  @Post()
  async createNotification(
    @Body() createNotificationDto: CreateNotificationsDto,
  ) {
    await this.notificationsService.createNotification(createNotificationDto);
  }
}
