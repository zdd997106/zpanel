import { Module } from '@nestjs/common';

import { DatabaseModule } from 'modules/database';

import { AppKeysService } from './app-keys.service';
import { AppReportService } from './app-report.service';
import { TransformerService } from './transformer.service';
import { AppKeysController } from './app-keys.controller';
import { AppKeysScheduleController } from './app-keys.schedule.controller';

const PROVIDERS = [AppKeysService, AppReportService, TransformerService];

@Module({
  imports: [DatabaseModule],
  controllers: [AppKeysController, AppKeysScheduleController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class AppKeysModule {}
