import { Expose, Type } from 'class-transformer';
import {
  DeploymentScenarioDto,
  DeploymentScenarioListDto,
} from './deployment-scenario.dto';
import { ConfigAssessmentDto } from './config-assessment.dto';

export class CIAAsset {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  cia: number;

  @Expose()
  availability: number;

  @Expose()
  confidentiality: number;

  @Expose()
  integrity: number;
}

export class CIAResult {
  @Expose()
  @Type(() => CIAAsset)
  countermeasures: CIAAsset[];

  @Expose()
  @Type(() => CIAAsset)
  notCountermeasures: CIAAsset[];
}

export class CountermeasureResult {
  @Expose()
  id: string;

  @Expose()
  cost: number;

  @Expose()
  name: string;

  @Expose()
  type: string;

  @Expose()
  outcomes: Record<string, number>;
}

export class LikelihoodResult {
  @Expose()
  countermeasures: [string, number];

  @Expose()
  notCountermeasures: [string, number];
}

export class RiskResult {
  @Expose()
  @Type(() => LikelihoodResult)
  likelihood: LikelihoodResult;

  @Expose()
  @Type(() => LikelihoodResult)
  riskLevel: LikelihoodResult;

  @Expose()
  @Type(() => LikelihoodResult)
  severity: LikelihoodResult;
}

export class SupplimentLikelihood {
  @Expose()
  attackerCapability: number;

  @Expose()
  effectivenessDefender: number;
}

export class ResultDto {
  @Expose()
  @Type(() => CIAResult)
  cia: CIAResult;

  // @Expose()
  // @Type(() => LikelihoodResult)
  // likelihood: LikelihoodResult;

  @Expose()
  @Type(() => CountermeasureResult)
  countermeasures: CountermeasureResult;

  @Expose()
  @Type(() => RiskResult)
  risk: RiskResult;

  @Expose()
  @Type(() => SupplimentLikelihood)
  supplimentLikelihood: SupplimentLikelihood;
}

export class AssessmentResultDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  deploymentScenarioId: string;

  @Expose()
  // @Type(() => DeploymentScenarioDto)
  deploymentScenario: object;

  @Expose()
  // @Type(() => ConfigAssessmentDto)
  supplementConfig: object;

  @Expose()
  @Type(() => ResultDto)
  result: ResultDto;

  @Expose()
  createdAt: Date;
}

export class AssessmentResultListDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  deploymentScenarioId: string;

  @Expose()
  @Type(() => DeploymentScenarioListDto)
  deploymentScenario: DeploymentScenarioListDto;

  @Expose()
  @Type(() => ConfigAssessmentDto)
  supplementConfig: ConfigAssessmentDto;

  @Expose()
  @Type(() => ResultDto)
  result: ResultDto;

  @Expose()
  createdAt: Date;
}
