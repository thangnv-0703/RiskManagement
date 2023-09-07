import { Expose } from 'class-transformer';

class AttackerCapabilityFactor {
  @Expose()
  type: string;

  @Expose()
  name: string;

  @Expose()
  weight: number;

  @Expose()
  score: number;
}

class EffectivenessDefenderFactor {
  @Expose()
  type: string;

  @Expose()
  name: string;

  @Expose()
  weight: number;

  @Expose()
  score: number;
}

export class AssessmentConfigDto {
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
  attackerCapability: AttackerCapabilityFactor[];

  @Expose()
  effectivenessDefender: EffectivenessDefenderFactor[];
}
