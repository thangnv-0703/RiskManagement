import { BaseDocument } from '@libs/common/base';
import { sharedSchema } from '@libs/common/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CveOnAsset,
  CveOnAssetSchema,
} from 'apps/deployment-scenario/src/deployment-scenario/core/domain/sub-documents';
import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;

@Schema()
export class AssetCve extends BaseDocument {
  @Prop({ type: String })
  assetId: string;

  @Prop({ type: [CveOnAssetSchema], _id: false })
  cves: CveOnAsset[];

  @Prop({ type: [String], default: [] })
  active: string[];

  @Prop({ type: ObjectId, ref: 'DeploymentScenario' })
  deploymentScenario: string;
}

export const AssetCveSchema = SchemaFactory.createForClass(AssetCve).add(
  sharedSchema()
);
