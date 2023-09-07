import { ACCOUNT_SERVICE } from '@libs/common/constant';
import {
  ClientProviderOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { get } from 'env-var';
import { AssessmentResultDIToken } from '../assessment-result/api/di-token';

export const Config = {
  host: get('RABBITMQ_HOST').asString() || 'localhost',
  port: get('RABBITMQ_PORT').required().asIntPositive(),
  assessmentResultQueue: get('ASSESSMENT_RESULT_QUEUE_NAME')
    .required()
    .asString(),
  accountQueue: get('ACCOUNT_QUEUE_NAME').required().asString(),
  supplementAptRiskQueue: get('SUPPLEMENT_APT_RISK_QUEUE_NAME')
    .required()
    .asString(),
  deploymentScenarioQueue: get('DEPLOYMENT_SCENARIO_QUEUE_NAME')
    .required()
    .asString(),
  coreServiceHost: get('CORE_SERVICE_HOST').asString() || 'localhost',
  coreServicePort: get('CORE_SERVICE_PORT').required().asIntPositive(),
};

export const CORE_SERVICE_URL = `http://${Config.coreServiceHost}:${Config.coreServicePort}`;

export const RabbitmqConfig = {
  assessmentResultQueue(): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${Config.host}`],
        queue: Config.assessmentResultQueue,
        queueOptions: {
          durable: true,
        },
      },
    };
  },

  accountQueue(): ClientProviderOptions {
    return {
      name: ACCOUNT_SERVICE,
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${Config.host}`],
        queue: Config.accountQueue,
        queueOptions: {
          durable: true,
        },
      },
    };
  },

  supplementAptRiskQueue(): ClientProviderOptions {
    return {
      name: AssessmentResultDIToken.SupplementAptRiskClientProxy,
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${Config.host}`],
        queue: Config.supplementAptRiskQueue,
        queueOptions: {
          durable: true,
        },
      },
    };
  },

  deploymentScenarioQueue(): ClientProviderOptions {
    return {
      name: AssessmentResultDIToken.DeploymentScenarioClientProxy,
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${Config.host}`],
        queue: Config.deploymentScenarioQueue,
        queueOptions: {
          durable: true,
        },
      },
    };
  },
};
