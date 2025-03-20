import { DynamicModule, Module } from '@nestjs/common';

import { DatabaseModule } from 'modules/database/database.module';
import { TransformerService as AppKeyTransformerService } from 'src/app-keys/transformer.service';
import { TransformerService as ApplicationTransformerService } from 'src/applications/transformer.service';
import { TransformerService as AuthTransformerService } from 'src/auth/transformer.service';
import { TransformerService as MediaTransformerService } from 'src/media/transformer.service';
import { TransformerService as PermissionTransformerService } from 'src/permissions/transformer.service';
import { TransformerService as RoleTransformerService } from 'src/roles/transformer.service';
import { TransformerService as UserTransformerService } from 'src/users/transformer.service';
import { TransformerService as PortfolioProjectTransformerService } from 'src/projects/portfolio/transformer.service';

// ----------

const EXPORTS = [
  AppKeyTransformerService,
  ApplicationTransformerService,
  AuthTransformerService,
  MediaTransformerService,
  PermissionTransformerService,
  RoleTransformerService,
  PortfolioProjectTransformerService,
  UserTransformerService,
];

@Module({
  imports: [DatabaseModule],
  providers: EXPORTS,
  exports: EXPORTS,
})
export class TransformerModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: TransformerModule,
      providers: EXPORTS,
      exports: EXPORTS,
    };
  }
}
