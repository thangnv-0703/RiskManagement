export enum DeploymentScenarioPattern {
  DeploymentScenarioCreated = 'deployment-scenario-created',
  DeploymentScenarioUpdated = 'deployment-scenario-updated',
  DeploymentScenarioDeleted = 'deployment-scenario-deleted',

  CreateDeploymentScenario = 'create-deployment-scenario',
  GetPagingDeploymentScenario = 'get-paging-deployment-scenario',
  GetByIdDeploymentScenario = 'get-deployment-scenario-by-id',
  UpdateDeploymentScenario = 'update-deployment-scenario',
  DeleteDeploymentScenario = 'delete-deployment-scenario',
  GetDeploymentScenarioDashboard = 'get-deployment-scenario-dashboard',

  CreateAttacker = 'create-attacker',
  GetPagingAttacker = 'get-paging-attacker',
  UpdateAttacker = 'update-attacker',
  DeleteAttacker = 'delete-attacker',

  CreateCountermeasure = 'create-countermeasure',
  GetPagingCountermeasure = 'get-paging-countermeasure',
  UpdateCountermeasure = 'update-countermeasure',
  DeleteCountermeasure = 'delete-countermeasure',

  AssignCpeToAsset = 'assign-cpe-to-asset',
  AssignCveOnAsset = 'assign-cve-on-asset',
  GetPagingCveOnAsset = 'get-paging-cve-on-asset',
  GetAssetActiveCve = 'get-asset-active-cve',
  GetActiveCve = 'get-active-cve-on-asset',
  UpdateCveOnAsset = 'update-cve-on-asset',
  UpdateActiveCve = 'update-active-cve',

  GetAttackGraph = 'get-attack-graph',
  SaveAttackGraph = 'save-attack-graph',
  GetAssetCveOnAttackGraph = 'get-cve-on-attack-graph',
  GenerateCoordinates = 'generate-coordinates',
}
