import { Module } from '@nestjs/common';
import { AssessmentResultService } from './core/application/assessment-result.service';
import { AssessmentResultRepository } from './infrastructure/repositories/assessment-result.repository';
import { AssessmentResultMessageHandler } from './api/assessment-result.message.handler';
import {
  AssessmentResult,
  AssessmentResultSchema,
} from './core/domain/assessment-result';
import { MongooseModule } from '@nestjs/mongoose';
import { AssessmentResultDIToken } from './api/di-token';
import { ContextService } from '@libs/common/context';
import { AssessmentResultController } from './api/assessment-result.controller';
import { ClientsModule } from '@nestjs/microservices';
import { RabbitmqConfig } from '../configs/rabbimq.config.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AssessmentResult.name, schema: AssessmentResultSchema },
    ]),
    ClientsModule.register([
      RabbitmqConfig.accountQueue(),
      RabbitmqConfig.supplementAptRiskQueue(),
      RabbitmqConfig.deploymentScenarioQueue(),
    ]),
    HttpModule,
  ],
  controllers: [AssessmentResultMessageHandler, AssessmentResultController],
  providers: [
    {
      provide: AssessmentResultDIToken.AssessmentResultService,
      useClass: AssessmentResultService,
    },
    {
      provide: AssessmentResultDIToken.AssessmentResultRepository,
      useClass: AssessmentResultRepository,
    },
    {
      provide: AssessmentResultDIToken.ContextService,
      useClass: ContextService,
    },
  ],
})
export class AssessmentResultModule {}
