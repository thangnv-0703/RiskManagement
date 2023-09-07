import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { AssetModel } from './assetModel.schema';
import { License } from './license.schema';

@Schema()
export class Manufacturer extends Document {
  @Prop({ default: null })
  name: string;

  @Prop({ default: null })
  image: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'AssetModel' }],
  })
  assetModels: AssetModel[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'License' }],
  })
  licenses: License[];
}

export const ManufacturerSchema = SchemaFactory.createForClass(Manufacturer);
