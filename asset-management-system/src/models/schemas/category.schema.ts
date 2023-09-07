import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { AssetModel } from './assetModel.schema';
import { License } from './license.schema';
import { RequestAsset } from './requestAsset..schema';

@Schema()
export class Category extends Document {
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

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'RequestAsset' }],
  })
  requestAssets: RequestAsset[];

  toJSON() {
    const { _id, ...obj } = this.toObject();
    obj.id = _id;
    return obj;
  }
}

export const CategorySchema = SchemaFactory.createForClass(Category);
