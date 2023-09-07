import { BaseService } from '@libs/common/base';
import { IContextService } from '@libs/common/context';
import { Inject } from '@nestjs/common';
import { DeploymentScenarioDIToken } from '../../../api/di-token';
import { DeploymentScenarioRepositoryPort } from '../../domain/interfaces/deployment-scenario.repository.port';
import { AppliedCountermeasure } from '../../domain/documents';
import { AppliedCountermeasureServicePort } from '../interfaces/applied-countermeasure.service.port';
import { AppliedCountermeasureRepositoryPort } from '../../domain/interfaces/applied-countermeasure.repository.port';
import { PagingParam } from '@libs/api-contract';
import mongoose from 'mongoose';

export class AppliedCountermeasureService
  extends BaseService<AppliedCountermeasure>
  implements AppliedCountermeasureServicePort
{
  constructor(
    @Inject(DeploymentScenarioDIToken.AppliedCountermeasureRepository)
    readonly repo: AppliedCountermeasureRepositoryPort,
    @Inject(DeploymentScenarioDIToken.DeploymentScenarioRepository)
    readonly deploymentScenarioRepo: DeploymentScenarioRepositoryPort,
    @Inject(DeploymentScenarioDIToken.ContextService)
    readonly contextService: IContextService
  ) {
    super(repo, contextService);
    this.checkCreatedBy = false;
  }

  protected override async afterCreate(
    data: AppliedCountermeasure
  ): Promise<void> {
    await this.deploymentScenarioRepo.updateCountermeasure(data);
  }

  protected override async afterDelete(
    data: AppliedCountermeasure
  ): Promise<void> {
    await this.deploymentScenarioRepo.removeCountermeasure(data.id);
  }

  protected override addCustomFilter(param: PagingParam): void {
    const deploymentScenarioId = param.filter['deploymentScenarioId'];
    if (deploymentScenarioId) {
      param.filter = {
        deploymentScenario: new mongoose.Types.ObjectId(deploymentScenarioId),
      };
    }
  }
}
