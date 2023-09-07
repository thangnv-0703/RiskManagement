import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { DiToken } from '../di-token';
import { rabbitMqUrl, Config } from './config';
import { ACCOUNT_SERVICE } from '@libs/common/constant';

export const RabbitmqConfig = {
  accountQueue(): ClientProviderOptions {
    return {
      name: ACCOUNT_SERVICE,
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: Config.accountQueueName,
        queueOptions: {
          durable: true,
        },
      },
    };
  },

  categoryQueue(): ClientProviderOptions {
    return {
      name: DiToken.CategoryClientProxy,
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: Config.categoryQueueName,
        queueOptions: {
          durable: true,
        },
      },
    };
  },

  deploymentScenario(): ClientProviderOptions {
    return {
      name: DiToken.DeploymentScenarioClientProxy,
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: Config.deploymentScenarioQueueName,
        queueOptions: {
          durable: true,
        },
      },
    };
  },

  countermeasureQueue(): ClientProviderOptions {
    return {
      name: DiToken.CountermeasureClientProxy,
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: Config.countermeasureQueueName,
        queueOptions: {
          durable: true,
        },
      },
    };
  },

  systemProfileQueue(): ClientProviderOptions {
    return {
      name: DiToken.SystemProfileClientProxy,
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: Config.systemProfileQueueName,
        queueOptions: {
          durable: true,
        },
      },
    };
  },

  supplementAptRiskQueue(): ClientProviderOptions {
    return {
      name: DiToken.SupplementAptRiskClientProxy,
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: Config.supplementAptRiskQueueName,
        queueOptions: {
          durable: true,
        },
      },
    };
  },

  assessmentResultQueue(): ClientProviderOptions {
    return {
      name: DiToken.AssessmentResultClientProxy,
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: Config.assessmentResultQueueName,
        queueOptions: {
          durable: true,
        },
      },
    };
  },

  assetQueue(): ClientProviderOptions {
    return {
      name: DiToken.AssetClientProxy,
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: Config.assetQueueName,
        queueOptions: {
          durable: true,
        },
      },
    };
  },
};
