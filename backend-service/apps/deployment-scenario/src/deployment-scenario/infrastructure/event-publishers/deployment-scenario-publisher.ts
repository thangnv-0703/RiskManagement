import { DeploymentScenarioEventDto } from './../../core/domain/event-data/deployment-scenario.event.dto';
import { Inject, Logger } from '@nestjs/common';
import { DeploymentScenarioDIToken } from '../../api/di-token';
import { DeploymentScenario } from '../../core/domain/documents';
import { DeploymentScenarioPublisherPort } from '../../core/domain/interfaces/deployment-scenario.publisher.port';
import { ClientProxy } from '@nestjs/microservices';
import { IContextService } from '@libs/common/context';
import { serializeObject } from '@libs/common/interceptors';
import { DeploymentScenarioPattern, ServiceParam } from '@libs/api-contract';
import { instanceToPlain } from 'class-transformer';

export class DeploymentScenarioPublisher
  implements DeploymentScenarioPublisherPort
{
  constructor(
    // @Inject(DeploymentScenarioDIToken.SystemProfileClientProxy)
    // readonly client: ClientProxy,
    @Inject(DeploymentScenarioDIToken.SystemProfileClientProxy)
    readonly systemProfileClient: ClientProxy,
    @Inject(DeploymentScenarioDIToken.AssetManagementClientProxy)
    readonly assetManagementClient: ClientProxy,
    @Inject(DeploymentScenarioDIToken.ContextService)
    readonly contextService: IContextService
  ) {}

  publishDeploymentScenarioCreated(data: DeploymentScenario): void {
    let eventData = serializeObject(DeploymentScenarioEventDto, data);
    const payload: ServiceParam<DeploymentScenarioEventDto> = {
      context: this.contextService.getContext(),
      data: eventData as DeploymentScenarioEventDto,
    };
    this.systemProfileClient.emit(
      DeploymentScenarioPattern.DeploymentScenarioCreated,
      payload
    );
    Logger.log(
      `event ${DeploymentScenarioPattern.DeploymentScenarioCreated} emitted`
    );

    // Emit event for asset management
    this.assetManagementClient.emit(
      DeploymentScenarioPattern.DeploymentScenarioCreated,
      payload
    );
    Logger.log(
      `event ${DeploymentScenarioPattern.DeploymentScenarioCreated} emitted for asset management`
    );
  }

  publishDeploymentScenarioUpdated(data: DeploymentScenario): void {
    let eventData = serializeObject(DeploymentScenarioEventDto, data);
    const payload: ServiceParam<DeploymentScenarioEventDto> = {
      context: this.contextService.getContext(),
      data: eventData as DeploymentScenarioEventDto,
    };
    this.systemProfileClient.emit(
      DeploymentScenarioPattern.DeploymentScenarioUpdated,
      payload
    );
    Logger.log(
      `event ${DeploymentScenarioPattern.DeploymentScenarioUpdated} emitted`
    );
  }

  publishDeploymentScenarioDeleted(data: DeploymentScenario): void {
    let eventData = serializeObject(DeploymentScenarioEventDto, data);
    const payload: ServiceParam<DeploymentScenarioEventDto> = {
      context: this.contextService.getContext(),
      data: eventData as DeploymentScenarioEventDto,
    };
    this.systemProfileClient.emit(
      DeploymentScenarioPattern.DeploymentScenarioDeleted,
      payload
    );
    Logger.log(
      `event ${DeploymentScenarioPattern.DeploymentScenarioDeleted} emitted`
    );
  }
}
