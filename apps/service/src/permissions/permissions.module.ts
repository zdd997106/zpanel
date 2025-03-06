import { DynamicModule, Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database';

import { PermissionsService } from './permissions.service';
import { TransformerService } from './transformer.service';
import { PermissionsController } from './permissions.controller';
import { PermissionGuard } from './permissions.guard';

// ----------

const PROVIDERS = [PermissionsService, PermissionGuard, TransformerService];

@Module({
  imports: [DatabaseModule],
  controllers: [PermissionsController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class PermissionsModule {
  static forRoot(): DynamicModule {
    const providers = PROVIDERS;
    return {
      global: true,
      module: PermissionsModule,
      providers: providers,
      exports: providers,
    };
  }
}
