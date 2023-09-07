import { BaseDocument } from '@libs/common/base';
import { sharedSchema } from '@libs/common/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  DeploymentScenarioStatus,
  ExploitabilityCVSS,
  RemediationLevelCVSS,
  ReportConfidenceCVSS,
} from '../enums';
import {
  SecurityGoal,
  AssetCpe,
  AssetRelationship,
  SecurityGoalSchema,
  AssetCpeSchema,
  AssetRelationshipSchema,
  AttackGraph,
  AttackGraphSchema,
} from '../sub-documents';
import { Attacker } from './attacker';
import { AppliedCountermeasure } from './applied-countermeasure';
import { AssetCve } from './asset-cve';

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

  @Prop({ type: String })
  systemProfileId: string;

  @Prop({ type: String })
  systemProfileName: string;

  @Prop({ type: [SecurityGoalSchema], _id: false })
  securityGoals: SecurityGoal[];

  @Prop({ type: [AssetCpeSchema], _id: false })
  assets: AssetCpe[];

  @Prop({ type: [AssetRelationshipSchema], _id: false })
  assetRelationships: AssetRelationship[];

  @Prop([{ type: ObjectId, ref: AppliedCountermeasure.name }])
  countermeasures: AppliedCountermeasure[];

  @Prop([{ type: ObjectId, ref: Attacker.name }])
  attackers: Attacker[];

  @Prop([{ type: ObjectId, ref: AssetCve.name }])
  cves: AssetCve[];

  @Prop({ type: AttackGraphSchema, _id: false })
  attackGraph: AttackGraph;

  @Prop({
    type: String,
    enum: ExploitabilityCVSS,
  })
  exploitability: string;

  @Prop({
    type: String,
    enum: RemediationLevelCVSS,
  })
  remediationLevel: string;

  @Prop({
    type: String,
    enum: ReportConfidenceCVSS,
  })
  reportConfidence: string;

  @Prop({ type: Number })
  baseImpact: number;

  @Prop({ type: Number })
  baseBenefit: number;
}

export const DeploymentScenarioSchema = SchemaFactory.createForClass(
  DeploymentScenario
).add(sharedSchema());
