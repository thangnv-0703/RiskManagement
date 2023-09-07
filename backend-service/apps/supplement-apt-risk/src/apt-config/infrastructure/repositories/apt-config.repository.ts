import { InjectModel } from '@nestjs/mongoose';
import { AptConfig } from '../../core/domain/apt-config';
import { AptConfigRepositoryPort } from '../../core/domain/apt-config.repository.port';
import { BaseRepository } from '@libs/common/base';
import { Model } from 'mongoose';

export class AptConfigRepository
  extends BaseRepository<AptConfig>
  implements AptConfigRepositoryPort
{
  constructor(
    @InjectModel(AptConfig.name) readonly collection: Model<AptConfig>
  ) {
    super(collection);
  }

  async getAptConfigByName(name: string): Promise<AptConfig[]> {
    const filter = {
      name: {
        $regex: `^${name}$`,
        $options: 'i',
      },
    };
    return await this.collection.find(filter);
  }
}
