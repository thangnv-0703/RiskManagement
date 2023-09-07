import { BaseServicePort } from '@libs/common/base';
import { DeploymentScenario } from '../../domain/documents';
import {
  GetAssetActiveCveDto,
  SystemProfileDto,
  UpdateAssetCpeDto,
  GetAttackGraphDto,
  CveOnAttackGraphDto,
} from '../../../api/dtos';

export interface DeploymentScenarioServicePort
  extends BaseServicePort<DeploymentScenario> {
  createDeploymentScenario(data: DeploymentScenario): Promise<string>;
  updateAssetCpe(data: UpdateAssetCpeDto): Promise<void>;
  updateSystemProfile(data: SystemProfileDto): Promise<void>;
  deleteBySystemProfile(id: string): Promise<void>;
  getAssetActiveCve(id: string): Promise<GetAssetActiveCveDto>;
  getAttackGraph(id: string): Promise<GetAttackGraphDto>;
  saveAttackGraph(data: DeploymentScenario): Promise<boolean>;
  getAssetCveOnAttackGraph(id: string): Promise<CveOnAttackGraphDto[]>;
  getDeploymentScenarioDashboard(id: string): Promise<DeploymentScenario[]>;
}
