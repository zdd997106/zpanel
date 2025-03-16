import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EPermission, UpdateUserRoleDto } from '@zpanel/core';

import { PermissionGuard } from 'src/permissions';
import {
  AppKeysService,
  TransformerService as AppKeyTransformerService,
} from 'src/app-keys';

import { UsersService } from './users.service';
import { TransformerService } from './transformer.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly appKeysService: AppKeysService,
    private readonly transformerService: TransformerService,
    private readonly appKeyTransformerService: AppKeyTransformerService,
  ) {}

  @PermissionGuard.CanRead(EPermission.USER_CONFIGURE)
  @Get()
  async findAllUsers() {
    const users = await this.usersService.findAllUsers();
    return users.map(this.transformerService.toUserDto);
  }

  @PermissionGuard.CanUpdate(EPermission.USER_CONFIGURE)
  @Post(':id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    await this.usersService.updateUserRole(id, updateUserRoleDto);
  }

  @PermissionGuard.CanRead(EPermission.APP_KEY_MANAGEMENT)
  @Get(':id/app-keys')
  async findKeysByUser(@Param('id') id: string) {
    const appKeys = await this.appKeysService.findAppKeysByUser(id);
    return appKeys.map(this.appKeyTransformerService.toAppKeyDto);
  }
}
