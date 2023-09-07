import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { DigitalContent } from './digitalContent.schema';
import { SourceCode } from './sourceCode.schema';

@Schema()
export class DigitalContentToSourceCode extends Document {
  @Prop({ default: null })
  checkout_date: Date;

  @Prop({ default: null })
  checkout_note: string;

  @Prop({ default: null })
  checkin_date: Date;

  @Prop({ default: null })
  checkin_note: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'DigitalContent' })
  digitalContent: DigitalContent;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'SourceCode' })
  sourceCode: SourceCode;

  @Prop({ default: null })
  deletedAt: Date;
}

export const DigitalContentToSourceCodeSchema = SchemaFactory.createForClass(
  DigitalContentToSourceCode,
);
