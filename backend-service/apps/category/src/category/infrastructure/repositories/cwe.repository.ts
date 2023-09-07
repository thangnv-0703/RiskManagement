import { InjectModel } from '@nestjs/mongoose';
import { Cwe } from '../../core/domain/cwe';
import { CweRepositoryPort } from '../../core/domain/cwe.repository.port';
import { BaseRepository } from '@libs/common/base';
import { Model } from 'mongoose';

export class CweRepository
  extends BaseRepository<Cwe>
  implements CweRepositoryPort
{
  constructor(@InjectModel(Cwe.name) readonly collection: Model<Cwe>) {
    super(collection);
  }

  async getCweByName(name: string): Promise<Cwe[]> {
    const filter = {
      name: {
        $regex: `^${name}$`,
        $options: 'i',
      },
    };
    return await this.collection.find(filter);
  }
}
