import { IsArray, IsNumber } from 'class-validator';

export class InitRiskMonitoringDto {
  @IsNumber()
  timeStep: number;

  @IsArray()
  observerData: any;

  @IsArray()
  observerFactor: any;

  @IsArray()
  nodeTemporals: any;

  deploymentScenarioId: string;
}
