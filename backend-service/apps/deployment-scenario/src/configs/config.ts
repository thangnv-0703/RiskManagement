import { get } from 'env-var';
export const Config = {
  host: get('RABBITMQ_HOST').asString() || 'localhost',
  port: get('RABBITMQ_PORT').required().asIntPositive(),
  systemProfileQueue: get('SYSTEM_PROFILE_QUEUE_NAME').required().asString(),
  categoryQueue: get('CATEGORY_QUEUE_NAME').required().asString(),
  assetQueue: get('ASSET_QUEUE_NAME').required().asString(),
  deploymentScenarioQueue: get('DEPLOYMENT_SCENARIO_QUEUE_NAME')
    .required()
    .asString(),
  accountQueue: get('ACCOUNT_QUEUE_NAME').required().asString(),
  supplementAptRiskQueue: get('SUPPLEMENT_APT_RISK_QUEUE_NAME')
    .required()
    .asString(),
  coreServiceHost: get('CORE_SERVICE_HOST').asString() || 'localhost',
  coreServicePort: get('CORE_SERVICE_PORT').required().asIntPositive(),
};

export const CORE_SERVICE_URL = `http://${Config.coreServiceHost}:${Config.coreServicePort}`;
