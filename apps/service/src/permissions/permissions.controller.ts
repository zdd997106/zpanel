import { Body, Controller, Get, Patch } from '@nestjs/common';

import { PermissionsService } from './permissions.service';
import { TransformerService } from './transformer.service';
import { UpdatePermissionsDto } from '@zpanel/core';
import { AuthGuard } from 'src/auth/auth.guard';

// ----------

@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly transformerService: TransformerService,
  ) {}

  // --- GET: ALL PERMISSIONS ---

  @AuthGuard.Protect()
  @Get()
  async getAllPermissions() {
    const permissions = await this.permissionsService.findAllPermissions();
    return permissions.map(this.transformerService.toPermissionDto);
  }

  // --- PUT: UPDATE PERMISSIONS ---

  @AuthGuard.Protect()
  @Patch()
  async updatePermissions(@Body() updatePermissionsDto: UpdatePermissionsDto) {
    await this.permissionsService.updatePermissions(updatePermissionsDto);
  }
}
