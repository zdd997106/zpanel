import { Module } from '@nestjs/common';

import { DatabaseModule } from 'modules/database';

import { ContactMeFormService } from './contact-me.service';
import { TransformerService } from './transformer.service';
import { ContactMeFormController } from './contact-me.controller';

// ----------

const PROVIDERS = [ContactMeFormService, TransformerService];

@Module({
  imports: [DatabaseModule],
  controllers: [ContactMeFormController],
  providers: PROVIDERS,
})
export class ContactMeFormModule {}
