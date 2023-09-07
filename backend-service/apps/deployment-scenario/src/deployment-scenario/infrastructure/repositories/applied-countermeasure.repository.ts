import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@libs/common/base';
import { Model } from 'mongoose';
import { AppliedCountermeasure } from '../../core/domain/documents';
import { AppliedCountermeasureRepositoryPort } from '../../core/domain/interfaces';

export class AppliedCountermeasureRepository
  extends BaseRepository<AppliedCountermeasure>
  implements AppliedCountermeasureRepositoryPort
{
  constructor(
    @InjectModel(AppliedCountermeasure.name)
    readonly collection: Model<AppliedCountermeasure>
  ) {
    super(collection);
  }
}
