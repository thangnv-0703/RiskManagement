import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CIAResult, CIAResultSchema } from './cia-result';
import {
  CountermeasureResult,
  CountermeasureResultSchema,
} from './countermeasure-result';
import { LikelihoodResult, LikelihoodResultSchema } from './likelihood-result';
import { RiskResult, RiskResultSchema } from './risk-result';
import {
  SupplimentLikelihood,
  SupplimentLikelihoodSchema,
} from './suppliment-likelihood';

@Schema()
export class Result {
  @Prop({ type: CIAResultSchema, _id: false })
  cia: CIAResult;

  @Prop({ type: [CountermeasureResultSchema], _id: false })
  countermeasure: CountermeasureResult[];

  @Prop({ type: RiskResultSchema, _id: false })
  risk: RiskResult;

  @Prop({ type: SupplimentLikelihoodSchema, _id: false })
  supplimentLikelihood: SupplimentLikelihood;
}
export const ResultSchema = SchemaFactory.createForClass(Result);
