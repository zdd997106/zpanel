import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateRoleDto, EPermission } from '@zpanel/core';

import { AuthGuard } from 'src/auth/auth.guard';

import { TransformerService } from './transformer.service';
import { RolesService } from './roles.service';
import { PermissionGuard } from 'src/permissions';

// ----------

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly transformerService: TransformerService,
  ) {}

  // --- GET: ALL ROLES ---

  @PermissionGuard.CanRead(EPermission.ROLE_CONFIGURE)
  @Get()
  async findAllRoles() {
    const roles = await this.rolesService.findAllRoles();
    return roles.map(this.transformerService.toRoleDto);
  }

  @AuthGuard.Protect()
  @Get('options')
  async getRoleOptions() {
    const roles = await this.rolesService.getRoleOptions();
    return roles.map(this.transformerService.toRoleOptionDto);
  }

  // --- POST: CREATE ROLE ---

  @PermissionGuard.CanUpdate(EPermission.ROLE_CONFIGURE)
  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    await this.rolesService.createRole(createRoleDto);
  }

  // --- GET: ROLE DETAIL ---

  // @PermissionGuard.CanRead(EPermission.ROLE_CONFIGURE)
  @Get(':id')
  async getRole(@Param('id') id: string) {
    const role = await this.rolesService.getRole(id);
    return this.transformerService.toRoleDetailDto(role);
  }

  // --- PUT: UPDATE ROLE ---

  // @PermissionGuard.CanUpdate(EPermission.ROLE_CONFIGURE)
  @Put(':id')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: CreateRoleDto,
  ) {
    await this.rolesService.updateRole(id, updateRoleDto);
  }

  // --- DELETE: DELETE ROLE ---

  // @PermissionGuard.CanDelete(EPermission.ROLE_CONFIGURE)
  @Delete(':id')
  async deleteRole(@Param('id') id: string) {
    await this.rolesService.deleteRole(id);
  }
}
