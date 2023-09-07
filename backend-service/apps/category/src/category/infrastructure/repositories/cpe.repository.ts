import { InjectModel } from '@nestjs/mongoose';
import { Cpe } from '../../core/domain/cpe';
import { CpeRepositoryPort } from '../../core/domain/cpe.repository.port';
import { BaseRepository } from '@libs/common/base';
import { Model } from 'mongoose';

export class CpeRepository
  extends BaseRepository<Cpe>
  implements CpeRepositoryPort
{
  constructor(@InjectModel(Cpe.name) readonly collection: Model<Cpe>) {
    super(collection);
  }

  async getCpeByName(name: string): Promise<Cpe[]> {
    const filter = {
      name: {
        $regex: `^${name}$`,
        $options: 'i',
      },
    };
    return await this.collection.find(filter);
  }
}
