import {
  ClientProviderOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { DeploymentScenarioDIToken } from '../deployment-scenario/api/di-token';
import { ACCOUNT_SERVICE } from '@libs/common/constant';
import { Config } from './config';

export const RabbitmqConfig = {
  deploymnetScenarioQueue(): RmqOptions {
    return {
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

  systemProfileQueue(): ClientProviderOptions {
    return {
      name: DeploymentScenarioDIToken.SystemProfileClientProxy,
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

  categoryQueue(): ClientProviderOptions {
    return {
      name: DeploymentScenarioDIToken.CategoryClientProxy,
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

  supplementAptRiskQueue(): ClientProviderOptions {
    return {
      name: DeploymentScenarioDIToken.SupplementAptRiskClientProxy,
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

  assetQueue(): ClientProviderOptions {
    return {
      name: DeploymentScenarioDIToken.AssetManagementClientProxy,
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${Config.host}:${Config.port}`],
        queue: Config.assetQueue,
        queueOptions: {
          durable: true,
        },
      },
    };
  },
};
