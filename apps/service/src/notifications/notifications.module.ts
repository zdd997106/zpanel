import { Module } from '@nestjs/common';

import { DatabaseModule } from 'modules/database';
import { MailModule } from 'modules/mail';

import { NotificationsService } from './notifications.service';
import { TransformerService } from './transformer.service';
import { NotificationsController } from './notifications.controller';

// ----------

const PROVIDERS = [NotificationsService, TransformerService];

@Module({
  imports: [DatabaseModule, MailModule],
  controllers: [NotificationsController],
  providers: PROVIDERS,
})
export class NotificationsModule {}
