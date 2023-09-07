import { IsArray } from 'class-validator';

export class UpdateActiveCveDto {
  assetId: string;
  deploymentScenarioId: string;

  @IsArray()
  cves: string[];
}
