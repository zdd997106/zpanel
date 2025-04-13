import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  CreateUserDto,
  EPermission,
  FindUserNotificationsCountDto,
  FindUserNotificationsDto,
  FindUsersDto,
  RequestToUpdateUserEmailDto,
  UpdateUserProfileDto,
  UpdateUserDto,
  UpdateUserEmailDto,
  UpdateUserPasswordDto,
  UpdateUsersNotificationsAllDto,
  UpdateUsersNotificationsDto,
} from '@zpanel/core';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { AuthGuard, PermissionGuard } from 'modules/guards';
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

  // --- GET: ALL USERS ---

  @PermissionGuard.CanRead(EPermission.USER_CONFIGURE)
  @Get()
  async findUsers(@Query() findUsersDto: FindUsersDto) {
    const { users, count } = await this.usersService.findUsers(findUsersDto);
    return { items: users.map(this.transformerService.toUserDto), count };
  }

  // --- POST: CREATE USER ---

  @PermissionGuard.CanCreate(EPermission.USER_CONFIGURE)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.usersService.createUser(createUserDto);
  }

  // --- GET: USER OPTIONS ---

  @AuthGuard.Protect()
  @Get('options')
  async getUserOptions() {
    const roles = await this.usersService.getUserOptions();
    return roles.map(this.transformerService.toUserOptionDto);
  }

  // --- GET: USER DETAIL ---

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

  // --- PATCH: UPDATE USER PASSWORD ---

  @PermissionGuard.CanUpdate(EPermission.ACCOUNT)
  @Patch(':id/password')
  async updateUserPassword(
    @Param('id') id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    await this.usersService.updateUserPassword(id, updateUserPasswordDto);
  }

  // --- PUT: UPDATE USER SETTINGS ---

  @PermissionGuard.CanUpdate(EPermission.USER_CONFIGURE)
  @Put(':id')
  async updateUserSettings(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.usersService.updateUser(id, updateUserDto);
  }

  // --- DELETE: DELETE USER ---

  @PermissionGuard.CanDelete(EPermission.USER_CONFIGURE)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
  }

  // --- PUT: UPDATE USER PROFILE ---

  @PermissionGuard.CanUpdate(EPermission.ACCOUNT)
  @Put(':id/profile')
  async updateUserProfile(
    @Param('id') id: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    await this.usersService.equalToSignedInUser({ clientId: id });
    await this.usersService.updateUserProfile(id, updateUserProfileDto);
  }

  // --- PATCH: UPDATE USER EMAIL ---

  @PermissionGuard.CanUpdate(EPermission.ACCOUNT)
  @Patch(':id/email')
  async updateUserEmail(
    @Param('id') id: string,
    @Body() updateUserEmailDto: UpdateUserEmailDto,
  ) {
    await this.usersService.equalToSignedInUser({ clientId: id });
    await this.usersService.updateUserEmail(id, updateUserEmailDto);
  }

  @PermissionGuard.CanUpdate(EPermission.ACCOUNT)
  @Delete(':id/email')
  async discountUserEmail(@Param('id') id: string) {
    await this.usersService.equalToSignedInUser({ clientId: id });
    await this.usersService.discountUserEmail(id);
  }

  // --- POST: REQUEST TO UPDATE USER EMAIL ---

  @PermissionGuard.CanUpdate(EPermission.ACCOUNT)
  @Post(':id/request-to-update-email')
  async requestToUpdateUserEmail(
    @Param('id') id: string,
    @Body() requestToUpdateUserEmailDto: RequestToUpdateUserEmailDto,
  ) {
    await this.usersService.equalToSignedInUser({ clientId: id });
    await this.usersService.requestToUpdateUserEmail(id, {
      ...requestToUpdateUserEmailDto,
    });
  }

  // --- GET: USER APP KEYS ---

  @PermissionGuard.CanRead(EPermission.APP_KEY_MANAGEMENT)
  @Get(':id/app-keys')
  async findKeysByUser(@Param('id') id: string) {
    const appKeys = await this.usersService.findAppKeysByUser(id);
    return appKeys.map(this.appKeyTransformerService.toAppKeyDto);
  }

  // --- GET: USER NOTIFICATIONS ---

  @PermissionGuard.CanRead(EPermission.NOTIFICATION)
  @Get(':id/notifications')
  async findUserNotifications(
    @Param('id') id: string,
    @Query() findUserNotificationsDto: FindUserNotificationsDto,
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

  // --- GET: USER NOTIFICATION COUNT ---

  @PermissionGuard.CanRead(EPermission.NOTIFICATION)
  @Get(':id/notifications/count')
  async findUserNotificationCount(
    @Param('id') id: string,
    @Query() findUserNotificationsCountDto: FindUserNotificationsCountDto,
  ) {
    await this.usersService.equalToSignedInUser({ clientId: id });
    return await this.usersService.findUserNotificationCount(id, {
      ...findUserNotificationsCountDto,
    });
  }

  // --- GET: USER LATEST NOTIFICATIONS ---

  @PermissionGuard.CanRead(EPermission.NOTIFICATION)
  @Get(':id/notifications/latest')
  async findLatestUserNotifications(@Param('id') id: string) {
    await this.usersService.equalToSignedInUser({ clientId: id });
    const notifications =
      await this.usersService.findLatestUserNotifications(id);
    return notifications.map(this.transformerService.toUserNotificationDto);
  }

  // --- PATCH: UPDATE USER NOTIFICATIONS ---

  @PermissionGuard.CanUpdate(EPermission.NOTIFICATION)
  @Patch(':id/notifications')
  async updateUserNotifications(
    @Param('id') id: string,
    @Body() updateUsersNotificationsDto: UpdateUsersNotificationsDto,
  ) {
    await this.usersService.equalToSignedInUser({ clientId: id });
    await this.usersService.updateUserNotifications(id, {
      ...updateUsersNotificationsDto,
    });
  }

  // --- PATCH: UPDATE ALL USER NOTIFICATIONS ---

  @PermissionGuard.CanUpdate(EPermission.NOTIFICATION)
  @Patch(':id/notifications/all')
  async updateUserNotificationsAll(
    @Param('id') id: string,
    @Body() updateUsersNotificationsAllDto: UpdateUsersNotificationsAllDto,
  ) {
    await this.usersService.equalToSignedInUser({ clientId: id });
    await this.usersService.updateUserNotificationsAll(id, {
      ...updateUsersNotificationsAllDto,
    });
  }
}
