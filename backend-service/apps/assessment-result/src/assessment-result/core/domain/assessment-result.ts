import { BaseDocument } from '@libs/common/base';
import { sharedSchema } from '@libs/common/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Result, ResultSchema } from './sub-document/result';

@Schema()
export class AssessmentResult extends BaseDocument {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  deploymentScenarioId: string;

  @Prop({ type: ResultSchema, _id: false })
  result: Result;

  @Prop({ type: Object })
  deploymentScenario: object;

  @Prop({ type: Object })
  supplementConfig: object;
}

export const AssessmentResultSchema = SchemaFactory.createForClass(
  AssessmentResult
).add(sharedSchema());
