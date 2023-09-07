import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';

enum AggregateFunction {
  Min = 'min',
  Max = 'max',
  Mean = 'mean',
}

enum AttackerCapabilityType {
  Opportunity = 'opportunity',
  Mean = 'mean',
}

enum EffectivenessDefenderType {
  Technical = 'technical',
  Organizational = 'organizational',
}

class SaveAttackerCapabilityFactorDto {
  @IsEnum(AttackerCapabilityType)
  type: string;

  @IsString()
  name: string;

  @IsNumber()
  weight: number;

  @IsNumber()
  score: number;
}

class SaveEffectivenessDefenderFactorDto {
  @IsEnum(EffectivenessDefenderType)
  type: string;

  @IsString()
  name: string;

  @IsNumber()
  weight: number;

  @IsNumber()
  score: number;
}

export class SaveAptConfigDto {
  userId: string;

  @IsEnum(AggregateFunction)
  attackerAggregateFunction: string;

  @IsEnum(AggregateFunction)
  defenderAggregateFunction: string;

  @IsNumber()
  attackerVariationRate: number;

  @IsNumber()
  defenderVariationRate: number;

  @IsArray()
  attackerCapabilityDefault: SaveAttackerCapabilityFactorDto[];

  @IsArray()
  effectivenessDefenderDefault: SaveEffectivenessDefenderFactorDto[];
}
