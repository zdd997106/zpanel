import { Body, Controller, Get, Patch } from '@nestjs/common';
import { EPermission, UpdatePermissionsDto } from '@zpanel/core';

import { PermissionGuard } from 'modules/guards';

import { PermissionsService } from './permissions.service';
import { TransformerService } from './transformer.service';

// ----------

@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly transformerService: TransformerService,
  ) {}

  // --- GET: ALL PERMISSIONS ---

  @PermissionGuard.CanRead(
    EPermission.PERMISSION_CONFIGURE,
    EPermission.ROLE_CONFIGURE,
  )
  @Get()
  async getAllPermissions() {
    const permissions = await this.permissionsService.findAllPermissions();
    return permissions.map(this.transformerService.toPermissionDto);
  }

  // --- PUT: UPDATE PERMISSIONS ---

  @PermissionGuard.CanUpdate(EPermission.PERMISSION_CONFIGURE)
  @Patch()
  async updatePermissions(@Body() updatePermissionsDto: UpdatePermissionsDto) {
    await this.permissionsService.updatePermissions(updatePermissionsDto);
  }
}
