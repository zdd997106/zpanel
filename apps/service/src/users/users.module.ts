import { DynamicModule, Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database';
import { AppKeysModule } from 'src/app-keys';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TransformerService } from './transformer.service';

const PROVIDERS = [UsersService, TransformerService];

@Module({
  imports: [DatabaseModule, AppKeysModule.forRoot()],
  controllers: [UsersController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class UsersModule {
  static forRoot(): DynamicModule {
    const providers = PROVIDERS;
    return {
      global: true,
      module: UsersModule,
      providers: providers,
      exports: providers,
    };
  }
}
