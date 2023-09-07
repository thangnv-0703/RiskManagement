import { BaseDocument } from '@libs/common/base';
import { sharedSchema } from '@libs/common/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class SystemProfile extends BaseDocument {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Object, default: {} })
  customFields: object;
}

export const SystemProfileSchema = SchemaFactory.createForClass(
  SystemProfile
).add(sharedSchema());
