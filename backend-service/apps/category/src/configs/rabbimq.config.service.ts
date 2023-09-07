import {
  ClientProviderOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { get } from 'env-var';
import { CategoryDIToken } from '../category/api/di-token';
import { ACCOUNT_SERVICE } from '@libs/common/constant';

export const Config = {
  host: get('RABBITMQ_HOST').asString() || 'localhost',
  port: get('RABBITMQ_PORT').required().asIntPositive(),
  categoryQueue: get('CATEGORY_QUEUE_NAME').required().asString(),
  deploymentScenarioQueue: get('DEPLOYMENT_SCENARIO_QUEUE_NAME')
    .required()
    .asString(),
  accountQueue: get('ACCOUNT_QUEUE_NAME').required().asString(),
};

export const RabbitmqConfig = {
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

  categoryQueue(): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${Config.host}`],
        queue: Config.categoryQueue,
        queueOptions: {
          durable: true,
        },
      },
    };
  },
};
