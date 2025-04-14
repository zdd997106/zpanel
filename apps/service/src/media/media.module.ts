import { Module } from '@nestjs/common';

import { DatabaseModule } from 'modules/database';

import { MediaService } from './media.service';
import { S3Service } from './s3.service';
import { TransformerService } from './transformer.service';
import { MediaController } from './media.controller';
import { MediaScheduleController } from './media.schedule.controller';

// ----------

const PROVIDERS = [MediaService, TransformerService, S3Service];

@Module({
  imports: [DatabaseModule],
  controllers: [MediaController, MediaScheduleController],
  providers: PROVIDERS,
})
export class MediaModule {}
