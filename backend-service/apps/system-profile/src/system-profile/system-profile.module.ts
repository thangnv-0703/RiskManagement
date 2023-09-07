import { Module } from '@nestjs/common';
import { SystemProfileService } from './core/application/system-profile.service';
import { SystemProfileRepository } from './infrastructure/repositories/system-profile.repository';
import {
  SystemProfile,
  SystemProfileSchema,
} from './core/domain/system-profile';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemProfileDIToken } from './api/di-token';
import { ContextService } from '@libs/common/context';
import { ClientsModule } from '@nestjs/microservices';
import { RabbitmqConfig } from '../configs/rabbimq.config';
import { DeploymentScenarioEventHandler } from './api/deployment-scenario.event.handler';
import {
  DeploymentScenario,
  DeploymentScenarioSchema,
} from './core/domain/deployment-scenario';
import { DeploymentScenarioService } from './core/application/deployment-scenario.service';
import { DeploymentScenarioRepository } from './infrastructure/repositories/deployment-scenario.repository';
import { SystemProfilePublisher } from './infrastructure/event-publishers/system-profile.publisher';
import { SystemProfileController } from './api/system-profile.controller';
import { DeploymentScenarioController } from './api/deployment-scenario.controller';
import { SystemProfileMessageHandler } from './api/system-profile.message.handler';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SystemProfile.name, schema: SystemProfileSchema },
      { name: DeploymentScenario.name, schema: DeploymentScenarioSchema },
    ]),
    ClientsModule.register([
      RabbitmqConfig.deploymnetScenarioQueue(),
      RabbitmqConfig.accountQueue(),
    ]),
  ],
  controllers: [
    SystemProfileController,
    SystemProfileMessageHandler,
    DeploymentScenarioEventHandler,
    DeploymentScenarioController,
  ],
  providers: [
    {
      provide: SystemProfileDIToken.SystemProfileService,
      useClass: SystemProfileService,
    },
    {
      provide: SystemProfileDIToken.SystemProfileRepository,
      useClass: SystemProfileRepository,
    },
    {
      provide: SystemProfileDIToken.DeploymentScenarioService,
      useClass: DeploymentScenarioService,
    },
    {
      provide: SystemProfileDIToken.DeploymentScenarioRepository,
      useClass: DeploymentScenarioRepository,
    },
    {
      provide: SystemProfileDIToken.ContextService,
      useClass: ContextService,
    },
    {
      provide: SystemProfileDIToken.SystemProfilePublisher,
      useClass: SystemProfilePublisher,
    },
  ],
})
export class SystemProfileModule {}
