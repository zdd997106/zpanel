import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { DatabaseModule } from 'modules/database';
import { MailModule } from 'modules/mail';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TransformerService } from './transformer.service';

const PROVIDERS = [UsersService, TransformerService];

@Module({
  imports: [DatabaseModule, JwtModule, MailModule],
  controllers: [UsersController],
  providers: PROVIDERS,
})
export class UsersModule {}
