import { IsNumber, IsString } from 'class-validator';
import { DeploymentScenarioDto } from './deployment-scenario.dto';

export class DetectThreatDto {
  @IsString()
  assetId: string;

  @IsString()
  cveId: string;

  @IsNumber()
  observerProbability: number;

  deploymentScenarioId: string;

  deploymentScenario: DeploymentScenarioDto;
}
