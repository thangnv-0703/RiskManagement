import { Expose, Type } from 'class-transformer';
import { AssetCpeDto } from './asset-cpe.dto';

export class AssetActiveCveDto {
  @Expose()
  @Type(() => AssetCpeDto)
  assets: AssetCpeDto[];

  @Expose()
  active: Record<string, string[]>;
}
