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

export class AptConfigDto {
  @Expose()
  userId: string;

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
  attackerCapabilityDefault: AttackerCapabilityFactorDto[];

  @Expose()
  @Type(() => EffectivenessDefenderFactorDto)
  effectivenessDefenderDefault: EffectivenessDefenderFactorDto[];
}
