import { RmqOptions, Transport } from '@nestjs/microservices';
import { get } from 'env-var';

export const Config = {
  host: get('RABBITMQ_HOST').asString() || 'localhost',
  port: get('RABBITMQ_PORT').asIntPositive(),
  assetQueue: get('ASSET_QUEUE_NAME').asString(),
};

export const RabbitmqConfig = {
  assetQueue(): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${Config.host}`],
        queue: Config.assetQueue,
        queueOptions: {
          durable: true,
        },
      },
    };
  },
};
