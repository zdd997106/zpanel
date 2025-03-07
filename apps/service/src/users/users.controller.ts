import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EPermission, UpdateUserRoleDto } from '@zpanel/core';

import { UsersService } from './users.service';
import { TransformerService } from './transformer.service';
import { PermissionGuard } from 'src/permissions';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly transformerService: TransformerService,
  ) {}

  @PermissionGuard.CanRead(EPermission.USER_CONFIGURE)
  @Get()
  async findAllUsers() {
    const users = await this.usersService.findAllUsers();
    return this.transformerService.toUserDtoList(users);
  }

  @PermissionGuard.CanUpdate(EPermission.USER_CONFIGURE)
  @Post(':id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    await this.usersService.updateUserRole(id, updateUserRoleDto);
  }
}
