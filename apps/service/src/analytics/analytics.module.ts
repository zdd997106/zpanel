import { Module } from '@nestjs/common';

import { DatabaseModule } from 'modules/database';

import { AnalyticsController } from './analytics.controller';

// ----------

const PROVIDERS = [];

@Module({
  imports: [DatabaseModule],
  controllers: [AnalyticsController],
  providers: PROVIDERS,
})
export class AnalyticsModule {}
