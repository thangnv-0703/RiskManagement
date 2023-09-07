import * as dotenv from 'dotenv';
dotenv.config();

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  MicroserviceOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { RabbitmqConfig } from './configs/rabbitmq.config.service';
import { get } from 'env-var';
import { TransformIdInterceptor } from './interceptors/transform-id.interceptor';
import { AppModule } from './app.module';
import { SnakeToCamelInterceptor } from './interceptors/snake-to-camel.interceptor';
import { CamelToSnakeInterceptor } from './interceptors/camel-to-snake.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('IT Asset Management System')
    .setDescription('API for ITAMS')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new TransformIdInterceptor());
  app.useGlobalInterceptors(new CamelToSnakeInterceptor());
  app.useGlobalInterceptors(new SnakeToCamelInterceptor());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = get('PORT').asPortNumber();
  Logger.log(`🚀 Asset management service is running on port ${port}`);

  app.connectMicroservice<RmqOptions>(RabbitmqConfig.assetQueue(), {
    inheritAppConfig: true,
  });

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
