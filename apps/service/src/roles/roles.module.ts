import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database';

import { RolesService } from './roles.service';
import { TransformerService } from './transformer.service';
import { RolesController } from './roles.controller';

const PROVIDERS = [RolesService, TransformerService];

@Module({
  imports: [DatabaseModule],
  controllers: [RolesController],
  providers: PROVIDERS,
})
export class RolesModule {}
