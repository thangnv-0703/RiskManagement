import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@libs/common/base';
import { Model } from 'mongoose';
import { DeploymentScenario } from '../../core/domain/deployment-scenario';
import { DeploymentScenarioRepositoryPort } from '../../core/domain/deployment-scenario.repository.port';

export class DeploymentScenarioRepository
  extends BaseRepository<DeploymentScenario>
  implements DeploymentScenarioRepositoryPort
{
  constructor(
    @InjectModel(DeploymentScenario.name)
    readonly collection: Model<DeploymentScenario>
  ) {
    super(collection);
  }
}
