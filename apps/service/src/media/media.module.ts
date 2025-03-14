import { DynamicModule, Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database';

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
  exports: PROVIDERS,
})
export class MediaModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: MediaModule,
      providers: PROVIDERS,
      exports: PROVIDERS,
    };
  }
}
