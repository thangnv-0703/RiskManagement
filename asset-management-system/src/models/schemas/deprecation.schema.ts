import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from './category.schema';

@Schema()
export class Deprecation extends Document {
  @Prop({ default: null })
  name: string;

  @Prop({ default: null })
  months: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  category: Category;
}

export const DeprecationSchema = SchemaFactory.createForClass(Deprecation);
