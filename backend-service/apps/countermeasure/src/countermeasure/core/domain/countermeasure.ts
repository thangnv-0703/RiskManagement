import { BaseDocument } from '@libs/common/base';
import { sharedSchema } from '@libs/common/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Countermeasure extends BaseDocument {
  @Prop({ type: String })
  name: string;

  @Prop({ type: Array<String> })
  coverCves: string[];
}

export const CountermeasureSchema = SchemaFactory.createForClass(
  Countermeasure
).add(sharedSchema());
