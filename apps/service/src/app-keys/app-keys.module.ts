import { DynamicModule, Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database';

import { AppKeysService } from './app-keys.service';
import { TransformerService } from './transformer.service';
import { AppKeysController } from './app-keys.controller';
import { AppKeyGuard } from './app-keys.guard';

const PROVIDERS = [AppKeysService, TransformerService, AppKeyGuard];

@Module({
  imports: [DatabaseModule],
  controllers: [AppKeysController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class AppKeysModule {
  static forRoot(global = false): DynamicModule {
    const providers = PROVIDERS;
    return {
      global,
      module: AppKeysModule,
      providers: providers,
      exports: providers,
    };
  }
}
