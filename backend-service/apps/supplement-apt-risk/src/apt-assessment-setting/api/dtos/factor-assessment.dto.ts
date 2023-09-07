import { Expose, Type } from 'class-transformer';

class AttackerCapabilityFactorDto {
  @Expose()
  type: string;

  @Expose()
  name: string;

  @Expose()
  weight: number;

  @Expose()
  score: number;
}

class EffectivenessDefenderFactorDto {
  @Expose()
  type: string;

  @Expose()
  name: string;

  @Expose()
  weight: number;

  @Expose()
  score: number;
}

export class FactorAssessmentDto {
  @Expose()
  deploymentScenarioId: string;

  @Expose()
  @Type(() => AttackerCapabilityFactorDto)
  attackerCapability: AttackerCapabilityFactorDto[];

  @Expose()
  @Type(() => EffectivenessDefenderFactorDto)
  effectivenessDefender: EffectivenessDefenderFactorDto[];
}
