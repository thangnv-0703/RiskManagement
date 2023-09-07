import { ClientProxy } from '@nestjs/microservices';
import { SystemProfileDIToken } from '../../api/di-token';
import { SystemProfile } from '../../core/domain/system-profile';
import { SystemProfilePublisherPort } from '../../core/domain/system-profile.publisher.port';
import { IContextService } from '@libs/common/context';
import { Inject, Logger } from '@nestjs/common';
import { ServiceParam, SystemProfilePattern } from '@libs/api-contract';

export class SystemProfilePublisher implements SystemProfilePublisherPort {
  constructor(
    @Inject(SystemProfileDIToken.DeploymentScenarioClientProxy)
    readonly client: ClientProxy,
    @Inject(SystemProfileDIToken.ContextService)
    readonly contextService: IContextService
  ) {}

  publishSystemProfileUpdated(data: SystemProfile): void {
    const payload: ServiceParam<SystemProfile> = {
      context: this.contextService.getContext(),
      data: data,
    };
    this.client.emit(SystemProfilePattern.Updated, payload);
    Logger.log(`event ${SystemProfilePattern.Updated} emitted`);
  }

  publishSystemProfileDeleted(data: SystemProfile): void {
    const payload: ServiceParam<SystemProfile> = {
      context: this.contextService.getContext(),
      data: data,
    };
    this.client.emit(SystemProfilePattern.Deleted, payload);
    Logger.log(`event ${SystemProfilePattern.Deleted} emitted`);
  }
}
