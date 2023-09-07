import { ACCOUNT_SERVICE } from '@libs/common/constant';
import {
  ClientProviderOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { get } from 'env-var';

export const Config = {
  host: get('RABBITMQ_HOST').asString() || 'localhost',
  port: get('RABBITMQ_PORT').required().asIntPositive(),
  countermeasureQueue: get('COUNTERMEASURE_QUEUE_NAME').required().asString(),
  accountQueue: get('ACCOUNT_QUEUE_NAME').required().asString(),
};

export const RabbitmqConfig = {
  countermeasureQueue(): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${Config.host}`],
        queue: Config.countermeasureQueue,
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
};
