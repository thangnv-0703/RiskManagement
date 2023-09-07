import { BaseService } from '@libs/common/base';
import { IContextService } from '@libs/common/context';
import { Countermeasure } from '../domain/countermeasure';
import { CountermeasureRepositoryPort } from '../domain/countermeasure.repository.port';
import { CountermeasureServicePort } from './countermeasure.service.port';
import { Inject } from '@nestjs/common';
import { CountermeasureDIToken } from '../../api/di-token';

export class CountermeasureService
  extends BaseService<Countermeasure>
  implements CountermeasureServicePort
{
  constructor(
    @Inject(CountermeasureDIToken.CountermeasureRepository)
    readonly repo: CountermeasureRepositoryPort,
    @Inject(CountermeasureDIToken.ContextService)
    readonly contextService: IContextService
  ) {
    super(repo, contextService);
  }
}
