import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { License } from './license.schema';
import { Asset } from './asset.schema';

@Schema()
export class LicenseToAsset extends Document {
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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'License' })
  license: License;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Asset' })
  asset: Asset;
}

export const LicenseToAssetSchema =
  SchemaFactory.createForClass(LicenseToAsset);
