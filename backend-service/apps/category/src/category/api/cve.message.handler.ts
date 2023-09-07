import { CategoryPattern, PagingParam, ServiceParam } from '@libs/api-contract';
import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { CveServicePort } from '../core/application/cve.service.port';
import { CategoryDIToken } from './di-token';
import { MessagePattern } from '@nestjs/microservices';
import { CheckContextInterceptor } from '@libs/common/interceptors';

@Controller()
export class CveMessageHandler {
  constructor(
    @Inject(CategoryDIToken.CveService) readonly service: CveServicePort
  ) {}

  @UseInterceptors(CheckContextInterceptor)
  @MessagePattern(CategoryPattern.MappingCVE)
  async mappingCve(param: ServiceParam<string>) {
    const result = await this.service.getCveByCpeName(param.data);
    return result;
  }

  @MessagePattern(CategoryPattern.GetPagingCVE)
  async getPaging(param: ServiceParam<PagingParam>) {
    const result = await this.service.getPaging(param.data);
    return result;
  }

  @MessagePattern(CategoryPattern.GetCVEById)
  async getById(param: ServiceParam<string>) {
    const result = await this.service.getCvebyCveId(param.data);
    return result;
  }
}
