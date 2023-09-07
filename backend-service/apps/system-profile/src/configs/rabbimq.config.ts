import {
  ClientProviderOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { SystemProfileDIToken } from '../system-profile/api/di-token';
import { get } from 'env-var';
import { ACCOUNT_SERVICE } from '@libs/common/constant';

export const Config = {
  host: get('RABBITMQ_HOST').asString() || 'localhost',
  port: get('RABBITMQ_PORT').required().asIntPositive(),
  systemProfileQueue: get('SYSTEM_PROFILE_QUEUE_NAME').required().asString(),
  deploymentScenarioQueue: get('DEPLOYMENT_SCENARIO_QUEUE_NAME')
    .required()
    .asString(),
  accountQueue: get('ACCOUNT_QUEUE_NAME').required().asString(),
};

export const RabbitmqConfig = {
  systemProfileQueue(): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${Config.host}`],
        queue: Config.systemProfileQueue,
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

  deploymnetScenarioQueue(): ClientProviderOptions {
    return {
      name: SystemProfileDIToken.DeploymentScenarioClientProxy,
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
