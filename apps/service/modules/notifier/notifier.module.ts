import { Module } from '@nestjs/common';
import { MailModule } from 'modules/mail';

import { NotifierService } from './notifier.service';
import { DatabaseModule } from 'modules/database';

@Module({
  imports: [DatabaseModule, MailModule],
  providers: [NotifierService],
  exports: [NotifierService],
})
export class NotifierModule {}
