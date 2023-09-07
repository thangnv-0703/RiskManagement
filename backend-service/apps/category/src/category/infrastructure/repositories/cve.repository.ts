import { InjectModel } from '@nestjs/mongoose';
import { Cve } from '../../core/domain/cve';
import { CveRepositoryPort } from '../../core/domain/cve.repository.port';
import { BaseRepository } from '@libs/common/base';
import { Model } from 'mongoose';

export class CveRepository
  extends BaseRepository<Cve>
  implements CveRepositoryPort
{
  constructor(@InjectModel(Cve.name) readonly collection: Model<Cve>) {
    super(collection);
  }

  async getCveByName(name: string): Promise<Cve[]> {
    const filter = {
      name: {
        $regex: `^${name}$`,
        $options: 'i',
      },
    };
    return await this.collection.find(filter);
  }

  async findCveByCpeName(cpeName: string): Promise<Cve[]> {
    return this.collection
      .find({
        cpe: {
          $in: [cpeName],
        },
      })
      .select('cve_id cwe_id description attackVector impact condition');
  }
}
