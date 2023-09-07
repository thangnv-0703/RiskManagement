import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Asset } from './asset.schema';
import { Inventory } from './inventory.schema';
import { Status } from './status.schema';

@Schema()
export class AssetToInventory extends Document {
  @Prop({ default: null })
  old_cost: number;

  @Prop({ default: null })
  new_cost: number;

  @Prop({ default: false })
  check: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Asset' })
  asset: Asset;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Inventory' })
  inventory: Inventory;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Status' })
  old_status: Status;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Status' })
  new_status: Status;
}

export const AssetToInventorySchema =
  SchemaFactory.createForClass(AssetToInventory);
