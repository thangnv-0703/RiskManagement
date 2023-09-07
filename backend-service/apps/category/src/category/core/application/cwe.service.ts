import { BaseService } from '@libs/common/base';
import { IContextService } from '@libs/common/context';
import { Cwe } from '../domain/cwe';
import { CweRepositoryPort } from '../domain/cwe.repository.port';
import { CweServicePort } from './cwe.service.port';
import { Inject } from '@nestjs/common';
import { CategoryDIToken } from '../../api/di-token';

export class CweService extends BaseService<Cwe> implements CweServicePort {
  constructor(
    @Inject(CategoryDIToken.CweRepository) readonly repo: CweRepositoryPort,
    @Inject(CategoryDIToken.ContextService)
    readonly contextService: IContextService
  ) {
    super(repo, contextService);
    this.checkCreatedBy = false;
  }

  async getCwebyCweId(cweId: string): Promise<Cwe> {
    const result = await this.repo.findByCondition({
      cwe_id: cweId,
    });
    return result.length > 0 ? result[0] : null;
  }
}
