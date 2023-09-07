import { get } from 'env-var';

export const Config = {
  rabbitMqHost: get('RABBITMQ_HOST').asString() || 'localhost',
  rabbitMqPort: get('RABBITMQ_PORT').required().asIntPositive(),
  user: get('RABBITMQ_DEFAULT_USER').asString(),
  password: get('RABBITMQ_DEFAULT_PASS').asString(),

  assetHost: get('ASSET_MANAGEMENT_SERVICE_HOST').asString() || 'localhost',
  assetPort: get('ASSET_MANAGEMENT_SERVICE_PORT').asIntPositive(),
  riskCoreHost: get('CORE_SERVICE_HOST').asString() || 'localhost',
  riskCorePort: get('CORE_SERVICE_PORT').asIntPositive(),
  accountHost: get('ACCOUNT_SERVICE_HOST').asString() || 'localhost',
  accountPort: get('ACCOUNT_SERVICE_PORT').asIntPositive(),
  categoryHost: get('CATEGORY_SERVICE_HOST').asString() || 'localhost',
  categoryPort: get('CATEGORY_SERVICE_PORT').asIntPositive(),
  deploymentScenarioHost:
    get('DEPLOYMENT_SCENARIO_SERVICE_HOST').asString() || 'localhost',
  deploymentScenarioPort: get(
    'DEPLOYMENT_SCENARIO_SERVICE_PORT'
  ).asIntPositive(),
  countermeasureHost:
    get('COUNTERMEASURE_SERVICE_HOST').asString() || 'localhost',
  countermeasurePort: get('COUNTERMEASURE_SERVICE_PORT').asIntPositive(),
  systemProfileHost:
    get('SYSTEM_PROFILE_SERVICE_HOST').asString() || 'localhost',
  systemProfilePort: get('SYSTEM_PROFILE_SERVICE_PORT').asIntPositive(),
  assessmentResultHost:
    get('ASSESSMENT_RESULT_SERVICE_HOST').asString() || 'localhost',
  assessmentResultPort: get('ASSESSMENT_RESULT_SERVICE_PORT').asIntPositive(),
  supplementAptRiskHost:
    get('SUPPLEMENT_APT_RISK_SERVICE_HOST').asString() || 'localhost',
  supplementAptRiskPort: get(
    'SUPPLEMENT_APT_RISK_SERVICE_PORT'
  ).asIntPositive(),

  accountQueueName: get('ACCOUNT_QUEUE_NAME').required().asString(),
  assetQueueName: get('ASSET_QUEUE_NAME').required().asString(),
  deploymentScenarioQueueName: get('DEPLOYMENT_SCENARIO_QUEUE_NAME')
    .required()
    .asString(),
  categoryQueueName: get('CATEGORY_QUEUE_NAME').required().asString(),
  countermeasureQueueName: get('COUNTERMEASURE_QUEUE_NAME')
    .required()
    .asString(),
  systemProfileQueueName: get('SYSTEM_PROFILE_QUEUE_NAME')
    .required()
    .asString(),
  assessmentResultQueueName: get('ASSESSMENT_RESULT_QUEUE_NAME')
    .required()
    .asString(),
  supplementAptRiskQueueName: get('SUPPLEMENT_APT_RISK_QUEUE_NAME')
    .required()
    .asString(),
};

export const rabbitMqUrl =
  Config.user && Config.password
    ? `amqp://${Config.user}:${Config.password}@${Config.rabbitMqHost}:${Config.rabbitMqPort}`
    : `amqp://${Config.rabbitMqHost}`;

export const ASSET_MANAGEMENT_SERVICE_URL = `http://${Config.assetHost}:${Config.assetPort}`;
export const CORE_SERVICE_URL = `http://${Config.riskCoreHost}:${Config.riskCorePort}`;
export const ACCOUNT_SERVICE_URL = `http://${Config.accountHost}:${Config.accountPort}`;
export const CATEGORY_SERVICE_URL = `http://${Config.categoryHost}:${Config.categoryPort}`;
export const DEPLOYMENT_SCENARIO_SERVICE_URL = `http://${Config.deploymentScenarioHost}:${Config.deploymentScenarioPort}`;
export const COUNTERMEASURE_SERVICE_URL = `http://${Config.countermeasureHost}:${Config.countermeasurePort}`;
export const SYSTEM_PROFILE_SERVICE_URL = `http://${Config.systemProfileHost}:${Config.systemProfilePort}`;
export const ASSESSMENT_RESULT_SERVICE_URL = `http://${Config.assessmentResultHost}:${Config.assessmentResultPort}`;
export const SUPPLEMENT_APT_RISK_SERVICE_URL = `http://${Config.supplementAptRiskHost}:${Config.supplementAptRiskPort}`;
