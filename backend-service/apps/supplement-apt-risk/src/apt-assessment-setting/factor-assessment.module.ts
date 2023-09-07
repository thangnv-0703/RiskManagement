import { Module } from '@nestjs/common';
import { FactorAssessmentService } from './core/application/factor-assessment.service';
import { FactorAssessmentRepository } from './infrastructure/repositories/factor-assessment.repository';
import { FactorAssessmentMessageHandler } from './api/factor-assessment.message.handler';
import {
  FactorAssessment,
  FactorAssessmentSchema,
} from './core/domain/factor-assessment';
import { MongooseModule } from '@nestjs/mongoose';
import { FactorAssessmentDIToken } from './api/di-token';
import { ContextService } from '@libs/common/context';
import { AptConfigModule } from '../apt-config/apt-config.module';
import { AptConfigService } from '../apt-config/core/application/apt-config.service';
import { AptConfigRepository } from '../apt-config/infrastructure/repositories/apt-config.repository';
import {
  AptConfig,
  AptConfigSchema,
} from '../apt-config/core/domain/apt-config';
import { FactorAssessmentController } from './api/factor-assessment.controller';
import { ClientsModule } from '@nestjs/microservices';
import { RabbitmqConfig } from '../configs/rabbimq.config.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FactorAssessment.name,
        schema: FactorAssessmentSchema,
      },
      {
        name: AptConfig.name,
        schema: AptConfigSchema,
      },
    ]),
    AptConfigModule,
    ClientsModule.register([RabbitmqConfig.accountQueue()]),
  ],
  controllers: [FactorAssessmentMessageHandler, FactorAssessmentController],
  providers: [
    {
      provide: FactorAssessmentDIToken.FactorAssessmentService,
      useClass: FactorAssessmentService,
    },
    {
      provide: FactorAssessmentDIToken.FactorAssessmentRepository,
      useClass: FactorAssessmentRepository,
    },
    {
      provide: FactorAssessmentDIToken.ContextService,
      useClass: ContextService,
    },
    {
      provide: FactorAssessmentDIToken.AptConfigService,
      useClass: AptConfigService,
    },
    {
      provide: FactorAssessmentDIToken.AptConfigRepository,
      useClass: AptConfigRepository,
    },
  ],
})
export class AssessmentSettingModule {}
