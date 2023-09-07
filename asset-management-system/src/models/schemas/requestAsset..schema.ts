import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from './category.schema';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class RequestAsset extends Document {
  @Prop({ default: 'Requested' })
  status: string;

  @Prop({ default: null })
  assetId: string;

  @Prop({ default: null })
  note: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  category: Category;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const RequestAssetSchema = SchemaFactory.createForClass(RequestAsset);
