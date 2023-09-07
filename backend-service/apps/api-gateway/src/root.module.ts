import { ContextService } from '@libs/common/context';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import { HelperController } from './helper.controller';
import { AssetManagementServiceProxy } from './services/asset-management-service.proxy';
import { SystemProfileServiceProxy } from './services/system-profile-service.proxy';
import { CountermeasureServiceProxy } from './services/countermeasure-service.proxy';
import { AccountServiceProxy } from './services/account-service.proxy';
import { CategoryServiceProxy } from './services/category-service.proxy';
import { DeploymentScenarioServiceProxy } from './services/deployment-scenario-service.proxy';
import { SupplementAptRiskServiceProxy } from './services/supplement-apt-risk-service.proxy';
import { AssessmentResultServiceProxy } from './services/assessment-result-service.proxy';
import { CONTEXT_SERVICE } from '@libs/common/constant';
import { RabbitmqConfig } from './configs/rabbitmq.config.service';

@Module({
  imports: [
    HttpModule,
    ClientsModule.register([
      RabbitmqConfig.accountQueue(),
      RabbitmqConfig.assetQueue(),
      RabbitmqConfig.categoryQueue(),
      RabbitmqConfig.deploymentScenario(),
      RabbitmqConfig.countermeasureQueue(),
      RabbitmqConfig.systemProfileQueue(),
      RabbitmqConfig.assessmentResultQueue(),
      RabbitmqConfig.supplementAptRiskQueue(),
    ]),
  ],
  providers: [
    {
      provide: CONTEXT_SERVICE,
      useClass: ContextService,
    },
  ],
  controllers: [HelperController],
})
export class RootModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccountServiceProxy)
      .forRoutes(
        { path: 'admin/users/*', method: RequestMethod.ALL },
        { path: 'login', method: RequestMethod.ALL },
        { path: 'logout', method: RequestMethod.ALL },
        { path: 'current_user', method: RequestMethod.ALL }
      );

    consumer
      .apply(AssessmentResultServiceProxy)
      .forRoutes(
        { path: 'assessment_result/*', method: RequestMethod.ALL },
        { path: 'assessment_result', method: RequestMethod.ALL }
      );

    consumer
      .apply(SystemProfileServiceProxy)
      .forRoutes(
        { path: 'system_profiles/*', method: RequestMethod.ALL },
        { path: 'system_profiles', method: RequestMethod.ALL }
      );

    consumer
      .apply(CountermeasureServiceProxy)
      .forRoutes(
        { path: 'countermeasures/*', method: RequestMethod.ALL },
        { path: 'countermeasures', method: RequestMethod.ALL }
      );

    consumer
      .apply(DeploymentScenarioServiceProxy)
      .forRoutes(
        { path: 'deployment_scenarios/*', method: RequestMethod.ALL },
        { path: 'deployment_scenarios', method: RequestMethod.ALL }
      );

    consumer
      .apply(SupplementAptRiskServiceProxy)
      .forRoutes(
        { path: 'supplement_apt_risk/*', method: RequestMethod.ALL },
        { path: 'supplement_apt_risk', method: RequestMethod.ALL }
      );

    consumer
      .apply(CategoryServiceProxy)
      .forRoutes(
        { path: 'cves/*', method: RequestMethod.ALL },
        { path: 'cves', method: RequestMethod.ALL },
        { path: 'cpes/*', method: RequestMethod.ALL },
        { path: 'cpes', method: RequestMethod.ALL },
        { path: 'cwes/*', method: RequestMethod.ALL },
        { path: 'cwes', method: RequestMethod.ALL }
      );

    consumer
      .apply(AssetManagementServiceProxy)
      .forRoutes({ path: 'asset/*', method: RequestMethod.ALL });
  }
}
