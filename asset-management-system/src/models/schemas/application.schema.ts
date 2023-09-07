import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Application extends Document {
  @Prop({ default: null })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({ default: null })
  version: string;

  @Prop({ type: [{ id: String, name: String }] })
  deploymentScenarios: Array<{ id: string; name: string }>;

  @Prop({ default: [] })
  cves: Array<object>;
}
export const ApplicationSchema = SchemaFactory.createForClass(Application);
