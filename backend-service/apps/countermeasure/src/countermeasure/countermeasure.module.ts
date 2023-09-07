import { Module } from '@nestjs/common';
import { CountermeasureService } from './core/application/countermeasure.service';
import { CountermeasureRepository } from './infrastructure/repositories/countermeasure.repository';
import {
  Countermeasure,
  CountermeasureSchema,
} from './core/domain/countermeasure';
import { MongooseModule } from '@nestjs/mongoose';
import { CountermeasureDIToken } from './api/di-token';
import { ContextService } from '@libs/common/context';
import { CountermeasureController } from './api/countermeasure.controller';
import { ClientsModule } from '@nestjs/microservices';
import { RabbitmqConfig } from '../configs/rabbimq.config.service';
import { CountermeasureMessageHandler } from './api/countermeasure.message.handler';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Countermeasure.name, schema: CountermeasureSchema },
    ]),
    ClientsModule.register([RabbitmqConfig.accountQueue()]),
  ],
  controllers: [CountermeasureController, CountermeasureMessageHandler],
  providers: [
    {
      provide: CountermeasureDIToken.CountermeasureService,
      useClass: CountermeasureService,
    },
    {
      provide: CountermeasureDIToken.CountermeasureRepository,
      useClass: CountermeasureRepository,
    },
    {
      provide: CountermeasureDIToken.ContextService,
      useClass: ContextService,
    },
  ],
})
export class CountermeasureModule {}
