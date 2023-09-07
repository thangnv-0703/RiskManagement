import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  DeploymentScenarioStatus,
  ExploitabilityCVSS,
  RemediationLevelCVSS,
  ReportConfidenceCVSS,
} from '../../core/domain/enums';

export class UpdateDeploymentScenarioDto {
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsEnum(DeploymentScenarioStatus)
  status: string;

  @IsNumber()
  @IsOptional()
  damageCriterion: number;

  @IsNumber()
  @IsOptional()
  benefitCriterion: number;

  @IsEnum(ExploitabilityCVSS)
  @IsOptional()
  exploitability: ExploitabilityCVSS;

  @IsEnum(RemediationLevelCVSS)
  @IsOptional()
  remediationLevel: RemediationLevelCVSS;

  @IsEnum(ReportConfidenceCVSS)
  @IsOptional()
  reportConfidence: ReportConfidenceCVSS;
}
