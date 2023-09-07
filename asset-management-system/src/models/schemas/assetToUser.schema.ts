import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Asset } from './asset.schema';
import { User } from './user.schema';

@Schema()
export class AssetToUser extends Document {
  @Prop({ default: null })
  checkout_date: Date;

  @Prop({ default: null })
  checkout_note: string;

  @Prop({ default: null })
  checkin_date: Date;

  @Prop({ default: null })
  checkin_note: string;

  @Prop({ default: null })
  deletedAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Asset' })
  asset: Asset;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const AssetToUserSchema = SchemaFactory.createForClass(AssetToUser);
