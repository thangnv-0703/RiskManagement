import {
  ExploitabilityCVSS,
  RemediationLevelCVSS,
  ReportConfidenceCVSS,
} from './../../core/domain/enums/cvss';
import { IsEnum, IsNumber } from 'class-validator';

export class StaticAssessment {
  @IsNumber()
  damageCriterion: number;

  @IsNumber()
  benefitCriterion: number;

  @IsEnum(ExploitabilityCVSS)
  exploitability: ExploitabilityCVSS;

  @IsEnum(RemediationLevelCVSS)
  remediationLevel: RemediationLevelCVSS;

  @IsEnum(ReportConfidenceCVSS)
  reportConfidence: ReportConfidenceCVSS;

  deploymentScenarioId: string;
}
