import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class AssetCpe {
  @Prop({ type: String })
  id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  part: string;

  @Prop({ type: String })
  server: string;

  @Prop({ type: String })
  vendor: string;

  @Prop({ type: String })
  product: string;

  @Prop({ type: String })
  version: string;

  @Prop({ type: String })
  cpe: string;

  @Prop({ type: Object, default: {} })
  customFields: object;
}

export const AssetCpeSchema = SchemaFactory.createForClass(AssetCpe);
