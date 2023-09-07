import { BaseService } from '@libs/common/base';
import { IContextService } from '@libs/common/context';
import { Cve } from '../domain/cve';
import { CveRepositoryPort } from '../domain/cve.repository.port';
import { CveServicePort } from './cve.service.port';
import { Inject } from '@nestjs/common';
import { CategoryDIToken } from '../../api/di-token';

export class CveService extends BaseService<Cve> implements CveServicePort {
  constructor(
    @Inject(CategoryDIToken.CveRepository) readonly repo: CveRepositoryPort,
    @Inject(CategoryDIToken.ContextService)
    readonly contextService: IContextService
  ) {
    super(repo, contextService);
    this.checkCreatedBy = false;
  }

  async getCveByCpeName(cpeName: string): Promise<Cve[]> {
    const result = await this.repo.findCveByCpeName(cpeName);
    return result;
  }

  async getCvebyCveId(cveId: string): Promise<Cve> {
    const result = await this.repo.findByCondition({
      cve_id: cveId,
    });
    return result.length > 0 ? result[0] : null;
  }
}
