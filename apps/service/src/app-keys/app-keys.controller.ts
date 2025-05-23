import { Request } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CreateAppKeyDto, UpdateAppKeyDto, EPermission } from '@zpanel/core';

import { PermissionGuard } from 'modules/guards';

import { TransformerService } from './transformer.service';
import { AppKeysService } from './app-keys.service';

// ----------

@Controller('app-keys')
export class AppKeysController {
  constructor(
    private readonly appKeysService: AppKeysService,
    private readonly transformerService: TransformerService,
  ) {}

  // --- GET: ALL APP KEYS ---

  @PermissionGuard.CanRead(EPermission.APP_KEY_CONFIGURE)
  @Get()
  async findAllKeys() {
    const appKeys = await this.appKeysService.findAllAppKeys();
    return appKeys.map(this.transformerService.toAppKeyDto);
  }

  // --- POST: CREATE APP KEY ---

  @PermissionGuard.CanUpdate(
    [EPermission.APP_KEY_CONFIGURE],
    [EPermission.APP_KEY_MANAGEMENT],
  )
  @Post()
  async createRole(@Body() createAppKeyDto: CreateAppKeyDto) {
    await this.appKeysService.createAppKey(createAppKeyDto);
  }

  // --- GET: APP KEY DETAIL ---

  @PermissionGuard.CanRead(
    [EPermission.APP_KEY_CONFIGURE],
    [EPermission.APP_KEY_MANAGEMENT],
  )
  @Get(':id')
  async getAppKeyDetail(@Param('id') id: string, @Req() req: Request) {
    if (!req.matchedPermissions?.includes(EPermission.APP_KEY_CONFIGURE)) {
      await this.appKeysService.isOwner(id);
    }

    const appKey = await this.appKeysService.getAppKey(id);
    return this.transformerService.toAppKeyDetailDto(appKey);
  }

  // --- PUT: UPDATE APP KEY ---

  @PermissionGuard.CanUpdate(
    [EPermission.APP_KEY_CONFIGURE],
    [EPermission.APP_KEY_MANAGEMENT],
  )
  @Put(':id')
  async updateAppKey(
    @Param('id') id: string,
    @Body() updateAppKeyDto: UpdateAppKeyDto,
    @Req() req: Request,
  ) {
    if (!req.matchedPermissions?.includes(EPermission.APP_KEY_CONFIGURE)) {
      await this.appKeysService.isOwner(id);
    }

    await this.appKeysService.updateAppKey(id, updateAppKeyDto);
  }

  // --- DELETE: DELETE APP KEY ---

  @PermissionGuard.CanDelete(
    [EPermission.APP_KEY_CONFIGURE],
    [EPermission.APP_KEY_MANAGEMENT],
  )
  @Delete(':id')
  async deleteAppKey(@Param('id') id: string, @Req() req: Request) {
    if (!req.matchedPermissions?.includes(EPermission.APP_KEY_CONFIGURE)) {
      await this.appKeysService.isOwner(id);
    }

    await this.appKeysService.deleteAppKey(id);
  }
}
