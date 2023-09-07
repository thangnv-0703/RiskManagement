import { DeploymentScenarioPagingDto } from './../../api/dtos/deployment-scenario-paging.dto';
import { BaseServicePort } from '@libs/common/base';
import { DeploymentScenario } from '../domain/deployment-scenario';
import { PagingResponse } from '@libs/api-contract';
export interface DeploymentScenarioServicePort
  extends BaseServicePort<DeploymentScenario> {
  getPagingBySystemProfileId(
    param: DeploymentScenarioPagingDto
  ): Promise<PagingResponse<DeploymentScenario>>;
}
