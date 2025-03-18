import { DynamicModule, Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { TokenService } from './token.service';
import { AuthGuard } from './auth.guard';

// ----------

const PROVIDERS = [TokenService, AuthGuard];
const EXPORTS = [TokenService, AuthGuard];

@Module({
  imports: [DatabaseModule],
  providers: PROVIDERS,
  exports: EXPORTS,
})
export class GuardsModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: GuardsModule,
      providers: PROVIDERS,
      exports: EXPORTS,
    };
  }
}
