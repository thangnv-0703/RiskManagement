import {
  CountermeasurePattern,
  PagingParam,
  ServiceParam,
} from '@libs/api-contract';
import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { CountermeasureServicePort } from '../core/application/countermeasure.service.port';
import { Countermeasure } from '../core/domain/countermeasure';
import { CountermeasureDIToken } from './di-token';
import { MessagePattern } from '@nestjs/microservices';
import { CheckContextInterceptor } from '@libs/common/interceptors';

@UseInterceptors(CheckContextInterceptor)
@Controller('countermeasure')
export class CountermeasureMessageHandler {
  constructor(
    @Inject(CountermeasureDIToken.CountermeasureService)
    readonly service: CountermeasureServicePort
  ) {}

  @MessagePattern(CountermeasurePattern.GetPaging)
  async getPaging(param: ServiceParam<PagingParam>) {
    const result = await this.service.getPaging(param.data);
    return result;
  }

  @MessagePattern(CountermeasurePattern.GetById)
  async getById(param: ServiceParam<string>) {
    const result = await this.service.getById(param.data);
    return result;
  }

  @MessagePattern(CountermeasurePattern.Create)
  async create(param: ServiceParam<Countermeasure>) {
    const result = await this.service.create(param.data);
    return result;
  }

  @MessagePattern(CountermeasurePattern.Update)
  async update(param: ServiceParam<Countermeasure>) {
    const result = await this.service.update(param.data);
    return result;
  }

  @MessagePattern(CountermeasurePattern.Delete)
  async delete(param: ServiceParam<string>) {
    const result = await this.service.delete(param.data);
    return result;
  }
}
