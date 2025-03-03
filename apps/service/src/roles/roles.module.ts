import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database';

import { RolesService } from './roles.service';
import { TransformerService } from './transformer.service';
import { RolesController } from './roles.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [RolesController],
  providers: [RolesService, TransformerService],
})
export class RolesModule {}
