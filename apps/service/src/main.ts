import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

import 'scripts/utils/sync-env';
import { csrf } from 'utils';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: new AppLogger(),
  });

  // Apply Parsers
  app.use(cookieParser());

  // Apply Security
  app.use(helmet());
  app.use(csrf.middleware);

  // Apply Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT || 8080);
}

bootstrap().catch(() => {});

declare module 'express' {
  interface Request {
    signedInInfo: {
      userId: string;
      roleId: string;
    };
  }
}
