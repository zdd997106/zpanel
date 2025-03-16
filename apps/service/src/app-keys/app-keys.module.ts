import { DynamicModule, Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database';

import { AppKeysService } from './app-keys.service';
import { AppReportService } from './app-report.service';
import { TransformerService } from './transformer.service';
import { AppKeysController } from './app-keys.controller';
import { AppKeyGuard } from './app-keys.guard';
import { AppKeysScheduleController } from './app-keys.schedule.controller';

const PROVIDERS = [
  AppKeysService,
  AppReportService,
  TransformerService,
  AppKeyGuard,
];

@Module({
  imports: [DatabaseModule],
  controllers: [AppKeysController, AppKeysScheduleController],
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
