import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class CIAAsset {
  @Prop({ type: String })
  id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: Number })
  cia: number;

  @Prop({ type: Number })
  availability: number;

  @Prop({ type: Number })
  confidentiality: number;

  @Prop({ type: Number })
  integrity: number;
}

export const CIAAssetSchema = SchemaFactory.createForClass(CIAAsset);

@Schema()
export class CIAResult {
  @Prop({ type: [CIAAssetSchema], _id: false })
  countermeasures: CIAAsset[];

  @Prop({ type: [CIAAssetSchema], _id: false })
  notCountermeasures: CIAAsset[];
}

export const CIAResultSchema = SchemaFactory.createForClass(CIAResult);
