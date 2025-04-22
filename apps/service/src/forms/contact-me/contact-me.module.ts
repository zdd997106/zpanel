import { Module } from '@nestjs/common';

import { DatabaseModule } from 'modules/database';
import { NotifierModule } from 'modules/notifier';

import { ContactMeFormService } from './contact-me.service';
import { TransformerService } from './transformer.service';
import { ContactMeFormController } from './contact-me.controller';

// ----------

const PROVIDERS = [ContactMeFormService, TransformerService];

@Module({
  imports: [DatabaseModule, NotifierModule],
  controllers: [ContactMeFormController],
  providers: PROVIDERS,
})
export class ContactMeFormModule {}
