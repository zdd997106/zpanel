import { Module } from '@nestjs/common';

import { DatabaseModule } from 'modules/database';

import { MediaService } from './media.service';
import { TransformerService } from './transformer.service';
import { MediaController } from './media.controller';
import { MediaScheduleController } from './media.schedule.controller';

// ----------

const PROVIDERS = [MediaService, TransformerService];

@Module({
  imports: [DatabaseModule],
  controllers: [MediaController, MediaScheduleController],
  providers: PROVIDERS,
})
export class MediaModule {}
