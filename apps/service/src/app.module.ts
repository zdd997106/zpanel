import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { ZodValidationPipe } from 'nestjs-zod';

import { TransformInterceptor } from './transform.interceptor';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
// import { OptionsModule } from './options/options.module';
// import { ProjectsModule } from './projects/projects.module';
// import { SecureShellService } from './secure-shell/secure-shell.service';
import { ApplicationsModule } from './applications/applications.module';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
    ScheduleModule.forRoot(),
    AuthModule.forRoot(),
    MediaModule.forRoot(),
    PermissionsModule.forRoot(),
    UsersModule.forRoot(),
    RolesModule,
    ApplicationsModule,
    // OptionsModule,
    // ProjectsModule,
  ],
  controllers: [],
  providers: [
    { useClass: ZodValidationPipe, provide: APP_PIPE },
    { useClass: TransformInterceptor, provide: APP_INTERCEPTOR },
    // SecureShellService,
  ],
})
export class AppModule {}
