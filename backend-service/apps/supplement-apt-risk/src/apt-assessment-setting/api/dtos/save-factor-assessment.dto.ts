import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';

enum AttackerCapabilityType {
  Opportunity = 'opportunity',
  Mean = 'mean',
}

enum EffectivenessDefenderType {
  Technical = 'technical',
  Organizational = 'organizational',
}

class AttackerCapabilityFactor {
  @IsEnum(AttackerCapabilityType)
  type: string;

  @IsString()
  name: string;

  @IsNumber()
  weight: number;

  @IsNumber()
  score: number;
}

class EffectivenessDefenderFactor {
  @IsEnum(EffectivenessDefenderType)
  type: string;

  @IsString()
  name: string;

  @IsNumber()
  weight: number;

  @IsNumber()
  score: number;
}

export class SaveFactorAssessmentDto {
  deploymentScenarioId: string;

  @IsArray()
  attackerCapability: AttackerCapabilityFactor[];

  @IsArray()
  effectivenessDefender: EffectivenessDefenderFactor[];
}
