import { BaseRepositoryPort } from '@libs/common/base';
import {
  AppliedCountermeasure,
  Attacker,
  DeploymentScenario,
} from '../documents';
import { UpdateAssetCpeDto } from '../../../api/dtos';

export interface DeploymentScenarioRepositoryPort
  extends BaseRepositoryPort<DeploymentScenario> {
  getDeploymentScenarioDetail(name: string): Promise<DeploymentScenario>;

  updateAttacker(attacker: Attacker): Promise<DeploymentScenario>;

  removeAttacker(attackerId: string): Promise<boolean>;

  updateCountermeasure(
    countermeasure: AppliedCountermeasure
  ): Promise<DeploymentScenario>;

  removeCountermeasure(countermeasureId: string): Promise<boolean>;

  updateAssetCpe(data: UpdateAssetCpeDto): Promise<void>;

  updateEmptyAttackGraph(deploymentScenarioId: string): Promise<boolean>;

  updateCve(
    deploymentScenarioId: string,
    assetCveId: string
  ): Promise<DeploymentScenario>;

  getDeploymentScenarioDashboard(
    condition: object
  ): Promise<DeploymentScenario[]>;
}
