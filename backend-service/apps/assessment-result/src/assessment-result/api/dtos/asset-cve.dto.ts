import { Expose, Type } from 'class-transformer';

export class CveOnAssetDto {
  @Expose()
  cve_id: string;

  @Expose()
  cwe_id: string;

  @Expose()
  description: string;

  @Expose()
  impact: object;

  @Expose()
  attackVector: string;

  @Expose()
  condition: object;
}

export class AssetCveDto {
  @Expose()
  assetId: string;

  @Expose()
  @Type(() => CveOnAssetDto)
  cves: CveOnAssetDto[];

  @Expose()
  active: string[];
}
