import { BaseDocument } from '@libs/common/base';
import { sharedSchema } from '@libs/common/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SystemProfile } from './system-profile';
import mongoose from 'mongoose';

export enum DeploymentScenarioStatus {
  RequirementsAnalysis = 'Requirements Analysis',
  Deployments = 'Deployments',
  Operations = 'Operations',
}

const ObjectId = mongoose.Schema.Types.ObjectId;

@Schema()
export class DeploymentScenario extends BaseDocument {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({
    type: String,
    enum: DeploymentScenarioStatus,
  })
  status: string;

  @Prop({ type: ObjectId, ref: SystemProfile.name })
  systemProfileId: SystemProfile;
}

export const DeploymentScenarioSchema = SchemaFactory.createForClass(
  DeploymentScenario
).add(sharedSchema());
