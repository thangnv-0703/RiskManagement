import { HttpAuthGuard } from '@libs/common/guard';
import { Get, Inject, Param, Query, UseGuards } from '@nestjs/common';
import { DeploymentScenarioPagingDto } from './dtos';
import { Serialize } from '@libs/common/interceptors';
import { ApiController } from '@libs/common/decorator';
import { SystemProfileDIToken } from './di-token';
import { DeploymentScenarioServicePort } from '../core/application/deployment-scenario.service.port';
import { PagingQueyDto } from '@libs/api-contract';
import { DeploymentScenarioDto } from './dtos/deployment-scenario.dto';
import { DeploymentScenarioStatus } from '../core/domain/deployment-scenario';

@UseGuards(HttpAuthGuard)
@Serialize(DeploymentScenarioDto)
@ApiController('system_profiles', 'Deployment scenario')
export class DeploymentScenarioController {
  constructor(
    @Inject(SystemProfileDIToken.DeploymentScenarioService)
    readonly service: DeploymentScenarioServicePort
  ) {}

  /**
   * Get paging a list of deployment scenario of system profile
   * @param id system profile id
   * @param queryParams query params
   * @param status deployment scenario status
   * @returns a list of deployment scenario of system profile
   */
  @Get(':id/deployment_scenarios')
  getPagingDeploymentScenario(
    @Param('id') id: string,
    @Query() queryParams: PagingQueyDto,
    @Query('status') status: DeploymentScenarioStatus
  ) {
    const param: DeploymentScenarioPagingDto = {
      paging: queryParams,
      systemProfileId: id,
      status: status,
    };
    return this.service.getPagingBySystemProfileId(param);
  }
}
