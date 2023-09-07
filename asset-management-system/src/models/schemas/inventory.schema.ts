import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Department } from './department.schema';
import { AssetToInventory } from './assetToInventory.schema';

@Schema()
export class Inventory extends Document {
  @Prop({ default: null })
  name: string;

  @Prop({ default: null })
  start_date: Date;

  @Prop({ default: null })
  end_date: Date;

  @Prop({ default: null })
  note: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Department' })
  department: Department;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'AssetToInventory' }],
  })
  assetToInventories: AssetToInventory[];
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
