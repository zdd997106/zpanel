import { DynamicModule, Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';

import { AuthService } from './auth.service';
import { TransformerService } from './transformer.service';
import { AuthGuard } from './auth.guard';
import { AuthController } from './auth.controller';
import { TokenService } from './token.service';
import { MediaModule } from 'src/media';

// ----------

const PROVIDERS = [AuthService, TokenService, AuthGuard, TransformerService];

@Module({
  imports: [DatabaseModule, MediaModule],
  controllers: [AuthController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class AuthModule {
  static forRoot(): DynamicModule {
    const providers = PROVIDERS;
    return {
      global: true,
      module: AuthModule,
      providers: providers,
      exports: providers,
    };
  }
}
