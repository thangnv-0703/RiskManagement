import { BaseDocument } from '@libs/common/base';
import { sharedSchema } from '@libs/common/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ThreatType } from '../enums';
import { AttackerTarget, AttackerTargetSchema } from '../sub-documents';

const ObjectId = mongoose.Schema.Types.ObjectId;

@Schema()
export class Attacker extends BaseDocument {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({
    type: String,
    enum: ThreatType,
  })
  type: string;

  @Prop({ type: [AttackerTargetSchema], _id: false })
  targets: AttackerTarget[];

  @Prop({ type: ObjectId, ref: 'DeploymentScenario' })
  deploymentScenario: string;
}

export const AttackerSchema = SchemaFactory.createForClass(Attacker).add(
  sharedSchema()
);
