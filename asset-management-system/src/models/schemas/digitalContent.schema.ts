import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean } from 'class-validator';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { DigitalContentToSourceCode } from './digitalContentToSourceCode.schema';

@Schema()
export class DigitalContent extends Document {
  @Prop({ default: null })
  name: string;

  @Prop({ default: null })
  owner: string;

  @Prop({ default: null })
  description: string;

  @Prop({ default: false })
  @IsBoolean()
  isPrivate: boolean;

  @Prop({ default: null })
  url: string;

  @Prop({ type: [{ id: String, name: String }] })
  deploymentScenarios: Array<{ id: string; name: string }>;

  @Prop({ default: null })
  deletedAt: Date;

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'DigitalContentToSourceCode',
      },
    ],
  })
  digitalContentToSourceCodes: DigitalContentToSourceCode[];
}

export const DigitalContentSchema =
  SchemaFactory.createForClass(DigitalContent);
