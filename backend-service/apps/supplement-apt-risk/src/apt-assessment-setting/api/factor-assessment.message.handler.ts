import {
  SupplementAptRiskPattern,
  PagingParam,
  ServiceParam,
} from '@libs/api-contract';
import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FactorAssessmentDIToken } from './di-token';
import { FactorAssessmentServicePort } from '../core/application/factor-assessment.service.port';
import { FactorAssessment } from '../core/domain/factor-assessment';
import { CheckContextInterceptor } from '@libs/common/interceptors';

@UseInterceptors(CheckContextInterceptor)
@Controller('factor-assessment')
export class FactorAssessmentMessageHandler {
  constructor(
    @Inject(FactorAssessmentDIToken.FactorAssessmentService)
    readonly service: FactorAssessmentServicePort
  ) {}
  @MessagePattern(SupplementAptRiskPattern.GetFactorAssessment)
  async getFactorAssessment(param: ServiceParam<string>) {
    const result = await this.service.getFactorAssessment(param.data);
    return result;
  }

  @MessagePattern(SupplementAptRiskPattern.SaveFactorAssessment)
  async saveFactorAssessment(param: ServiceParam<FactorAssessment>) {
    const result = await this.service.saveFactorAssessment(param.data);
    return result;
  }

  @MessagePattern(SupplementAptRiskPattern.GetConfigAssessment)
  async getConfigAssessment(param: ServiceParam<string>) {
    const result = await this.service.getConfigAssessment(param.data);
    return result;
  }
}
