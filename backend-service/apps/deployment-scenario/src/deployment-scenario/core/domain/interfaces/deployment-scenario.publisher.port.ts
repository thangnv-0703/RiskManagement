import { DeploymentScenario } from '../documents';

export interface DeploymentScenarioPublisherPort {
  publishDeploymentScenarioCreated(data: DeploymentScenario): void;
  publishDeploymentScenarioUpdated(data: DeploymentScenario): void;
  publishDeploymentScenarioDeleted(data: DeploymentScenario): void;
}
