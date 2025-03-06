import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UpdateUserRoleDto } from '@zpanel/core';

import { AuthGuard } from 'src/auth';

import { UsersService } from './users.service';
import { TransformerService } from './transformer.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly transformerService: TransformerService,
  ) {}

  @AuthGuard.Protect()
  @Get()
  async findAllUsers() {
    const users = await this.usersService.findAllUsers();
    return this.transformerService.toUserDtoList(users);
  }

  @AuthGuard.Protect()
  @Post(':id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    await this.usersService.updateUserRole(id, updateUserRoleDto);
  }
}
