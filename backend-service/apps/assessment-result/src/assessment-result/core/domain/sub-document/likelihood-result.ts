import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class LikelihoodResult {
  @Prop({ type: [String, Number] })
  countermeasures: [string, number];

  @Prop({ type: [String, Number] })
  notCountermeasures: [string, number];
}
export const LikelihoodResultSchema =
  SchemaFactory.createForClass(LikelihoodResult);
