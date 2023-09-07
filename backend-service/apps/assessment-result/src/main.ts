/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { RootModule } from './root.module';
import { RmqOptions } from '@nestjs/microservices';
import { RabbitmqConfig } from './configs/rabbimq.config.service';
import { get } from 'env-var';
import { AllExceptionsFilter } from '@libs/common/exception-filters';
import { setupOpenApi } from '@libs/common/swagger';
import { HttpAdapterHost } from '@nestjs/core';
import {
  CamelToSnakeInterceptor,
  SnakeToCamelInterceptor,
} from '@libs/common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapter, 'Assessment result service')
  );
  app.useGlobalInterceptors(new CamelToSnakeInterceptor());
  app.useGlobalInterceptors(new SnakeToCamelInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  setupOpenApi(app, 'Assessment result service API', '', '1.0');

  const port = get('PORT').asPortNumber();
  Logger.log(`🚀 Assessment result service is running on port ${port}`);

  app.connectMicroservice<RmqOptions>(RabbitmqConfig.assessmentResultQueue());
  app.startAllMicroservices();
  await app.listen(port);
}

bootstrap();
