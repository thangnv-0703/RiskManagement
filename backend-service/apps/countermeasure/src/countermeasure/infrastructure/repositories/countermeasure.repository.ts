import { InjectModel } from '@nestjs/mongoose';
import { Countermeasure } from '../../core/domain/countermeasure';
import { CountermeasureRepositoryPort } from '../../core/domain/countermeasure.repository.port';
import { BaseRepository } from '@libs/common/base';
import { Model } from 'mongoose';

export class CountermeasureRepository
  extends BaseRepository<Countermeasure>
  implements CountermeasureRepositoryPort
{
  constructor(
    @InjectModel(Countermeasure.name) readonly collection: Model<Countermeasure>
  ) {
    super(collection);
  }
}
