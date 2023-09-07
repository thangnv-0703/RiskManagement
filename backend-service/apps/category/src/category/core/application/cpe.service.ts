import { BaseService } from '@libs/common/base';
import { IContextService } from '@libs/common/context';
import { Cpe } from '../domain/cpe';
import { CpeRepositoryPort } from '../domain/cpe.repository.port';
import { CpeServicePort } from './cpe.service.port';
import { Inject } from '@nestjs/common';
import { CategoryDIToken } from '../../api/di-token';
import { PagingParam } from '@libs/api-contract';

export class CpeService extends BaseService<Cpe> implements CpeServicePort {
  constructor(
    @Inject(CategoryDIToken.CpeRepository) readonly repo: CpeRepositoryPort,
    @Inject(CategoryDIToken.ContextService)
    readonly contextService: IContextService
  ) {
    super(repo, contextService);
    this.checkCreatedBy = false;
  }

  async getCpeByKeyword(keyword: string): Promise<Cpe[]> {
    const delimiterPattern: RegExp = /[, _\-!?:]+/; // Regular expression pattern for delimiters
    const words: string[] = keyword.toLowerCase().split(delimiterPattern);
    const filter: PagingParam = {
      filter: {
        title: { $all: words },
      },
    };
    return (await this.repo.findAllPaging(filter)).data;
  }
}
