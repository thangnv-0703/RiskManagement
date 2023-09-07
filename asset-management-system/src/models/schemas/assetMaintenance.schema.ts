import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Asset } from './asset.schema';
import { Supplier } from './supplier.schema';

@Schema()
export class AssetMaintenance extends Document {
  @Prop({ default: null })
  start_date: Date;

  @Prop({ default: null })
  end_date: Date;

  @Prop({ default: null })
  cost: number;

  @Prop({ default: null })
  note: string;

  @Prop({ default: null })
  deletedAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Asset' })
  asset: Asset;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Supplier' })
  supplier: Supplier;
}

export const AssetMaintenanceSchema =
  SchemaFactory.createForClass(AssetMaintenance);
