import { BaseRepositoryPort } from '@libs/common/base';
import { AssetCve } from '../documents';

export interface AssetCveRepositoryPort extends BaseRepositoryPort<AssetCve> {
  upsertAssetCve(filter: object, data: Partial<AssetCve>): Promise<AssetCve>;
}
