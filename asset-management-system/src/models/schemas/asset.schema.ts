import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { AssetModel } from './assetModel.schema';
import { Department } from './department.schema';
import { Supplier } from './supplier.schema';
import { Status } from './status.schema';
import { AssetToUser } from './assetToUser.schema';
import { LicenseToAsset } from './licenseToAsset.schema';
import { AssetToInventory } from './assetToInventory.schema';
import { AssetMaintenance } from './assetMaintenance.schema';
import { AssetDeploymentScenario } from './assetDeploymentScenario.schema';

@Schema()
export class Asset extends Document {
  @Prop({ default: null })
  name: string;

  @Prop({ default: null })
  image: string;

  @Prop({ default: null })
  purchase_cost: number;

  @Prop({ default: null })
  current_cost: number;

  @Prop({ default: null })
  purchase_date: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'AssetModel' })
  assetModel: AssetModel;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Department' })
  department: Department;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Supplier' })
  supplier: Supplier;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Status' })
  status: Status;

  @Prop({ type: [{ id: String, name: String }] })
  deploymentScenarios: Array<{ id: string; name: string }>;

  @Prop({ default: [] })
  cves: Array<object>;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'AssetToUser' }],
  })
  assetToUsers: AssetToUser[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'LicenseToAsset' }],
  })
  licenseToAssets: LicenseToAsset[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'AssetToInventory' }],
  })
  assetToInventories: AssetToInventory[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'AssetMaintenance' }],
  })
  assetMaintenances: AssetMaintenance[];

  @Prop({ default: null })
  deletedAt: Date;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
