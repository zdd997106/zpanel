import { Module } from '@nestjs/common';

import { DatabaseModule } from 'modules/database/database.module';

import { AuthService } from './auth.service';
import { TransformerService } from './transformer.service';
import { AuthController } from './auth.controller';

// ----------

const PROVIDERS = [AuthService, TransformerService];

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: PROVIDERS,
})
export class AuthModule {}
