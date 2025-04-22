import { Module } from '@nestjs/common';

import { DatabaseModule } from 'modules/database';

import { NotificationsService } from './notifications.service';
import { TransformerService } from './transformer.service';
import { NotificationsController } from './notifications.controller';
import { NotifierModule } from 'modules/notifier';

// ----------

const PROVIDERS = [NotificationsService, TransformerService];

@Module({
  imports: [DatabaseModule, NotifierModule],
  controllers: [NotificationsController],
  providers: PROVIDERS,
})
export class NotificationsModule {}
