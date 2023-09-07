import { RmqOptions, Transport } from '@nestjs/microservices';
import { get } from 'env-var';

export const Config = {
  host: get('RABBITMQ_HOST').asString() || 'localhost',
  port: get('RABBITMQ_PORT').required().asIntPositive(),
  accountQueue: get('ACCOUNT_QUEUE_NAME').required().asString(),
  // rabbitmqUser: get('RABBITMQ_DEFAULT_USER').required().asString(),
  // rabbitmqPassword: get('RABBITMQ_DEFAULT_PASS').required().asString(),
};

export const RabbitmqConfig = {
  accountQueue(): RmqOptions {
    return {
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
