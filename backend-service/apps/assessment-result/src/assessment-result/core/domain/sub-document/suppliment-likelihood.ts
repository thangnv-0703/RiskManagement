import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class SupplimentLikelihood {
  @Prop({ type: Number })
  attackerCapability: number;

  @Prop({ type: Number })
  effectivenessDefender: number;
}
export const SupplimentLikelihoodSchema =
  SchemaFactory.createForClass(SupplimentLikelihood);
