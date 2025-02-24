import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: new AppLogger(),
  });

  // Apply Parsers
  app.use(cookieParser());

  // Apply Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT || 8080);
}

bootstrap();

declare module 'express' {
  interface Request {
    signedInInfo: {
      userId: string;
      roleId: string;
    };
  }
}
