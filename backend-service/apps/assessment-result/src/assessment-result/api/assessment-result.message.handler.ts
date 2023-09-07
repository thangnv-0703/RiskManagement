import {
  AssessmentResultPattern,
  PagingParam,
  ServiceParam,
} from '@libs/api-contract';
import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { AssessmentResultServicePort } from '../core/application/assessment-result.service.port';
import { AssessmentResult } from '../core/domain/assessment-result';
import { AssessmentResultDIToken } from './di-token';
import { MessagePattern } from '@nestjs/microservices';
import { CheckContextInterceptor } from '@libs/common/interceptors';

@UseInterceptors(CheckContextInterceptor)
@Controller('assessment-result')
export class AssessmentResultMessageHandler {
  constructor(
    @Inject(AssessmentResultDIToken.AssessmentResultService)
    readonly service: AssessmentResultServicePort
  ) {}

  @MessagePattern(AssessmentResultPattern.GetPaging)
  async getPaging(param: ServiceParam<PagingParam>) {
    const result = await this.service.getPaging(param.data);
    return result;
  }

  @MessagePattern(AssessmentResultPattern.GetById)
  async getById(param: ServiceParam<string>) {
    const result = await this.service.getById(param.data);
    return result;
  }

  @MessagePattern(AssessmentResultPattern.Save)
  async create(param: ServiceParam<AssessmentResult>) {
    const result = await this.service.create(param.data);
    return result;
  }

  @MessagePattern(AssessmentResultPattern.Delete)
  async delete(param: ServiceParam<string>) {
    const result = await this.service.delete(param.data);
    return result;
  }

  @MessagePattern(AssessmentResultPattern.GetDashboard)
  async getDashboard(param: ServiceParam<string>) {
    const result = await this.service.getAssessmentResultDashboard(param.data);
    return result;
  }
}
