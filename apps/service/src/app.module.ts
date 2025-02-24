import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { ZodValidationPipe } from 'nestjs-zod';

import { TransformInterceptor } from './transform.interceptor';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [
    { useClass: ZodValidationPipe, provide: APP_PIPE },
    { useClass: TransformInterceptor, provide: APP_INTERCEPTOR },
  ],
})
export class AppModule {}
