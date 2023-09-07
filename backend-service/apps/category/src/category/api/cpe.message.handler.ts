import { CategoryPattern, ServiceParam } from '@libs/api-contract';
import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { CpeServicePort } from '../core/application/cpe.service.port';
import { CategoryDIToken } from './di-token';
import { MessagePattern } from '@nestjs/microservices';
import { CheckContextInterceptor } from '@libs/common/interceptors';

@UseInterceptors(CheckContextInterceptor)
@Controller('')
export class CpeMessageHandler {
  constructor(
    @Inject(CategoryDIToken.CpeService) readonly service: CpeServicePort
  ) {}

  @MessagePattern(CategoryPattern.MappingCPE)
  async mappingCpe(param: ServiceParam<string>) {
    const result = await this.service.getCpeByKeyword(param.data);
    return result;
  }
}
