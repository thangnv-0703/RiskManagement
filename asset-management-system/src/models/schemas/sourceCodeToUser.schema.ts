import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { SourceCode } from './sourceCode.schema';

@Schema()
export class SourceCodeToUser extends Document {
  @Prop({ default: null })
  start_date: Date;

  @Prop({ default: null })
  start_note: string;

  @Prop({ default: null })
  end_date: Date;

  @Prop({ default: null })
  end_note: string;

  @Prop({ default: null })
  deletedAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'SourceCode' })
  sourceCode: SourceCode;
}

export const SourceCodeToUserSchema =
  SchemaFactory.createForClass(SourceCodeToUser);
