import { PagingQueyDto } from '@libs/api-contract';

export class CvesOnAssetPagingDto {
  deploymentScenarioId: string;

  assetId: string;

  paging: PagingQueyDto;
}
