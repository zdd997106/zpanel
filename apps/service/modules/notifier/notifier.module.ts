import { Module } from '@nestjs/common';
import { MailModule } from 'modules/mail';
import { DatabaseModule } from 'modules/database';

import { NotifierService } from './notifier.service';

@Module({
  imports: [DatabaseModule, MailModule],
  providers: [NotifierService],
  exports: [NotifierService],
})
export class NotifierModule {}
