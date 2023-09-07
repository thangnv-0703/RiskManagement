import { BaseDocument } from '@libs/common/base';
import { sharedSchema } from '@libs/common/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum AggregateFunction {
  Min = 'min',
  Max = 'max',
  Mean = 'mean',
}

export enum AttackerCapabilityType {
  Opportunity = 'opportunity',
  Mean = 'mean',
}

export enum EffectivenessDefenderType {
  Technical = 'technical',
  Organizational = 'organizational',
}

@Schema()
class AttackerCapabilityFactor {
  @Prop({
    type: String,
    enum: AttackerCapabilityType,
  })
  type: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: Number })
  weight: number;

  @Prop({ type: Number })
  score: number;
}
const AttackerCapabilityFactorSchema = SchemaFactory.createForClass(
  AttackerCapabilityFactor
);

@Schema()
class EffectivenessDefenderFactor {
  @Prop({
    type: String,
    enum: EffectivenessDefenderType,
  })
  type: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: Number })
  weight: number;

  @Prop({ type: Number })
  score: number;
}

const EffectivenessDefenderFactorSchema = SchemaFactory.createForClass(
  EffectivenessDefenderFactor
);

@Schema()
export class AptConfig extends BaseDocument {
  @Prop({ type: String })
  userId: string;

  @Prop({
    type: String,
    enum: AggregateFunction,
  })
  attackerAggregateFunction: string;

  @Prop({
    type: String,
    enum: AggregateFunction,
  })
  defenderAggregateFunction: string;

  @Prop({ type: Number })
  attackerVariationRate: number;

  @Prop({ type: Number })
  defenderVariationRate: number;

  @Prop({ type: [AttackerCapabilityFactorSchema], _id: false })
  attackerCapabilityDefault: AttackerCapabilityFactor[];

  @Prop({ type: [EffectivenessDefenderFactorSchema], _id: false })
  effectivenessDefenderDefault: EffectivenessDefenderFactor[];
}

export const AptConfigSchema = SchemaFactory.createForClass(AptConfig).add(
  sharedSchema()
);
