import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Asset } from './asset.schema';
import { AssetToInventory } from './assetToInventory.schema';

@Schema()
export class Status extends Document {
  @Prop({ default: null })
  name: string;

  @Prop({ default: '#666' })
  color: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Asset' }],
  })
  assets: Asset[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'AssetToInventory' }],
  })
  assetToInventories: AssetToInventory[];
}

export const StatusSchema = SchemaFactory.createForClass(Status);
