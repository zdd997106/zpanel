import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  EPermission,
  FindUserNotificationsCountDto,
  FindUserNotificationsDto,
  RequestToUpdateUserEmailDto,
  UpdateUserDto,
  UpdateUserEmailDto,
  UpdateUserPasswordDto,
  UpdateUserRoleDto,
  UpdateUsersNotificationsAllDto,
  UpdateUsersNotificationsDto,
} from '@zpanel/core';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { PermissionGuard } from 'modules/guards';
import { TransformerService as AppKeyTransformerService } from 'src/app-keys/transformer.service';

import { UsersService } from './users.service';
import { TransformerService } from './transformer.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly transformerService: TransformerService,
    private readonly appKeyTransformerService: AppKeyTransformerService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  @PermissionGuard.CanRead(EPermission.USER_CONFIGURE)
  @Get()
  async findAllUsers() {
    const users = await this.usersService.findAllUsers();
    return users.map(this.transformerService.toUserDto);
  }

  @PermissionGuard.CanRead([EPermission.ACCOUNT], [EPermission.USER_CONFIGURE])
  @Get(':id')
  async getUserDetail(@Param('id') id: string) {
    const user = await this.usersService.findUser(id);

    const matchedPermissions = this.request.matchedPermissions!;
    if (!matchedPermissions?.includes(EPermission.USER_CONFIGURE)) {
      await this.usersService.equalToSignedInUser(user);
    }

    return this.transformerService.toUserDetailDto(user);
  }

  @PermissionGuard.CanUpdate(EPermission.ACCOUNT)
  @Post('password')
  async updateUserPassword(
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    await this.usersService.updateUserPassword(updateUserPasswordDto);
  }

  @PermissionGuard.CanUpdate(EPermission.ACCOUNT)
  @Post(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.usersService.equalToSignedInUser({ clientId: id });
    await this.usersService.updateUser(id, updateUserDto);
  }

  @PermissionGuard.CanUpdate(EPermission.ACCOUNT)
  @Post(':id/email')
  async updateUserEmail(@Body() updateUserEmailDto: UpdateUserEmailDto) {
    await this.usersService.updateUserEmail(updateUserEmailDto);
  }

  @PermissionGuard.CanUpdate(EPermission.USER_CONFIGURE)
  @Post(':id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    await this.usersService.updateUserRole(id, updateUserRoleDto);
  }

  @PermissionGuard.CanUpdate(EPermission.ACCOUNT)
  @Post(':id/request-to-update-email')
  async requestToUpdateUserEmail(
    @Param('id') id: string,
    @Body() requestToUpdateUserEmailDto: RequestToUpdateUserEmailDto,
  ) {
    await this.usersService.equalToSignedInUser({ clientId: id });
    await this.usersService.requestToUpdateUserEmail(
      id,
      requestToUpdateUserEmailDto,
    );
  }

  @PermissionGuard.CanRead(EPermission.APP_KEY_MANAGEMENT)
  @Get(':id/app-keys')
  async findKeysByUser(@Param('id') id: string) {
    const appKeys = await this.usersService.findAppKeysByUser(id);
    return appKeys.map(this.appKeyTransformerService.toAppKeyDto);
  }

  @PermissionGuard.CanRead(EPermission.NOTIFICATION)
  @Get(':id/notifications')
  async findUserNotifications(
    @Param('id') id: string,
    findUserNotificationsDto: FindUserNotificationsDto,
  ) {
    await this.usersService.equalToSignedInUser({ clientId: id });
    const { notifications, count } =
      await this.usersService.findUserNotifications(id, {
        ...findUserNotificationsDto,
      });
    return {
      items: notifications.map(this.transformerService.toUserNotificationDto),
      count,
    };
  }

  @PermissionGuard.CanRead(EPermission.NOTIFICATION)
  @Get(':id/notifications/count')
  async findUserNotificationCount(
    @Param('id') id: string,
    findUserNotificationsCountDto: FindUserNotificationsCountDto,
  ) {
    await this.usersService.equalToSignedInUser({ clientId: id });
    return await this.usersService.findUserNotificationCount(id, {
      ...findUserNotificationsCountDto,
    });
  }

  @PermissionGuard.CanRead(EPermission.NOTIFICATION)
  @Get(':id/notifications/latest')
  async findLatestUserNotifications(@Param('id') id: string) {
    await this.usersService.equalToSignedInUser({ clientId: id });
    const notifications =
      await this.usersService.findLatestUserNotifications(id);
    return notifications.map(this.transformerService.toUserNotificationDto);
  }

  @PermissionGuard.CanUpdate(EPermission.NOTIFICATION)
  @Patch(':id/notifications')
  async updateUserNotifications(
    @Param('id') id: string,
    updateUsersNotificationsDto: UpdateUsersNotificationsDto,
  ) {
    await this.usersService.equalToSignedInUser({ clientId: id });
    await this.usersService.updateUserNotifications(id, {
      ...updateUsersNotificationsDto,
    });
  }

  @PermissionGuard.CanUpdate(EPermission.NOTIFICATION)
  @Patch(':id/notifications/all')
  async updateUserNotificationsAll(
    @Param('id') id: string,
    updateUsersNotificationsAllDto: UpdateUsersNotificationsAllDto,
  ) {
    await this.usersService.equalToSignedInUser({ clientId: id });
    await this.usersService.updateUserNotificationsAll(id, {
      ...updateUsersNotificationsAllDto,
    });
  }
}
