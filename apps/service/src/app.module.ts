import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ZodValidationPipe } from 'nestjs-zod';

import { GuardsModule } from 'modules/guards';
import { TransformerModule } from 'modules/transformer';

import { TransformInterceptor } from './transform.interceptor';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
// import { SecureShellService } from './secure-shell/secure-shell.service';
import { ApplicationsModule } from './applications/applications.module';
import { AppKeysModule } from './app-keys/app-keys.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FormsModule } from './forms/forms.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 100 }] }),
    ScheduleModule.forRoot(),
    forwardRef(() => TransformerModule.forRoot()),
    GuardsModule.forRoot(),
    AuthModule,
    MediaModule,
    PermissionsModule,
    UsersModule,
    RolesModule,
    ApplicationsModule,
    AppKeysModule,
    NotificationsModule,
    ProjectsModule,
    FormsModule,
    AnalyticsModule,
  ],
  controllers: [],
  providers: [
    { useClass: ZodValidationPipe, provide: APP_PIPE },
    { useClass: TransformInterceptor, provide: APP_INTERCEPTOR },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    // SecureShellService,
  ],
})
export class AppModule {}
