import { BaseService } from '@libs/common/base';
import { IContextService } from '@libs/common/context';
import { SystemProfile } from '../domain/system-profile';
import { SystemProfileRepositoryPort } from '../domain/system-profile.repository.port';
import { SystemProfileServicePort } from './system-profile.service.port';
import { Inject } from '@nestjs/common';
import { SystemProfileDIToken } from '../../api/di-token';
import { SystemProfilePublisherPort } from '../domain/system-profile.publisher.port';
import { DeploymentScenarioRepositoryPort } from '../domain/deployment-scenario.repository.port';
import mongoose from 'mongoose';

export class SystemProfileService
  extends BaseService<SystemProfile>
  implements SystemProfileServicePort
{
  constructor(
    @Inject(SystemProfileDIToken.SystemProfileRepository)
    readonly repo: SystemProfileRepositoryPort,
    @Inject(SystemProfileDIToken.SystemProfilePublisher)
    readonly publisher: SystemProfilePublisherPort,
    @Inject(SystemProfileDIToken.DeploymentScenarioRepository)
    readonly deploymentScenarioRepository: DeploymentScenarioRepositoryPort,
    @Inject(SystemProfileDIToken.ContextService)
    readonly contextService: IContextService
  ) {
    super(repo, contextService);
    this.checkCreatedBy = false;
  }

  protected override async afterUpdate(data: SystemProfile): Promise<void> {
    this.publisher.publishSystemProfileUpdated(data);
  }

  protected override async afterDelete(data: SystemProfile): Promise<void> {
    this.publisher.publishSystemProfileDeleted(data);
    await this.deploymentScenarioRepository.deleteMany({
      systemProfileId: new mongoose.Types.ObjectId(data.id),
    });
  }
}
