import { BaseDocument } from '@libs/common/base';
import { sharedSchema } from '@libs/common/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;

@Schema()
export class AppliedCountermeasure extends BaseDocument {
  @Prop({ type: String })
  name: string;

  @Prop({ type: Number })
  cost: number;

  @Prop({ type: Number })
  coverage: number;

  @Prop({ type: Array })
  coverCves: string[];

  @Prop({ type: ObjectId, ref: 'DeploymentScenario' })
  deploymentScenario: string;
}

export const AppliedCountermeasureSchema = SchemaFactory.createForClass(
  AppliedCountermeasure
).add(sharedSchema());
