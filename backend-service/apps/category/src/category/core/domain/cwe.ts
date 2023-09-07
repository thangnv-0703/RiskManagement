import { BaseDocument } from '@libs/common/base';
import { sharedSchema } from '@libs/common/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Cwe extends BaseDocument {
  @Prop({ type: String })
  cwe_id: string;

  @Prop({ type: String })
  cwe_name: string;

  @Prop({ type: String })
  description: string;
}

export const CweSchema = SchemaFactory.createForClass(Cwe).add(sharedSchema());
