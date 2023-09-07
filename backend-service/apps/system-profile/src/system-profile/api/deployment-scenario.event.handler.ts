import { DeploymentScenarioPattern, ServiceParam } from '@libs/api-contract';
import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { DeploymentScenarioServicePort } from '../core/application/deployment-scenario.service.port';
import { DeploymentScenario } from '../core/domain/deployment-scenario';
import { SystemProfileDIToken } from './di-token';
import { CheckContextInterceptor } from '@libs/common/interceptors';

@UseInterceptors(CheckContextInterceptor)
@Controller()
export class DeploymentScenarioEventHandler {
  constructor(
    @Inject(SystemProfileDIToken.DeploymentScenarioService)
    readonly service: DeploymentScenarioServicePort
  ) {}

  @EventPattern(DeploymentScenarioPattern.DeploymentScenarioCreated)
  async create(param: ServiceParam<DeploymentScenario>) {
    const result = await this.service.create(param.data);
    return result;
  }

  @EventPattern(DeploymentScenarioPattern.DeploymentScenarioUpdated)
  async update(param: ServiceParam<DeploymentScenario>) {
    const result = await this.service.update(param.data);
    return result;
  }

  @EventPattern(DeploymentScenarioPattern.DeploymentScenarioDeleted)
  async delete(param: ServiceParam<DeploymentScenario>) {
    const result = await this.service.deleteData(param.data);
    return result;
  }
}
