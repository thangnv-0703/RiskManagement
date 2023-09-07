import { ServiceParam, SystemProfilePattern } from '@libs/api-contract';
import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { DeploymentScenarioDIToken } from './di-token';
import { DeploymentScenarioServicePort } from '../core/application/interfaces';
import { SystemProfileDto } from './dtos/system-profile.dto';
import { CheckContextInterceptor } from '@libs/common/interceptors';

@UseInterceptors(CheckContextInterceptor)
@Controller()
export class SystemProfileEventHandler {
  constructor(
    @Inject(DeploymentScenarioDIToken.DeploymentScenarioService)
    readonly service: DeploymentScenarioServicePort
  ) {}

  @EventPattern(SystemProfilePattern.Updated)
  async updateSystemProfile(param: ServiceParam<SystemProfileDto>) {
    await this.service.updateSystemProfile(param.data);
  }

  @EventPattern(SystemProfilePattern.Deleted)
  async deleteBySystemProfile(param: ServiceParam<string>) {
    await this.service.deleteBySystemProfile(param.data);
  }
}
