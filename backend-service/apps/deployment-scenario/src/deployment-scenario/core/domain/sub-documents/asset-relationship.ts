import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AccessVector, Privilege } from '../enums';

@Schema()
export class AssetRelationship {
  @Prop({ type: Number })
  id: number;

  @Prop({ type: String })
  source: string;

  @Prop({ type: String })
  target: string;

  @Prop({
    type: String,
    enum: AccessVector,
  })
  accessVector: string;

  @Prop({
    type: String,
    enum: Privilege,
  })
  privilege: string;
}

export const AssetRelationshipSchema =
  SchemaFactory.createForClass(AssetRelationship);
