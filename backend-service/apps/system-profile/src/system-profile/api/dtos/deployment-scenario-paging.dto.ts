import { PagingQueyDto } from '@libs/api-contract';

export class DeploymentScenarioPagingDto {
  systemProfileId: string;

  paging: PagingQueyDto;

  status: string;
}
