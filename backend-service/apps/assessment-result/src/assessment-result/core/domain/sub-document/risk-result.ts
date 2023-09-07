import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikelihoodResult, LikelihoodResultSchema } from './likelihood-result';

@Schema()
export class RiskResult {
  @Prop({ type: LikelihoodResultSchema, _id: false })
  likelihood: LikelihoodResult;

  @Prop({ type: LikelihoodResultSchema, _id: false })
  riskLevel: LikelihoodResult;

  @Prop({ type: LikelihoodResultSchema, _id: false })
  severity: LikelihoodResult;
}
export const RiskResultSchema = SchemaFactory.createForClass(RiskResult);
