import { Expose } from 'class-transformer';

export class AssetCpeDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  part: string;

  @Expose()
  vendor: string;

  @Expose()
  product: string;

  @Expose()
  version: string;

  @Expose()
  cpe: string;

  @Expose()
  customFields: object;
}
