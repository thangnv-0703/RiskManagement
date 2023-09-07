import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@libs/common/base';
import { Model, UpdateQuery } from 'mongoose';
import { AssetCve } from '../../core/domain/documents';
import { AssetCveRepositoryPort } from '../../core/domain/interfaces';

export class AssetCveRepository
  extends BaseRepository<AssetCve>
  implements AssetCveRepositoryPort
{
  constructor(
    @InjectModel(AssetCve.name)
    readonly collection: Model<AssetCve>
  ) {
    super(collection);
  }

  async upsertAssetCve(
    filter: object,
    data: Partial<AssetCve>
  ): Promise<AssetCve> {
    const assetCve = await this.collection.findOne(filter);
    if (assetCve) {
      const cveUpdates = data.cves.map((cve) => cve.cve_id);
      for (let i = 0; i < assetCve.cves.length; i++) {
        if (cveUpdates.includes(assetCve.cves[i].cve_id)) {
          assetCve.cves[i] = data.cves.find(
            (cveUpdate) => cveUpdate.cve_id === assetCve.cves[i].cve_id
          );
        }
      }
      const updateQuery: UpdateQuery<AssetCve> = {
        $set: {
          cves: assetCve.cves,
          active: data.active,
        },
      };
      const updated = await this.collection.findOneAndUpdate(
        filter,
        updateQuery,
        {
          new: true,
        }
      );
      return updated;
    } else {
      const created = await this.collection.create(data);
      return created;
    }
  }
}
