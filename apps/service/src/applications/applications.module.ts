import { Module } from '@nestjs/common';

import { DatabaseModule } from 'modules/database';
import { MailModule } from 'modules/mail';

import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { TransformerService } from './transformer.service';

const PROVIDERS = [ApplicationsService, TransformerService];

@Module({
  imports: [DatabaseModule, MailModule],
  controllers: [ApplicationsController],
  providers: PROVIDERS,
})
export class ApplicationsModule {}
