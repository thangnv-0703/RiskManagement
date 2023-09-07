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

export class ConfigAssessmentDto {
  @Expose()
  deploymentScenarioId: string;

  @Expose()
  attackerAggregateFunction: string;

  @Expose()
  defenderAggregateFunction: string;

  @Expose()
  attackerVariationRate: number;

  @Expose()
  defenderVariationRate: number;

  @Expose()
  @Type(() => AttackerCapabilityFactorDto)
  attackerCapability: AttackerCapabilityFactorDto[];

  @Expose()
  @Type(() => EffectivenessDefenderFactorDto)
  effectivenessDefender: EffectivenessDefenderFactorDto[];
}
