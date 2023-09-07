import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateAssetCpeDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  part: string;

  @IsOptional()
  @IsString()
  vendor: string;

  @IsOptional()
  @IsString()
  server: string;

  @IsOptional()
  @IsString()
  product: string;

  @IsOptional()
  @IsString()
  version: string;

  @IsString()
  @IsOptional()
  cpe: string;

  @IsOptional()
  @IsObject()
  customFields: object;

  @IsString()
  deploymentScenarioId: string;
}
