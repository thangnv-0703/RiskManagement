import { BaseService } from '@libs/common/base';
import { IContextService } from '@libs/common/context';
import { AptConfig } from '../domain/apt-config';
import { AptConfigRepositoryPort } from '../domain/apt-config.repository.port';
import { AptConfigServicePort } from './apt-config.service.port';
import { Inject } from '@nestjs/common';
import { AptConfigDIToken } from '../../api/di-token';
import { defaultAptConfig } from '../domain/default-apt-config';

export class AptConfigService
  extends BaseService<AptConfig>
  implements AptConfigServicePort
{
  constructor(
    @Inject(AptConfigDIToken.AptConfigRepository)
    readonly repo: AptConfigRepositoryPort,
    @Inject(AptConfigDIToken.ContextService)
    readonly contextService: IContextService
  ) {
    super(repo, contextService);
  }

  async getConfig(): Promise<AptConfig> {
    const userId = this.contextService.getContext().id;
    const result = await this.repo.findByCondition({ userId: userId });
    if (result.length === 0) {
      return defaultAptConfig as AptConfig;
    }
    return result[0];
  }
  async saveConfig(config: AptConfig): Promise<boolean> {
    const result = await this.repo.upsert({ userId: config.userId }, config);
    return result;
  }
}
