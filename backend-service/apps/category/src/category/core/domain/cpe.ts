import { BaseDocument } from '@libs/common/base';
import { sharedSchema } from '@libs/common/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Cpe extends BaseDocument {
  @Prop({ type: String, index: true })
  name: string;

  @Prop({ type: String })
  title: string[];
}

export const CpeSchema = SchemaFactory.createForClass(Cpe).add(sharedSchema());
