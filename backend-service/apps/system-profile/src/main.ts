import { setupOpenApi } from '@libs/common/swagger';
import { HttpAdapterHost } from '@nestjs/core';
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { RootModule } from './root.module';
import { RabbitmqConfig } from './configs/rabbimq.config';
import { RmqOptions } from '@nestjs/microservices';
import { get } from 'env-var';
import {
  CamelToSnakeInterceptor,
  SnakeToCamelInterceptor,
} from '@libs/common/interceptors';
import { AllExceptionsFilter } from '@libs/common/exception-filters';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapter, 'System profile service')
  );
  app.useGlobalInterceptors(new CamelToSnakeInterceptor());
  app.useGlobalInterceptors(new SnakeToCamelInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  setupOpenApi(app, 'System profile service API', '', '1.0');

  const port = get('PORT').asPortNumber();
  Logger.log(`🚀 System profile service is running on port ${port}`);

  app.connectMicroservice<RmqOptions>(RabbitmqConfig.systemProfileQueue());
  app.startAllMicroservices();
  await app.listen(port);
}

bootstrap();
