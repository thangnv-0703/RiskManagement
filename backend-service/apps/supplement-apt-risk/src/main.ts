import { setupOpenApi } from '@libs/common/swagger';
import { SnakeToCamelInterceptor } from './../../../libs/common/src/interceptors/snake-to-camel.interceptor';
import { CamelToSnakeInterceptor } from './../../../libs/common/src/interceptors/camel-to-snake.interceptor';
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import { RmqOptions } from '@nestjs/microservices';
import { RabbitmqConfig } from './configs/rabbimq.config.service';
import { get } from 'env-var';
import { AllExceptionsFilter } from '@libs/common/exception-filters';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapter, 'Supplement APT risk service')
  );
  app.useGlobalInterceptors(new CamelToSnakeInterceptor());
  app.useGlobalInterceptors(new SnakeToCamelInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  setupOpenApi(app, 'Supplement APT risk service API', '', '1.0');

  const port = get('PORT').asPortNumber();
  Logger.log(`🚀 Supplement APT risk service is running on port ${port}`);

  app.connectMicroservice<RmqOptions>(RabbitmqConfig.aptConfigQueue());
  app.startAllMicroservices();
  await app.listen(port);
}

bootstrap();
