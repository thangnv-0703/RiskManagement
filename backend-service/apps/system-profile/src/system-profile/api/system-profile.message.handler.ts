import {
  SystemProfilePattern,
  PagingParam,
  ServiceParam,
} from '@libs/api-contract';
import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { SystemProfileServicePort } from '../core/application/system-profile.service.port';
import { SystemProfile } from '../core/domain/system-profile';
import { SystemProfileDIToken } from './di-token';
import { MessagePattern } from '@nestjs/microservices';
import { DeploymentScenarioPagingDto } from './dtos';
import { DeploymentScenarioServicePort } from '../core/application/deployment-scenario.service.port';
import { CheckContextInterceptor } from '@libs/common/interceptors';

@UseInterceptors(CheckContextInterceptor)
@Controller('system-profile')
export class SystemProfileMessageHandler {
  constructor(
    @Inject(SystemProfileDIToken.SystemProfileService)
    readonly service: SystemProfileServicePort,
    @Inject(SystemProfileDIToken.DeploymentScenarioService)
    readonly deploymentScenarioService: DeploymentScenarioServicePort
  ) {}

  @MessagePattern(SystemProfilePattern.GetPaging)
  async getPaging(param: ServiceParam<PagingParam>) {
    const result = await this.service.getPaging(param.data);
    return result;
  }

  @MessagePattern(SystemProfilePattern.GetById)
  async getById(param: ServiceParam<string>) {
    const result = await this.service.getById(param.data);
    return result;
  }

  @MessagePattern(SystemProfilePattern.GetPagingDeploymentScenario)
  async getPagingDeploymentScenario(
    param: ServiceParam<DeploymentScenarioPagingDto>
  ) {
    const result =
      await this.deploymentScenarioService.getPagingBySystemProfileId(
        param.data
      );
    return result;
  }

  @MessagePattern(SystemProfilePattern.Create)
  async create(param: ServiceParam<SystemProfile>) {
    const result = await this.service.create(param.data);
    return result;
  }

  @MessagePattern(SystemProfilePattern.Update)
  async update(param: ServiceParam<SystemProfile>) {
    const result = await this.service.update(param.data);
    return result;
  }

  @MessagePattern(SystemProfilePattern.Delete)
  async delete(param: ServiceParam<string>) {
    const result = await this.service.delete(param.data);
    return result;
  }
}
