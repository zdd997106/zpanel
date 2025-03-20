import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import {
  EPermission,
  RequestToUpdateUserEmailDto,
  UpdateUserDto,
  UpdateUserEmailDto,
  UpdateUserPasswordDto,
  UpdateUserRoleDto,
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
}
