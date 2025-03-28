import { Module } from '@nestjs/common';

import { DatabaseModule } from 'modules/database';
import { MailModule } from 'modules/mail';

import { AuthService } from './auth.service';
import { TransformerService } from './transformer.service';
import { AuthController } from './auth.controller';

// ----------

const PROVIDERS = [AuthService, TransformerService];

@Module({
  imports: [DatabaseModule, MailModule],
  controllers: [AuthController],
  providers: PROVIDERS,
})
export class AuthModule {}
