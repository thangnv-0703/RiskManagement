export class AssetCpe {
  id: string;

  name: string;

  part: string;

  vendor: string;

  server: string;

  product: string;

  version: string;

  cpe: string;
}

export class GetAssetActiveCveDto {
  assets: AssetCpe[];

  active: Record<string, string[]>;
}
