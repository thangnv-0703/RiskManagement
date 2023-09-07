/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { RootModule } from './root.module';
import { AllExceptionsFilter } from '@libs/common/exception-filters';
import {
  CamelToSnakeInterceptor,
  SnakeToCamelInterceptor,
} from '@libs/common/interceptors';
import { get } from 'env-var';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors();
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, 'api gateway'));
  app.useGlobalInterceptors(new SnakeToCamelInterceptor());
  app.useGlobalInterceptors(new CamelToSnakeInterceptor());

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // app.use();

  const port = get('PORT').asPortNumber();
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
