import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AccessVector, Privilege } from '../enums';

@Schema()
export class AttackerTarget {
  @Prop({ type: String })
  assetId: string;

  @Prop({
    type: String,
    enum: AccessVector,
  })
  attackVector: string;

  @Prop({
    type: String,
    enum: Privilege,
  })
  privilege: string;
}

export const AttackerTargetSchema =
  SchemaFactory.createForClass(AttackerTarget);
