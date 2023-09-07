import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Asset } from './asset.schema';
import { AssetMaintenance } from './assetMaintenance.schema';
import { License } from './license.schema';

@Schema()
export class Supplier extends Document {
  @Prop({ default: null })
  name: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Asset' }],
  })
  assets: Asset[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'AssetMaintenance' }],
  })
  assetMaintenances: AssetMaintenance[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'License' }],
  })
  licenses: License[];
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
