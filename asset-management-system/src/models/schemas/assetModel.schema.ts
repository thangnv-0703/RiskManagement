import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from './category.schema';
import { Manufacturer } from './manufacturer.schema';
import { Asset } from './asset.schema';

@Schema()
export class AssetModel extends Document {
  @Prop({ default: null })
  name: string;

  @Prop({ default: null })
  image: string;

  @Prop({ default: null })
  cpe: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  category: Category;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Manufacturer' })
  manufacturer: Manufacturer;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Asset' }],
  })
  assets: Asset[];
}

export const AssetModelSchema = SchemaFactory.createForClass(AssetModel);
