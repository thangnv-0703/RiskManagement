import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class CIAAsset {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  cia: number;

  @IsNumber()
  availability: number;

  @IsNumber()
  confidentiality: number;

  @IsNumber()
  integrity: number;
}

class CIAResult {
  @IsArray()
  @Type(() => CIAAsset)
  countermeasures: CIAAsset[];

  @IsArray()
  @Type(() => CIAAsset)
  notCountermeasures: CIAAsset[];
}

class CountermeasureResult {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsObject()
  outcomes: Record<string, number>;
}

class LikelihoodResult {
  @IsArray()
  countermeasures: [string, number];

  @IsArray()
  notCountermeasures: [string, number];
}

class RiskResult {
  @ValidateNested()
  @Type(() => LikelihoodResult)
  likelihood: LikelihoodResult;

  @ValidateNested()
  @Type(() => LikelihoodResult)
  riskLevel: LikelihoodResult;

  @ValidateNested()
  @Type(() => LikelihoodResult)
  severity: LikelihoodResult;
}

export class SupplimentLikelihoodDto {
  @IsNumber()
  attackerCapability: number;

  @IsNumber()
  effectivenessDefender: number;
}

class Result {
  @ValidateNested()
  @Type(() => CIAResult)
  cia: CIAResult;

  @ValidateNested()
  @Type(() => LikelihoodResult)
  likelihood: LikelihoodResult;

  @ValidateNested()
  @Type(() => CountermeasureResult)
  countermeasure: CountermeasureResult;

  @ValidateNested()
  @Type(() => RiskResult)
  risk: RiskResult;

  @ValidateNested()
  @Type(() => SupplimentLikelihoodDto)
  supplimentLikelihood: SupplimentLikelihoodDto;
}

export class SaveAssessmentResultDto {
  @IsString()
  name: string;

  deploymentScenarioId: string;

  deploymentScenario: object;

  supplementConfig: object;

  // @ValidateNested()
  // @Type(() => Result)
  result: Result;
}
