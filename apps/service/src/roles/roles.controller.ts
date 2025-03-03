import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateRoleDto } from '@zpanel/core';

import { AuthGuard } from 'src/auth/auth.guard';

import { TransformerService } from './transformer.service';
import { RolesService } from './roles.service';

// ----------

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly transformerService: TransformerService,
  ) {}

  // --- GET: ALL ROLES ---

  @AuthGuard.Protect()
  @Get()
  async findAllRoles() {
    const roles = await this.rolesService.findAllRoles();
    return roles.map(this.transformerService.toRoleDto);
  }

  // --- POST: CREATE ROLE ---

  @AuthGuard.Protect()
  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    await this.rolesService.createRole(createRoleDto);
  }

  // --- GET: ROLE DETAIL ---

  @AuthGuard.Protect()
  @Get(':id')
  async getRole(@Param('id') id: string) {
    const role = await this.rolesService.getRole(id);
    return this.transformerService.toRoleDetailDto(role);
  }

  // --- PUT: UPDATE ROLE ---

  @AuthGuard.Protect()
  @Put(':id')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: CreateRoleDto,
  ) {
    await this.rolesService.updateRole(id, updateRoleDto);
  }

  // --- DELETE: DELETE ROLE ---

  @AuthGuard.Protect()
  @Delete(':id')
  async deleteRole(@Param('id') id: string) {
    await this.rolesService.deleteRole(id);
  }
}
