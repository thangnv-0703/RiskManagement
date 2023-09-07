import { DeploymentScenarioPublisher } from './infrastructure/event-publishers/deployment-scenario-publisher';
import { Module } from '@nestjs/common';
import { ContextService } from '@libs/common/context';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DeploymentScenario,
  DeploymentScenarioSchema,
} from './core/domain/documents/deployment-scenario';
import { DeploymentScenarioDIToken } from './api/di-token';
import { DeploymentScenarioService } from './core/application/implementations/deployment-scenario.service';
import { DeploymentScenarioRepository } from './infrastructure/repositories/deployment-scenario.repository';
import { DeploymentScenarioMessageHandler } from './api/deployment-scenario.message.handler';
import { Attacker, AttackerSchema } from './core/domain/documents/attacker';
import { AttackerService } from './core/application/implementations/attacker.service';
import { AttackerRepository } from './infrastructure/repositories/attacker.repository';
import { AppliedCountermeasureRepository } from './infrastructure/repositories/applied-countermeasure.repository';
import {
  AppliedCountermeasure,
  AppliedCountermeasureSchema,
  AssetCve,
  AssetCveSchema,
} from './core/domain/documents';
import { AppliedCountermeasureService } from './core/application/implementations';
import { AssetCveService } from './core/application/implementations/asset-cve.service';
import { AssetCveRepository } from './infrastructure/repositories/asset-cve.repository';
import { ClientsModule } from '@nestjs/microservices';
import { RabbitmqConfig } from '../configs/rabbimq.config.service';
import { SystemProfileEventHandler } from './api/system-profile.event.handler';
import { DeploymentScenarioController } from './api/deployment-scenario.controller';
import { AttackerController } from './api/attacker.controller';
import { AppliedCountermeasureController } from './api/applied-countermeasure.controller';
import { AssetCveController } from './api/asset-cve.controller';
import { RiskCoreController } from './api/risk-core.controller';
import { RiskCoreService } from './core/application/implementations/risk-core.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeploymentScenario.name, schema: DeploymentScenarioSchema },
      { name: Attacker.name, schema: AttackerSchema },
      { name: AppliedCountermeasure.name, schema: AppliedCountermeasureSchema },
      { name: AssetCve.name, schema: AssetCveSchema },
    ]),
    ClientsModule.register([
      RabbitmqConfig.systemProfileQueue(),
      RabbitmqConfig.categoryQueue(),
      RabbitmqConfig.assetQueue(),
      RabbitmqConfig.accountQueue(),
      RabbitmqConfig.supplementAptRiskQueue(),
    ]),
    HttpModule,
  ],
  controllers: [
    DeploymentScenarioController,
    AttackerController,
    AppliedCountermeasureController,
    AssetCveController,
    RiskCoreController,
    DeploymentScenarioMessageHandler,
    SystemProfileEventHandler,
  ],
  providers: [
    {
      provide: DeploymentScenarioDIToken.DeploymentScenarioService,
      useClass: DeploymentScenarioService,
    },
    {
      provide: DeploymentScenarioDIToken.DeploymentScenarioRepository,
      useClass: DeploymentScenarioRepository,
    },
    {
      provide: DeploymentScenarioDIToken.AttackerService,
      useClass: AttackerService,
    },
    {
      provide: DeploymentScenarioDIToken.AttackerRepository,
      useClass: AttackerRepository,
    },
    {
      provide: DeploymentScenarioDIToken.AppliedCountermeasureService,
      useClass: AppliedCountermeasureService,
    },
    {
      provide: DeploymentScenarioDIToken.AppliedCountermeasureRepository,
      useClass: AppliedCountermeasureRepository,
    },
    {
      provide: DeploymentScenarioDIToken.AssetCveService,
      useClass: AssetCveService,
    },
    {
      provide: DeploymentScenarioDIToken.AssetCveRepository,
      useClass: AssetCveRepository,
    },
    {
      provide: DeploymentScenarioDIToken.RiskCoreService,
      useClass: RiskCoreService,
    },
    {
      provide: DeploymentScenarioDIToken.DeploymentScenarioPublisher,
      useClass: DeploymentScenarioPublisher,
    },
    {
      provide: DeploymentScenarioDIToken.ContextService,
      useClass: ContextService,
    },
  ],
})
export class DeploymentScenarioModule {}
