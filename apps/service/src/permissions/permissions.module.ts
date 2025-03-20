import { Module } from '@nestjs/common';

import { DatabaseModule } from 'modules/database';

import { PermissionsService } from './permissions.service';
import { TransformerService } from './transformer.service';
import { PermissionsController } from './permissions.controller';

// ----------

const PROVIDERS = [PermissionsService, TransformerService];

@Module({
  imports: [DatabaseModule],
  controllers: [PermissionsController],
  providers: PROVIDERS,
})
export class PermissionsModule {}
