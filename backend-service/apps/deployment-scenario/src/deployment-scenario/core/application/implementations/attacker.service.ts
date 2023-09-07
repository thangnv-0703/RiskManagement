import { BaseService } from '@libs/common/base';
import { IContextService } from '@libs/common/context';
import { Inject } from '@nestjs/common';
import { Attacker } from '../../domain/documents';
import { AttackerServicePort } from '../interfaces/attacker.service.port';
import { AttackerRepositoryPort } from '../../domain/interfaces/attacker.repository.port';
import { DeploymentScenarioDIToken } from '../../../api/di-token';
import { DeploymentScenarioRepositoryPort } from '../../domain/interfaces/deployment-scenario.repository.port';
import { PagingParam } from '@libs/api-contract';
import mongoose from 'mongoose';

export class AttackerService
  extends BaseService<Attacker>
  implements AttackerServicePort
{
  constructor(
    @Inject(DeploymentScenarioDIToken.AttackerRepository)
    readonly repo: AttackerRepositoryPort,
    @Inject(DeploymentScenarioDIToken.DeploymentScenarioRepository)
    readonly deploymentScenarioRepo: DeploymentScenarioRepositoryPort,
    @Inject(DeploymentScenarioDIToken.ContextService)
    readonly contextService: IContextService
  ) {
    super(repo, contextService);
    this.checkCreatedBy = false;
  }

  protected override async afterCreate(data: Attacker): Promise<void> {
    await this.deploymentScenarioRepo.updateAttacker(data);
  }

  protected async afterUpdate(data: Attacker): Promise<void> {
    await this.deploymentScenarioRepo.updateAttacker(data);
  }

  protected override async afterDelete(data: Attacker): Promise<void> {
    await this.deploymentScenarioRepo.removeAttacker(data.id);
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
